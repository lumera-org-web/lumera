'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export const MobileNavigation: React.FC = () => {
  const pathname = usePathname();
  const { itemCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { customer, openAuthModal } = useCustomerAuth();

  // Hide on admin routes or checkout
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-45 border-t border-white/[0.08] bg-[#140C09]/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-2.5 backdrop-blur-[16px] md:hidden">
      <div className="mx-auto flex max-w-[480px] items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-[0.2rem] text-[0.6rem] uppercase tracking-[0.05em] transition-colors ${
            pathname === '/' ? 'text-gold-400' : 'text-[#9E8E85]'
          }`}
        >
          <Home size={18} strokeWidth={1.5} />
          <span>Home</span>
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center gap-[0.2rem] text-[0.6rem] uppercase tracking-[0.05em] transition-colors ${
            pathname === '/shop' ? 'text-gold-400' : 'text-[#9E8E85]'
          }`}
        >
          <Compass size={18} strokeWidth={1.5} />
          <span>Shop</span>
        </Link>

        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center gap-[0.2rem] text-[0.6rem] uppercase tracking-[0.05em] transition-colors ${
            pathname === '/wishlist' ? 'text-gold-400' : 'text-[#9E8E85]'
          }`}
        >
          <Heart size={18} strokeWidth={1.5} />
          {wishlistCount > 0 && (
            <span className="absolute -top-[3px] right-[4px] flex h-[13px] w-[13px] items-center justify-center rounded-full bg-gold-400 text-[0.55rem] font-bold text-[#0D0705]">
              {wishlistCount}
            </span>
          )}
          <span>Wishlist</span>
        </Link>

        <button
          onClick={openDrawer}
          className="relative flex flex-col items-center gap-[0.2rem] text-[0.6rem] uppercase tracking-[0.05em] text-[#9E8E85] transition-colors"
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          {itemCount > 0 && (
            <span className="absolute -top-[3px] -right-[3px] flex h-[13px] w-[13px] items-center justify-center rounded-full bg-gold-400 text-[0.55rem] font-bold text-[#0D0705]">
              {itemCount}
            </span>
          )}
          <span>Bag</span>
        </button>

        {customer ? (
          <Link
            href="/account"
            className={`relative flex flex-col items-center gap-[0.2rem] text-[0.6rem] uppercase tracking-[0.05em] transition-colors ${
              pathname === '/account' ? 'text-gold-400' : 'text-[#9E8E85]'
            }`}
          >
            <div className="relative">
              <User size={18} strokeWidth={1.5} />
              <span className="absolute -top-[1px] -right-[1px] h-[5px] w-[5px] rounded-full bg-gold-400" />
            </div>
            <span>Account</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('signin')}
            className="relative flex flex-col items-center gap-[0.2rem] text-[0.6rem] uppercase tracking-[0.05em] text-[#9E8E85] transition-colors hover:text-gold-400"
          >
            <User size={18} strokeWidth={1.5} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </div>
  );
};

