/**
 * LUMÉRA Customer Authentication & Account Management Service
 * High-Security Password Hashing (PBKDF2-SHA512), Cryptographic OTP Verification,
 * Session Management with HMAC-signed cookies, and Dual Supabase / Resilient Store.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getPublicClient } from '@/utils/supabase/server';
import { SaudiAddress } from '@/types';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password_hash: string;
  salt: string;
  shipping_address?: Partial<SaudiAddress>;
  created_at: string;
  updated_at: string;
}

export interface CustomerSafeProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  shipping_address?: Partial<SaudiAddress>;
  created_at: string;
}

interface StoredOtp {
  email: string;
  code_hash: string;
  purpose: 'reset_password' | 'verify_email';
  attempts: number;
  expires_at: number; // Unix timestamp ms
  created_at: number;
}

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.ADMIN_PASSWORD ||
  'lumera_luxury_saudi_customer_session_secret_key_2026';

const DATA_DIR = path.join(process.cwd(), 'data');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');
const OTPS_FILE = path.join(DATA_DIR, 'customer_otps.json');

// Ensure local persistence data dir exists (safely catch read-only serverless environments)
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Read-only serverless environment (e.g. Vercel)
  }
}

function readLocalCustomers(): Record<string, CustomerUser> {
  try {
    ensureDataDir();
    if (!fs.existsSync(CUSTOMERS_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeLocalCustomers(customers: Record<string, CustomerUser>) {
  try {
    ensureDataDir();
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Serverless] Local file write skipped (read-only environment)');
  }
}

function readLocalOtps(): Record<string, StoredOtp> {
  try {
    ensureDataDir();
    if (!fs.existsSync(OTPS_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(OTPS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeLocalOtps(otps: Record<string, StoredOtp>) {
  try {
    ensureDataDir();
    fs.writeFileSync(OTPS_FILE, JSON.stringify(otps, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Serverless] Local OTP file write skipped (read-only environment)');
  }
}

// ------------------------------------------------------------
// Password Security (NIST standard PBKDF2 with SHA-512)
// ------------------------------------------------------------

export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const derived = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  const hashBuf = Buffer.from(storedHash, 'hex');
  const derivedBuf = Buffer.from(derived, 'hex');
  if (hashBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(hashBuf, derivedBuf);
}

// ------------------------------------------------------------
// Session Management (HMAC-SHA256 Token)
// ------------------------------------------------------------

export function createSessionToken(customer: CustomerSafeProfile): string {
  const payload = {
    sub: customer.id,
    email: customer.email,
    name: customer.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): { sub: string; email: string; name: string } | null {
  if (!token || !token.includes('.')) return null;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expSigBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expSigBuf.length || !crypto.timingSafeEqual(sigBuf, expSigBuf)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload = JSON.parse(jsonStr);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

// ------------------------------------------------------------
// Cryptographic OTP Generation & Verification
// ------------------------------------------------------------

function hashOtpCode(code: string): string {
  return crypto.createHash('sha256').update(code.trim()).digest('hex');
}

export function generateNumericOtp(): string {
  // Cryptographically secure 6-digit OTP (e.g. 583921)
  return crypto.randomInt(100000, 999999).toString();
}

export async function storeOtp(email: string, otp: string, purpose: 'reset_password' | 'verify_email'): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const codeHash = hashOtpCode(otp);
  const now = Date.now();
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes

  // Dual Store: Try Supabase table first, fallback to local store
  try {
    const supabase = getPublicClient();
    const { error } = await supabase.from('customer_otps').upsert({
      email: normalizedEmail,
      code_hash: codeHash,
      purpose,
      attempts: 0,
      expires_at: new Date(expiresAt).toISOString(),
      updated_at: new Date(now).toISOString(),
    }, { onConflict: 'email,purpose' });

    if (!error) {
      return;
    }
  } catch {
    // Fall through to local store
  }

  // Local fallback
  const otps = readLocalOtps();
  const key = `${normalizedEmail}:${purpose}`;
  otps[key] = {
    email: normalizedEmail,
    code_hash: codeHash,
    purpose,
    attempts: 0,
    expires_at: expiresAt,
    created_at: now,
  };
  writeLocalOtps(otps);
}

export async function verifyOtp(
  email: string,
  otp: string,
  purpose: 'reset_password' | 'verify_email'
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const candidateHash = hashOtpCode(otp);
  const now = Date.now();

  // Try Supabase first
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('customer_otps')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('purpose', purpose)
      .single();

    if (!error && data) {
      if (new Date(data.expires_at).getTime() < now) {
        return { success: false, error: 'Verification code has expired. Please request a new one.' };
      }
      if (data.attempts >= 5) {
        return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
      }

      if (data.code_hash !== candidateHash) {
        // Increment attempts
        await supabase
          .from('customer_otps')
          .update({ attempts: (data.attempts || 0) + 1 })
          .eq('id', data.id);
        return { success: false, error: 'Invalid verification code. Please check your email.' };
      }

      return { success: true };
    }
  } catch {
    // Fall through to local store
  }

  // Local check
  const otps = readLocalOtps();
  const key = `${normalizedEmail}:${purpose}`;
  const stored = otps[key];

  if (!stored) {
    return { success: false, error: 'No verification code requested for this email.' };
  }

  if (stored.expires_at < now) {
    delete otps[key];
    writeLocalOtps(otps);
    return { success: false, error: 'Verification code has expired. Please request a new code.' };
  }

  if (stored.attempts >= 5) {
    delete otps[key];
    writeLocalOtps(otps);
    return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  if (stored.code_hash !== candidateHash) {
    stored.attempts += 1;
    writeLocalOtps(otps);
    return { success: false, error: 'Invalid verification code. Please check your email.' };
  }

  return { success: true };
}

export async function invalidateOtp(email: string, purpose: 'reset_password' | 'verify_email'): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const supabase = getPublicClient();
    await supabase
      .from('customer_otps')
      .delete()
      .eq('email', normalizedEmail)
      .eq('purpose', purpose);
  } catch {
    // ignore
  }

  const otps = readLocalOtps();
  const key = `${normalizedEmail}:${purpose}`;
  if (otps[key]) {
    delete otps[key];
    writeLocalOtps(otps);
  }
}

// ------------------------------------------------------------
// Customer CRUD Operations
// ------------------------------------------------------------

export function toSafeProfile(customer: CustomerUser): CustomerSafeProfile {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    shipping_address: customer.shipping_address,
    created_at: customer.created_at,
  };
}

export async function findCustomerByEmail(email: string): Promise<CustomerUser | null> {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Try Supabase
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (!error && data) {
      return data as CustomerUser;
    }
  } catch {
    // Supabase table does not exist yet or failed
  }

  // 2. Local store
  const customers = readLocalCustomers();
  const user = customers[normalizedEmail];
  return user || null;
}

export async function findCustomerById(id: string): Promise<CustomerUser | null> {
  // 1. Try Supabase
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      return data as CustomerUser;
    }
  } catch {
    // Supabase fallback
  }

  // 2. Local store
  const customers = readLocalCustomers();
  for (const user of Object.values(customers)) {
    if (user.id === id) return user;
  }
  return null;
}

export async function createCustomer(params: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<CustomerSafeProfile> {
  const normalizedEmail = params.email.toLowerCase().trim();
  const existing = await findCustomerByEmail(normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists. Please sign in.');
  }

  const { salt, hash } = hashPassword(params.password);
  const now = new Date().toISOString();
  const customerId = crypto.randomUUID();

  const newCustomer: CustomerUser = {
    id: customerId,
    name: params.name.trim(),
    email: normalizedEmail,
    phone: params.phone?.trim() || '',
    password_hash: hash,
    salt,
    shipping_address: {},
    created_at: now,
    updated_at: now,
  };

  // Try Supabase first
  try {
    const supabase = getPublicClient();
    const { error } = await supabase.from('customers').insert({
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      password_hash: newCustomer.password_hash,
      salt: newCustomer.salt,
      shipping_address: newCustomer.shipping_address,
      created_at: newCustomer.created_at,
      updated_at: newCustomer.updated_at,
    });

    if (!error) {
      // Also cache in local file for redundancy
      const customers = readLocalCustomers();
      customers[normalizedEmail] = newCustomer;
      writeLocalCustomers(customers);
      return toSafeProfile(newCustomer);
    }
  } catch {
    // Fall through to local store
  }

  // Local file storage
  const customers = readLocalCustomers();
  customers[normalizedEmail] = newCustomer;
  writeLocalCustomers(customers);

  return toSafeProfile(newCustomer);
}

export async function updateCustomerPassword(email: string, newPassword: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const customer = await findCustomerByEmail(normalizedEmail);
  if (!customer) {
    throw new Error('Customer not found');
  }

  const { salt, hash } = hashPassword(newPassword);
  const now = new Date().toISOString();

  // Try Supabase
  try {
    const supabase = getPublicClient();
    const { error } = await supabase
      .from('customers')
      .update({
        password_hash: hash,
        salt,
        updated_at: now,
      })
      .eq('email', normalizedEmail);

    if (!error) {
      // Local sync
      const customers = readLocalCustomers();
      if (customers[normalizedEmail]) {
        customers[normalizedEmail].password_hash = hash;
        customers[normalizedEmail].salt = salt;
        customers[normalizedEmail].updated_at = now;
        writeLocalCustomers(customers);
      }
      return true;
    }
  } catch {
    // fallback
  }

  // Local update
  const customers = readLocalCustomers();
  if (customers[normalizedEmail]) {
    customers[normalizedEmail].password_hash = hash;
    customers[normalizedEmail].salt = salt;
    customers[normalizedEmail].updated_at = now;
    writeLocalCustomers(customers);
    return true;
  }

  return false;
}

export async function updateCustomerProfile(
  id: string,
  updates: {
    name?: string;
    phone?: string;
    shipping_address?: Partial<SaudiAddress>;
  }
): Promise<CustomerSafeProfile> {
  const customer = await findCustomerById(id);
  if (!customer) {
    throw new Error('Customer account not found');
  }

  const now = new Date().toISOString();
  if (updates.name) customer.name = updates.name.trim();
  if (updates.phone !== undefined) customer.phone = updates.phone.trim();
  if (updates.shipping_address) {
    customer.shipping_address = {
      ...(customer.shipping_address || {}),
      ...updates.shipping_address,
    };
  }
  customer.updated_at = now;

  // Try Supabase
  try {
    const supabase = getPublicClient();
    await supabase
      .from('customers')
      .update({
        name: customer.name,
        phone: customer.phone,
        shipping_address: customer.shipping_address,
        updated_at: now,
      })
      .eq('id', id);
  } catch {
    // fallback
  }

  // Local update
  const customers = readLocalCustomers();
  customers[customer.email] = customer;
  writeLocalCustomers(customers);

  return toSafeProfile(customer);
}
