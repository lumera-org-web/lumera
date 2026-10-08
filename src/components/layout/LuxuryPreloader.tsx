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
    } catch (e) {
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
      } catch (e) {
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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#0D0705',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.02)' : 'scale(1)',
        pointerEvents: isFadingOut ? 'none' : 'all',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Ambient Gold Radial Glow Aura */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(243, 193, 172, 0.12) 0%, rgba(200, 162, 101, 0.05) 40%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'lumeraPulseAura 2s ease-in-out infinite alternate',
        }}
      />

      {/* Centered Luxury Brand Intro Box */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 2rem',
          animation: 'lumeraScaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Crown / Crest Sparkle */}
        <div style={{ marginBottom: '1.25rem', opacity: 0.9 }}>
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
        <div style={{ position: 'relative', width: '220px', height: '80px', marginBottom: '0.85rem' }}>
          <Image
            src="/images/lumera-logo.png"
            alt="LUMÉRA"
            fill
            priority
            unoptimized
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: '#F3C1AC',
            marginBottom: '2rem',
            opacity: 0.9,
          }}
        >
          HAUTE BEAUTY · SAUDI ARABIA
        </div>

        {/* Hairline Gold Progress Bar */}
        <div
          style={{
            width: '140px',
            height: '1.5px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '1px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '100%',
              background: 'linear-gradient(90deg, #C8A265 0%, #F3C1AC 50%, #C8A265 100%)',
              animation: 'lumeraHairlineProgress 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          />
        </div>
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        html.lumera-skip-intro #lumera-luxury-preloader {
          display: none !important;
        }

        @keyframes lumeraScaleIn {
          0% {
            opacity: 0;
            transform: scale(0.94);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes lumeraPulseAura {
          0% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes lumeraHairlineProgress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  );
};
