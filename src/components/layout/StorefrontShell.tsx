'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { LuxuryPreloader } from '@/components/layout/LuxuryPreloader';
import { Banner, Category } from '@/types';

interface StorefrontShellProps {
  banners: Banner[];
  categories: Category[];
  children: React.ReactNode;
}

export const StorefrontShell: React.FC<StorefrontShellProps> = ({
  banners,
  categories,
  children,
}) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // Completely remove public navbar, announcement bar, footer, and drawers on all /admin pages
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <LuxuryPreloader />
      <AnnouncementBar banners={banners} />
      <Header categories={categories} />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer />
      <MobileNavigation />
      <CartDrawer />
    </>
  );
};
