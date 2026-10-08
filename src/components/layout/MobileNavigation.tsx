'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLocale } from '@/context/LocaleContext';

export const MobileNavigation: React.FC = () => {
  const pathname = usePathname();
  const { itemCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { t } = useLocale();

  // Hide on admin routes or checkout
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
    return null;
  }

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: Compass },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, count: wishlistCount },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 45,
        backgroundColor: 'rgba(20, 12, 9, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.5rem 1rem env(safe-area-inset-bottom, 0.5rem) 1rem',
      }}
      className="d-mobile-dock"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            color: pathname === '/' ? 'var(--color-gold-400)' : '#9E8E85',
            fontSize: '0.625rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <Home size={19} strokeWidth={1.5} />
          <span>Home</span>
        </Link>

        <Link
          href="/shop"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            color: pathname === '/shop' ? 'var(--color-gold-400)' : '#9E8E85',
            fontSize: '0.625rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <Compass size={19} strokeWidth={1.5} />
          <span>Shop</span>
        </Link>

        <Link
          href="/wishlist"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            color: pathname === '/wishlist' ? 'var(--color-gold-400)' : '#9E8E85',
            fontSize: '0.625rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            position: 'relative',
          }}
        >
          <Heart size={19} strokeWidth={1.5} />
          {wishlistCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '4px',
                backgroundColor: 'var(--color-gold-400)',
                color: '#0D0705',
                fontSize: '0.55rem',
                fontWeight: 700,
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {wishlistCount}
            </span>
          )}
          <span>Wishlist</span>
        </Link>

        <button
          onClick={openDrawer}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            color: '#9E8E85',
            fontSize: '0.625rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            position: 'relative',
          }}
        >
          <ShoppingBag size={19} strokeWidth={1.5} />
          {itemCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                backgroundColor: 'var(--color-gold-400)',
                color: '#0D0705',
                fontSize: '0.55rem',
                fontWeight: 700,
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {itemCount}
            </span>
          )}
          <span>Bag</span>
        </button>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .d-mobile-dock {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
