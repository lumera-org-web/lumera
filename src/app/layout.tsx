import type { Metadata } from 'next';
import './globals.css';
import { LocaleProvider } from '@/context/LocaleContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { StorefrontShell } from '@/components/layout/StorefrontShell';
import { getAnnouncementBanners } from '@/services/banners';
import { getCategories } from '@/services/categories';

export const metadata: Metadata = {
  title: 'LUMÉRA | Premium Saudi Beauty & Haute Perfumery',
  description:
    'Experience LUMÉRA — the pinnacle of luxury Arabian and international beauty, couture fragrances, and skincare rituals crafted for Saudi Arabia.',
  keywords: [
    'Lumera',
    'Saudi beauty',
    'Luxury perfume Jeddah',
    'Arabian fragrance',
    'Skincare Saudi Arabia',
    'Cosmetics Riyadh',
  ],
  openGraph: {
    title: 'LUMÉRA | Premium Saudi Beauty & Haute Perfumery',
    description:
      'Discover fragrance, makeup and skincare curated for unforgettable rituals.',
    url: 'https://lumera.sa',
    siteName: 'LUMÉRA',
    locale: 'en_US',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [banners, categories] = await Promise.all([
    getAnnouncementBanners().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('lumera_intro_done')){document.documentElement.classList.add('lumera-skip-intro');}}catch(e){}`,
          }}
        />
      </head>
      <body className="font-sans">
        <LocaleProvider>
          <WishlistProvider>
            <CartProvider>
              <StorefrontShell banners={banners} categories={categories}>
                {children}
              </StorefrontShell>
            </CartProvider>
          </WishlistProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
