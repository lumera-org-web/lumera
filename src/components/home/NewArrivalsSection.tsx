'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { useLocale } from '@/context/LocaleContext';

interface NewArrivalsSectionProps {
  products: Product[];
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products = [] }) => {
  const { locale, isRtl, t } = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse Drag to Scroll
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const updateScrollState = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) {
      setScrollProgress(100);
      return;
    }

    const currentScroll = Math.abs(scrollLeft);
    const progress = Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100));
    setScrollProgress(progress);
  };

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [products]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeftState(trackRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative overflow-hidden bg-[#120A08] py-12 md:py-20 border-t border-b border-white/5">
      {/* Subtle ambient luxury glow in background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,162,101,0.08)_0%,transparent_65%)] opacity-40" />

      <div className="container-lumera relative z-10">
        {/* Editorial Section Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div className="max-w-xl">
            <div className="mb-1.5 inline-flex items-center gap-1.5 text-[0.675rem] font-bold uppercase tracking-[0.22em] text-gold-400">
              <span>{locale === 'ar' ? 'الوصول الحصري الجديد' : 'NEW ARRIVALS SHOWCASE'}</span>
            </div>

            <h2 className="mb-2 font-display text-2xl font-semibold uppercase tracking-wide text-white sm:text-3xl md:text-4xl">
              {locale === 'ar' ? 'أحدث الإطلاقات والابتكارات' : 'JUST ARRIVED'}
            </h2>

            <p className="m-0 max-w-lg font-sans text-xs leading-relaxed text-[#9E8E85] sm:text-sm">
              {locale === 'ar'
                ? 'استكشف أحدث إصدارات العطور النادرة ومستحضرات الجمال والعناية المتطورة.'
                : 'Explore freshly curated haute fragrances, radiant skincare, and luxury cosmetics.'}
            </p>
          </div>

          <Link href="/shop?filter=new" className="btn-lumera-link whitespace-nowrap">
            <span>{t('viewAll')}</span>
          </Link>
        </div>

        {/* Horizontal Products Scroll Track */}
        {products.length === 0 ? (
          <div className="mx-auto max-w-lg rounded border border-dashed border-gold-500/30 bg-[#160E0B] p-12 text-center">
            <Sparkles size={28} className="mx-auto mb-3 text-gold-400" />
            <div className="mb-2 font-serif text-xl text-gold-400">
              {locale === 'ar' ? 'وصل حديثاً قريباً' : 'Curating New Luxury Releases'}
            </div>
            <p className="mx-auto mb-5 max-w-sm text-xs text-[#9E8E85] sm:text-sm">
              {locale === 'ar'
                ? 'ستظهر هنا أحدث المنتجات فور إضافتها إلى الكتالوج.'
                : 'Newly uploaded fragrances, skincare, and cosmetics will display here automatically.'}
            </p>
            <Link
              href="/admin/products"
              className="inline-block rounded bg-gold-400 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-espresso-950 transition-colors hover:bg-gold-300"
            >
              Manage Products in Admin
            </Link>
          </div>
        ) : (
          <div className="relative w-full">
            <div
              ref={trackRef}
              className={`flex flex-row flex-nowrap gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth px-1 py-2 pb-5 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="w-[270px] min-w-[250px] max-w-[285px] shrink-0 snap-start transition-transform duration-250"
                >
                  <ProductCard product={product} variant="dark" />
                </div>
              ))}
            </div>

            {/* Sleek Golden Scroll Progress Indicator */}
            <div className="w-full max-w-[280px] h-0.5 bg-white/10 rounded-full mx-auto mt-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-200"
                style={{
                  width: `${Math.max(15, scrollProgress)}%`,
                  transformOrigin: isRtl ? 'right' : 'left',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
