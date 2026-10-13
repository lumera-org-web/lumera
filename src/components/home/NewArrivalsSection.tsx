'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { useLocale } from '@/context/LocaleContext';

interface NewArrivalsSectionProps {
  products: Product[];
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products = [] }) => {
  const { locale, isRtl, t } = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
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
      setCanScrollLeft(false);
      setCanScrollRight(false);
      setScrollProgress(100);
      return;
    }

    const currentScroll = Math.abs(scrollLeft);
    setCanScrollLeft(currentScroll > 10);
    setCanScrollRight(currentScroll < maxScroll - 10);

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

  const handleScroll = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const cardWidth = 280;
    const scrollAmount = direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5;
    const sign = isRtl ? -1 : 1;

    trackRef.current.scrollBy({
      left: scrollAmount * sign,
      behavior: 'smooth',
    });
  };

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
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(200, 162, 101, 0.08) 0%, transparent 65%)',
        }}
      />

      <div className="container-lumera relative z-10">
        {/* Editorial Section Header */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-10"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-[0.675rem] font-bold tracking-[0.22em] uppercase text-gold-400 mb-1.5">
              <span>{locale === 'ar' ? 'الوصول الحصري الجديد' : 'NEW ARRIVALS SHOWCASE'}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide uppercase text-white mb-2">
              {locale === 'ar' ? 'أحدث الإطلاقات والابتكارات' : 'JUST ARRIVED'}
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#9E8E85] leading-relaxed max-w-lg m-0">
              {locale === 'ar'
                ? 'استكشف أحدث إصدارات العطور النادرة ومستحضرات الجمال والعناية المتطورة.'
                : 'Explore freshly curated haute fragrances, radiant skincare, and luxury cosmetics.'}
            </p>
          </div>

          {/* Action Bar (View All + Navigation Arrows) */}
          <div
            className="flex items-center gap-4 flex-wrap"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <Link
              href="/shop?filter=new"
              className="font-sans text-xs font-bold tracking-[0.14em] uppercase text-white/90 hover:text-gold-400 border-b border-white/30 hover:border-gold-400 transition-colors py-1 whitespace-nowrap"
            >
              <span>{t('viewAll')}</span>
            </Link>

            {/* Slider Navigation Arrows */}
            <div
              className="flex items-center gap-2"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="w-9 h-9 rounded-full border border-gold-500/30 bg-[#1A100C] text-white flex items-center justify-center transition-all hover:bg-gold-400 hover:text-[#0D0705] hover:border-gold-400 disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(200, 162, 101, 0.35)',
                  backgroundColor: '#1A100C',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="w-9 h-9 rounded-full border border-gold-500/30 bg-[#1A100C] text-white flex items-center justify-center transition-all hover:bg-gold-400 hover:text-[#0D0705] hover:border-gold-400 disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(200, 162, 101, 0.35)',
                  backgroundColor: '#1A100C',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Products Scroll Track */}
        {products.length === 0 ? (
          <div className="p-12 text-center bg-[#160E0B] rounded border border-dashed border-gold-500/30 max-w-lg mx-auto">
            <Sparkles size={28} className="text-gold-400 mx-auto mb-3" />
            <div className="font-serif text-xl text-gold-400 mb-2">
              {locale === 'ar' ? 'وصل حديثاً قريباً' : 'Curating New Luxury Releases'}
            </div>
            <p className="text-[#9E8E85] text-xs sm:text-sm max-w-sm mx-auto mb-5">
              {locale === 'ar'
                ? 'ستظهر هنا أحدث المنتجات فور إضافتها إلى الكتالوج.'
                : 'Newly uploaded fragrances, skincare, and cosmetics will display here automatically.'}
            </p>
            <Link
              href="/admin/products"
              className="inline-block px-5 py-2.5 bg-gold-400 text-espresso-950 font-bold text-xs tracking-widest uppercase rounded hover:bg-gold-300 transition-colors"
            >
              Manage Products in Admin
            </Link>
          </div>
        ) : (
          <div className="relative w-full">
            <div
              ref={trackRef}
              className={`new-arrivals-x-track flex flex-row flex-nowrap gap-4 md:gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth py-2 px-1 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                gap: '1.25rem',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                padding: '0.5rem 0.25rem 1.25rem 0.25rem',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="new-arrivals-x-card snap-start shrink-0 transition-transform duration-250"
                  style={{
                    flex: '0 0 270px',
                    width: '270px',
                    minWidth: '250px',
                    maxWidth: '285px',
                    scrollSnapAlign: 'start',
                  }}
                >
                  <ProductCard product={product} variant="light" />
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
