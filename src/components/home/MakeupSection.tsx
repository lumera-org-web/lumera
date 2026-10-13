'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category, Banner } from '@/types';
import { useLocale } from '@/context/LocaleContext';

interface MakeupSectionProps {
  banner?: Banner;
  categories?: Category[];
}

export const MakeupSection: React.FC<MakeupSectionProps> = ({ banner, categories = [] }) => {
  const { locale } = useLocale();

  const subcats = categories.filter((c) => ['lips', 'blush', 'complexion'].includes(c.slug));

  const blocks = subcats.length > 0 ? subcats : [
    { name: 'LIPS', name_ar: 'الشفاه', slug: 'lips', image_url: null },
    { name: 'BLUSH', name_ar: 'أحمر الخدود', slug: 'blush', image_url: null },
    { name: 'COMPLEXION', name_ar: 'البشرة والأساس', slug: 'complexion', image_url: null },
  ];

  const tag = banner?.subtitle || 'MAKEUP';
  const title = (locale === 'ar' && banner?.title_ar)
    ? banner.title_ar
    : (banner?.title || (locale === 'ar' ? 'جمال يبرز في كل تفصيلة' : 'BEAUTY IN EVERY DETAIL'));

  const description = (locale === 'ar' && banner?.description_ar)
    ? banner.description_ar
    : (banner?.description || (locale === 'ar'
        ? 'مستحضرات مكياج فاخرة تمنحك إطلالة آسرة وثقة لا تضاهى.'
        : 'Elevated essentials for your most confident self.'));

  const ctaText = (locale === 'ar' && banner?.cta_text_ar)
    ? banner.cta_text_ar
    : (banner?.cta_text || (locale === 'ar' ? 'استكشف المكياج ←' : 'EXPLORE MAKEUP →'));

  const ctaLink = banner?.cta_link || '/category/makeup';

  return (
    <section className="border-t border-white/5 bg-[#160E0B] py-[5.5rem]">
      <div className="container-lumera">
        {/* Header */}
        <div className="mb-12 max-w-[640px]">
          <div className="mb-3 font-sans text-[0.725rem] font-bold uppercase tracking-[0.22em] text-gold-400">
            {tag}
          </div>
          <h2 className="mb-4 whitespace-pre-line font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold uppercase leading-[1.2] tracking-[0.02em] text-white">
            {title}
          </h2>
          <p className="mb-6 max-w-[520px] text-[clamp(0.925rem,1.4vw,1.1rem)] font-light leading-[1.6] text-[#D8C7B2]">
            {description}
          </p>
          <Link href={ctaLink} className="btn-lumera-link">
            <span>{ctaText}</span>
          </Link>
        </div>

        {/* 3 Editorial Subcategory Showcase Panels */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {blocks.map((block) => {
            const displayName = locale === 'ar' && block.name_ar ? block.name_ar : block.name;

            return (
              <Link
                key={block.slug}
                href={`/category/makeup?sub=${block.slug}`}
                className="group relative flex h-[380px] flex-col justify-end overflow-hidden rounded-[3px] border border-white/[0.08] bg-[#221510] p-8 no-underline [transition:transform_0.3s_ease,border-color_0.3s_ease] hover:-translate-y-1 hover:!border-gold-400 hover:!shadow-[0_16px_36px_rgba(0,0,0,0.65)]"
              >
                {/* Crystal-Clear Image without dark wash filter */}
                {block.image_url && (
                  <Image
                    src={block.image_url}
                    alt={displayName}
                    fill
                    unoptimized
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                )}

                {/* Subtle bottom-only scrim for text readability without darkening the face/photo */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(13,7,5,0.35)_78%,rgba(13,7,5,0.85)_100%)]" />

                {/* Text Area */}
                <div className="relative z-[2]">
                  <h3 className="mb-[0.4rem] font-display text-[1.75rem] font-bold uppercase tracking-[0.04em] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.85)]">
                    {displayName}
                  </h3>
                  <span className="inline-flex items-center gap-[0.4rem] text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-gold-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.85)]">
                    <span>{locale === 'ar' ? 'تسوق الآن ←' : 'Shop Now →'}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
