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
    <section className="border-t border-white/5 bg-[#120A08] py-12 md:py-[5.5rem]">
      <div className="container-lumera">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-12">
          <div>
            <span className="mb-[0.35rem] block font-sans text-[0.675rem] font-bold uppercase tracking-[0.22em] text-gold-400">
              {locale === 'ar' ? 'مختارات الموسم' : 'CURATED SELECTION'}
            </span>
            <h2 className="mb-[0.35rem] font-display text-[clamp(1.4rem,3.2vw,2.4rem)] font-semibold uppercase leading-[1.2] tracking-[0.02em] text-white">
              {locale === 'ar' ? 'الأكثر رواجاً الآن' : 'TRENDING NOW'}
            </h2>
            <p className="m-0 max-w-[480px] text-[clamp(0.75rem,1.8vw,0.875rem)] text-[#9E8E85]">
              {locale === 'ar'
                ? 'أحدث الاكتشافات التجميلية المفضلة لدى الجميع في المملكة.'
                : 'The beauty discoveries everyone is talking about.'}
            </p>
          </div>

          <Link href="/shop?filter=trending" className="btn-lumera-link whitespace-nowrap">
            <span>{t('viewAll')}</span>
          </Link>
        </div>

        {/* Product Grid or Empty State */}
        {products.length === 0 ? (
          <div className="rounded-[4px] border border-dashed border-[rgba(200,162,101,0.2)] bg-[#160E0B] px-8 py-16 text-center">
            <div className="mb-2 font-serif text-[1.25rem] text-gold-400">
              Catalog Awaiting Real Products
            </div>
            <p className="mx-auto mb-6 max-w-[420px] text-[0.85rem] text-[#9E8E85]">
              Products will dynamically appear here when uploaded via the LUMÉRA Admin / CMS portal or Supabase database.
            </p>
            <Link href="/admin/products" className="btn-lumera-outline !text-[0.7rem]">
              Open Admin Portal
            </Link>
          </div>
        ) : (
          <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
