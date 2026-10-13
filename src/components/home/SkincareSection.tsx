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
    <div className="mb-3 flex items-center [justify-content:inherit]">
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
    <section className="overflow-hidden border-y border-black/5 bg-[#FBF8F4]">
      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEWPORT: Full-bleed Panoramic Banner (Preserved 100% Unchanged) */}
      {/* ========================================================================= */}
      <div className="relative hidden min-h-[340px] w-full items-center min-[769px]:flex">
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <Image
            src={bannerImageUrl}
            alt={title}
            fill
            priority
            unoptimized
            sizes="100vw"
            className={`object-cover ${locale === 'ar' ? 'object-[center_left]' : 'object-[center_right]'}`}
          />

          {/* Soft Directional Ivory Scrim */}
          <div
            className={`absolute inset-0 ${
              locale === 'ar'
                ? 'bg-[linear-gradient(270deg,#FBF8F4_0%,rgba(251,248,244,0.97)_30%,rgba(251,248,244,0.76)_45%,rgba(251,248,244,0.25)_62%,transparent_78%)]'
                : 'bg-[linear-gradient(90deg,#FBF8F4_0%,rgba(251,248,244,0.97)_30%,rgba(251,248,244,0.76)_45%,rgba(251,248,244,0.25)_62%,transparent_78%)]'
            }`}
          />
        </div>

        <div className="container-lumera relative z-10 w-full py-14">
          <div className="max-w-[540px]">
            <CrestIcon />

            <div className="mb-[0.65rem] font-sans text-[0.75rem] font-semibold uppercase tracking-[0.28em] text-[#7D5A42]">
              {tag}
            </div>

            <h2 className="mb-[0.85rem] !font-serif text-[clamp(2.4rem,4vw,3.6rem)] font-semibold uppercase leading-[1.08] tracking-[0.04em] text-[#1A100C]">
              {title}
            </h2>

            <p className="mb-[1.65rem] !font-serif text-[1.25rem] font-medium leading-[1.45] tracking-[0.02em] text-[#4B352B]">
              {description}
            </p>

            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 border-b border-[#1A100C] pb-[0.35rem] text-[0.75rem] font-bold uppercase tracking-[0.22em] text-[#1A100C] no-underline transition-all duration-200 ease-[ease] hover:!border-gold-600 hover:!text-gold-600 hover:!tracking-[0.26em]"
            >
              <span>{ctaText}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE VIEWPORT: Crystal-Clear Editorial Layout (No Text Overlap, No Haze) */}
      {/* ========================================================================= */}
      <div className="flex w-full flex-col bg-[#FBF8F4] min-[769px]:hidden">
        {/* Top Text Block: 100% Clear High-Contrast Typography on Clean Ivory */}
        <div className="flex flex-col items-center px-6 pb-8 pt-12 text-center">
          <CrestIcon />

          <div className="mb-2 font-sans text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#8C674E]">
            {tag}
          </div>

          <h2 className="mb-[0.65rem] !font-serif text-[clamp(2rem,8vw,2.6rem)] font-semibold uppercase leading-[1.12] tracking-[0.04em] text-[#1A100C]">
            {title}
          </h2>

          <p className="mx-auto mb-[1.4rem] max-w-[340px] !font-serif text-[1.15rem] font-medium leading-[1.4] tracking-[0.02em] text-[#4B352B]">
            {description}
          </p>

          <Link
            href={ctaLink}
            className="inline-flex items-center gap-[0.45rem] border-b border-[#1A100C] pb-[0.35rem] text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#1A100C] no-underline transition-all duration-200 ease-[ease] hover:!border-gold-600 hover:!text-gold-600 hover:!tracking-[0.26em]"
          >
            <span>{ctaText}</span>
          </Link>
        </div>

        {/* Bottom Photography: Full-Color, 100% Sharp & Vibrant (Zero Fog/Milky Wash) */}
        <div className="relative h-[290px] w-full overflow-hidden">
          <Image
            src={mobileBannerImageUrl}
            alt={title}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[75%_center]"
          />
          {/* Subtle Top Edge Feather into the Ivory Section Background */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[35px] bg-[linear-gradient(180deg,#FBF8F4_0%,transparent_100%)]" />
        </div>
      </div>
    </section>
  );
};
