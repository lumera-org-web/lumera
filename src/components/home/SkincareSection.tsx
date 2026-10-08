'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Banner } from '@/types';
import { useLocale } from '@/context/LocaleContext';

interface SkincareSectionProps {
  banner?: Banner;
}

export const SkincareSection: React.FC<SkincareSectionProps> = ({ banner }) => {
  const { locale } = useLocale();

  const tag = banner?.subtitle || 'SKINCARE';
  const title = (locale === 'ar' && banner?.title_ar)
    ? banner.title_ar
    : (banner?.title || (locale === 'ar' ? 'طقوس العناية بالبشرة' : 'THE SKIN RITUAL'));

  const description = (locale === 'ar' && banner?.description_ar)
    ? banner.description_ar
    : (banner?.description || (locale === 'ar'
        ? 'إشراقة. ترطيب عميق. تجديد وحماية.'
        : 'Brighten. Hydrate. Repair. Protect.'));

  const ctaText = (locale === 'ar' && banner?.cta_text_ar)
    ? banner.cta_text_ar
    : (banner?.cta_text || (locale === 'ar' ? 'استكشف العناية بالبشرة ←' : 'EXPLORE SKINCARE →'));

  const ctaLink = banner?.cta_link || '/category/skincare';
  const bannerImageUrl = banner?.image_url || '/images/skincare/skincare-panoramic-banner.jpg';
  const mobileBannerImageUrl = banner?.mobile_image_url || bannerImageUrl;

  const CrestIcon = () => (
    <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'inherit' }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2C12 2 13.5 6.5 17 8C13.5 9.5 12 14 12 14C12 14 10.5 9.5 7 8C10.5 6.5 12 2 12 2Z"
          fill="#C8A265"
          fillOpacity="0.85"
        />
        <path
          d="M12 14C12 14 13 17 15.5 18C13 19 12 22 12 22C12 22 11 19 8.5 18C11 17 12 14 12 14Z"
          fill="#C8A265"
          fillOpacity="0.6"
        />
        <circle cx="12" cy="11" r="1.5" fill="#C8A265" />
      </svg>
    </div>
  );

  return (
    <section className="skincare-section-root">
      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEWPORT: Full-bleed Panoramic Banner (Preserved 100% Unchanged) */}
      {/* ========================================================================= */}
      <div className="skincare-desktop-view">
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <Image
            src={bannerImageUrl}
            alt={title}
            fill
            priority
            unoptimized
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: locale === 'ar' ? 'center left' : 'center right',
            }}
          />

          {/* Soft Directional Ivory Scrim */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                locale === 'ar'
                  ? 'linear-gradient(270deg, #FBF8F4 0%, rgba(251, 248, 244, 0.97) 30%, rgba(251, 248, 244, 0.76) 45%, rgba(251, 248, 244, 0.25) 62%, transparent 78%)'
                  : 'linear-gradient(90deg, #FBF8F4 0%, rgba(251, 248, 244, 0.97) 30%, rgba(251, 248, 244, 0.76) 45%, rgba(251, 248, 244, 0.25) 62%, transparent 78%)',
            }}
          />
        </div>

        <div
          className="container-lumera"
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            paddingTop: '3.5rem',
            paddingBottom: '3.5rem',
          }}
        >
          <div style={{ maxWidth: '540px' }}>
            <CrestIcon />

            <div
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#7D5A42',
                fontWeight: 600,
                marginBottom: '0.65rem',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {tag}
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
                fontWeight: 600,
                color: '#1A100C',
                letterSpacing: '0.04em',
                lineHeight: 1.08,
                marginBottom: '0.85rem',
                textTransform: 'uppercase',
              }}
            >
              {title}
            </h2>

            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.25rem',
                fontWeight: 500,
                color: '#4B352B',
                letterSpacing: '0.02em',
                lineHeight: 1.45,
                marginBottom: '1.65rem',
              }}
            >
              {description}
            </p>

            <Link
              href={ctaLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#1A100C',
                textDecoration: 'none',
                borderBottom: '1px solid #1A100C',
                paddingBottom: '0.35rem',
                transition: 'all 0.2s ease',
              }}
              className="skincare-cta-hover"
            >
              <span>{ctaText}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE VIEWPORT: Crystal-Clear Editorial Layout (No Text Overlap, No Haze) */}
      {/* ========================================================================= */}
      <div className="skincare-mobile-view">
        {/* Top Text Block: 100% Clear High-Contrast Typography on Clean Ivory */}
        <div className="skincare-mobile-content">
          <CrestIcon />

          <div
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#8C674E',
              fontWeight: 700,
              marginBottom: '0.5rem',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {tag}
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 8vw, 2.6rem)',
              fontWeight: 600,
              color: '#1A100C',
              letterSpacing: '0.04em',
              lineHeight: 1.12,
              marginBottom: '0.65rem',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.15rem',
              fontWeight: 500,
              color: '#4B352B',
              letterSpacing: '0.02em',
              lineHeight: 1.4,
              marginBottom: '1.4rem',
              maxWidth: '340px',
              marginInline: 'auto',
            }}
          >
            {description}
          </p>

          <Link
            href={ctaLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#1A100C',
              textDecoration: 'none',
              borderBottom: '1px solid #1A100C',
              paddingBottom: '0.35rem',
              transition: 'all 0.2s ease',
            }}
            className="skincare-cta-hover"
          >
            <span>{ctaText}</span>
          </Link>
        </div>

        {/* Bottom Photography: Full-Color, 100% Sharp & Vibrant (Zero Fog/Milky Wash) */}
        <div className="skincare-mobile-photo-wrap">
          <Image
            src={mobileBannerImageUrl}
            alt={title}
            fill
            priority
            unoptimized
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: '75% center',
            }}
          />
          {/* Subtle Top Edge Feather into the Ivory Section Background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '35px',
              background: 'linear-gradient(180deg, #FBF8F4 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Embedded CSS for Hover & Responsive Viewport Toggle */}
      <style>{`
        .skincare-section-root {
          background-color: #FBF8F4;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .skincare-cta-hover:hover {
          color: var(--color-gold-600) !important;
          border-bottom-color: var(--color-gold-600) !important;
          letter-spacing: 0.26em !important;
        }

        /* Desktop Viewport Rules (100% Preserved) */
        @media (min-width: 769px) {
          .skincare-mobile-view {
            display: none !important;
          }
          .skincare-desktop-view {
            position: relative;
            min-height: 340px;
            display: flex;
            align-items: center;
            width: 100%;
          }
        }

        /* Mobile Viewport Rules (Ultra-Clear Editorial Presentation) */
        @media (max-width: 768px) {
          .skincare-desktop-view {
            display: none !important;
          }
          .skincare-mobile-view {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            background-color: #FBF8F4 !important;
          }
          .skincare-mobile-content {
            padding: 3rem 1.5rem 2rem 1.5rem !important;
            text-align: center !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .skincare-mobile-photo-wrap {
            position: relative !important;
            width: 100% !important;
            height: 290px !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </section>
  );
};
