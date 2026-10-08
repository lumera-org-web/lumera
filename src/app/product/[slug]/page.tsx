import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
      <div style={{ backgroundColor: '#140C09', minHeight: '80vh', padding: '6rem 0' }}>
        <div className="container-lumera" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold-400)', fontSize: '2rem', marginBottom: '1rem' }}>
            Product Not Found
          </h1>
          <p style={{ color: '#9E8E85', marginBottom: '2rem' }}>
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
    <div style={{ backgroundColor: '#140C09', minHeight: '85vh', padding: '2rem 0 6rem 0' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-lumera">
        {/* Breadcrumbs */}
        <nav
          style={{
            fontSize: '0.725rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#7E6F67',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Link href="/" style={{ color: '#D8C7B2' }}>
            Home
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} style={{ color: '#D8C7B2' }}>
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: 'var(--color-gold-400)' }}>{product.name}</span>
        </nav>

        {/* Interactive Luxury Product View */}
        <ProductView product={product} />
      </div>
    </div>
  );
}
