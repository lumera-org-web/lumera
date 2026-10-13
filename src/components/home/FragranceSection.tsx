'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category, Banner } from '@/types';
import { useLocale } from '@/context/LocaleContext';

interface FragranceSectionProps {
  categories?: Category[];
  banner?: Banner;
}

export const FragranceSection: React.FC<FragranceSectionProps> = ({ categories = [], banner }) => {
  const { locale } = useLocale();

  // Subcategories from database or default fragrance notes with dedicated reference assets
  const subcats = categories.filter((c) =>
    ['arabian', 'floral', 'woody', 'musk', 'amber', 'fresh'].includes(c.slug)
  );

  const defaultFamilies = [
    { name: 'ARABIAN', name_ar: 'عربي شرقي', slug: 'arabian', image_url: '/images/fragrance/arabian-art.png' },
    { name: 'FLORAL', name_ar: 'زهري', slug: 'floral', image_url: '/images/fragrance/floral-art.png' },
    { name: 'WOODY', name_ar: 'خشبي', slug: 'woody', image_url: '/images/fragrance/woody-art.png' },
    { name: 'MUSK', name_ar: 'مسك', slug: 'musk', image_url: '/images/fragrance/musk-art.png' },
    { name: 'AMBER', name_ar: 'عنبر', slug: 'amber', image_url: '/images/fragrance/amber-art.png' },
    { name: 'FRESH', name_ar: 'منعش', slug: 'fresh', image_url: '/images/fragrance/fresh-art.png' },
  ];

  const fragranceFamilies = defaultFamilies.map((item) => {
    const found = subcats.find((c) => c.slug === item.slug);
    return {
      ...item,
      name: found?.name || item.name,
      name_ar: found?.name_ar || item.name_ar,
      image_url: found?.image_url || item.image_url,
    };
  });

  const tag = banner?.subtitle || 'FRAGRANCE';
  const title = (locale === 'ar' && banner?.title_ar)
    ? banner.title_ar
    : (banner?.title || (locale === 'ar' ? 'عطور تأسر الحواس وتدوم' : 'SCENTS THAT STAY'));

  const description = (locale === 'ar' && banner?.description_ar)
    ? banner.description_ar
    : (banner?.description || (locale === 'ar'
        ? 'من كنوز العطور العربية إلى الأيقونات العصرية، اكتشف العطر الذي يجسد حضورك الفريد.'
        : 'From Arabian treasures to modern icons, find a scent that becomes part of you.'));

  const ctaText = (locale === 'ar' && banner?.cta_text_ar)
    ? banner.cta_text_ar
    : (banner?.cta_text || (locale === 'ar' ? 'استكشف العطور ←' : 'EXPLORE FRAGRANCES →'));

  const ctaLink = banner?.cta_link || '/category/fragrance';

  return (
    <section className="relative flex min-h-[620px] items-center overflow-hidden border-y border-white/5 bg-[#0D0705] pb-[5.5rem] pt-20">
      {/* ========================================================================= */}
      {/* OPULENT BAROQUE BACKGROUND SCENE (Right-aligned Hero LUMÉRA Flacon) */}
      {/* ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {banner?.image_url ? (
          <Image
            src={banner.image_url}
            alt="LUMÉRA Parfumerie"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[center_right]"
          />
        ) : (
          /* Default Baroque LUMÉRA Hero Scene positioned on the right */
          <div className="absolute inset-y-0 right-0 w-[45%] min-w-[500px] max-w-[820px]">
            <Image
              src="/images/fragrance/hero-flacon-ultra.webp"
              alt="LUMÉRA Flacon Imperial"
              fill
              priority
              unoptimized
              className="object-cover object-[center_left]"
            />
          </div>
        )}

        {/* Cinematic Chiaroscuro Gradient Scrim: Deep Black over Cards, Glowing Light on Right */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0D0705_0%,#0D0705_44%,rgba(13,7,5,0.95)_58%,rgba(13,7,5,0.7)_72%,rgba(13,7,5,0.12)_88%,transparent_100%)]" />

        {/* Ambient Top & Bottom Vignettes */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,7,5,0.7)_0%,transparent_18%,transparent_82%,rgba(13,7,5,0.75)_100%)]" />
      </div>

      {/* ========================================================================= */}
      {/* CONTENT: Left Side Header + Perfectly Aligned 6 Arched Cards */}
      {/* ========================================================================= */}
      <div className="container-lumera relative z-10 w-full">
        {/* Editorial Section Header */}
        <div className="mb-10 max-w-[560px]">
          <div className="mb-[0.65rem] text-[0.725rem] font-semibold uppercase tracking-[0.26em] text-gold-400">
            {tag}
          </div>

          <h2 className="mb-[0.85rem] !font-serif text-[clamp(2.3rem,3.8vw,3.6rem)] font-semibold uppercase leading-[1.08] tracking-[0.04em] text-white">
            {title}
          </h2>

          <p className="mb-[1.4rem] max-w-[500px] text-[0.925rem] leading-[1.55] text-[#D8C7B2]">
            {description}
          </p>

          <Link
            href={ctaLink}
            className="inline-flex items-center gap-[0.45rem] border-b border-gold-400 pb-[0.35rem] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-white no-underline transition-all duration-200 ease-[ease] hover:!tracking-[0.24em] hover:!text-gold-400"
          >
            <span>{ctaText}</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 6 ARCHED CARDS: Bigger, Grand Cathedral Arches + Crystal-Sharp Resolution */}
        {/* ========================================================================= */}
        <div className="flex w-full max-w-[1060px] snap-x snap-mandatory gap-[0.85rem] overflow-x-auto pb-[0.85rem] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[1081px]:grid min-[1081px]:grid-cols-[repeat(6,minmax(140px,168px))] min-[1081px]:overflow-visible min-[1081px]:pb-0">
          {fragranceFamilies.map((item) => (
            <Link
              key={item.slug}
              href={`/category/fragrance?family=${item.slug}`}
              className="relative flex h-[250px] min-w-[150px] max-w-[150px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-[30px_30px_6px_6px] border border-white/[0.22] bg-[#160E0B] no-underline shadow-[0_10px_28px_rgba(0,0,0,0.55)] [transition:transform_0.35s_cubic-bezier(0.16,1,0.3,1),border-color_0.3s_ease,box-shadow_0.35s_ease] hover:-translate-y-2 hover:!border-gold-400 hover:!shadow-[0_18px_36px_rgba(0,0,0,0.75),0_0_24px_rgba(200,162,101,0.3)] min-[1081px]:h-[275px] min-[1081px]:w-full min-[1081px]:min-w-0 min-[1081px]:max-w-none"
            >
              {/* Full Artwork fills entire card through top arch to bottom - unoptimized ensures 100% original high-res sharpness */}
              {item.image_url ? (
                <>
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    unoptimized
                    priority
                    className="object-cover object-center [image-rendering:-webkit-optimize-contrast]"
                  />
                  {/* Seamless Vignette Scrim at bottom - Gradual dark tint to make label perfectly readable */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(13,7,5,0)_52%,rgba(13,7,5,0.65)_76%,rgba(13,7,5,0.94)_100%)]" />
                </>
              ) : (
                <>
                  {/* Luxury ambient gold star arch fallback */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(200,162,101,0.16)_0%,rgba(20,12,9,0.95)_80%)]" />
                  <div className="absolute left-1/2 top-5 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-[rgba(200,162,101,0.3)] text-[0.75rem] text-gold-400">
                    ✦
                  </div>
                </>
              )}

              {/* Card Label Base: sits cleanly over the bottom gradient */}
              <div className="relative z-[2] px-2 pb-[0.95rem] pt-0 text-center">
                <span className="block font-sans text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.95)]">
                  {locale === 'ar' ? item.name_ar : item.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
