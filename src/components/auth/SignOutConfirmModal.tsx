'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, X, RotateCw } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  customerName?: string;
}

export const SignOutConfirmModal: React.FC<SignOutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customerName,
}) => {
  const { locale } = useLocale();
  const [loading, setLoading] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('[SignOutConfirmModal error]', err);
    } finally {
      setLoading(false);
    }
  };

  const isAr = locale === 'ar';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signout-modal-title"
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-[440px] rounded-[4px] border border-white/[0.12] bg-[#190F0C] p-6 md:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(214,69,41,0.1)] transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top subtle decorative accent glow */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D64529]/60 to-transparent" />

        {/* Header row with Icon, Title, and Close */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D64529]/30 bg-[#D64529]/15 text-[#FF8E78] shadow-[0_0_15px_rgba(214,69,41,0.25)]">
              <LogOut size={20} />
            </div>
            <div>
              <h3
                id="signout-modal-title"
                className="font-serif text-[1.15rem] font-medium tracking-wide text-white"
              >
                {isAr ? 'تأكيد تسجيل الخروج' : 'Sign Out of LUMÉRA Privé?'}
              </h3>
              <span className="text-[0.68rem] uppercase tracking-[0.14em] text-gold-400 font-sans">
                {customerName ? (isAr ? customerName : `Member: ${customerName}`) : 'Privé Member'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            className="rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Explanatory Message */}
        <p className="mb-6 text-[0.84rem] leading-relaxed text-[#D8C7B2]/85">
          {isAr
            ? 'هل أنت متأكد من رغبتك في تسجيل الخروج؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى طلباتك وتفاصيل ملفك الشخصي وعناوين الشحن.'
            : 'Are you sure you want to sign out of your account? You will need to sign in again to access your orders, saved details, and Saudi shipping preferences.'}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-[2px] border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.1em] text-[#D8C7B2] transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#D64529] px-5 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-white shadow-lg transition-colors hover:bg-[#E85539] disabled:opacity-60"
          >
            {loading ? (
              <>
                <RotateCw size={13} className="animate-spin" />
                <span>{isAr ? 'جارِ الخروج...' : 'Signing Out...'}</span>
              </>
            ) : (
              <span>{isAr ? 'نعم، تسجيل الخروج' : 'Yes, Sign Out'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
