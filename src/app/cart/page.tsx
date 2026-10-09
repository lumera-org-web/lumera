'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatters';
import { useLocale } from '@/context/LocaleContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shippingFee, total } = useCart();
  const { t } = useLocale();

  if (items.length === 0) {
    return (
      <div className="cart-empty-wrapper">
        <div className="container-lumera" style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <div className="cart-empty-icon">
            <ShoppingBag size={32} />
          </div>
          <h1 className="cart-empty-title">
            {t('cart.empty')}
          </h1>
          <p className="cart-empty-lead">
            Explore our curated fragrance, makeup, and skincare edits.
          </p>
          <Link href="/shop" className="btn-lumera-primary" style={{ padding: '0.95rem 2.25rem' }}>
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="container-lumera">
        <h1 className="cart-page-title">
          {t('cart.title')}
        </h1>

        <div className="cart-layout-grid">
          {/* Items List */}
          <div className="cart-items-column">
            {items.map((item) => (
              <div key={item.id} className="cart-item-card">
                {/* Thumb */}
                <div className="cart-item-thumb">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill sizes="80px" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className="cart-item-thumb-placeholder">
                      LUMÉRA
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="cart-item-details">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      {item.brandName && (
                        <span className="cart-item-brand">
                          {item.brandName}
                        </span>
                      )}
                      <h3 className="cart-item-name">
                        {item.name}
                      </h3>
                      {item.size && (
                        <span className="cart-item-meta">
                          Size: {item.size}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="cart-item-delete-btn"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="cart-item-actions-row">
                    {/* Quantity Selector */}
                    <div className="cart-qty-picker">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="cart-qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="cart-qty-val">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="cart-qty-btn"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="cart-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="cart-summary-card">
            <h2 className="cart-summary-title">
              Order Summary
            </h2>

            <div className="cart-summary-row">
              <span>{t('cart.subtotal')}</span>
              <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{formatPrice(subtotal)}</span>
            </div>

            <div className="cart-summary-row">
              <span>{t('cart.shipping')} (Saudi Arabia)</span>
              <span style={{ color: 'var(--color-gold-400)', fontWeight: 600 }}>
                {shippingFee === 0 ? t('cart.complimentary') : formatPrice(shippingFee)}
              </span>
            </div>

            <div className="cart-summary-total-row">
              <span>Total</span>
              <span style={{ color: 'var(--color-gold-400)' }}>{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              className="btn-lumera-primary cart-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>

            <div className="cart-trust-badges">
              <div className="cart-trust-badge">
                <Truck size={15} color="var(--color-gold-400)" />
                <span>Complimentary Jeddah & KSA delivery</span>
              </div>
              <div className="cart-trust-badge">
                <ShieldCheck size={15} color="var(--color-gold-400)" />
                <span>100% Authentic Saudi luxury guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page-wrapper {
          background-color: #140C09;
          min-height: 85vh;
          padding: 3rem 0 6rem 0;
        }

        .cart-empty-wrapper {
          background-color: #140C09;
          min-height: 80vh;
          padding: 6rem 1rem;
          display: flex;
          align-items: center;
        }

        .cart-empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background-color: rgba(200, 162, 101, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
          color: var(--color-gold-400);
        }

        .cart-empty-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.25rem;
          color: #FFFFFF;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }

        .cart-empty-lead {
          color: #9E8E85;
          font-size: 0.9rem;
          max-width: 420px;
          margin: 0 auto 2rem auto;
        }

        .cart-page-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 4vw, 2.75rem);
          color: #FFFFFF;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .cart-layout-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2.5rem;
          align-items: flex-start;
        }

        .cart-items-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .cart-item-card {
          display: flex;
          gap: 1.25rem;
          padding: 1.5rem;
          background-color: #190F0C;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 3px;
        }

        .cart-item-thumb {
          position: relative;
          width: 84px;
          height: 104px;
          border-radius: 2px;
          overflow: hidden;
          background-color: #221510;
          flex-shrink: 0;
        }

        .cart-item-thumb-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-gold-400);
          font-size: 0.65rem;
        }

        .cart-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .cart-item-brand {
          font-size: 0.7rem;
          color: var(--color-gold-400);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
          display: block;
        }

        .cart-item-name {
          font-size: 0.95rem;
          color: #FFFFFF;
          margin: 0.2rem 0;
          font-weight: 400;
          line-height: 1.35;
        }

        .cart-item-meta {
          font-size: 0.75rem;
          color: #9E8E85;
          display: block;
        }

        .cart-item-delete-btn {
          color: #7E6F67;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          transition: color 0.2s;
        }

        .cart-item-delete-btn:hover {
          color: #D64529;
        }

        .cart-item-actions-row {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
        }

        .cart-qty-picker {
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 2px;
          background-color: #120907;
        }

        .cart-qty-btn {
          padding: 0.35rem 0.6rem;
          color: #D8C7B2;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-qty-btn:hover {
          color: #FFFFFF;
        }

        .cart-qty-val {
          padding: 0 0.4rem;
          font-size: 0.8rem;
          min-width: 22px;
          text-align: center;
          color: #FFFFFF;
          font-weight: 600;
        }

        .cart-item-price {
          font-size: 1rem;
          font-weight: 600;
          color: #FFFFFF;
        }

        .cart-summary-card {
          padding: 2rem;
          background-color: #190F0C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          position: sticky;
          top: 90px;
        }

        .cart-summary-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.35rem;
          color: #FFFFFF;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
        }

        .cart-summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.85rem;
          font-size: 0.85rem;
          color: #D8C7B2;
        }

        .cart-summary-total-row {
          display: flex;
          justify-content: space-between;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 1.75rem;
          font-size: 1.2rem;
          font-weight: 600;
          color: #FFFFFF;
        }

        .cart-checkout-btn {
          width: 100%;
          padding: 1.05rem;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.16em;
        }

        .cart-trust-badges {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: #9E8E85;
          font-size: 0.725rem;
        }

        .cart-trust-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 991px) {
          .cart-layout-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .cart-summary-card {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .cart-page-wrapper {
            padding: 1.5rem 0 calc(7rem + env(safe-area-inset-bottom, 0px)) 0;
          }

          .cart-page-title {
            margin-bottom: 1.25rem;
          }

          .cart-item-card {
            padding: 1rem 0.85rem;
            gap: 0.85rem;
          }

          .cart-item-thumb {
            width: 70px;
            height: 90px;
          }

          .cart-item-name {
            font-size: 0.88rem;
          }

          .cart-summary-card {
            padding: 1.25rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
