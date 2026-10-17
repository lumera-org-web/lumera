'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

interface AdminToastContextType {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AdminToastContext = createContext<AdminToastContextType | undefined>(undefined);

const TOAST_DURATION = 3200;

export const AdminToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ id: number; message: string; type: 'success' | 'error' } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ id: Date.now(), message, type });
    setIsVisible(true);

    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, TOAST_DURATION);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setToast(null);
    }, 250);
  };

  return (
    <AdminToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-[999999] pointer-events-none select-none max-w-[calc(100vw-2rem)]"
        >
          <div
            className={`pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-[#140C09]/95 backdrop-blur-md border border-[#DEC197]/35 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-white transition-all duration-300 ease-out transform ${
              isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-2 opacity-0 scale-95'
            }`}
          >
            {/* Icon */}
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-[#E05A47] shrink-0 stroke-[2.5]" />
            ) : (
              <Check className="w-4 h-4 text-[#DEC197] shrink-0 stroke-[2.5]" />
            )}

            {/* Simple text message */}
            <span className="font-medium text-white/95 text-xs tracking-wide truncate max-w-[240px] sm:max-w-[340px]">
              {toast.message}
            </span>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              aria-label="Close notification"
              className="text-white/40 hover:text-white p-0.5 ml-1 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </AdminToastContext.Provider>
  );
};

export const useAdminToast = () => {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error('useAdminToast must be used within an AdminToastProvider');
  }
  return context;
};
