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
    <section className="relative flex min-h-[84vh] w-full items-center overflow-hidden bg-[#110907] max-[768px]:h-[calc(100dvh-95px)] max-[768px]:max-h-[720px] max-[768px]:min-h-[520px] max-[768px]:flex-col max-[768px]:items-center max-[768px]:justify-end">
      {/* Background Slides with Smooth Cross-Fade Transition */}
      <div className="absolute inset-0 z-[1]">
        {heroBanners.length > 0 ? (
          heroBanners.map((banner, idx) => {
            const isCurrent = currentSlide === idx;
            return (
              <div
                key={banner.id || idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isCurrent ? 'pointer-events-auto z-[2] opacity-100' : 'pointer-events-none z-[1] opacity-0'
                }`}
              >
                {banner.mobile_image_url ? (
                  <>
                    {/* Dedicated Mobile Banner Image (Smartphone) */}
                    <div className="absolute inset-0 block min-[769px]:hidden">
                      <Image
                        src={banner.mobile_image_url}
                        alt={banner.title || ''}
                        fill
                        priority={idx === 0}
                        unoptimized
                        sizes="100vw"
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Desktop Banner Image (Tablet / Desktop) */}
                    <div className="absolute inset-0 hidden min-[769px]:block">
                      {banner.image_url ? (
                        <Image
                          src={banner.image_url}
                          alt={banner.title || ''}
                          fill
                          priority={idx === 0}
                          unoptimized
                          sizes="100vw"
                          className="object-cover object-center"
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
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(68,38,30,0.45)_0%,rgba(20,12,9,0.95)_70%,#0D0705_100%)]" />
                )}
              </div>
            );
          })
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(68,38,30,0.45)_0%,rgba(20,12,9,0.95)_70%,#0D0705_100%)]" />
        )}

        {/* Ambient Chiaroscuro Scrim */}
        <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(90deg,rgba(13,7,5,0.92)_0%,rgba(13,7,5,0.65)_45%,rgba(13,7,5,0.35)_100%)] max-[768px]:bg-[linear-gradient(180deg,rgba(13,7,5,0.15)_0%,rgba(13,7,5,0.05)_35%,rgba(13,7,5,0.45)_55%,rgba(13,7,5,0.82)_72%,rgba(13,7,5,0.97)_100%)]" />
      </div>

      {/* Content Container */}
      <div className="container-lumera relative z-10 w-full py-16 max-[768px]:mt-auto max-[768px]:flex max-[768px]:flex-col max-[768px]:items-center max-[768px]:pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] max-[768px]:pt-4 max-[768px]:text-center">
        <div
          key={currentSlide}
          className="animate-hero-fade max-w-[640px] max-[768px]:mx-auto max-[768px]:flex max-[768px]:max-w-full max-[768px]:flex-col max-[768px]:items-center max-[768px]:text-center"
        >
          {/* Editorial Category Tag */}
          {tag ? (
            <div className="mb-3 inline-block font-sans text-[0.725rem] font-semibold uppercase tracking-[0.26em] text-gold-400 max-[768px]:mb-[0.35rem] max-[768px]:text-center max-[768px]:!text-[0.65rem] max-[768px]:!tracking-[0.24em] rtl:!font-arabic rtl:!tracking-[0.1em]">
              {tag}
            </div>
          ) : null}

          {/* Main Editorial Title in Cormorant Garamond */}
          <h1 className="mb-[1.35rem] whitespace-pre-line !font-serif text-[clamp(2.8rem,5.2vw,4.8rem)] font-semibold uppercase leading-[1.08] tracking-[0.04em] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.6)] max-[768px]:mb-[0.45rem] max-[768px]:text-center max-[768px]:!text-[clamp(1.85rem,6.8vw,2.35rem)] max-[768px]:[text-shadow:0_2px_14px_rgba(0,0,0,0.95)] rtl:!font-arabic rtl:!tracking-normal">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mb-9 max-w-[560px] font-serif text-[clamp(1.05rem,1.4vw,1.25rem)] font-normal leading-[1.6] tracking-[0.02em] text-[#D8C7B2] max-[768px]:mb-4 max-[768px]:max-w-[310px] max-[768px]:text-center max-[768px]:text-[clamp(0.8rem,2.8vw,0.92rem)] max-[768px]:leading-[1.38] max-[768px]:text-[#E7DDCE] max-[768px]:[text-shadow:0_1px_10px_rgba(0,0,0,0.9)] rtl:!font-arabic">
            {subtitle}
          </p>

          {/* CTA Button */}
          <div className="block max-[768px]:flex max-[768px]:w-full max-[768px]:justify-center">
            <Link
              href={ctaLink}
              className="inline-flex items-center justify-center gap-[0.65rem] border border-gold-400 bg-transparent px-9 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-white no-underline transition-all duration-[250ms] ease-in-out hover:bg-gold-400 hover:text-espresso-950 max-[768px]:rounded-[2px] max-[768px]:!bg-[linear-gradient(180deg,rgba(28,16,12,0.88)_0%,rgba(14,8,6,0.95)_100%)] max-[768px]:px-[2.2rem] max-[768px]:py-[0.72rem] max-[768px]:text-[0.7rem] max-[768px]:font-semibold max-[768px]:tracking-[0.18em] max-[768px]:!text-[#FAF4EE] max-[768px]:shadow-[0_8px_24px_rgba(0,0,0,0.55),0_0_16px_rgba(200,162,101,0.12)]"
            >
              <span>{ctaText}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
