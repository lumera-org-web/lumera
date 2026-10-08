'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { ShieldCheck, Truck, RotateCcw, ArrowRight, Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <footer
      style={{
        backgroundColor: '#0A0504',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#FAF7F2',
        paddingTop: '4rem',
        paddingBottom: '5rem',
      }}
    >
      <div className="container-lumera">
        {/* Trust Badges Ribbon */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 162, 101, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold-400)',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>
                100% Authentic Curation
              </h4>
              <p style={{ fontSize: '0.75rem', color: '#9E8E85', margin: '0.2rem 0 0 0' }}>
                Directly sourced from certified luxury houses.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 162, 101, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold-400)',
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>
                Saudi Express Delivery
              </h4>
              <p style={{ fontSize: '0.75rem', color: '#9E8E85', margin: '0.2rem 0 0 0' }}>
                Jeddah within 24 hours. All KSA within 2-3 days.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 162, 101, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold-400)',
              }}
            >
              <RotateCcw size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>
                Seamless Returns
              </h4>
              <p style={{ fontSize: '0.75rem', color: '#9E8E85', margin: '0.2rem 0 0 0' }}>
                Hassle-free luxury customer care experience.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand Col */}
          <div style={{ maxWidth: '320px' }}>
            <Logo width={160} height={64} />
            <p style={{ fontSize: '0.825rem', color: '#9E8E85', lineHeight: 1.6, marginTop: '1.25rem' }}>
              The pinnacle of luxury Arabian and international beauty. Curated for timeless elegance and unforgettable rituals across Saudi Arabia.
            </p>
            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--color-gold-400)' }}>
              <span>📍 Jeddah, Kingdom of Saudi Arabia</span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h5 style={{ fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-gold-400)', marginBottom: '1.25rem' }}>
              The Collections
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link href="/category/fragrance" style={{ fontSize: '0.8rem', color: '#D8C7B2', transition: 'color 0.2s' }}>
                  Haute Fragrance
                </Link>
              </li>
              <li>
                <Link href="/category/makeup" style={{ fontSize: '0.8rem', color: '#D8C7B2', transition: 'color 0.2s' }}>
                  Makeup & Lip Artistry
                </Link>
              </li>
              <li>
                <Link href="/category/skincare" style={{ fontSize: '0.8rem', color: '#D8C7B2', transition: 'color 0.2s' }}>
                  The Skincare Ritual
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=trending" style={{ fontSize: '0.8rem', color: '#D8C7B2', transition: 'color 0.2s' }}>
                  Trending Now
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" style={{ fontSize: '0.8rem', color: '#D8C7B2', transition: 'color 0.2s' }}>
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 style={{ fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-gold-400)', marginBottom: '1.25rem' }}>
              Customer Care
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link href="/account" style={{ fontSize: '0.8rem', color: '#D8C7B2' }}>
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/cart" style={{ fontSize: '0.8rem', color: '#D8C7B2' }}>
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/wishlist" style={{ fontSize: '0.8rem', color: '#D8C7B2' }}>
                  Private Wishlist
                </Link>
              </li>
              <li>
                <Link href="/admin" style={{ fontSize: '0.8rem', color: 'var(--color-gold-400)' }}>
                  Admin / CMS Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h5 style={{ fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-gold-400)', marginBottom: '1rem' }}>
              The LUMÉRA Circle
            </h5>
            <p style={{ fontSize: '0.775rem', color: '#9E8E85', lineHeight: 1.5, marginBottom: '1rem' }}>
              Be first to discover rare extraits, private masterclasses, and curated Saudi releases.
            </p>
            {subscribed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-400)', fontSize: '0.8rem' }}>
                <Check size={16} />
                <span>Thank you. You are part of the circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: '#160E0B',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.75rem',
                    outline: 'none',
                    borderRadius: '2px',
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Subscribe to newsletter"
                  style={{
                    backgroundColor: 'var(--color-gold-400)',
                    color: '#0D0705',
                    padding: '0 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '2px',
                  }}
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Mada, Apple Pay, Visa, Mastercard, Tabby, Tamara */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            fontSize: '0.7rem',
            color: '#7E6F67',
          }}
        >
          <div>
            © {new Date().getFullYear()} LUMÉRA. ALL RIGHTS RESERVED. KINGDOM OF SAUDI ARABIA.
          </div>

          {/* Saudi Payment Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.2rem 0.5rem', background: '#160E0B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', color: '#D8C7B2', fontSize: '0.625rem', fontWeight: 600 }}>
              mada
            </span>
            <span style={{ padding: '0.2rem 0.5rem', background: '#160E0B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', color: '#D8C7B2', fontSize: '0.625rem', fontWeight: 600 }}>
              Apple Pay
            </span>
            <span style={{ padding: '0.2rem 0.5rem', background: '#160E0B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', color: '#D8C7B2', fontSize: '0.625rem', fontWeight: 600 }}>
              Visa
            </span>
            <span style={{ padding: '0.2rem 0.5rem', background: '#160E0B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', color: '#D8C7B2', fontSize: '0.625rem', fontWeight: 600 }}>
              Mastercard
            </span>
            <span style={{ padding: '0.2rem 0.5rem', background: '#160E0B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', color: '#DEC197', fontSize: '0.625rem', fontWeight: 600 }}>
              tabby
            </span>
            <span style={{ padding: '0.2rem 0.5rem', background: '#160E0B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', color: '#DEC197', fontSize: '0.625rem', fontWeight: 600 }}>
              tamara
            </span>
            <span style={{ padding: '0.2rem 0.5rem', background: '#160E0B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', color: '#A88143', fontSize: '0.625rem', fontWeight: 600 }}>
              stc pay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
