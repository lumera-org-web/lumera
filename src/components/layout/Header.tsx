'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLocale } from '@/context/LocaleContext';
import { Category } from '@/types';

interface HeaderProps {
  categories?: Category[];
}

export const Header: React.FC<HeaderProps> = ({ categories = [] }) => {
  const pathname = usePathname();
  const { itemCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { locale, t } = useLocale();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: t('nav.new'), href: '/shop?filter=new' },
    { label: t('nav.makeup'), href: '/category/makeup' },
    { label: t('nav.skincare'), href: '/category/skincare' },
    { label: t('nav.fragrance'), href: '/category/fragrance' },
    { label: t('nav.trending'), href: '/shop?filter=trending' },
    { label: t('nav.brands'), href: '/shop' },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: isScrolled ? 'rgba(20, 12, 9, 0.96)' : 'var(--bg-primary)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div
          className="container-lumera"
          style={{
            height: '76px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Mobile Left: Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="d-mobile-only">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              style={{ color: '#FFFFFF', padding: '0.5rem', display: 'flex', alignItems: 'center' }}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Desktop Left: Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Logo width={160} height={64} />
          </div>

          {/* Desktop Center: Luxury Editorial Navigation */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2.25rem',
            }}
            className="d-desktop-nav"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: active ? 'var(--color-gold-400)' : '#E3D9D2',
                    transition: 'color 0.2s ease',
                    position: 'relative',
                    padding: '0.4rem 0',
                  }}
                  className="nav-link-hover"
                >
                  {link.label}
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: 'var(--color-gold-400)',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Account, Wishlist, Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search Catalog"
              style={{
                color: '#E3D9D2',
                padding: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s ease',
              }}
              className="icon-hover"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Account Icon (Desktop) */}
            <Link
              href="/account"
              aria-label={t('nav.account')}
              style={{
                color: '#E3D9D2',
                padding: '0.4rem',
                display: 'none',
                alignItems: 'center',
                transition: 'color 0.2s ease',
              }}
              className="d-desktop-icon icon-hover"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              aria-label={t('nav.wishlist')}
              style={{
                color: '#E3D9D2',
                padding: '0.4rem',
                display: 'none',
                alignItems: 'center',
                position: 'relative',
                transition: 'color 0.2s ease',
              }}
              className="d-desktop-icon icon-hover"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '1px',
                    backgroundColor: 'var(--color-gold-400)',
                    color: '#0D0705',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart */}
            <button
              onClick={openDrawer}
              aria-label={t('nav.bag')}
              style={{
                color: '#E3D9D2',
                padding: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                transition: 'color 0.2s ease',
              }}
              className="icon-hover"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '0px',
                    backgroundColor: 'var(--color-gold-400)',
                    color: '#0D0705',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Flyout */}
        {searchOpen && (
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#160E0B',
              padding: '1rem 0',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div className="container-lumera">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#1F140F',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '2px',
                  padding: '0.65rem 1rem',
                }}
              >
                <Search size={18} color="var(--color-gold-400)" />
                <input
                  type="text"
                  placeholder={t('nav.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    color: 'var(--color-gold-400)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{ color: '#9E8E85', marginLeft: '0.5rem' }}
                >
                  <X size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '82%',
              maxWidth: '340px',
              height: '100%',
              backgroundColor: '#140C09',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                <Logo width={145} height={58} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: '#FFFFFF', padding: '0.5rem' }}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontSize: '0.95rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                      fontWeight: 500,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      paddingBottom: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={14} color="var(--color-gold-400)" />
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#D8C7B2', fontSize: '0.85rem' }}
                >
                  <User size={18} color="var(--color-gold-400)" />
                  <span>{t('nav.account')}</span>
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#D8C7B2', fontSize: '0.85rem' }}
                >
                  <Heart size={18} color="var(--color-gold-400)" />
                  <span>{t('nav.wishlist')} ({wishlistCount})</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold-400)',
                    marginTop: '0.5rem',
                  }}
                >
                  Admin / CMS Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .icon-hover:hover {
          color: var(--color-gold-400) !important;
        }
        .nav-link-hover:hover {
          color: var(--color-gold-400) !important;
        }
        @media (min-width: 992px) {
          .d-desktop-nav {
            display: flex !important;
          }
          .d-desktop-icon {
            display: flex !important;
          }
          .d-mobile-only {
            display: none !important;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};
