'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Banner } from '@/types';
import { useLocale } from '@/context/LocaleContext';

interface HeroBannerProps {
  banners?: Banner[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banners = [] }) => {
  const { locale } = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroBanners = banners
    .filter((b) => b.section_type === 'hero')
    .sort((a, b) => (a.display_order || 1) - (b.display_order || 1));

  // Auto-sliding Carousel (Rotates every 5.5s)
  useEffect(() => {
    if (heroBanners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [heroBanners.length, currentSlide]);

  const activeBanner = heroBanners[currentSlide] || heroBanners[0];

  const rawTag =
    locale === 'ar' && activeBanner?.subtitle_ar
      ? activeBanner.subtitle_ar
      : activeBanner?.subtitle || (locale === 'ar' ? 'المجموعة الحصرية' : 'HAUTE PERFUMERY');

  // Strip any slide index markers like "· SLIDE 01" so count doesn't re-appear
  const tag =
    rawTag.replace(/\s*[·•|-]?\s*SLIDE\s*\d+/i, '').trim() ||
    (locale === 'ar' ? 'المجموعة الحصرية' : 'HAUTE PERFUMERY');

  const title =
    locale === 'ar' && activeBanner?.title_ar
      ? activeBanner.title_ar
      : activeBanner?.title || 'BEAUTY\nAFTER DARK';

  const subtitle =
    locale === 'ar' && activeBanner?.description_ar
      ? activeBanner.description_ar
      : activeBanner?.description ||
        'Discover fragrance, makeup and skincare curated for unforgettable rituals.';

  const ctaText =
    locale === 'ar' && activeBanner?.cta_text_ar
      ? activeBanner.cta_text_ar
      : activeBanner?.cta_text || 'SHOP THE EDIT →';

  const ctaLink = activeBanner?.cta_link || '/shop';

  return (
    <section className="hero-banner-section">
      {/* Background Slides with Smooth Cross-Fade Transition */}
      <div className="hero-background-wrapper">
        {heroBanners.length > 0 ? (
          heroBanners.map((banner, idx) => {
            const isCurrent = currentSlide === idx;
            return (
              <div
                key={banner.id || idx}
                className="hero-slide-layer"
                style={{
                  opacity: isCurrent ? 1 : 0,
                  transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: isCurrent ? 2 : 1,
                  pointerEvents: isCurrent ? 'auto' : 'none',
                }}
              >
                {banner.mobile_image_url ? (
                  <>
                    {/* Dedicated Mobile Banner Image (Smartphone) */}
                    <div className="hero-mobile-img">
                      <Image
                        src={banner.mobile_image_url}
                        alt={banner.title || ''}
                        fill
                        priority={idx === 0}
                        unoptimized
                        sizes="100vw"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>

                    {/* Desktop Banner Image (Tablet / Desktop) */}
                    <div className="hero-desktop-img">
                      {banner.image_url ? (
                        <Image
                          src={banner.image_url}
                          alt={banner.title || ''}
                          fill
                          priority={idx === 0}
                          unoptimized
                          sizes="100vw"
                          style={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                      ) : null}
                    </div>
                  </>
                ) : banner.image_url ? (
                  <Image
                    src={banner.image_url}
                    alt={banner.title || ''}
                    fill
                    priority={idx === 0}
                    unoptimized
                    sizes="100vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'radial-gradient(circle at 65% 45%, rgba(68, 38, 30, 0.45) 0%, rgba(20, 12, 9, 0.95) 70%, #0D0705 100%)',
                    }}
                  />
                )}
              </div>
            );
          })
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 65% 45%, rgba(68, 38, 30, 0.45) 0%, rgba(20, 12, 9, 0.95) 70%, #0D0705 100%)',
            }}
          />
        )}

        {/* Ambient Chiaroscuro Scrim */}
        <div className="hero-ambient-scrim" />
      </div>

      {/* Content Container */}
      <div className="container-lumera hero-content-container">
        <div key={currentSlide} className="hero-text-block animate-hero-fade">
          {/* Editorial Category Tag */}
          {tag ? <div className="hero-tag">{tag}</div> : null}

          {/* Main Editorial Title in Cormorant Garamond */}
          <h1 className="hero-title">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            {subtitle}
          </p>

          {/* CTA Button */}
          <div className="hero-cta-wrapper">
            <Link href={ctaLink} className="hero-cta-btn">
              <span>{ctaText}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Embedded Responsive CSS: Desktop preserved 100% same, Mobile styled like luxury reference */}
      <style>{`
        .hero-banner-section {
          position: relative;
          width: 100%;
          min-height: 84vh;
          background-color: #110907;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-background-wrapper {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .hero-slide-layer {
          position: absolute;
          inset: 0;
        }

        .hero-ambient-scrim {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background: linear-gradient(90deg, rgba(13, 7, 5, 0.92) 0%, rgba(13, 7, 5, 0.65) 45%, rgba(13, 7, 5, 0.35) 100%);
        }

        .hero-content-container {
          position: relative;
          z-index: 10;
          padding-top: 4rem;
          padding-bottom: 4rem;
          width: 100%;
        }

        .hero-text-block {
          max-width: 640px;
        }

        .hero-tag {
          font-family: var(--font-sans);
          font-size: 0.725rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--color-gold-400);
          font-weight: 600;
          margin-bottom: 0.75rem;
          display: inline-block;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', Georgia, serif !important;
          font-size: clamp(2.8rem, 5.2vw, 4.8rem);
          font-weight: 600;
          letter-spacing: 0.04em;
          line-height: 1.08;
          text-transform: uppercase;
          color: #FFFFFF;
          white-space: pre-line;
          margin-bottom: 1.35rem;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
        }

        .hero-subtitle {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.05rem, 1.4vw, 1.25rem);
          font-weight: 400;
          color: #D8C7B2;
          letter-spacing: 0.02em;
          line-height: 1.6;
          margin-bottom: 2.25rem;
          max-width: 560px;
        }

        .hero-cta-wrapper {
          display: block;
        }

        .hero-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 1rem 2.25rem;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FFFFFF;
          border: 1px solid var(--color-gold-400);
          text-decoration: none;
          transition: all 0.25s ease;
          background: transparent;
        }

        .hero-cta-btn:hover {
          background-color: var(--color-gold-400);
          color: var(--color-espresso-950);
          border-color: var(--color-gold-400);
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-hero-fade {
          animation: heroFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        [dir="rtl"] .hero-title,
        html[dir="rtl"] .hero-title {
          font-family: var(--font-arabic), serif !important;
          letter-spacing: 0 !important;
        }

        [dir="rtl"] .hero-subtitle,
        html[dir="rtl"] .hero-subtitle {
          font-family: var(--font-arabic), serif !important;
        }

        [dir="rtl"] .hero-tag,
        html[dir="rtl"] .hero-tag {
          font-family: var(--font-arabic), sans-serif !important;
          letter-spacing: 0.1em !important;
        }

        /* Desktop Viewport Rules (Strictly Preserved Same) */
        @media (min-width: 769px) {
          .hero-mobile-img {
            display: none !important;
          }
          .hero-desktop-img {
            display: block !important;
            position: absolute;
            inset: 0;
          }
        }

        /* Mobile Viewport Rules (Matches Luxury Reference Screenshot: Centered Upper Text + Product Focus Below) */
        @media (max-width: 768px) {
          .hero-desktop-img {
            display: none !important;
          }
          .hero-mobile-img {
            display: block !important;
            position: absolute;
            inset: 0;
          }

          .hero-banner-section {
            min-height: 88vh !important;
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
            align-items: center !important;
          }

          .hero-ambient-scrim {
            background: linear-gradient(
              180deg,
              rgba(13, 7, 5, 0.25) 0%,
              rgba(13, 7, 5, 0.15) 35%,
              rgba(13, 7, 5, 0.55) 60%,
              rgba(13, 7, 5, 0.88) 80%,
              rgba(13, 7, 5, 0.98) 100%
            ) !important;
          }

          .hero-content-container {
            margin-top: auto !important;
            padding-top: 2rem !important;
            padding-bottom: 2.25rem !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }

          .hero-text-block {
            max-width: 100% !important;
            margin: 0 auto !important;
            text-align: center !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }

          .hero-tag {
            font-size: 0.68rem !important;
            letter-spacing: 0.24em !important;
            margin-bottom: 0.45rem !important;
            text-align: center !important;
          }

          .hero-title {
            font-family: 'Cormorant Garamond', Georgia, serif !important;
            font-size: clamp(2rem, 7.5vw, 2.75rem) !important;
            font-weight: 600 !important;
            color: #FFFFFF !important;
            letter-spacing: 0.04em !important;
            line-height: 1.1 !important;
            text-transform: uppercase !important;
            margin-bottom: 0.5rem !important;
            text-align: center !important;
            text-shadow: 0 2px 14px rgba(0, 0, 0, 0.95) !important;
          }

          .hero-subtitle {
            font-family: 'Cormorant Garamond', Georgia, serif !important;
            font-size: clamp(0.9rem, 3.2vw, 1.05rem) !important;
            font-weight: 400 !important;
            color: #E7DDCE !important;
            letter-spacing: 0.02em !important;
            line-height: 1.45 !important;
            margin-bottom: 1.25rem !important;
            text-align: center !important;
            max-width: 330px !important;
            text-shadow: 0 1px 10px rgba(0, 0, 0, 0.9) !important;
          }

          .hero-cta-wrapper {
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
          }

          .hero-cta-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            border: 1px solid var(--color-gold-400) !important;
            background: linear-gradient(180deg, rgba(28, 16, 12, 0.88) 0%, rgba(14, 8, 6, 0.95) 100%) !important;
            color: #FAF4EE !important;
            padding: 0.8rem 2.25rem !important;
            font-size: 0.72rem !important;
            font-weight: 600 !important;
            letter-spacing: 0.18em !important;
            text-transform: uppercase !important;
            border-radius: 2px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55), 0 0 16px rgba(200, 162, 101, 0.12) !important;
          }
        }
      `}</style>
    </section>
  );
};
