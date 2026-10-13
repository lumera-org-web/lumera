import React from 'react';
import Link from 'next/link';
import { getProducts, searchProducts } from '@/services/products';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterBar } from '@/components/product/FilterBar';

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata = {
  title: 'The Collection | LUMÉRA Haute Beauty & Fragrance',
  description: 'Explore the full luxury collection of fragrances, makeup, and skincare rituals.',
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const search = await searchParams;
  const filter = (search.filter as string) || '';
  const query = (search.search as string) || '';
  const sort = (search.sort as any) || 'featured';

  let products = [];
  let total = 0;

  if (query) {
    products = await searchProducts(query);
    total = products.length;
  } else {
    const res = await getProducts({
      isTrending: filter === 'trending',
      isNew: filter === 'new',
      isBestseller: filter === 'bestseller',
      sort,
    });
    products = res.products;
    total = res.total;
  }

  let title = 'THE COMPLETE COLLECTION';
  if (filter === 'trending') title = 'TRENDING NOW';
  if (filter === 'new') title = 'NEW ARRIVALS';
  if (filter === 'bestseller') title = 'BESTSELLERS';
  if (query) title = `SEARCH RESULTS FOR "${query.toUpperCase()}"`;

  return (
    <div className="min-h-[85vh] bg-[#140C09] py-10 pb-24">
      <div className="container-lumera">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-[0.725rem] uppercase tracking-[0.1em] text-[#7E6F67]">
          <Link href="/" className="text-[#D8C7B2] transition-colors hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="text-gold-400">Shop</span>
        </nav>

        {/* Header */}
        <div className="mb-10 max-w-[780px]">
          <h1 className="editorial-section-title mb-3 text-white">
            {title}
          </h1>
          <p className="text-[0.95rem] font-light leading-[1.6] text-[#D8C7B2]">
            Curated for the refined tastes of Saudi Arabia with guaranteed authenticity and express delivery.
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <FilterBar totalCount={total} />

        {/* Grid or Empty */}
        {products.length === 0 ? (
          <div className="rounded-[3px] border border-white/[0.05] bg-[#190F0C] px-8 py-20 text-center">
            <h3 className="mb-3 font-serif text-[1.5rem] text-gold-400">
              No Products Found
            </h3>
            <p className="mx-auto mb-8 max-w-[420px] text-[0.85rem] text-[#9E8E85]">
              Add real products to your catalog through the LUMÉRA Admin / CMS portal.
            </p>
            <Link href="/admin/products" className="btn-lumera-outline">
              Go to Admin Portal
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
    </div>
  );
}
