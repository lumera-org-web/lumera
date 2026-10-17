'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const TOAST_DURATION = 3000;

export const CartToast: React.FC = () => {
  const { toast, hideToast } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, TOAST_DURATION);
    } else {
      setIsVisible(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast?.id]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      hideToast();
    }, 250);
  };

  if (!toast && !isVisible) return null;

  const message = toast?.name
    ? `${toast.name} added to cart`
    : 'Item added to cart';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-[120px] right-4 sm:top-[128px] sm:right-6 z-[99999] pointer-events-none select-none max-w-[calc(100vw-2rem)]"
    >
      <div
        className={`pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-[#140C09]/95 backdrop-blur-md border border-[#DEC197]/35 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-white transition-all duration-300 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-2 opacity-0 scale-95'
        }`}
      >
        {/* Simple gold check icon */}
        <Check className="w-4 h-4 text-[#DEC197] shrink-0 stroke-[2.5]" />

        {/* Simple text message */}
        <span className="font-medium text-white/95 text-xs tracking-wide truncate max-w-[220px] sm:max-w-[320px]">
          {message}
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
  );
};
