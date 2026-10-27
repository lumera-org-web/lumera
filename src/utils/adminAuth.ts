import crypto from 'crypto';
import { NextRequest } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_PASSWORD || 'lumera2026';
const COOKIE_NAME = 'lumera_admin_session';

/**
 * Creates an HMAC-SHA256 signed admin session token.
 */
export function createAdminToken(): string {
  const payload = {
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies an HMAC-signed admin session token.
 */
export function verifyAdminToken(token: string): boolean {
  if (!token || !token.includes('.')) return false;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expSigBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expSigBuf.length || !crypto.timingSafeEqual(sigBuf, expSigBuf)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return false; // Expired
    }
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

/**
 * Checks if incoming NextRequest has a valid admin session cookie or authorization header.
 */
export function isAdminAuthorized(req: NextRequest): boolean {
  // Check cookie
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken && verifyAdminToken(cookieToken)) {
    return true;
  }

  // Check Bearer authorization header or direct admin-secret header
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7);
    if (verifyAdminToken(bearerToken)) return true;
  }

  const secretHeader = req.headers.get('x-admin-key');
  if (secretHeader && secretHeader === ADMIN_SECRET) {
    return true;
  }

  return false;
}

export { COOKIE_NAME };
