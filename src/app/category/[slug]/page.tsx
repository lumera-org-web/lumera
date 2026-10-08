import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/services/categories';
import { getProducts } from '@/services/products';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterBar } from '@/components/product/FilterBar';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: `${slug.toUpperCase()} | LUMÉRA`,
    };
  }

  return {
    title: `${category.name} | LUMÉRA Luxury Beauty`,
    description: category.description || `Explore our exclusive ${category.name} collection at LUMÉRA.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const sort = (search.sort as any) || 'featured';

  const [category, { products, total }] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({
      categorySlug: slug,
      sort,
    }),
  ]);

  const categoryName = category?.name || slug.toUpperCase();
  const categoryDesc =
    category?.description ||
    'Discover scents ranging from viral Arabian compositions to modern niche-inspired fragrances.';

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
          <Link href="/" style={{ color: '#D8C7B2', transition: 'color 0.2s' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-gold-400)' }}>{categoryName}</span>
        </nav>

        {/* Category Header */}
        <div style={{ maxWidth: '780px', marginBottom: '2.5rem' }}>
          <h1
            className="editorial-section-title"
            style={{
              color: '#FFFFFF',
              marginBottom: '0.75rem',
              letterSpacing: '0.04em',
            }}
          >
            {categoryName}
          </h1>
          <p
            style={{
              fontSize: '0.95rem',
              color: '#D8C7B2',
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            {categoryDesc}
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <FilterBar totalCount={total} />

        {/* Product Grid */}
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
              No Products in this Category Yet
            </h3>
            <p style={{ color: '#9E8E85', fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 2rem auto' }}>
              Real products added via the Admin / CMS portal with category &quot;{categoryName}&quot; will automatically populate this page.
            </p>
            <Link href="/admin/products" className="btn-lumera-outline">
              Add Products in Admin
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
