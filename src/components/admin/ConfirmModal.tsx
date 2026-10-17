'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, LogOut, Trash2, X, RefreshCw } from 'lucide-react';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  iconType?: 'trash' | 'logout' | 'warning';
  onConfirm: () => void | Promise<void>;
}

interface AdminConfirmContextType {
  confirm: (options: ConfirmOptions) => void;
  closeConfirm: () => void;
}

const AdminConfirmContext = createContext<AdminConfirmContextType | undefined>(undefined);

export const AdminConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions | null;
    loading: boolean;
  }>({
    isOpen: false,
    options: null,
    loading: false,
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    setModalState({
      isOpen: true,
      options,
      loading: false,
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false, loading: false }));
  }, []);

  const handleConfirmAction = async () => {
    if (!modalState.options) return;
    try {
      setModalState((prev) => ({ ...prev, loading: true }));
      await modalState.options.onConfirm();
      closeConfirm();
    } catch (err) {
      console.error('[ConfirmModal Error]', err);
      setModalState((prev) => ({ ...prev, loading: false }));
    }
  };

  const options = modalState.options;
  const variant = options?.variant || 'danger';
  const iconType = options?.iconType || (variant === 'danger' ? 'trash' : 'warning');

  return (
    <AdminConfirmContext.Provider value={{ confirm, closeConfirm }}>
      {children}

      {modalState.isOpen && options && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !modalState.loading) {
              closeConfirm();
            }
          }}
        >
          <div className="relative w-full max-w-md rounded-lg border border-white/12 bg-[#140C09] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(200,162,101,0.08)] transform transition-all">
            {/* Top accent glow line */}
            <div
              className={`absolute top-0 inset-x-0 h-[2px] ${
                variant === 'danger'
                  ? 'bg-gradient-to-r from-transparent via-[#E05A47] to-transparent'
                  : 'bg-gradient-to-r from-transparent via-[#DEC197] to-transparent'
              }`}
            />

            {/* Header with Icon & Close */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
                    variant === 'danger'
                      ? 'border-[#E05A47]/30 bg-[#E05A47]/15 text-[#E05A47] shadow-[0_0_15px_rgba(224,90,71,0.25)]'
                      : 'border-[#DEC197]/30 bg-[#DEC197]/15 text-[#DEC197] shadow-[0_0_15px_rgba(222,193,151,0.2)]'
                  }`}
                >
                  {iconType === 'logout' ? (
                    <LogOut size={20} />
                  ) : iconType === 'trash' ? (
                    <Trash2 size={20} />
                  ) : (
                    <AlertTriangle size={20} />
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white font-medium tracking-wide">
                    {options.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#9E8E85] font-sans">
                    Admin Confirmation
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeConfirm}
                disabled={modalState.loading}
                aria-label="Close"
                className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Body */}
            <p className="text-sm text-[#D8C7B2]/85 leading-relaxed mb-6 font-sans">
              {options.message}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={closeConfirm}
                disabled={modalState.loading}
                className="px-4 py-2.5 rounded text-xs uppercase tracking-wider font-semibold text-[#D8C7B2] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
              >
                {options.cancelText || 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={modalState.loading}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded text-xs uppercase tracking-wider font-bold transition-all ${
                  variant === 'danger'
                    ? 'bg-[#D64529] hover:bg-[#E05A47] text-white shadow-[0_4px_14px_rgba(214,69,41,0.35)] active:scale-[0.98]'
                    : 'bg-gradient-to-r from-[#DEC197] via-[#E8D4B4] to-[#DEC197] text-[#0D0705] hover:brightness-105 active:scale-[0.98]'
                } ${modalState.loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {modalState.loading && <RefreshCw size={13} className="animate-spin" />}
                <span>
                  {modalState.loading
                    ? 'Processing...'
                    : options.confirmText || (variant === 'danger' ? 'Confirm' : 'Continue')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminConfirmContext.Provider>
  );
};

export const useAdminConfirm = () => {
  const context = useContext(AdminConfirmContext);
  if (!context) {
    throw new Error('useAdminConfirm must be used within an AdminConfirmProvider');
  }
  return context;
};
