import React from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FragranceSection } from '@/components/home/FragranceSection';
import { MakeupSection } from '@/components/home/MakeupSection';
import { SkincareSection } from '@/components/home/SkincareSection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { getBanners } from '@/services/banners';
import { getCategories } from '@/services/categories';
import { getTrendingProducts } from '@/services/products';

export const revalidate = 60; // revalidate every 60 seconds

export default async function HomePage() {
  const [banners, categories, trendingProducts] = await Promise.all([
    getBanners().catch(() => []),
    getCategories().catch(() => []),
    getTrendingProducts(8).catch(() => []),
  ]);

  const heroBanners = banners.filter((b) => b.section_type === 'hero');
  const fragranceBanner = banners.find((b) => b.section_type === 'fragrance_editorial');
  const makeupBanner = banners.find((b) => b.section_type === 'makeup_editorial');
  const skincareBanner = banners.find((b) => b.section_type === 'skincare_editorial');

  return (
    <div>
      {/* 1. Cinematic Hero Banner */}
      <HeroBanner banners={heroBanners} />

      {/* 2. Fragrance Section with Arched Pills */}
      <FragranceSection categories={categories} banner={fragranceBanner} />

      {/* 3. Makeup Section */}
      <MakeupSection banner={makeupBanner} categories={categories} />

      {/* 4. Skincare Editorial Ritual */}
      <SkincareSection banner={skincareBanner} />

      {/* 5. Trending Now Products */}
      <TrendingSection products={trendingProducts} />
    </div>
  );
}
