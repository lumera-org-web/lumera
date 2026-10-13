'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLocale } from '@/context/LocaleContext';
import { Category } from '@/types';

interface HeaderProps {
  categories?: Category[];
}

function isLinkActive(
  linkHref: string,
  pathname: string,
  searchParams: ReturnType<typeof useSearchParams> | null
) {
  const [linkPath, linkQuery] = linkHref.split('?');

  if (linkQuery) {
    if (pathname !== linkPath) return false;
    if (!searchParams) return false;
    const linkParams = new URLSearchParams(linkQuery);
    for (const [key, val] of linkParams.entries()) {
      if (searchParams.get(key) !== val) {
        return false;
      }
    }
    return true;
  }

  if (pathname !== linkPath) return false;

  // When on /shop without matching a query link (e.g. ?filter=trending or ?filter=new)
  if (linkPath === '/shop') {
    const filter = searchParams?.get('filter');
    if (filter === 'trending' || filter === 'new') {
      return false;
    }
  }

  return true;
}

interface NavLinksItemProps {
  navLinks: { label: string; href: string }[];
  pathname: string;
}

const DesktopNavLinks: React.FC<NavLinksItemProps> = ({ navLinks, pathname }) => {
  const searchParams = useSearchParams();

  return (
    <>
      {navLinks.map((link) => {
        const active = isLinkActive(link.href, pathname, searchParams);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative py-[0.4rem] text-[0.725rem] font-medium uppercase tracking-[0.18em] transition-colors duration-200 hover:text-gold-400 ${
              active ? 'text-gold-400' : 'text-[#E3D9D2]'
            }`}
          >
            {link.label}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold-400" />
            )}
          </Link>
        );
      })}
    </>
  );
};

const DesktopNavFallback: React.FC<NavLinksItemProps> = ({ navLinks, pathname }) => {
  return (
    <>
      {navLinks.map((link) => {
        const active = isLinkActive(link.href, pathname, null);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative py-[0.4rem] text-[0.725rem] font-medium uppercase tracking-[0.18em] transition-colors duration-200 hover:text-gold-400 ${
              active ? 'text-gold-400' : 'text-[#E3D9D2]'
            }`}
          >
            {link.label}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold-400" />
            )}
          </Link>
        );
      })}
    </>
  );
};

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
        className={`sticky top-0 z-50 border-b border-white/[0.08] transition-[background-color,border-color] duration-300 ${
          isScrolled
            ? 'bg-[#140C09]/96 backdrop-blur-[12px]'
            : 'bg-[var(--bg-primary)]'
        }`}
      >
        <div className="container-lumera flex h-[76px] items-center justify-between">
          {/* Mobile Left: Menu Toggle */}
          <div className="flex items-center gap-3 min-[992px]:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="flex items-center p-2 text-white"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Desktop Left: Brand Logo */}
          <div className="flex items-center">
            <Logo width={160} height={64} />
          </div>

          {/* Desktop Center: Luxury Editorial Navigation */}
          <nav
            className="hidden items-center gap-9 min-[992px]:flex"
            aria-label="Main Navigation"
          >
            <Suspense fallback={<DesktopNavFallback navLinks={navLinks} pathname={pathname} />}>
              <DesktopNavLinks navLinks={navLinks} pathname={pathname} />
            </Suspense>
          </nav>

          {/* Right Action Icons: Search, Account, Wishlist, Cart */}
          <div className="flex items-center gap-5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search Catalog"
              className="flex items-center p-[0.4rem] text-[#E3D9D2] transition-colors duration-200 hover:text-gold-400"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Account Icon (Desktop) */}
            <Link
              href="/account"
              aria-label={t('nav.account')}
              className="hidden items-center p-[0.4rem] text-[#E3D9D2] transition-colors duration-200 hover:text-gold-400 min-[992px]:flex"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              aria-label={t('nav.wishlist')}
              className="relative hidden items-center p-[0.4rem] text-[#E3D9D2] transition-colors duration-200 hover:text-gold-400 min-[992px]:flex"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-[2px] right-[1px] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-gold-400 text-[0.625rem] font-bold text-[#0D0705]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart */}
            <button
              onClick={openDrawer}
              aria-label={t('nav.bag')}
              className="relative flex items-center p-[0.4rem] text-[#E3D9D2] transition-colors duration-200 hover:text-gold-400"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-[2px] right-0 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-gold-400 text-[0.625rem] font-bold text-[#0D0705]">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Flyout */}
        {searchOpen && (
          <div className="animate-fade-in border-t border-white/[0.08] bg-[#160E0B] py-4">
            <div className="container-lumera">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="flex items-center gap-3 rounded-[2px] border border-gold-400/30 bg-[#1F140F] px-4 py-[0.65rem]"
              >
                <Search size={18} className="text-gold-400" />
                <input
                  type="text"
                  placeholder={t('nav.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="flex-1 border-none bg-transparent font-sans text-[0.85rem] text-white outline-none placeholder:text-[#9E8E85]"
                />
                <button
                  type="submit"
                  className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-gold-400"
                >
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-2 text-[#9E8E85] transition-colors hover:text-white"
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
          className="fixed inset-0 z-[100] flex bg-black/75 backdrop-blur-[6px]"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="flex h-full w-[82%] max-w-[340px] flex-col justify-between overflow-y-auto border-r border-white/[0.08] bg-[#140C09] p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="mb-10 flex items-center justify-between">
                <Logo width={145} height={58} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between border-b border-white/[0.05] pb-[0.85rem] text-[0.95rem] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:text-gold-400"
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={14} className="text-gold-400" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-6">
              <div className="flex flex-col gap-4">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-[0.85rem] text-[#D8C7B2] transition-colors hover:text-gold-400"
                >
                  <Heart size={18} className="text-gold-400" />
                  <span>
                    {t('nav.wishlist')} ({wishlistCount})
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
