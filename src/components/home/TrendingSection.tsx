'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { useLocale } from '@/context/LocaleContext';

interface TrendingSectionProps {
  products: Product[];
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ products = [] }) => {
  const { locale, t } = useLocale();

  return (
    <section className="trending-section-root">
      <div className="container-lumera">
        {/* Header */}
        <div className="trending-header">
          <div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.675rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-400)',
                display: 'block',
                marginBottom: '0.35rem',
              }}
            >
              {locale === 'ar' ? 'مختارات الموسم' : 'CURATED SELECTION'}
            </span>
            <h2
              className="editorial-section-title"
              style={{
                color: '#FFFFFF',
                marginBottom: '0.35rem',
                fontSize: 'clamp(1.4rem, 3.2vw, 2.4rem)',
              }}
            >
              {locale === 'ar' ? 'الأكثر رواجاً الآن' : 'TRENDING NOW'}
            </h2>
            <p
              style={{
                color: '#9E8E85',
                fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                margin: 0,
                maxWidth: '480px',
              }}
            >
              {locale === 'ar'
                ? 'أحدث الاكتشافات التجميلية المفضلة لدى الجميع في المملكة.'
                : 'The beauty discoveries everyone is talking about.'}
            </p>
          </div>

          <Link href="/shop?filter=trending" className="btn-lumera-link" style={{ whiteSpace: 'nowrap' }}>
            <span>{t('viewAll')}</span>
          </Link>
        </div>

        {/* Product Grid or Empty State */}
        {products.length === 0 ? (
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              backgroundColor: '#160E0B',
              borderRadius: '4px',
              border: '1px dashed rgba(200, 162, 101, 0.2)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-gold-400)', marginBottom: '0.5rem' }}>
              Catalog Awaiting Real Products
            </div>
            <p style={{ color: '#9E8E85', fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              Products will dynamically appear here when uploaded via the LUMÉRA Admin / CMS portal or Supabase database.
            </p>
            <Link href="/admin/products" className="btn-lumera-outline" style={{ fontSize: '0.7rem' }}>
              Open Admin Portal
            </Link>
          </div>
        ) : (
          <div className="lumera-products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .trending-section-root {
          background-color: #120A08;
          padding: 3rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .trending-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .trending-section-root {
            padding: 5.5rem 0;
          }
          .trending-header {
            margin-bottom: 3rem;
          }
        }
      `}</style>
    </section>
  );
};
