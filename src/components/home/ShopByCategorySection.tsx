'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Banner } from '@/types';
import { useLocale } from '@/context/LocaleContext';

interface ShopByCategorySectionProps {
  banners?: Banner[];
}

interface DefaultCategoryCard {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  cta_link: string;
  image_url: string;
  display_order: number;
}

const DEFAULT_CATEGORY_CARDS: DefaultCategoryCard[] = [
  {
    id: 'default-fragrance',
    title: 'FRAGRANCE',
    title_ar: 'العطور الفاخرة',
    description: 'Iconic scents from Arabian treasures to modern classics.',
    description_ar: 'عطور أيقونية تأسر الحواس من كنوز الشرق إلى الكلاسيكيات العصرية.',
    cta_link: '/category/fragrance',
    image_url: '/images/categories/fragrance.jpg',
    display_order: 1,
  },
  {
    id: 'default-makeup',
    title: 'MAKEUP',
    title_ar: 'المكياج والتجميل',
    description: 'Elevate your everyday beauty with iconic favourites.',
    description_ar: 'تألقي بجمال يومي ساحر مع أفضل مستحضرات التجميل المفضلة.',
    cta_link: '/category/makeup',
    image_url: '/images/categories/makeup.jpg',
    display_order: 2,
  },
  {
    id: 'default-skincare',
    title: 'SKINCARE',
    title_ar: 'العناية بالبشرة',
    description: 'Healthy skin, brighter you.',
    description_ar: 'بشرة صحية وإشراقة طبيعية مفعمة بالنضارة والجمال.',
    cta_link: '/category/skincare',
    image_url: '/images/categories/skincare.jpg',
    display_order: 3,
  },
];

export const ShopByCategorySection: React.FC<ShopByCategorySectionProps> = ({ banners = [] }) => {
  const { locale, isRtl } = useLocale();

  // Filter banners configured for "shop_by_category"
  const categoryBanners = banners
    .filter((b) => b.section_type === 'shop_by_category' && b.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  // If CMS has cards, use them; if empty, use the 3 standard structure cards
  const cardsToDisplay = categoryBanners.length > 0 ? categoryBanners : DEFAULT_CATEGORY_CARDS;

  return (
    <section className="relative overflow-hidden bg-[#0D0705] py-10 md:py-14 border-b border-white/5">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,162,101,0.06)_0%,transparent_70%)]" />

      <div className="container-lumera relative z-10">
        {/* Section Header Bar */}
        <div className="mb-6 md:mb-8">
          <h2 className="font-serif text-xl sm:text-2xl md:text-[1.65rem] font-semibold tracking-[0.16em] uppercase text-[#E8CCA4]">
            {locale === 'ar' ? 'تسوق حسب الفئة' : 'SHOP BY CATEGORY'}
          </h2>
        </div>

        {/* 3 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {cardsToDisplay.map((card, idx) => {
            const fallback = DEFAULT_CATEGORY_CARDS[idx] || DEFAULT_CATEGORY_CARDS[0];

            const cardTitle =
              locale === 'ar' && card.title_ar
                ? card.title_ar
                : card.title || fallback.title;

            const cardDescription =
              locale === 'ar' && card.description_ar
                ? card.description_ar
                : card.description || fallback.description;

            const destination = card.cta_link || fallback.cta_link;
            const imgSrc = card.image_url || fallback.image_url;

            return (
              <Link
                key={card.id || `category-card-${idx}`}
                href={destination}
                className="group relative flex flex-col justify-end overflow-hidden rounded-xl md:rounded-2xl border border-[rgba(200,162,101,0.28)] bg-[#160E0B] transition-all duration-300 hover:border-[rgba(200,162,101,0.65)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] min-h-[220px] sm:min-h-[250px] lg:min-h-[270px] p-5 sm:p-6"
              >
                {/* Background Image / Ambient Gradient */}
                {imgSrc ? (
                  <>
                    <Image
                      src={imgSrc}
                      alt={cardTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={idx === 0}
                    />
                    {/* Dark gradient overlay for ultra-crisp readable text */}
                    <div
                      className={`absolute inset-0 z-[1] transition-opacity duration-300 ${
                        isRtl
                          ? 'bg-gradient-to-l from-black/85 via-black/45 to-black/15'
                          : 'bg-gradient-to-r from-black/85 via-black/45 to-black/15'
                      }`}
                    />
                    <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_70%_40%,rgba(200,162,101,0.18)_0%,rgba(20,12,9,0.95)_75%,#0D0705_100%)]" />
                )}

                {/* Foreground Content */}
                <div className="relative z-10 max-w-[85%] sm:max-w-[78%] flex flex-col justify-end">
                  {/* Category Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide uppercase text-white drop-shadow-md mb-1.5 transition-colors group-hover:text-[#F3E7D7]">
                    {cardTitle}
                  </h3>

                  {/* Description */}
                  {cardDescription && (
                    <p className="font-sans text-xs sm:text-[0.825rem] text-[#E0D3C3] leading-relaxed mb-4 line-clamp-2 drop-shadow">
                      {cardDescription}
                    </p>
                  )}

                  {/* Circular Gold Button with Arrow */}
                  <div
                    aria-label={`Explore ${cardTitle}`}
                    className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#E8CCA4] text-[#140C09] shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#F5DEBC]"
                  >
                    {isRtl ? (
                      <ArrowLeft size={16} strokeWidth={2.2} />
                    ) : (
                      <ArrowRight size={16} strokeWidth={2.2} />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
