'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight, RefreshCw } from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLocale } from '@/context/LocaleContext';
import { Category } from '@/types';
import { formatPrice } from '@/utils/formatters';

interface SearchProduct {
  id: string;
  name: string;
  name_ar?: string | null;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  image_url?: string | null;
}

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
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  // Live Search Effect (Debounced 200ms, max 4 items)
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.products || []);
          setHasSearched(true);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setSearchResults([]);
          setHasSearched(true);
        }
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  // Close mobile menu and search on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    handleCloseSearch();
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
          <div className="animate-fade-in border-t border-white/[0.08] bg-[#160E0B] py-3 md:py-4">
            <div className="container-lumera mx-auto max-w-[760px] px-3 md:px-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="flex items-center gap-2 rounded-[2px] border border-gold-400/30 bg-[#1F140F] px-3 py-2 md:py-2.5 transition-colors focus-within:border-gold-400/80"
              >
                <Search size={16} className="text-gold-400 shrink-0" />
                <input
                  type="text"
                  placeholder={t('nav.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="flex-1 min-w-0 border-none bg-transparent font-sans text-[0.8rem] md:text-[0.85rem] text-white outline-none placeholder:text-[#9E8E85]"
                />
                {isSearching && (
                  <RefreshCw size={13} className="animate-spin text-gold-400 shrink-0" />
                )}
                {searchQuery && !isSearching && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search input"
                    className="p-1 text-[#9E8E85] transition-colors hover:text-white shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Search Catalog"
                  className="p-1 text-gold-400 transition-colors hover:text-gold-300 shrink-0"
                >
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleCloseSearch}
                  aria-label="Close Search"
                  className="ml-1 p-1 text-[#9E8E85] transition-colors hover:text-white shrink-0"
                >
                  <X size={16} />
                </button>
              </form>

              {/* Related Live Search Items (Max 4, Very Small, Mobile Responsive) */}
              {searchQuery.trim().length > 0 && (
                <div className="mt-2 overflow-hidden rounded-[2px] border border-white/[0.08] bg-[#190F0C] shadow-2xl animate-fade-in">
                  {searchResults.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between border-b border-white/[0.05] bg-white/[0.02] px-3 py-1.5">
                        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#9E8E85]">
                          {locale === 'ar' ? 'المنتجات المقترحة' : 'Suggested Products'}
                        </span>
                        <span className="text-[0.6rem] font-medium text-gold-400/90">
                          {searchResults.length} {locale === 'ar' ? 'عناصر' : 'items'}
                        </span>
                      </div>

                      <div className="divide-y divide-white/[0.04]">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={handleCloseSearch}
                            className="group flex items-center gap-2.5 px-3 py-1.5 transition-colors hover:bg-white/[0.04] active:bg-white/[0.08]"
                          >
                            {/* Very Small Thumbnail (36x36) */}
                            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[2px] border border-white/[0.08] bg-[#120A07]">
                              {product.image_url ? (
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  fill
                                  sizes="36px"
                                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[0.6rem] text-[#9E8E85]">
                                  L
                                </div>
                              )}
                            </div>

                            {/* Product Info (Compact) */}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[0.75rem] md:text-[0.78rem] font-medium text-[#EAE2DC] transition-colors group-hover:text-gold-400">
                                {locale === 'ar' && product.name_ar ? product.name_ar : product.name}
                              </p>
                              <div className="mt-[1px] flex items-center gap-2">
                                <span className="text-[0.7rem] font-bold text-gold-400">
                                  {formatPrice(product.price)}
                                </span>
                                {product.compare_at_price && product.compare_at_price > product.price && (
                                  <span className="text-[0.62rem] text-[#9E8E85] line-through">
                                    {formatPrice(product.compare_at_price)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Tiny Arrow */}
                            <ArrowRight
                              size={13}
                              className="shrink-0 text-[#9E8E85] transition-all group-hover:translate-x-0.5 group-hover:text-gold-400"
                            />
                          </Link>
                        ))}
                      </div>

                      {/* Footer: View All Results */}
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery.trim())}`}
                        onClick={handleCloseSearch}
                        className="flex items-center justify-between border-t border-white/[0.06] bg-gold-400/[0.03] px-3 py-1.5 md:py-2 text-[0.7rem] font-medium tracking-[0.05em] text-gold-400 transition-colors hover:bg-gold-400/[0.08]"
                      >
                        <span className="truncate pr-2">
                          {locale === 'ar'
                            ? `عرض جميع النتائج لـ "${searchQuery.trim()}"`
                            : `View all results for "${searchQuery.trim()}"`}
                        </span>
                        <ArrowRight size={13} className="shrink-0" />
                      </Link>
                    </div>
                  ) : hasSearched && !isSearching ? (
                    <div className="px-3 py-2.5 text-center">
                      <p className="text-[0.72rem] text-[#9E8E85]">
                        {locale === 'ar'
                          ? `لم يتم العثور على منتجات مطابقة لـ "${searchQuery.trim()}"`
                          : `No products matching "${searchQuery.trim()}"`}
                      </p>
                      <Link
                        href="/shop"
                        onClick={handleCloseSearch}
                        className="mt-1 inline-block text-[0.68rem] text-gold-400 hover:underline"
                      >
                        {locale === 'ar' ? 'تصفح جميع المنتجات ←' : 'Browse catalog →'}
                      </Link>
                    </div>
                  ) : null}
                </div>
              )}
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
