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
    <footer className="footer-root">
      <div className="container-lumera">
        {/* ========================================================================= */}
        {/* 1. TRUST BADGES RIBBON (Responsive Grid / Stack) */}
        {/* ========================================================================= */}
        <div className="footer-trust-ribbon">
          <div className="footer-trust-item">
            <div className="footer-trust-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="footer-trust-heading">
                {locale === 'ar' ? 'منتجات أصلية ١٠٠٪' : '100% Authentic Curation'}
              </h4>
              <p className="footer-trust-sub">
                {locale === 'ar'
                  ? 'مستوردة مباشرة من بيوت العطور والجمال العالمية المعتمدة.'
                  : 'Directly sourced from certified luxury houses.'}
              </p>
            </div>
          </div>

          <div className="footer-trust-item">
            <div className="footer-trust-icon">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="footer-trust-heading">
                {locale === 'ar' ? 'توصيل سريع للمملكة' : 'Saudi Express Delivery'}
              </h4>
              <p className="footer-trust-sub">
                {locale === 'ar'
                  ? 'جدة خلال ٢٤ ساعة. باقي مدن المملكة خلال ٢-٣ أيام.'
                  : 'Jeddah within 24 hours. All KSA within 2-3 days.'}
              </p>
            </div>
          </div>

          <div className="footer-trust-item">
            <div className="footer-trust-icon">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 className="footer-trust-heading">
                {locale === 'ar' ? 'إرجاع واستبدال سلس' : 'Seamless Returns'}
              </h4>
              <p className="footer-trust-sub">
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
        <div className="footer-main-layout">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Logo width={150} height={60} />
            <p className="footer-brand-desc">
              {locale === 'ar'
                ? 'قمة الفخامة في العطور العربية والعالمية ومستحضرات التجميل الراقية. مصممة لأناقة لا تزول وطقوس لا تُنسى في المملكة العربية السعودية.'
                : 'The pinnacle of luxury Arabian and international beauty. Curated for timeless elegance and unforgettable rituals across Saudi Arabia.'}
            </p>
            <div className="footer-location-badge">
              <span>{locale === 'ar' ? '📍 جدة، المملكة العربية السعودية' : '📍 Jeddah, Kingdom of Saudi Arabia'}</span>
            </div>
          </div>

          {/* Accordion 1: The Collections */}
          <div className="footer-accordion-item">
            <button
              type="button"
              className="footer-accordion-header"
              onClick={() => toggleSection('collections')}
              aria-expanded={!!openSections.collections}
            >
              <h5 className="footer-accordion-title">
                {locale === 'ar' ? 'المجموعات' : 'The Collections'}
              </h5>
              <ChevronDown
                size={16}
                className={`footer-accordion-chevron ${openSections.collections ? 'is-open' : ''}`}
              />
            </button>
            <div className={`footer-accordion-content ${openSections.collections ? 'is-open' : ''}`}>
              <div className="footer-accordion-inner">
                <ul className="footer-links-list">
                  <li>
                    <Link href="/category/fragrance" className="footer-link-item">
                      {locale === 'ar' ? 'العطور الفاخرة' : 'Haute Fragrance'}
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/makeup" className="footer-link-item">
                      {locale === 'ar' ? 'المكياج وفن الشفاه' : 'Makeup & Lip Artistry'}
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/skincare" className="footer-link-item">
                      {locale === 'ar' ? 'طقوس العناية بالبشرة' : 'The Skincare Ritual'}
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?filter=trending" className="footer-link-item">
                      {locale === 'ar' ? 'الأكثر رواجاً الآن' : 'Trending Now'}
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?filter=new" className="footer-link-item">
                      {locale === 'ar' ? 'وصل حديثاً' : 'New Arrivals'}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Accordion 2: Customer Care */}
          <div className="footer-accordion-item">
            <button
              type="button"
              className="footer-accordion-header"
              onClick={() => toggleSection('care')}
              aria-expanded={!!openSections.care}
            >
              <h5 className="footer-accordion-title">
                {locale === 'ar' ? 'خدمة العملاء' : 'Customer Care'}
              </h5>
              <ChevronDown
                size={16}
                className={`footer-accordion-chevron ${openSections.care ? 'is-open' : ''}`}
              />
            </button>
            <div className={`footer-accordion-content ${openSections.care ? 'is-open' : ''}`}>
              <div className="footer-accordion-inner">
                <ul className="footer-links-list">
                  <li>
                    <Link href="/account" className="footer-link-item">
                      {locale === 'ar' ? 'تتبع طلبي' : 'Order Tracking'}
                    </Link>
                  </li>
                  <li>
                    <Link href="/cart" className="footer-link-item">
                      {locale === 'ar' ? 'حقيبة التسوق' : 'Shopping Bag'}
                    </Link>
                  </li>
                  <li>
                    <Link href="/wishlist" className="footer-link-item">
                      {locale === 'ar' ? 'المفضلة الخاصة' : 'Private Wishlist'}
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop" className="footer-link-item">
                      {locale === 'ar' ? 'توصيل مجاني للطلبات' : 'Complimentary Saudi Delivery'}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Accordion 3: Maison LUMÉRA */}
          <div className="footer-accordion-item">
            <button
              type="button"
              className="footer-accordion-header"
              onClick={() => toggleSection('maison')}
              aria-expanded={!!openSections.maison}
            >
              <h5 className="footer-accordion-title">
                {locale === 'ar' ? 'دار لوميرا' : 'Maison LUMÉRA'}
              </h5>
              <ChevronDown
                size={16}
                className={`footer-accordion-chevron ${openSections.maison ? 'is-open' : ''}`}
              />
            </button>
            <div className={`footer-accordion-content ${openSections.maison ? 'is-open' : ''}`}>
              <div className="footer-accordion-inner">
                <ul className="footer-links-list">
                  <li>
                    <Link href="/shop" className="footer-link-item">
                      {locale === 'ar' ? 'قصتنا وتراثنا' : 'Our Saudi Heritage'}
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop" className="footer-link-item">
                      {locale === 'ar' ? 'بوتيك جدة الرئيسي' : 'Jeddah Flagship Boutique'}
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop" className="footer-link-item">
                      {locale === 'ar' ? 'استشارات العطور الخاصة' : 'Bespoke Fragrance Consultation'}
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop" className="footer-link-item">
                      {locale === 'ar' ? 'ضمان الأصالة والجودة' : 'Authenticity Guarantee'}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="footer-newsletter-card">
            <h5 className="footer-accordion-title" style={{ marginBottom: '0.75rem' }}>
              {locale === 'ar' ? 'دائرة لوميرا' : 'The LUMÉRA Circle'}
            </h5>
            <p className="footer-newsletter-desc">
              {locale === 'ar'
                ? 'كوني أول من يكتشف الخلاصات النادرة، والجلسات الخاصة، وإصدارات المملكة الحصرية.'
                : 'Be first to discover rare extraits, private masterclasses, and curated Saudi releases.'}
            </p>
            {subscribed ? (
              <div className="footer-subscribed-notice">
                <Check size={16} />
                <span>
                  {locale === 'ar' ? 'شكراً لك. أصبحتِ جزءاً من دائرة لوميرا.' : 'Thank you. You are part of the circle.'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <input
                  type="email"
                  placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="footer-newsletter-input"
                />
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Subscribe to newsletter"
                  className="footer-newsletter-btn"
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
        <div className="footer-bottom-bar">
          <div className="footer-legal-col">
            <div className="footer-copyright">
              © {new Date().getFullYear()} LUMÉRA. ALL RIGHTS RESERVED. KINGDOM OF SAUDI ARABIA.
            </div>
            <div className="footer-craft">
              {locale === 'ar' ? 'تصميم وتطوير بواسطة ' : 'Crafted by '}
              <a
                href="https://ekodrix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-ekodrix-link"
              >
                Ekodrix (ekodrix.com)
              </a>
            </div>
          </div>

          {/* Saudi Payment Badges */}
          <div className="footer-payment-badges">
            <span className="payment-badge">mada</span>
            <span className="payment-badge">Apple Pay</span>
            <span className="payment-badge">Visa</span>
            <span className="payment-badge">Mastercard</span>
            <span className="payment-badge badge-tabby">tabby</span>
            <span className="payment-badge badge-tamara">tamara</span>
            <span className="payment-badge badge-stc">stc pay</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-root {
          background-color: #0A0504;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #FAF7F2;
          padding-top: 3rem;
          padding-bottom: 6rem;
        }
        @media (min-width: 768px) {
          .footer-root {
            padding-top: 4rem;
            padding-bottom: 4rem;
          }
        }

        /* Trust Ribbon */
        .footer-trust-ribbon {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 2.25rem;
        }
        @media (min-width: 640px) {
          .footer-trust-ribbon {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            padding-bottom: 2.75rem;
            margin-bottom: 3rem;
          }
        }
        .footer-trust-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .footer-trust-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: rgba(200, 162, 101, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-gold-400);
          flex-shrink: 0;
        }
        .footer-trust-heading {
          font-size: 0.775rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0;
          font-weight: 600;
          color: #FFFFFF;
        }
        .footer-trust-sub {
          font-size: 0.725rem;
          color: #9E8E85;
          margin: 0.2rem 0 0 0;
          line-height: 1.4;
        }

        /* Main Footer Layout */
        .footer-main-layout {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 900px) {
          .footer-main-layout {
            display: grid;
            grid-template-columns: 1.4fr 1fr 1fr 1fr 1.3fr;
            gap: 2.5rem;
            margin-bottom: 3.5rem;
          }
        }

        .footer-brand-col {
          max-width: 320px;
          margin-bottom: 1.75rem;
        }
        @media (min-width: 900px) {
          .footer-brand-col {
            margin-bottom: 0;
          }
        }
        .footer-brand-desc {
          font-size: 0.8rem;
          color: #9E8E85;
          line-height: 1.6;
          margin-top: 1rem;
        }
        .footer-location-badge {
          margin-top: 1.25rem;
          font-size: 0.725rem;
          color: var(--color-gold-400);
        }

        /* Accordion Structure */
        .footer-accordion-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .footer-accordion-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 0;
          background: none;
          border: none;
          cursor: pointer;
          text-align: inherit;
        }
        .footer-accordion-title {
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-gold-400);
          font-weight: 600;
          margin: 0;
        }
        .footer-accordion-chevron {
          color: var(--color-gold-400);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .footer-accordion-chevron.is-open {
          transform: rotate(180deg);
        }
        .footer-accordion-content {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
          opacity: 0;
          overflow: hidden;
        }
        .footer-accordion-content.is-open {
          grid-template-rows: 1fr;
          opacity: 1;
        }
        .footer-accordion-inner {
          min-height: 0;
          padding: 0.2rem 0 1.25rem 0;
        }
        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-link-item {
          font-size: 0.8rem;
          color: #D8C7B2;
          transition: color 0.2s ease;
        }
        .footer-link-item:hover {
          color: var(--color-gold-300);
        }

        /* Desktop Reset for Accordions */
        @media (min-width: 900px) {
          .footer-accordion-item {
            border-bottom: none !important;
          }
          .footer-accordion-header {
            padding: 0 0 1.25rem 0 !important;
            cursor: default !important;
            pointer-events: none !important;
          }
          .footer-accordion-chevron {
            display: none !important;
          }
          .footer-accordion-content {
            display: block !important;
            grid-template-rows: none !important;
            opacity: 1 !important;
            overflow: visible !important;
          }
          .footer-accordion-inner {
            padding: 0 !important;
          }
        }

        /* Newsletter Card */
        .footer-newsletter-card {
          margin-top: 1.75rem;
          padding: 1.5rem;
          background-color: #140C09;
          border: 1px solid rgba(200, 162, 101, 0.2);
          border-radius: 3px;
        }
        @media (min-width: 900px) {
          .footer-newsletter-card {
            margin-top: 0;
            padding: 0;
            background-color: transparent;
            border: none;
          }
        }
        .footer-newsletter-desc {
          font-size: 0.775rem;
          color: #9E8E85;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .footer-subscribed-notice {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-gold-400);
          font-size: 0.8rem;
        }
        .footer-newsletter-form {
          display: flex;
          gap: 0.5rem;
        }
        .footer-newsletter-input {
          flex: 1;
          min-height: 42px;
          background-color: #1A100C;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          padding: 0.65rem 0.85rem;
          font-size: 0.75rem;
          outline: none;
          border-radius: 2px;
        }
        .footer-newsletter-btn {
          min-height: 42px;
          background-color: var(--color-gold-400);
          color: #0D0705;
          padding: 0 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          flex-shrink: 0;
          transition: background-color 0.2s ease;
        }
        .footer-newsletter-btn:hover {
          background-color: var(--color-gold-300);
        }

        /* Bottom Bar */
        .footer-bottom-bar {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.25rem;
          font-size: 0.7rem;
          color: #7E6F67;
        }
        @media (min-width: 768px) {
          .footer-bottom-bar {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
        .footer-legal-col {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .footer-craft {
          font-size: 0.68rem;
          color: #8E7D74;
          letter-spacing: 0.02em;
        }
        .footer-ekodrix-link {
          color: var(--color-gold-400);
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(200, 162, 101, 0.4);
          transition: all 0.2s ease;
        }
        .footer-ekodrix-link:hover {
          color: var(--color-gold-300);
          text-decoration-color: var(--color-gold-300);
        }
        .footer-payment-badges {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .payment-badge {
          padding: 0.25rem 0.55rem;
          background-color: #160E0B;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          color: #D8C7B2;
          font-size: 0.625rem;
          font-weight: 600;
        }
        .badge-tabby, .badge-tamara {
          color: #DEC197;
        }
        .badge-stc {
          color: #A88143;
        }
      `}</style>
    </footer>
  );
};
