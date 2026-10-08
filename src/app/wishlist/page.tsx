'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { createClient } from '@/utils/supabase/client';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('products')
          .select('*, brand:brands(*), category:categories(*), images:product_images(*)')
          .in('id', wishlist);

        setProducts((data as Product[]) || []);
      } catch (e) {
        console.error('Failed to load wishlist items', e);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistProducts();
  }, [wishlist]);

  return (
    <div style={{ backgroundColor: '#140C09', minHeight: '85vh', padding: '3rem 0 6rem 0' }}>
      <div className="container-lumera">
        <div style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.25rem',
              color: '#FFFFFF',
              marginBottom: '0.5rem',
            }}
          >
            Private Wishlist
          </h1>
          <p style={{ color: '#9E8E85', fontSize: '0.9rem' }}>
            Your curated edit of personal favorites and luxury beauty wishlist.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9E8E85' }}>
            Loading your favorites...
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              backgroundColor: '#190F0C',
              borderRadius: '3px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 162, 101, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: 'var(--color-gold-400)',
              }}
            >
              <Heart size={28} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                color: '#FFFFFF',
                marginBottom: '0.5rem',
              }}
            >
              Your Wishlist is Empty
            </h2>
            <p style={{ color: '#9E8E85', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
              Tap the heart on any fragrance, skincare or makeup item to save it here.
            </p>
            <Link href="/shop" className="btn-lumera-primary">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="lumera-products-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
