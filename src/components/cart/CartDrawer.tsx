'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatters';
import { useLocale } from '@/context/LocaleContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    shippingFee,
    total,
    isDrawerOpen,
    closeDrawer,
  } = useCart();
  const { isRtl, t } = useLocale();

  if (!isDrawerOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: isRtl ? 'flex-start' : 'flex-end',
      }}
      onClick={closeDrawer}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#140C09',
          borderLeft: isRtl ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRight: isRtl ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShoppingBag size={20} color="var(--color-gold-400)" />
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.15rem',
                letterSpacing: '0.05em',
                margin: 0,
              }}
            >
              {t('cart.title')}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#9E8E85' }}>
              ({items.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </div>

          <button
            onClick={closeDrawer}
            aria-label="Close bag"
            style={{ color: '#D8C7B2', padding: '0.35rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                color: '#9E8E85',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: 'var(--color-gold-400)',
                }}
              >
                <ShoppingBag size={28} />
              </div>
              <p style={{ fontSize: '1rem', color: '#FAF7F2', marginBottom: '0.5rem' }}>
                {t('cart.empty')}
              </p>
              <p style={{ fontSize: '0.8rem', maxWidth: '240px', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Explore our curated fragrance, makeup, and skincare edits.
              </p>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="btn-lumera-outline"
                style={{ fontSize: '0.7rem' }}
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {/* Thumb */}
                <div
                  style={{
                    position: 'relative',
                    width: '74px',
                    height: '92px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    backgroundColor: '#1E120D',
                    flexShrink: 0,
                  }}
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="74px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                        color: 'var(--color-gold-400)',
                      }}
                    >
                      LUMÉRA
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {item.brandName && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.1em',
                        color: 'var(--color-gold-400)',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {item.brandName}
                    </span>
                  )}
                  <h4
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      margin: '0.15rem 0',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.name}
                  </h4>
                  {item.size && (
                    <span style={{ fontSize: '0.7rem', color: '#9E8E85' }}>
                      {item.size}
                    </span>
                  )}

                  <div
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.5rem',
                    }}
                  >
                    {/* Qty Selector */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '2px',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '0.2rem 0.45rem', color: '#D8C7B2' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0 0.4rem',
                          minWidth: '20px',
                          textAlign: 'center',
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '0.2rem 0.45rem', color: '#D8C7B2' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price & Delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ color: '#7E6F67', padding: '0.2rem' }}
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#0F0806',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#D8C7B2' }}>
              <span>{t('cart.subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem', color: '#D8C7B2' }}>
              <span>{t('cart.shipping')} (Saudi Arabia)</span>
              <span style={{ color: 'var(--color-gold-400)' }}>
                {shippingFee === 0 ? t('cart.complimentary') : formatPrice(shippingFee)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1.25rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#FFFFFF',
              }}
            >
              <span>Total</span>
              <span style={{ color: 'var(--color-gold-400)' }}>{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="btn-lumera-primary"
              style={{ width: '100%', padding: '0.95rem', fontSize: '0.75rem', fontWeight: 700 }}
            >
              <span>{t('cart.checkout')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(${isRtl ? '-100%' : '100%'});
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
