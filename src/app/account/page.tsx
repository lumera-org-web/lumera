'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogOut,
  MapPin,
  RotateCw,
  Search,
  KeyRound,
  Sparkles,
  Truck,
  ExternalLink,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice } from '@/utils/formatters';
import { createClient } from '@/utils/supabase/client';

const SAUDI_CITIES = [
  'Jeddah',
  'Riyadh',
  'Dammam',
  'Mecca',
  'Medina',
  'Khobar',
  'Dhahran',
  'Tabuk',
  'Taif',
  'Abha',
  'Buraidah',
  'Najran',
  'Jazan',
  'Hail',
  'Al-Ahsa',
  'Yanbu',
];

export default function AccountPage() {
  const {
    customer,
    isLoading: authLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    sendForgotOtp,
    resetPassword,
    updateProfile,
  } = useCustomerAuth();
  const { locale } = useLocale();

  // Auth Card View Modes: 'signin' | 'signup' | 'forgot_request' | 'forgot_verify'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot_request' | 'forgot_verify'>('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Authenticated Dashboard Active Tab: 'orders' | 'profile' | 'track_lookup'
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'track_lookup'>('orders');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Customer Orders List
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileCity, setProfileCity] = useState('Jeddah');
  const [profileDistrict, setProfileDistrict] = useState('');
  const [profilePostalCode, setProfilePostalCode] = useState('');
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [profileNotice, setProfileNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Guest Order Tracking State
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupNotFound, setLookupNotFound] = useState(false);

  // OTP Cooldown Timer Effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Sync profile fields when customer logs in
  useEffect(() => {
    if (customer) {
      setProfileName(customer.name || '');
      setProfilePhone(customer.phone || '');
      const addr = customer.shipping_address || {};
      setProfileAddress(addr.address || '');
      setProfileCity(addr.city || 'Jeddah');
      setProfileDistrict(addr.district || '');
      setProfilePostalCode(addr.postalCode || '');
      loadCustomerOrders();
    }
  }, [customer]);

  const loadCustomerOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/customer/orders', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCustomerOrders(data.orders || []);
      }
    } catch {
      setCustomerOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Reset errors when switching modes
  const switchAuthMode = (mode: 'signin' | 'signup' | 'forgot_request' | 'forgot_verify') => {
    setAuthMode(mode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const res = await login(email.trim(), password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to sign in. Please verify your email and password.');
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await signup(name.trim(), email.trim(), phone.trim(), password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed. Please check your details.');
    }
  };

  // Handle Forgot Password - Step 1: Send OTP via Brevo
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const res = await sendForgotOtp(email.trim());
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to dispatch verification code.');
    } else {
      setSuccessMsg(res.message || 'Verification code sent to your email.');
      setCooldown(60); // 60s cooldown before resend
      setAuthMode('forgot_verify');
    }
  };

  // Handle Forgot Password - Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otp.trim()) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('New passwords do not match. Please verify.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await resetPassword(email.trim(), otp.trim(), newPassword);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Password reset failed. Invalid or expired code.');
    } else {
      setSuccessMsg('Your password has been successfully reset! Welcome back.');
      // Auto-authenticated by resetPassword route
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const res = await sendForgotOtp(email.trim());
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg('A new verification code has been dispatched to your email.');
      setCooldown(60);
    } else {
      setErrorMsg(res.error || 'Failed to resend code.');
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileNotice(null);
    setProfileUpdating(true);

    const res = await updateProfile({
      name: profileName.trim(),
      phone: profilePhone.trim(),
      shipping_address: {
        fullName: profileName.trim(),
        phone: profilePhone.trim(),
        address: profileAddress.trim(),
        city: profileCity,
        district: profileDistrict.trim(),
        postalCode: profilePostalCode.trim(),
      },
    });

    setProfileUpdating(false);
    if (res.success) {
      setProfileNotice({ type: 'success', text: 'Profile & delivery details saved successfully.' });
      setTimeout(() => setProfileNotice(null), 4000);
    } else {
      setProfileNotice({ type: 'error', text: res.error || 'Could not save profile changes.' });
    }
  };

  // Handle Guest Order Lookup
  const handleTrackLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setLookupLoading(true);
    setLookupNotFound(false);
    setLookupResult(null);

    try {
      const supabase = createClient();
      const cleanNum = lookupQuery.trim().toUpperCase();

      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('order_number', cleanNum)
        .single();

      if (error || !data) {
        setLookupNotFound(true);
      } else {
        setLookupResult(data);
      }
    } catch {
      setLookupNotFound(true);
    } finally {
      setLookupLoading(false);
    }
  };

  // Loading skeleton while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#140C09]">
        <div className="flex flex-col items-center gap-3">
          <RotateCw size={28} className="animate-spin text-gold-400" />
          <span className="text-[0.75rem] uppercase tracking-[0.2em] text-[#9E8E85]">
            Accessing LUMÉRA Privé...
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW A: LOGGED IN CUSTOMER DASHBOARD
  // =========================================================================
  if (isAuthenticated && customer) {
    const initials = customer.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div className="min-h-[85vh] bg-[#140C09] py-10 pb-24 max-[768px]:pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] max-[768px]:pt-6">
        <div className="container-lumera mx-auto max-w-[1040px]">
          {/* Client Dashboard Banner */}
          <div className="mb-8 rounded-[4px] border border-white/[0.08] bg-gradient-to-r from-[#1A0F0B] via-[#1E120D] to-[#160D09] p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/10 font-serif text-lg font-bold text-gold-400 shadow-inner">
                  {initials || 'L'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-[2px] bg-gold-400/15 px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-gold-400">
                      LUMÉRA Privé Member
                    </span>
                  </div>
                  <h1 className="mt-1 font-serif text-[clamp(1.4rem,3vw,1.85rem)] font-normal text-white">
                    {locale === 'ar' ? `مرحباً بك، ${customer.name}` : `Welcome, ${customer.name}`}
                  </h1>
                  <p className="text-[0.8rem] text-[#9E8E85] flex items-center gap-2">
                    <span>{customer.email}</span>
                    {customer.phone && (
                      <>
                        <span className="text-white/[0.2]">•</span>
                        <span>{customer.phone}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/shop"
                  className="rounded-[2px] border border-gold-400/40 bg-gold-400/10 px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-gold-400 transition-colors hover:bg-gold-400/20"
                >
                  {locale === 'ar' ? 'تسوق المجموعة' : 'Shop Curation'}
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-1.5 rounded-[2px] border border-white/[0.12] bg-white/[0.03] px-3.5 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#C5B7AD] transition-colors hover:border-[#D64529]/50 hover:text-[#FF8E78]"
                >
                  <LogOut size={14} />
                  <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8 flex border-b border-white/[0.08] overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] whitespace-nowrap transition-colors ${
                activeTab === 'orders'
                  ? 'border-gold-400 text-gold-400'
                  : 'border-transparent text-[#9E8E85] hover:text-white'
              }`}
            >
              <Package size={15} />
              <span>{locale === 'ar' ? 'طلباتي' : 'My Orders'}</span>
              {customerOrders.length > 0 && (
                <span className="ml-1 rounded-full bg-gold-400/20 px-1.5 py-0.2 text-[0.62rem] text-gold-400">
                  {customerOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] whitespace-nowrap transition-colors ${
                activeTab === 'profile'
                  ? 'border-gold-400 text-gold-400'
                  : 'border-transparent text-[#9E8E85] hover:text-white'
              }`}
            >
              <User size={15} />
              <span>{locale === 'ar' ? 'الملف الشخصي والعنوان' : 'Profile & Address'}</span>
            </button>

            <button
              onClick={() => setActiveTab('track_lookup')}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] whitespace-nowrap transition-colors ${
                activeTab === 'track_lookup'
                  ? 'border-gold-400 text-gold-400'
                  : 'border-transparent text-[#9E8E85] hover:text-white'
              }`}
            >
              <Search size={15} />
              <span>{locale === 'ar' ? 'تتبع أي شحنة' : 'Track Any Parcel'}</span>
            </button>
          </div>

          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div>
              {ordersLoading ? (
                <div className="flex h-48 items-center justify-center rounded-[3px] border border-white/[0.08] bg-[#190F0C]">
                  <RotateCw size={22} className="animate-spin text-gold-400" />
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="rounded-[4px] border border-white/[0.08] bg-[#190F0C] p-10 text-center">
                  <Package size={40} className="mx-auto mb-3 text-gold-400/40" />
                  <h3 className="mb-2 font-serif text-lg text-white">No Orders Placed Yet</h3>
                  <p className="mx-auto max-w-[420px] text-[0.85rem] text-[#9E8E85]">
                    Your luxury order history will appear here once you make your first purchase.
                    All deliveries across Saudi Arabia are handled with white-glove courier care.
                  </p>
                  <Link
                    href="/shop"
                    className="btn-lumera-primary mt-6 inline-flex items-center gap-2 px-6 py-3 text-[0.75rem] font-bold"
                  >
                    <span>Explore Products</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {customerOrders.map((ord) => {
                    const statusColor =
                      ord.order_status === 'delivered'
                        ? 'text-[#3EED8B] border-[#3EED8B]/30 bg-[#3EED8B]/10'
                        : ord.order_status === 'shipped'
                        ? 'text-sky-400 border-sky-400/30 bg-sky-400/10'
                        : ord.order_status === 'cancelled'
                        ? 'text-rose-400 border-rose-400/30 bg-rose-400/10'
                        : 'text-gold-400 border-gold-400/30 bg-gold-400/10';

                    const formattedDate = ord.created_at
                      ? new Date(ord.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Recent';

                    return (
                      <div
                        key={ord.id}
                        className="overflow-hidden rounded-[3px] border border-white/[0.08] bg-[#190F0C] transition-colors hover:border-gold-400/30"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-[#140C09]/60 px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-serif text-[1.05rem] font-medium tracking-[0.05em] text-white">
                              #{ord.order_number}
                            </span>
                            <span className="text-[0.72rem] text-[#9E8E85]">{formattedDate}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-[2px] border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] ${statusColor}`}
                            >
                              {ord.order_status}
                            </span>
                            <span className="rounded-[2px] bg-white/[0.06] px-2 py-1 text-[0.68rem] font-medium uppercase text-[#D8C7B2]">
                              {ord.payment_status}
                            </span>
                          </div>
                        </div>

                        {/* Order Body */}
                        <div className="p-5">
                          {/* Items List */}
                          {ord.items && ord.items.length > 0 && (
                            <div className="divide-y divide-white/[0.04]">
                              {ord.items.map((it: any) => (
                                <div
                                  key={it.id || it.product_id}
                                  className="flex items-center justify-between gap-4 py-3 text-[0.85rem]"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-white/[0.08] bg-[#130A08] text-xs font-bold text-gold-400">
                                      {it.quantity}×
                                    </div>
                                    <div>
                                      <p className="font-medium text-white">{it.product_name}</p>
                                      {it.variant_title && (
                                        <p className="text-[0.72rem] text-[#9E8E85]">
                                          Size: {it.variant_title}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <span className="font-semibold text-gold-400">
                                    {formatPrice(it.total_price || it.unit_price * it.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Tracking & Courier strip if available */}
                          {(ord.tracking_number || ord.courier) && (
                            <div className="mt-4 flex items-center justify-between rounded-[2px] border border-gold-400/20 bg-gold-400/[0.04] p-3 text-[0.78rem]">
                              <div className="flex items-center gap-2 text-white">
                                <Truck size={15} className="text-gold-400" />
                                <span>
                                  Carrier: <strong>{ord.courier || 'Express Saudi Courier'}</strong>
                                </span>
                              </div>
                              {ord.tracking_number && (
                                <div className="text-right">
                                  <span className="text-[#9E8E85] mr-1.5">Ref:</span>
                                  <span className="font-mono font-bold text-gold-400">
                                    {ord.tracking_number}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Order Footer Totals */}
                          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-white/[0.06] pt-3 text-[0.82rem] text-[#9E8E85]">
                            <div className="flex items-center gap-4">
                              <span>
                                Destination:{' '}
                                <strong className="text-white">
                                  {ord.shipping_address?.city || 'Saudi Arabia'}
                                </strong>
                              </span>
                              <span>
                                Shipping: <strong className="text-[#3EED8B]">COMPLIMENTARY</strong>
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="mr-2 text-[0.75rem] uppercase">Total:</span>
                              <span className="font-serif text-[1.1rem] font-semibold text-gold-400">
                                {formatPrice(ord.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE & ADDRESS */}
          {activeTab === 'profile' && (
            <div className="rounded-[4px] border border-white/[0.08] bg-[#190F0C] p-6 md:p-8">
              <h2 className="mb-2 font-serif text-xl text-white">Personal Profile & Saudi Shipping</h2>
              <p className="mb-6 text-[0.82rem] text-[#9E8E85]">
                Manage your contact details and default delivery destination for frictionless Saudi checkout.
              </p>

              {profileNotice && (
                <div
                  className={`mb-6 rounded-[2px] border p-3.5 text-[0.82rem] ${
                    profileNotice.type === 'success'
                      ? 'border-[#3EED8B]/40 bg-[#3EED8B]/10 text-[#71F2AD]'
                      : 'border-[#D64529]/40 bg-[#D64529]/10 text-[#FF9E8C]'
                  }`}
                >
                  {profileNotice.text}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-2.5 text-[0.85rem] text-white outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                      Email Address (Verified)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={customer.email}
                      className="w-full cursor-not-allowed rounded-[2px] border border-white/[0.06] bg-[#0E0604] px-3.5 py-2.5 text-[0.85rem] text-[#9E8E85]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +966 50 123 4567"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-2.5 text-[0.85rem] text-white outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                      Saudi City
                    </label>
                    <select
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-2.5 text-[0.85rem] text-white outline-none focus:border-gold-400"
                    >
                      {SAUDI_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-[#190F0C]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                    Street Address / Villa or Building
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prince Mohammed Bin Abdulaziz St, Villa 14"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-2.5 text-[0.85rem] text-white outline-none focus:border-gold-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                      District (Neighborhood)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Al Rawdah, Al Zahra, Al Malqa"
                      value={profileDistrict}
                      onChange={(e) => setProfileDistrict(e.target.value)}
                      className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-2.5 text-[0.85rem] text-white outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 23432"
                      value={profilePostalCode}
                      onChange={(e) => setProfilePostalCode(e.target.value)}
                      className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-2.5 text-[0.85rem] text-white outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileUpdating}
                    className="btn-lumera-primary px-8 py-3 text-[0.75rem] font-bold"
                  >
                    {profileUpdating ? 'Saving Changes...' : 'Save Profile Details'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: TRACK ANY PARCEL */}
          {activeTab === 'track_lookup' && (
            <div className="rounded-[4px] border border-white/[0.08] bg-[#190F0C] p-6 md:p-8">
              <h2 className="mb-2 font-serif text-xl text-white">Live Parcel Tracking</h2>
              <p className="mb-6 text-[0.82rem] text-[#9E8E85]">
                Enter any LUMÉRA order reference code (e.g. LUM-884219) to view its real-time preparation and dispatch progress.
              </p>

              <form onSubmit={handleTrackLookup} className="flex gap-3 max-[768px]:flex-col">
                <input
                  type="text"
                  required
                  placeholder="e.g. LUM-884219"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="flex-1 rounded-[2px] border border-white/[0.12] bg-[#130A08] px-4 py-3 text-[0.85rem] text-white outline-none focus:border-gold-400"
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="btn-lumera-primary whitespace-nowrap px-8 py-3 text-[0.75rem] font-bold"
                >
                  {lookupLoading ? 'Locating...' : 'Track Parcel'}
                </button>
              </form>

              {lookupNotFound && (
                <div className="mt-5 rounded-[2px] border border-[#D64529]/40 bg-[#D64529]/10 p-3.5 text-[0.82rem] text-[#FF9E8C]">
                  No order found matching &quot;{lookupQuery}&quot;. Please verify the reference code on your confirmation email.
                </div>
              )}

              {lookupResult && (
                <div className="mt-6 rounded-[2px] border border-gold-400/30 bg-[#150D0A] p-6">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                    <div>
                      <span className="text-[0.7rem] uppercase text-[#9E8E85]">Order Reference</span>
                      <h3 className="font-serif text-[1.15rem] text-gold-400">
                        #{lookupResult.order_number}
                      </h3>
                    </div>
                    <span className="rounded-[2px] border border-[#3EED8B]/40 bg-[#3EED8B]/10 px-2.5 py-1 text-[0.72rem] font-bold uppercase text-[#3EED8B]">
                      {lookupResult.order_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[0.82rem] text-[#D8C7B2]">
                    <div>
                      <span className="block text-[#9E8E85] text-[0.7rem]">Customer:</span>
                      <span className="font-medium text-white">{lookupResult.customer_name}</span>
                    </div>
                    <div>
                      <span className="block text-[#9E8E85] text-[0.7rem]">City:</span>
                      <span className="font-medium text-white">
                        {lookupResult.shipping_address?.city || 'Jeddah'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[#9E8E85] text-[0.7rem]">Payment:</span>
                      <span className="font-medium uppercase text-white">
                        {lookupResult.payment_status}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[#9E8E85] text-[0.7rem]">Total:</span>
                      <span className="font-semibold text-gold-400">
                        {formatPrice(lookupResult.total)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Sign Out Confirmation Modal */}
        {showLogoutConfirm && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <div
              className="w-full max-w-[420px] rounded-[4px] border border-white/[0.12] bg-[#190F0C] p-6 md:p-7 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D64529]/15 text-[#FF8E78]">
                <LogOut size={22} />
              </div>

              <h3 className="mb-1.5 font-serif text-lg font-medium text-white">
                {locale === 'ar' ? 'تأكيد تسجيل الخروج' : 'Sign Out of LUMÉRA Privé?'}
              </h3>
              <p className="mb-6 text-[0.82rem] leading-relaxed text-[#9E8E85]">
                {locale === 'ar'
                  ? 'هل أنت متأكد من رغبتك في تسجيل الخروج؟ يمكنك تسجيل الدخول مجدداً في أي وقت للوصول إلى طلباتك وتفاصيلك المحفوظة.'
                  : 'Are you sure you want to sign out of your account? You will need to sign in again to access your orders and saved details.'}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded-[2px] border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[#D8C7B2] transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setShowLogoutConfirm(false);
                    await logout();
                  }}
                  className="rounded-[2px] bg-[#D64529] px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#E85539]"
                >
                  {locale === 'ar' ? 'نعم، تسجيل الخروج' : 'Yes, Sign Out'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

  // =========================================================================
  // VIEW B: AUTHENTICATION GATEWAY (SIGN IN, SIGN UP, BREVO OTP FORGOT PASSWORD)
  // =========================================================================
  return (
    <div className="min-h-[85vh] bg-[#140C09] py-12 pb-24 max-[768px]:pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] max-[768px]:pt-6">
      <div className="container-lumera mx-auto max-w-[540px]">
        {/* Auth Mode Toggle Tabs (when in signin or signup mode) */}
        {(authMode === 'signin' || authMode === 'signup') && (
          <div className="mb-6 grid grid-cols-2 rounded-[3px] border border-white/[0.08] bg-[#190F0C] p-1">
            <button
              type="button"
              onClick={() => switchAuthMode('signin')}
              className={`rounded-[2px] py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-all ${
                authMode === 'signin'
                  ? 'bg-gold-400 text-[#0D0705] shadow'
                  : 'text-[#9E8E85] hover:text-white'
              }`}
            >
              {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => switchAuthMode('signup')}
              className={`rounded-[2px] py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-all ${
                authMode === 'signup'
                  ? 'bg-gold-400 text-[#0D0705] shadow'
                  : 'text-[#9E8E85] hover:text-white'
              }`}
            >
              {locale === 'ar' ? 'إنشاء حساب' : 'Create Account'}
            </button>
          </div>
        )}

        {/* Main Card */}
        <div className="rounded-[4px] border border-white/[0.08] bg-[#190F0C] p-7 md:p-9 shadow-2xl">
          {/* Notification Messages */}
          {errorMsg && (
            <div className="mb-5 flex items-start gap-2.5 rounded-[2px] border border-[#D64529]/40 bg-[#D64529]/10 p-3.5 text-[0.82rem] text-[#FF9E8C]">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-[#FF8E78]" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 flex items-start gap-2.5 rounded-[2px] border border-[#3EED8B]/40 bg-[#3EED8B]/10 p-3.5 text-[0.82rem] text-[#71F2AD]">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#3EED8B]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. SIGN IN FORM */}
          {/* ========================================================= */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-3 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-[#9E8E85]" />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => switchAuthMode('forgot_request')}
                    className="text-[0.72rem] text-gold-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-3 pl-10 pr-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-[#9E8E85]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3.5 top-3.5 text-[#9E8E85] hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-lumera-primary flex w-full items-center justify-center gap-2 py-3.5 text-[0.78rem] font-bold tracking-[0.14em]"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw size={15} className="animate-spin text-[#0D0705]" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In to LUMÉRA</span>
                  )}
                </button>
              </div>

              <div className="pt-3 text-center">
                <p className="text-[0.8rem] text-[#9E8E85]">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchAuthMode('signup')}
                    className="font-semibold text-gold-400 hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 2. SIGN UP FORM */}
          {/* ========================================================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Noura Al-Saud"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-3 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <User size={16} className="absolute left-3.5 top-3.5 text-[#9E8E85]" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-3 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-[#9E8E85]" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  Mobile Number (Saudi Format)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+966 50 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-3 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <Phone size={16} className="absolute left-3.5 top-3.5 text-[#9E8E85]" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  Create Password (Min 6 Characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-3 pl-10 pr-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-[#9E8E85]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3.5 top-3.5 text-[#9E8E85] hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-3 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-[#9E8E85]" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-lumera-primary flex w-full items-center justify-center gap-2 py-3.5 text-[0.78rem] font-bold tracking-[0.14em]"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw size={15} className="animate-spin text-[#0D0705]" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Join LUMÉRA Privé</span>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[0.8rem] text-[#9E8E85]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchAuthMode('signin')}
                    className="font-semibold text-gold-400 hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 3. FORGOT PASSWORD - STEP 1 (REQUEST BREVO OTP) */}
          {/* ========================================================= */}
          {authMode === 'forgot_request' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="mb-2">
                <h2 className="font-serif text-[1.15rem] font-medium text-white">
                  {locale === 'ar' ? 'استعادة كلمة المرور' : 'Password Recovery'}
                </h2>
                <p className="text-[0.78rem] text-[#9E8E85]">
                  {locale === 'ar'
                    ? 'أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق (OTP) عبر Brevo.'
                    : 'Enter your registered email address to receive your 6-digit verification code.'}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-3 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-[#9E8E85]" />
                </div>
              </div>

              <div className="rounded-[2px] border border-gold-400/20 bg-gold-400/[0.04] p-3 text-[0.76rem] text-[#C5B7AD] leading-relaxed">
                An authentic 6-digit verification code will be sent to your email address via our Brevo transactional gateway.
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-lumera-primary flex w-full items-center justify-center gap-2 py-3.5 text-[0.78rem] font-bold tracking-[0.14em]"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw size={15} className="animate-spin text-[#0D0705]" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <span>Send Verification Code (OTP)</span>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => switchAuthMode('signin')}
                  className="text-[0.78rem] text-[#9E8E85] hover:text-white"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 4. FORGOT PASSWORD - STEP 2 (VERIFY OTP & RESET PASSWORD) */}
          {/* ========================================================= */}
          {authMode === 'forgot_verify' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-center text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-gold-400">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  className="w-full text-center tracking-[12px] font-mono text-[1.4rem] font-bold rounded-[2px] border border-gold-400/50 bg-[#130A08] py-3 text-gold-400 outline-none focus:border-gold-400 shadow-inner"
                />
                <p className="mt-1 text-center text-[0.72rem] text-[#9E8E85]">
                  Valid for 10 minutes. Delivered to {email}.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  New Password (Min 6 Characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-3 pl-10 pr-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-[#9E8E85]" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3.5 top-3.5 text-[#9E8E85] hover:text-white"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-3 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-[#9E8E85]" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-lumera-primary flex w-full items-center justify-center gap-2 py-3.5 text-[0.78rem] font-bold tracking-[0.14em]"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw size={15} className="animate-spin text-[#0D0705]" />
                      <span>Verifying &amp; Resetting...</span>
                    </>
                  ) : (
                    <span>Reset Password &amp; Sign In</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 text-[0.76rem]">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || isSubmitting}
                  className={`text-gold-400 hover:underline ${
                    cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code via Brevo'}
                </button>
                <button
                  type="button"
                  onClick={() => switchAuthMode('forgot_request')}
                  className="text-[#9E8E85] hover:text-white"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ========================================================= */}
        {/* Guest Order Lookup & Concierge Card (Below Auth Card) */}
        {/* ========================================================= */}
        <div className="mt-10 rounded-[3px] border border-white/[0.08] bg-[#190F0C] p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2 text-gold-400">
            <Search size={18} />
            <h2 className="text-[0.82rem] font-semibold uppercase tracking-[0.14em]">
              Guest Order Tracking
            </h2>
          </div>
          <p className="mb-4 text-[0.82rem] leading-relaxed text-[#9E8E85]">
            Looking to check the shipping status of a purchase placed as a guest? Enter your order reference code (e.g. LUM-884219) below:
          </p>

          <form onSubmit={handleTrackLookup} className="flex gap-2 max-[640px]:flex-col">
            <input
              type="text"
              required
              placeholder="e.g. LUM-884219"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              className="flex-1 rounded-[2px] border border-white/[0.12] bg-[#130A08] px-3.5 py-2.5 text-[0.82rem] text-white outline-none focus:border-gold-400"
            />
            <button
              type="submit"
              disabled={lookupLoading}
              className="btn-lumera-primary whitespace-nowrap px-6 py-2.5 text-[0.72rem] font-bold"
            >
              {lookupLoading ? 'Locating...' : 'Track Parcel'}
            </button>
          </form>

          {lookupNotFound && (
            <div className="mt-4 rounded-[2px] border border-[#D64529]/40 bg-[#D64529]/10 p-3 text-[0.78rem] text-[#FF9E8C]">
              No order found matching &quot;{lookupQuery}&quot;. Please verify the order reference code.
            </div>
          )}

          {lookupResult && (
            <div className="mt-5 rounded-[2px] border border-gold-400/30 bg-[#150D0A] p-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 mb-3">
                <div>
                  <span className="text-[0.68rem] uppercase text-[#9E8E85]">Reference</span>
                  <h3 className="font-serif text-[1.05rem] text-gold-400">
                    #{lookupResult.order_number}
                  </h3>
                </div>
                <span className="rounded-[2px] border border-[#3EED8B]/40 bg-[#3EED8B]/10 px-2 py-0.5 text-[0.68rem] font-bold uppercase text-[#3EED8B]">
                  {lookupResult.order_status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[0.78rem] text-[#D8C7B2]">
                <div>
                  <span className="text-[#9E8E85]">Customer:</span>{' '}
                  <span className="text-white">{lookupResult.customer_name}</span>
                </div>
                <div>
                  <span className="text-[#9E8E85]">City:</span>{' '}
                  <span className="text-white">
                    {lookupResult.shipping_address?.city || 'Jeddah'}
                  </span>
                </div>
                <div>
                  <span className="text-[#9E8E85]">Total:</span>{' '}
                  <span className="font-semibold text-gold-400">
                    {formatPrice(lookupResult.total)}
                  </span>
                </div>
                <div>
                  <span className="text-[#9E8E85]">Payment:</span>{' '}
                  <span className="uppercase text-white">{lookupResult.payment_status}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Concierge Help Badge */}
        <div className="mt-6 text-center">
          <p className="text-[0.76rem] text-[#9E8E85]">
            Need immediate concierge assistance? WhatsApp:{' '}
            <a
              href="https://wa.me/966501234567"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:underline"
            >
              +966 50 123 4567
            </a>{' '}
            · Jeddah, KSA
          </p>
        </div>
      </div>
    </div>
  );
}
