import React from 'react';
import Link from 'next/link';
import { getProductBySlug } from '@/services/products';
import { ProductView } from '@/components/product/ProductView';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | LUMÉRA',
    };
  }

  return {
    title: `${product.name} | ${product.brand?.name || 'LUMÉRA'}`,
    description: product.short_description || product.description || 'Exclusive luxury beauty from LUMÉRA.',
    openGraph: {
      title: product.name,
      description: product.short_description || '',
      images: product.images?.[0]?.image_url ? [product.images[0].image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="flex min-h-[80vh] items-center bg-[#140C09] py-24">
        <div className="container-lumera mx-auto text-center">
          <h1 className="mb-4 font-serif text-[2rem] text-gold-400">
            Product Not Found
          </h1>
          <p className="mb-8 text-[#9E8E85]">
            This item may be temporarily unavailable or unlisted in our active Saudi catalog.
          </p>
          <Link href="/shop" className="btn-lumera-outline">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  // Schema.org Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.[0]?.image_url,
    description: product.short_description || product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'LUMÉRA',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'SAR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="min-h-[85vh] bg-[#140C09] py-8 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-lumera">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-[0.725rem] uppercase tracking-[0.1em] text-[#7E6F67]">
          <Link href="/" className="text-[#D8C7B2] transition-colors hover:text-white">
            Home
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                href={`/category/${product.category.slug}`}
                className="text-[#D8C7B2] transition-colors hover:text-white"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gold-400">{product.name}</span>
        </nav>

        {/* Interactive Luxury Product View */}
        <ProductView product={product} />
      </div>
    </div>
  );
}
