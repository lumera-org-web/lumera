'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'ar';

interface LocaleContextType {
  locale: Locale;
  isRtl: boolean;
  toggleLocale: () => void;
  setLocale: (loc: Locale) => void;
  t: (key: string, defaultEn?: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations: Record<string, { en: string; ar: string }> = {
  // Navigation & Actions
  'nav.new': { en: 'NEW', ar: 'وصل حديثاً' },
  'nav.makeup': { en: 'MAKEUP', ar: 'مكياج' },
  'nav.skincare': { en: 'SKINCARE', ar: 'عناية بالبشرة' },
  'nav.fragrance': { en: 'FRAGRANCE', ar: 'عطور' },
  'nav.trending': { en: 'TRENDING', ar: 'الأكثر رواجاً' },
  'nav.brands': { en: 'BRANDS', ar: 'الماركات' },
  'nav.search': { en: 'Search fragrances, makeup...', ar: 'ابحث عن العطور، المكياج...' },
  'nav.bag': { en: 'Bag', ar: 'الحقيبة' },
  'nav.account': { en: 'Account', ar: 'حسابي' },
  'nav.wishlist': { en: 'Wishlist', ar: 'المفضلة' },

  // Announcements
  'announcement.shipping': { en: 'COMPLIMENTARY SAUDI DELIVERY', ar: 'توصيل مجاني داخل المملكة العربية السعودية' },
  'announcement.authentic': { en: 'AUTHENTIC PRODUCTS', ar: 'منتجات أصلية ١٠٠٪' },
  'announcement.returns': { en: 'EASY RETURNS', ar: 'إرجاع سهل وسلس' },
  'market.saudi': { en: 'SAUDI ARABIA (SAR)', ar: 'المملكة العربية السعودية (ر.س)' },

  // Product & Actions
  'product.addToBag': { en: 'ADD TO BAG', ar: 'أضف إلى الحقيبة' },
  'product.buyNow': { en: 'BUY NOW', ar: 'شراء فوري' },
  'product.size': { en: 'Size', ar: 'الحجم' },
  'product.quantity': { en: 'Quantity', ar: 'الكمية' },
  'product.authenticBadge': { en: 'Authentic Products', ar: 'منتجات أصلية موثوقة' },
  'product.fastSaudiDelivery': { en: 'Fast Saudi Delivery', ar: 'توصيل سريع للمملكة' },
  'product.secureCheckout': { en: 'Secure Checkout', ar: 'دفع إلكتروني آمن' },

  // Cart & Checkout
  'cart.title': { en: 'Shopping Bag', ar: 'حقيبة التسوق' },
  'cart.empty': { en: 'Your bag is empty', ar: 'حقيبة التسوق فارغة' },
  'cart.subtotal': { en: 'Subtotal', ar: 'المجموع الفرعي' },
  'cart.shipping': { en: 'Shipping', ar: 'الشحن والتوصيل' },
  'cart.complimentary': { en: 'Complimentary', ar: 'مجاني' },
  'cart.checkout': { en: 'CHECKOUT', ar: 'إتمام الطلب' },

  // General
  'viewAll': { en: 'View All →', ar: 'عرض الكل ←' },
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lumera_locale') as Locale | null;
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLocaleState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (newLoc: Locale) => {
    setLocaleState(newLoc);
    localStorage.setItem('lumera_locale', newLoc);
    document.documentElement.dir = newLoc === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLoc;
  };

  const toggleLocale = () => {
    const next = locale === 'en' ? 'ar' : 'en';
    setLocale(next);
  };

  const t = (key: string, defaultEn?: string): string => {
    const item = translations[key];
    if (item) {
      return locale === 'ar' ? item.ar : item.en;
    }
    return defaultEn || key;
  };

  const isRtl = locale === 'ar';

  return (
    <LocaleContext.Provider value={{ locale, isRtl, toggleLocale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
};
