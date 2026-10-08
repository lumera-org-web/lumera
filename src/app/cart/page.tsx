'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatters';
import { useLocale } from '@/context/LocaleContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shippingFee, total } = useCart();
  const { t } = useLocale();

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: '#140C09', minHeight: '80vh', padding: '6rem 0' }}>
        <div className="container-lumera" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(200, 162, 101, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              color: 'var(--color-gold-400)',
            }}
          >
            <ShoppingBag size={32} />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: '#FFFFFF',
              marginBottom: '0.75rem',
            }}
          >
            {t('cart.empty')}
          </h1>
          <p style={{ color: '#9E8E85', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 2rem auto' }}>
            Explore our curated fragrance, makeup, and skincare edits.
          </p>
          <Link href="/shop" className="btn-lumera-primary">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#140C09', minHeight: '85vh', padding: '3rem 0 6rem 0' }}>
      <div className="container-lumera">
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.25rem',
            color: '#FFFFFF',
            marginBottom: '2.5rem',
          }}
        >
          {t('cart.title')}
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  padding: '1.5rem',
                  backgroundColor: '#190F0C',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '3px',
                }}
              >
                {/* Thumb */}
                <div
                  style={{
                    position: 'relative',
                    width: '90px',
                    height: '110px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    backgroundColor: '#221510',
                    flexShrink: 0,
                  }}
                >
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill sizes="90px" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-400)', fontSize: '0.65rem' }}>
                      LUMÉRA
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {item.brandName && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-gold-400)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                      {item.brandName}
                    </span>
                  )}
                  <h3 style={{ fontSize: '0.95rem', color: '#FFFFFF', margin: '0.2rem 0', fontWeight: 400 }}>
                    {item.name}
                  </h3>
                  {item.size && (
                    <span style={{ fontSize: '0.75rem', color: '#9E8E85' }}>
                      Size: {item.size}
                    </span>
                  )}

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
                    {/* Quantity Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '2px' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.35rem 0.65rem', color: '#D8C7B2' }}>
                        <Minus size={13} />
                      </button>
                      <span style={{ padding: '0 0.5rem', fontSize: '0.8rem', minWidth: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.35rem 0.65rem', color: '#D8C7B2' }}>
                        <Plus size={13} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button onClick={() => removeItem(item.id)} style={{ color: '#7E6F67' }}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div
            style={{
              padding: '2rem',
              backgroundColor: '#190F0C',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                color: '#FFFFFF',
                marginBottom: '1.5rem',
              }}
            >
              Order Summary
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', fontSize: '0.85rem', color: '#D8C7B2' }}>
              <span>{t('cart.subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#D8C7B2' }}>
              <span>{t('cart.shipping')} (Saudi Arabia)</span>
              <span style={{ color: 'var(--color-gold-400)' }}>
                {shippingFee === 0 ? t('cart.complimentary') : formatPrice(shippingFee)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '2rem',
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#FFFFFF',
              }}
            >
              <span>Total</span>
              <span style={{ color: 'var(--color-gold-400)' }}>{formatPrice(total)}</span>
            </div>

            <Link href="/checkout" className="btn-lumera-primary" style={{ width: '100%', padding: '1rem', fontSize: '0.8rem', fontWeight: 700 }}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#9E8E85', fontSize: '0.75rem' }}>
              <ShieldCheck size={16} color="var(--color-gold-400)" />
              <span>Complimentary Jeddah & KSA delivery included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
