import React from 'react';
import Link from 'next/link';
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
  const brand = (search.brand as string) || undefined;
  const minPrice = search.minPrice ? Number(search.minPrice) : undefined;
  const maxPrice = search.maxPrice ? Number(search.maxPrice) : undefined;
  const minRating = search.rating ? Number(search.rating) : undefined;
  const availability = (search.availability as string) || undefined;
  const inStock = availability === 'in_stock' ? true : availability === 'out_of_stock' ? false : undefined;

  const [category, { products, total }] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({
      categorySlug: slug,
      brandSlug: brand,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sort,
    }),
  ]);

  const categoryName = category?.name || slug.toUpperCase();
  const categoryDesc =
    category?.description ||
    'Discover scents ranging from viral Arabian compositions to modern niche-inspired fragrances.';

  return (
    <div className="min-h-[85vh] bg-[#140C09] py-10 pb-24">
      <div className="container-lumera">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-[0.725rem] uppercase tracking-[0.1em] text-[#7E6F67]">
          <Link href="/" className="text-[#D8C7B2] transition-colors hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="text-gold-400">{categoryName}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-10 max-w-[780px]">
          <h1 className="editorial-section-title mb-3 tracking-[0.04em] text-white">
            {categoryName}
          </h1>
          <p className="text-[0.95rem] font-light leading-[1.6] text-[#D8C7B2]">
            {categoryDesc}
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <FilterBar totalCount={total} />

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="rounded-[3px] border border-white/[0.05] bg-[#190F0C] px-8 py-20 text-center">
            <h3 className="mb-3 font-serif text-[1.5rem] text-gold-400">
              No Products in this Category Yet
            </h3>
            <p className="mx-auto mb-8 max-w-[420px] text-[0.85rem] text-[#9E8E85]">
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
