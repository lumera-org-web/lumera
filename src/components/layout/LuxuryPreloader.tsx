'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export const LuxuryPreloader: React.FC = () => {
  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if user has already seen the intro animation during this session
    try {
      const hasSeen = sessionStorage.getItem('lumera_intro_done');
      if (hasSeen) {
        setShouldRender(false);
        return; // Don't show pre-loader on subsequent page navigations/refreshes in same tab
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }

    // Timeline: Start fade-out at 1.6s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1600);

    // Unmount completely at 2.2s
    const unmountTimer = setTimeout(() => {
      setShouldRender(false);
      try {
        sessionStorage.setItem('lumera_intro_done', 'true');
      } catch {
        // Ignore
      }
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      id="lumera-luxury-preloader"
      suppressHydrationWarning
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center overflow-hidden bg-[#0D0705] transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] ${
        isFadingOut ? 'pointer-events-none scale-[1.02] opacity-0' : 'pointer-events-auto scale-100 opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* Ambient Gold Radial Glow Aura */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-pulse-aura bg-[radial-gradient(circle,rgba(243,193,172,0.12)_0%,rgba(200,162,101,0.05)_40%,transparent_70%)]" />

      {/* Centered Luxury Brand Intro Box */}
      <div className="relative z-[2] flex animate-scale-in flex-col items-center px-8 text-center">
        {/* Crown / Crest Sparkle */}
        <div className="mb-5 opacity-90">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C12 2 13.5 6.5 17 8C13.5 9.5 12 14 12 14C12 14 10.5 9.5 7 8C10.5 6.5 12 2 12 2Z"
              fill="#F3C1AC"
              fillOpacity="0.9"
            />
            <path
              d="M12 14C12 14 13 17 15.5 18C13 19 12 22 12 22C12 22 11 19 8.5 18C11 17 12 14 12 14Z"
              fill="#C8A265"
              fillOpacity="0.75"
            />
            <circle cx="12" cy="11" r="1.5" fill="#F3C1AC" />
          </svg>
        </div>

        {/* High-Res Brand Logo */}
        <div className="relative mb-[0.85rem] h-[80px] w-[220px]">
          <Image
            src="/images/lumera-logo.png"
            alt="LUMÉRA"
            fill
            priority
            unoptimized
            className="object-contain"
          />
        </div>

        {/* Tagline */}
        <div className="mb-8 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-[#F3C1AC] opacity-90">
          HAUTE BEAUTY · SAUDI ARABIA
        </div>

        {/* Hairline Gold Progress Bar */}
        <div className="relative h-[1.5px] w-[140px] overflow-hidden rounded-[1px] bg-white/[0.08]">
          <div className="absolute inset-y-0 left-0 w-full animate-hairline-progress bg-[linear-gradient(90deg,#C8A265_0%,#F3C1AC_50%,#C8A265_100%)]" />
        </div>
      </div>
    </div>
  );
};
