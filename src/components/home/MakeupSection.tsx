'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
    <section
      style={{
        backgroundColor: '#160E0B',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '5.5rem 0',
      }}
    >
      <div className="container-lumera">
        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: '3rem' }}>
          <div className="editorial-section-tag">{tag}</div>
          <h2
            className="editorial-section-title"
            style={{ color: '#FFFFFF', marginBottom: '1rem', whiteSpace: 'pre-line' }}
          >
            {title}
          </h2>
          <p className="editorial-lead" style={{ marginBottom: '1.5rem', color: '#D8C7B2' }}>
            {description}
          </p>
          <Link href={ctaLink} className="btn-lumera-link">
            <span>{ctaText}</span>
          </Link>
        </div>

        {/* 3 Editorial Subcategory Showcase Panels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {blocks.map((block) => {
            const displayName = locale === 'ar' && block.name_ar ? block.name_ar : block.name;

            return (
              <Link
                key={block.slug}
                href={`/category/makeup?sub=${block.slug}`}
                style={{
                  position: 'relative',
                  height: '380px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  backgroundColor: '#221510',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem',
                  textDecoration: 'none',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                }}
                className="makeup-panel"
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
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                )}

                {/* Subtle bottom-only scrim for text readability without darkening the face/photo */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, transparent 58%, rgba(13, 7, 5, 0.35) 78%, rgba(13, 7, 5, 0.85) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Text Area */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      marginBottom: '0.4rem',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.85)',
                    }}
                  >
                    {displayName}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.15em',
                      color: 'var(--color-gold-400)',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      textShadow: '0 2px 6px rgba(0, 0, 0, 0.85)',
                    }}
                  >
                    <span>{locale === 'ar' ? 'تسوق الآن ←' : 'Shop Now →'}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .makeup-panel:hover {
          transform: translateY(-4px);
          border-color: var(--color-gold-400) !important;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.65) !important;
        }
        .makeup-panel:hover img {
          transform: scale(1.04);
        }
      `}</style>
    </section>
  );
};
