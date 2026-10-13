'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
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
    <div className="min-h-[85vh] bg-[#140C09] py-12 pb-24">
      <div className="container-lumera">
        <div className="mb-10 max-w-[640px]">
          <h1 className="mb-2 font-serif text-[2.25rem] text-white">
            Private Wishlist
          </h1>
          <p className="text-[0.9rem] text-[#9E8E85]">
            Your curated edit of personal favorites and luxury beauty wishlist.
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-[#9E8E85]">
            Loading your favorites...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[3px] border border-white/[0.06] bg-[#190F0C] px-8 py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
              <Heart size={28} />
            </div>
            <h2 className="mb-2 font-serif text-[1.5rem] text-white">
              Your Wishlist is Empty
            </h2>
            <p className="mb-7 text-[0.85rem] text-[#9E8E85]">
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
