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
    <section
      style={{
        position: 'relative',
        backgroundColor: '#0D0705',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '5rem 0 5.5rem 0',
        overflow: 'hidden',
        minHeight: '620px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* ========================================================================= */}
      {/* OPULENT BAROQUE BACKGROUND SCENE (Right-aligned Hero LUMÉRA Flacon) */}
      {/* ========================================================================= */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {banner?.image_url ? (
          <Image
            src={banner.image_url}
            alt="LUMÉRA Parfumerie"
            fill
            priority
            unoptimized
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center right' }}
          />
        ) : (
          /* Default Baroque LUMÉRA Hero Scene positioned on the right */
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '45%',
              minWidth: '500px',
              maxWidth: '820px',
            }}
          >
            <Image
              src="/images/fragrance/hero-flacon-ultra.webp"
              alt="LUMÉRA Flacon Imperial"
              fill
              priority
              unoptimized
              style={{ objectFit: 'cover', objectPosition: 'center left' }}
            />
          </div>
        )}

        {/* Cinematic Chiaroscuro Gradient Scrim: Deep Black over Cards, Glowing Light on Right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, #0D0705 0%, #0D0705 44%, rgba(13, 7, 5, 0.95) 58%, rgba(13, 7, 5, 0.7) 72%, rgba(13, 7, 5, 0.12) 88%, transparent 100%)',
          }}
        />

        {/* Ambient Top & Bottom Vignettes */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(13, 7, 5, 0.7) 0%, transparent 18%, transparent 82%, rgba(13, 7, 5, 0.75) 100%)',
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* CONTENT: Left Side Header + Perfectly Aligned 6 Arched Cards */}
      {/* ========================================================================= */}
      <div className="container-lumera" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {/* Editorial Section Header */}
        <div style={{ maxWidth: '560px', marginBottom: '2.5rem' }}>
          <div
            style={{
              fontSize: '0.725rem',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-400)',
              fontWeight: 600,
              marginBottom: '0.65rem',
            }}
          >
            {tag}
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.3rem, 3.8vw, 3.6rem)',
              fontWeight: 600,
              color: '#FFFFFF',
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
              color: '#D8C7B2',
              fontSize: '0.925rem',
              lineHeight: 1.55,
              maxWidth: '500px',
              marginBottom: '1.4rem',
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
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderBottom: '1px solid var(--color-gold-400)',
              paddingBottom: '0.35rem',
              transition: 'all 0.2s ease',
            }}
            className="fragrance-cta-hover"
          >
            <span>{ctaText}</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 6 ARCHED CARDS: Bigger, Grand Cathedral Arches + Crystal-Sharp Resolution */}
        {/* ========================================================================= */}
        <div
          className="fragrance-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(140px, 168px))',
            gap: '0.85rem',
            maxWidth: '1060px',
            width: '100%',
          }}
        >
          {fragranceFamilies.map((item) => (
            <Link
              key={item.slug}
              href={`/category/fragrance?family=${item.slug}`}
              style={{
                width: '100%',
                height: '275px',
                borderRadius: '30px 30px 6px 6px',
                backgroundColor: '#160E0B',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                position: 'relative',
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.35s ease',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.55)',
              }}
              className="fragrance-arch-card"
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
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      imageRendering: '-webkit-optimize-contrast',
                    }}
                  />
                  {/* Seamless Vignette Scrim at bottom - Gradual dark tint to make label perfectly readable */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(13, 7, 5, 0) 52%, rgba(13, 7, 5, 0.65) 76%, rgba(13, 7, 5, 0.94) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                </>
              ) : (
                <>
                  {/* Luxury ambient gold star arch fallback */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'radial-gradient(circle at 50% 30%, rgba(200, 162, 101, 0.16) 0%, rgba(20, 12, 9, 0.95) 80%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: '1px solid rgba(200, 162, 101, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      color: 'var(--color-gold-400)',
                    }}
                  >
                    ✦
                  </div>
                </>
              )}

              {/* Card Label Base: sits cleanly over the bottom gradient */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  textAlign: 'center',
                  padding: '0 0.5rem 0.95rem 0.5rem',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    fontFamily: "'Montserrat', sans-serif",
                    textShadow: '0 2px 6px rgba(0, 0, 0, 0.95)',
                  }}
                >
                  {locale === 'ar' ? item.name_ar : item.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Embedded CSS for smooth hover micro-animations & responsive layout */}
      <style>{`
        .fragrance-arch-card:hover {
          transform: translateY(-8px);
          border-color: var(--color-gold-400) !important;
          box-shadow: 0 18px 36px rgba(0, 0, 0, 0.75), 0 0 24px rgba(200, 162, 101, 0.3) !important;
        }
        .fragrance-cta-hover:hover {
          color: var(--color-gold-400) !important;
          letter-spacing: 0.24em !important;
        }

        @media (max-width: 1080px) {
          .fragrance-cards-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            padding-bottom: 0.85rem !important;
            -webkit-overflow-scrolling: touch !important;
            gap: 0.85rem !important;
          }
          .fragrance-cards-grid::-webkit-scrollbar {
            display: none;
          }
          .fragrance-arch-card {
            min-width: 150px !important;
            max-width: 150px !important;
            height: 250px !important;
            scroll-snap-align: start !important;
            flex-shrink: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};
