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
    <div style={{ backgroundColor: '#140C09', minHeight: '85vh', padding: '2.5rem 0 6rem 0' }}>
      <div className="container-lumera">
        {/* Breadcrumb */}
        <nav
          style={{
            fontSize: '0.725rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#7E6F67',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Link href="/" style={{ color: '#D8C7B2' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-gold-400)' }}>Shop</span>
        </nav>

        {/* Header */}
        <div style={{ maxWidth: '780px', marginBottom: '2.5rem' }}>
          <h1
            className="editorial-section-title"
            style={{
              color: '#FFFFFF',
              marginBottom: '0.75rem',
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#D8C7B2', lineHeight: 1.6, fontWeight: 300 }}>
            Curated for the refined tastes of Saudi Arabia with guaranteed authenticity and express delivery.
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <FilterBar totalCount={total} />

        {/* Grid or Empty */}
        {products.length === 0 ? (
          <div
            style={{
              padding: '5rem 2rem',
              textAlign: 'center',
              backgroundColor: '#190F0C',
              borderRadius: '3px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                color: 'var(--color-gold-400)',
                marginBottom: '0.75rem',
              }}
            >
              No Products Found
            </h3>
            <p style={{ color: '#9E8E85', fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 2rem auto' }}>
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
