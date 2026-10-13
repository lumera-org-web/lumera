'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { ShieldCheck, Truck, RotateCcw, ArrowRight, Check, ChevronDown } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useLocale } from '@/context/LocaleContext';

export const Footer: React.FC = () => {
  const { locale } = useLocale();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mobile Accordion state: track which sections are expanded on mobile
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    collections: false,
    care: false,
    maison: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);

    try {
      const supabase = createClient();
      await supabase.from('newsletter_subscribers').insert({ email });
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#0A0504] pb-24 pt-12 text-[#FAF7F2] md:py-16">
      <div className="container-lumera">
        {/* ========================================================================= */}
        {/* 1. TRUST BADGES RIBBON (Responsive Grid / Stack) */}
        {/* ========================================================================= */}
        <div className="mb-9 grid grid-cols-1 gap-5 border-b border-white/[0.06] pb-8 sm:mb-12 sm:grid-cols-3 sm:gap-6 sm:pb-11">
          <div className="flex items-center gap-[0.85rem]">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="m-0 text-[0.775rem] font-semibold uppercase tracking-[0.12em] text-white">
                {locale === 'ar' ? 'منتجات أصلية ١٠٠٪' : '100% Authentic Curation'}
              </h4>
              <p className="mt-[0.2rem] text-[0.725rem] leading-[1.4] text-[#9E8E85]">
                {locale === 'ar'
                  ? 'مستوردة مباشرة من بيوت العطور والجمال العالمية المعتمدة.'
                  : 'Directly sourced from certified luxury houses.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[0.85rem]">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="m-0 text-[0.775rem] font-semibold uppercase tracking-[0.12em] text-white">
                {locale === 'ar' ? 'توصيل سريع للمملكة' : 'Saudi Express Delivery'}
              </h4>
              <p className="mt-[0.2rem] text-[0.725rem] leading-[1.4] text-[#9E8E85]">
                {locale === 'ar'
                  ? 'جدة خلال ٢٤ ساعة. باقي مدن المملكة خلال ٢-٣ أيام.'
                  : 'Jeddah within 24 hours. All KSA within 2-3 days.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[0.85rem]">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 className="m-0 text-[0.775rem] font-semibold uppercase tracking-[0.12em] text-white">
                {locale === 'ar' ? 'إرجاع واستبدال سلس' : 'Seamless Returns'}
              </h4>
              <p className="mt-[0.2rem] text-[0.725rem] leading-[1.4] text-[#9E8E85]">
                {locale === 'ar'
                  ? 'خدمة عملاء راقية لضمان رضاكم التام.'
                  : 'Hassle-free luxury customer care experience.'}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN FOOTER CONTENT (Accordion on Mobile, Grid on Desktop) */}
        {/* ========================================================================= */}
        <div className="mb-10 flex flex-col gap-0 min-[900px]:mb-14 min-[900px]:grid min-[900px]:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr] min-[900px]:gap-10">
          {/* Brand Column */}
          <div className="mb-7 max-w-[320px] min-[900px]:mb-0">
            <Logo width={150} height={60} />
            <p className="mt-4 text-[0.8rem] leading-[1.6] text-[#9E8E85]">
              {locale === 'ar'
                ? 'قمة الفخامة في العطور العربية والعالمية ومستحضرات التجميل الراقية. مصممة لأناقة لا تزول وطقوس لا تُنسى في المملكة العربية السعودية.'
                : 'The pinnacle of luxury Arabian and international beauty. Curated for timeless elegance and unforgettable rituals across Saudi Arabia.'}
            </p>
            <div className="mt-5 text-[0.725rem] text-gold-400">
              <span>{locale === 'ar' ? '📍 جدة، المملكة العربية السعودية' : '📍 Jeddah, Kingdom of Saudi Arabia'}</span>
            </div>
          </div>

          {/* Accordion 1: The Collections */}
          <div className="border-b border-white/[0.08] min-[900px]:border-b-0">
            <button
              type="button"
              className="flex w-full items-center justify-between bg-transparent py-[1.1rem] text-left rtl:text-right min-[900px]:pointer-events-none min-[900px]:cursor-default min-[900px]:py-0 min-[900px]:pb-5"
              onClick={() => toggleSection('collections')}
              aria-expanded={!!openSections.collections}
            >
              <h5 className="m-0 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
                {locale === 'ar' ? 'المجموعات' : 'The Collections'}
              </h5>
              <ChevronDown
                size={16}
                className={`text-gold-400 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] min-[900px]:hidden ${
                  openSections.collections ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] min-[900px]:!block min-[900px]:!overflow-visible min-[900px]:!opacity-100 ${
                openSections.collections
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] overflow-hidden opacity-0'
              }`}
            >
              <div className="min-h-0 pb-5 pt-[0.2rem] min-[900px]:p-0">
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  <li>
                    <Link
                      href="/category/fragrance"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'العطور الفاخرة' : 'Haute Fragrance'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/makeup"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'المكياج وفن الشفاه' : 'Makeup & Lip Artistry'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/skincare"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'طقوس العناية بالبشرة' : 'The Skincare Ritual'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?filter=trending"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'الأكثر رواجاً الآن' : 'Trending Now'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?filter=new"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'وصل حديثاً' : 'New Arrivals'}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Accordion 2: Customer Care */}
          <div className="border-b border-white/[0.08] min-[900px]:border-b-0">
            <button
              type="button"
              className="flex w-full items-center justify-between bg-transparent py-[1.1rem] text-left rtl:text-right min-[900px]:pointer-events-none min-[900px]:cursor-default min-[900px]:py-0 min-[900px]:pb-5"
              onClick={() => toggleSection('care')}
              aria-expanded={!!openSections.care}
            >
              <h5 className="m-0 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
                {locale === 'ar' ? 'خدمة العملاء' : 'Customer Care'}
              </h5>
              <ChevronDown
                size={16}
                className={`text-gold-400 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] min-[900px]:hidden ${
                  openSections.care ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] min-[900px]:!block min-[900px]:!overflow-visible min-[900px]:!opacity-100 ${
                openSections.care
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] overflow-hidden opacity-0'
              }`}
            >
              <div className="min-h-0 pb-5 pt-[0.2rem] min-[900px]:p-0">
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  <li>
                    <Link
                      href="/account"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'تتبع طلبي' : 'Order Tracking'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cart"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'حقيبة التسوق' : 'Shopping Bag'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/wishlist"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'المفضلة الخاصة' : 'Private Wishlist'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'توصيل مجاني للطلبات' : 'Complimentary Saudi Delivery'}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Accordion 3: Maison LUMÉRA */}
          <div className="border-b border-white/[0.08] min-[900px]:border-b-0">
            <button
              type="button"
              className="flex w-full items-center justify-between bg-transparent py-[1.1rem] text-left rtl:text-right min-[900px]:pointer-events-none min-[900px]:cursor-default min-[900px]:py-0 min-[900px]:pb-5"
              onClick={() => toggleSection('maison')}
              aria-expanded={!!openSections.maison}
            >
              <h5 className="m-0 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
                {locale === 'ar' ? 'دار لوميرا' : 'Maison LUMÉRA'}
              </h5>
              <ChevronDown
                size={16}
                className={`text-gold-400 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] min-[900px]:hidden ${
                  openSections.maison ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] min-[900px]:!block min-[900px]:!overflow-visible min-[900px]:!opacity-100 ${
                openSections.maison
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] overflow-hidden opacity-0'
              }`}
            >
              <div className="min-h-0 pb-5 pt-[0.2rem] min-[900px]:p-0">
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  <li>
                    <Link
                      href="/shop"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'قصتنا وتراثنا' : 'Our Saudi Heritage'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'بوتيك جدة الرئيسي' : 'Jeddah Flagship Boutique'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'استشارات العطور الخاصة' : 'Bespoke Fragrance Consultation'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      className="text-[0.8rem] text-[#D8C7B2] transition-colors duration-200 hover:text-gold-300"
                    >
                      {locale === 'ar' ? 'ضمان الأصالة والجودة' : 'Authenticity Guarantee'}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="mt-7 rounded-[3px] border border-gold-400/20 bg-[#140C09] p-6 min-[900px]:mt-0 min-[900px]:border-none min-[900px]:bg-transparent min-[900px]:p-0">
            <h5 className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
              {locale === 'ar' ? 'دائرة لوميرا' : 'The LUMÉRA Circle'}
            </h5>
            <p className="mb-4 text-[0.775rem] leading-[1.5] text-[#9E8E85]">
              {locale === 'ar'
                ? 'كوني أول من يكتشف الخلاصات النادرة، والجلسات الخاصة، وإصدارات المملكة الحصرية.'
                : 'Be first to discover rare extraits, private masterclasses, and curated Saudi releases.'}
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-[0.8rem] text-gold-400">
                <Check size={16} />
                <span>
                  {locale === 'ar' ? 'شكراً لك. أصبحتِ جزءاً من دائرة لوميرا.' : 'Thank you. You are part of the circle.'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-[42px] flex-1 rounded-[2px] border border-white/10 bg-[#1A100C] px-[0.85rem] py-[0.65rem] text-[0.75rem] text-white outline-none placeholder:text-[#9E8E85]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Subscribe to newsletter"
                  className="flex min-h-[42px] shrink-0 items-center justify-center rounded-[2px] bg-gold-400 px-[1.1rem] text-[#0D0705] transition-colors duration-200 hover:bg-gold-300"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM BAR (Copyright, Crafted by Ekodrix & Saudi Payment Badges) */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center gap-5 border-t border-white/[0.06] pt-8 text-center text-[0.7rem] text-[#7E6F67] md:flex-row md:justify-between md:text-left rtl:md:text-right">
          <div className="flex flex-col gap-[0.35rem]">
            <div>
              © {new Date().getFullYear()} LUMÉRA. ALL RIGHTS RESERVED. KINGDOM OF SAUDI ARABIA.
            </div>
            <div className="text-[0.68rem] tracking-[0.02em] text-[#8E7D74]">
              {locale === 'ar' ? 'تصميم وتطوير بواسطة ' : 'Crafted by '}
              <a
                href="https://ekodrix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold-400 underline decoration-gold-400/40 underline-offset-[3px] transition-colors duration-200 hover:text-gold-300 hover:decoration-gold-300"
              >
                Ekodrix
              </a>
            </div>
          </div>

          {/* Saudi Payment Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-[2px] border border-white/[0.08] bg-[#160E0B] px-[0.55rem] py-1 text-[0.625rem] font-semibold text-[#D8C7B2]">
              mada
            </span>
            <span className="rounded-[2px] border border-white/[0.08] bg-[#160E0B] px-[0.55rem] py-1 text-[0.625rem] font-semibold text-[#D8C7B2]">
              Apple Pay
            </span>
            <span className="rounded-[2px] border border-white/[0.08] bg-[#160E0B] px-[0.55rem] py-1 text-[0.625rem] font-semibold text-[#D8C7B2]">
              Visa
            </span>
            <span className="rounded-[2px] border border-white/[0.08] bg-[#160E0B] px-[0.55rem] py-1 text-[0.625rem] font-semibold text-[#D8C7B2]">
              Mastercard
            </span>
            <span className="rounded-[2px] border border-white/[0.08] bg-[#160E0B] px-[0.55rem] py-1 text-[0.625rem] font-semibold text-[#DEC197]">
              tabby
            </span>
            <span className="rounded-[2px] border border-white/[0.08] bg-[#160E0B] px-[0.55rem] py-1 text-[0.625rem] font-semibold text-[#DEC197]">
              tamara
            </span>
            <span className="rounded-[2px] border border-white/[0.08] bg-[#160E0B] px-[0.55rem] py-1 text-[0.625rem] font-semibold text-[#A88143]">
              stc pay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
