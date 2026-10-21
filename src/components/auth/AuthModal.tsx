'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useLocale } from '@/context/LocaleContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    signup,
    sendForgotOtp,
    resetPassword,
  } = useCustomerAuth();
  const { locale } = useLocale();

  // Modal view modes: 'signin' | 'signup' | 'forgot_request' | 'forgot_verify'
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot_request' | 'forgot_verify'>('signin');

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

  // Sync mode whenever modal opens with a requested mode
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || 'signin');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isAuthModalOpen, authModalMode]);

  // Handle ESC key press
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        closeAuthModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, isSubmitting, closeAuthModal]);

  // Lock body scroll when open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const isAr = locale === 'ar';

  const resetFormState = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'forgot_request' | 'forgot_verify') => {
    resetFormState();
    setMode(newMode);
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || (isAr ? 'بيانات الاعتماد غير صالحة' : 'Invalid email or password.'));
      } else {
        setSuccessMsg(isAr ? 'تم تسجيل الدخول بنجاح!' : 'Welcome back to LUMÉRA Privé!');
        setTimeout(() => {
          closeAuthModal();
        }, 600);
      }
    } catch {
      setErrorMsg(isAr ? 'حدث خطأ في الاتصال' : 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(isAr ? 'يجب أن لا تقل كلمة المرور عن 6 أحرف' : 'Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signup(name, email, phone, password);
      if (!res.success) {
        setErrorMsg(res.error || (isAr ? 'فشل إنشاء الحساب' : 'Failed to create account.'));
      } else {
        setSuccessMsg(isAr ? 'مرحباً بك في لوميرا بريفيه!' : 'Welcome to LUMÉRA Privé membership!');
        setTimeout(() => {
          closeAuthModal();
        }, 700);
      }
    } catch {
      setErrorMsg(isAr ? 'حدث خطأ في الشبكة' : 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Forgot Password - Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await sendForgotOtp(email);
      if (!res.success) {
        setErrorMsg(res.error || (isAr ? 'فشل إرسال رمز التحقق' : 'Failed to send verification code.'));
      } else {
        setSuccessMsg(
          res.message ||
            (isAr
              ? 'تم إرسال رمز التحقق المكون من 6 أرقام إلى بريدك الإلكتروني.'
              : 'A 6-digit verification code has been dispatched to your email.')
        );
        setMode('forgot_verify');
      }
    } catch {
      setErrorMsg(isAr ? 'خطأ في الشبكة' : 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Forgot Password - Step 2: Reset Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmNewPassword) {
      setErrorMsg(isAr ? 'كلمتا المرور غير متطابقتين' : 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg(isAr ? 'يجب أن لا تقل كلمة المرور عن 6 أحرف' : 'Password must be at least 6 characters.');
      return;
    }
    if (!otp || otp.length < 6) {
      setErrorMsg(isAr ? 'يرجى إدخال رمز التحقق المكون من 6 أرقام' : 'Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(email, otp, newPassword);
      if (!res.success) {
        setErrorMsg(res.error || (isAr ? 'رمز التحقق غير صالح أو منتهي الصلاحية' : 'Invalid or expired OTP code.'));
      } else {
        setSuccessMsg(isAr ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully! Welcome back.');
        setTimeout(() => {
          closeAuthModal();
        }, 700);
      }
    } catch {
      setErrorMsg(isAr ? 'حدث خطأ أثناء التحديث' : 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          closeAuthModal();
        }
      }}
    >
      <div
        className="relative my-auto w-full max-w-[460px] rounded-[4px] border border-white/[0.12] bg-[#180E0B] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(200,162,101,0.08)] transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top subtle decorative gold accent line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          disabled={isSubmitting}
          aria-label={isAr ? 'إغلاق' : 'Close'}
          className="absolute right-4 top-4 rounded p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          <X size={20} />
        </button>

        {/* Brand / Privé Emblem Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-400 shadow-[0_0_15px_rgba(200,162,101,0.2)]">
            <Sparkles size={18} />
          </div>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold-400 font-sans">
            LUMÉRA PRIVÉ
          </span>
          <h2 id="auth-modal-title" className="font-serif text-xl sm:text-2xl text-white font-medium mt-1">
            {mode === 'signin' && (isAr ? 'تسجيل الدخول' : 'Sign In')}
            {mode === 'signup' && (isAr ? 'إنشاء حساب جديد' : 'Join LUMÉRA Privé')}
            {mode === 'forgot_request' && (isAr ? 'استعادة كلمة المرور' : 'Reset Password')}
            {mode === 'forgot_verify' && (isAr ? 'رمز التحقق وكلمة المرور' : 'Verify & Reset')}
          </h2>
        </div>

        {/* Mode Toggle Tabs (when in signin or signup mode) */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="mb-6 grid grid-cols-2 rounded-[2px] border border-white/[0.08] bg-[#120806] p-1">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`rounded-[2px] py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] transition-all ${
                mode === 'signin'
                  ? 'bg-gold-400 text-[#0D0705] shadow'
                  : 'text-[#9E8E85] hover:text-white'
              }`}
            >
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`rounded-[2px] py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] transition-all ${
                mode === 'signup'
                  ? 'bg-gold-400 text-[#0D0705] shadow'
                  : 'text-[#9E8E85] hover:text-white'
              }`}
            >
              {isAr ? 'إنشاء حساب' : 'Create Account'}
            </button>
          </div>
        )}

        {/* Alert Notifications */}
        {errorMsg && (
          <div className="mb-5 flex items-start gap-2.5 rounded-[2px] border border-[#D64529]/40 bg-[#D64529]/10 p-3 text-[0.8rem] text-[#FF9E8C]">
            <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#FF8E78]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 flex items-start gap-2.5 rounded-[2px] border border-[#3EED8B]/40 bg-[#3EED8B]/10 p-3 text-[0.8rem] text-[#71F2AD]">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#3EED8B]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 1. SIGN IN FORM */}
        {/* ========================================================= */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[2px] border border-white/[0.12] bg-[#120806] px-3.5 py-2.5 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                />
                <Mail size={16} className="absolute left-3.5 top-3 text-[#9E8E85]" />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  {isAr ? 'كلمة المرور' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot_request')}
                  className="text-[0.7rem] text-gold-400 hover:underline"
                >
                  {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[2px] border border-white/[0.12] bg-[#120806] px-3.5 py-2.5 pl-10 pr-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-[#9E8E85]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3.5 top-3 text-[#9E8E85] hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-lumera-primary flex w-full items-center justify-center gap-2 py-3 text-[0.75rem] font-bold tracking-[0.12em]"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw size={14} className="animate-spin text-[#0D0705]" />
                    <span>{isAr ? 'جارِ الدخول...' : 'Signing In...'}</span>
                  </>
                ) : (
                  <span>{isAr ? 'تسجيل الدخول إلى لوميرا' : 'Sign In to LUMÉRA'}</span>
                )}
              </button>
            </div>

            <div className="pt-2 text-center">
              <p className="text-[0.78rem] text-[#9E8E85]">
                {isAr ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-semibold text-gold-400 hover:underline"
                >
                  {isAr ? 'إنشاء حساب جديد' : 'Create Account'}
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* 2. SIGN UP FORM */}
        {/* ========================================================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                {isAr ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: نورة آل سعود' : 'e.g. Noura Al-Saud'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[2px] border border-white/[0.12] bg-[#120806] px-3.5 py-2.5 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                />
                <User size={16} className="absolute left-3.5 top-3 text-[#9E8E85]" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[2px] border border-white/[0.12] bg-[#120806] px-3.5 py-2.5 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                />
                <Mail size={16} className="absolute left-3.5 top-3 text-[#9E8E85]" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                {isAr ? 'رقم الجوال السعودي' : 'Mobile Number (Saudi Format)'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+966 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-[2px] border border-white/[0.12] bg-[#120806] px-3.5 py-2.5 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                />
                <Phone size={16} className="absolute left-3.5 top-3 text-[#9E8E85]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  {isAr ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#120806] px-3.5 py-2.5 pl-9 pr-9 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <Lock size={14} className="absolute left-3 top-3 text-[#9E8E85]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password"
                    className="absolute right-2.5 top-3 text-[#9E8E85] hover:text-white"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                  {isAr ? 'تأكيد المرور' : 'Confirm'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#120806] px-3.5 py-2.5 pl-9 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                  <Lock size={14} className="absolute left-3 top-3 text-[#9E8E85]" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-lumera-primary flex w-full items-center justify-center gap-2 py-3 text-[0.75rem] font-bold tracking-[0.12em]"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw size={14} className="animate-spin text-[#0D0705]" />
                    <span>{isAr ? 'جارِ إنشاء الحساب...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <span>{isAr ? 'الانضمام إلى لوميرا بريفيه' : 'Join LUMÉRA Privé'}</span>
                )}
              </button>
            </div>

            <div className="pt-1 text-center">
              <p className="text-[0.78rem] text-[#9E8E85]">
                {isAr ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="font-semibold text-gold-400 hover:underline"
                >
                  {isAr ? 'تسجيل الدخول' : 'Sign In'}
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* 3. FORGOT PASSWORD - STEP 1 (REQUEST OTP) */}
        {/* ========================================================= */}
        {mode === 'forgot_request' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <p className="text-[0.8rem] text-[#D8C7B2]/85 leading-relaxed">
              {isAr
                ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رمز تحقق سرياً مكوناً من 6 أرقام عبر بريفو.'
                : 'Enter your registered email address to receive a secure 6-digit verification code.'}
            </p>

            <div>
              <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                {isAr ? 'البريد الإلكتروني' : 'Registered Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[2px] border border-white/[0.12] bg-[#120806] px-3.5 py-2.5 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                />
                <Mail size={16} className="absolute left-3.5 top-3 text-[#9E8E85]" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-lumera-primary flex w-full items-center justify-center gap-2 py-3 text-[0.75rem] font-bold tracking-[0.12em]"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw size={14} className="animate-spin text-[#0D0705]" />
                    <span>{isAr ? 'جارِ الإرسال...' : 'Sending Verification Code...'}</span>
                  </>
                ) : (
                  <span>{isAr ? 'إرسال رمز التحقق (OTP)' : 'Send Verification Code (OTP)'}</span>
                )}
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-[0.78rem] text-[#9E8E85] hover:text-white transition-colors"
              >
                {isAr ? '← العودة لتسجيل الدخول' : '← Back to Sign In'}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* 4. FORGOT PASSWORD - STEP 2 (VERIFY OTP & RESET) */}
        {/* ========================================================= */}
        {mode === 'forgot_verify' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-center text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold-400">
                {isAr ? 'أدخل رمز التحقق (6 أرقام)' : 'Enter 6-Digit Verification Code'}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                autoFocus
                className="w-full text-center tracking-[10px] font-mono text-[1.3rem] font-bold rounded-[2px] border border-gold-400/50 bg-[#120806] py-2.5 text-gold-400 outline-none focus:border-gold-400 shadow-inner"
              />
              <p className="mt-1 text-center text-[0.7rem] text-[#9E8E85]">
                {isAr ? `تم الإرسال إلى ${email}` : `Valid for 10 minutes. Delivered to ${email}.`}
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                {isAr ? 'كلمة المرور الجديدة' : 'New Password (Min 6 Characters)'}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-[2px] border border-white/[0.12] bg-[#120806] px-3.5 py-2.5 pl-10 pr-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-[#9E8E85]" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label="Toggle password"
                  className="absolute right-3.5 top-3 text-[#9E8E85] hover:text-white"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#C5B7AD]">
                {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full rounded-[2px] border border-white/[0.12] bg-[#120806] px-3.5 py-2.5 pl-10 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-[#9E8E85]" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-lumera-primary flex w-full items-center justify-center gap-2 py-3 text-[0.75rem] font-bold tracking-[0.12em]"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw size={14} className="animate-spin text-[#0D0705]" />
                    <span>{isAr ? 'جارِ التحديث...' : 'Updating Password...'}</span>
                  </>
                ) : (
                  <span>{isAr ? 'إعادة التعيين وتسجيل الدخول' : 'Reset Password & Sign In'}</span>
                )}
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-[0.78rem] text-[#9E8E85] hover:text-white transition-colors"
              >
                {isAr ? '← العودة لتسجيل الدخول' : '← Back to Sign In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
