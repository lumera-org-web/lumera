'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, Lock, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatters';

const SAUDI_CITIES = [
  'Jeddah',
  'Riyadh',
  'Mecca (Makkah)',
  'Medina (Madinah)',
  'Dammam',
  'Al Khobar',
  'Dhahran',
  'Taif',
  'Tabuk',
  'Abha',
  'Khamis Mushait',
  'Jubail',
  'Yanbu',
  'Al-Ahsa',
  'Qassim (Buraidah)',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [receiveWhatsApp, setReceiveWhatsApp] = useState(true);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jeddah');
  const [postalCode, setPostalCode] = useState('');
  const [saveAddress, setSaveAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'tabby' | 'tamara' | 'stc_pay' | 'cod'>('card');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !fullName || !address) {
      setErrorMsg('Please complete all contact and delivery fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          contact: { email, phone: phone.startsWith('+966') ? phone : `+966 ${phone}`, receiveWhatsApp },
          shippingAddress: { fullName, address, city, postalCode, saveAddress },
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      router.push(`/checkout/confirmation?order=${data.orderNumber}&total=${data.total}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during order submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: '#140C09', minHeight: '80vh', padding: '6rem 1rem', display: 'flex', alignItems: 'center' }}>
        <div className="container-lumera" style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: 'rgba(200, 162, 101, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--color-gold-400)' }}>
            <ShoppingBag size={30} />
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#FFFFFF', fontSize: '2.25rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Your Bag is Empty
          </h1>
          <p style={{ color: '#9E8E85', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Please select your desired fragrances, makeup, or skincare before checking out.
          </p>
          <Link href="/shop" className="btn-lumera-primary" style={{ padding: '0.95rem 2rem' }}>
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      <div className="container-lumera">
        {/* Step Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>

          <div className="checkout-stepper">
            <div className="checkout-step-item" style={{ color: 'var(--color-gold-400)' }}>
              <span className="checkout-step-num" style={{ backgroundColor: 'var(--color-gold-400)', color: '#0D0705' }}>1</span>
              <span>Shipping</span>
            </div>
            <span className="checkout-step-divider">—</span>
            <div className="checkout-step-item" style={{ color: 'var(--color-gold-400)' }}>
              <span className="checkout-step-num" style={{ backgroundColor: 'var(--color-gold-400)', color: '#0D0705' }}>2</span>
              <span>Payment</span>
            </div>
            <span className="checkout-step-divider">—</span>
            <div className="checkout-step-item" style={{ color: '#7E6F67' }}>
              <span className="checkout-step-num" style={{ backgroundColor: '#2A1A14', color: '#FAF7F2' }}>3</span>
              <span>Review</span>
            </div>
          </div>
        </div>

        {/* Mobile Compact Order Summary Collapsible Banner */}
        <div className="checkout-mobile-summary-card">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="checkout-mobile-summary-btn"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={16} color="var(--color-gold-400)" />
              <span style={{ fontSize: '0.8rem', color: '#FAF7F2', fontWeight: 500 }}>
                {mobileSummaryOpen ? 'Hide order summary' : 'Show order summary'}
              </span>
              {mobileSummaryOpen ? <ChevronUp size={14} color="#9E8E85" /> : <ChevronDown size={14} color="#9E8E85" />}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-gold-400)' }}>
              {formatPrice(total)}
            </span>
          </button>

          {mobileSummaryOpen && (
            <div className="checkout-mobile-summary-dropdown">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ position: 'relative', width: '44px', height: '54px', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#221510', flexShrink: 0 }}>
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill sizes="44px" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: 'var(--color-gold-400)' }}>LUMÉRA</div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#9E8E85' }}>Qty: {item.quantity} {item.size ? `· ${item.size}` : ''}</div>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF', flexShrink: 0 }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D8C7B2' }}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D8C7B2' }}>
                  <span>Saudi Shipping</span>
                  <span style={{ color: 'var(--color-gold-400)' }}>{shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="checkout-error-banner">
            {errorMsg}
          </div>
        )}

        <div className="checkout-layout-grid">
          {/* LEFT: Checkout Form */}
          <form onSubmit={handleSubmitOrder} className="checkout-form-column">
            {/* 1. Contact Information */}
            <div className="checkout-card">
              <h2 className="checkout-card-title">
                1. Contact Information
              </h2>

              <div className="checkout-two-col">
                <div>
                  <label className="checkout-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="checkout-input"
                  />
                </div>

                <div>
                  <label className="checkout-label">Saudi Mobile (+966) *</label>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <span className="checkout-phone-prefix">+966</span>
                    <input
                      type="tel"
                      required
                      placeholder="50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="checkout-input checkout-phone-input"
                    />
                  </div>
                </div>
              </div>

              <label className="checkout-checkbox-label">
                <input
                  type="checkbox"
                  checked={receiveWhatsApp}
                  onChange={(e) => setReceiveWhatsApp(e.target.checked)}
                  style={{ accentColor: 'var(--color-gold-400)' }}
                />
                <span>Receive order updates & shipment tracking via WhatsApp</span>
              </label>
            </div>

            {/* 2. Delivery Address */}
            <div className="checkout-card">
              <h2 className="checkout-card-title">
                2. Delivery Address (Saudi Arabia)
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="checkout-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="First and last name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="checkout-input"
                  />
                </div>

                <div>
                  <label className="checkout-label">Street Address & District *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Hamra District, King Abdulaziz Branch Rd"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="checkout-input"
                  />
                </div>

                <div className="checkout-two-col" style={{ marginBottom: 0 }}>
                  <div>
                    <label className="checkout-label">City (Saudi Arabia) *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="checkout-input checkout-select"
                    >
                      {SAUDI_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c} {c === 'Jeddah' ? '★ Same-Day Delivery' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="checkout-label">Postal Code / National Address (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 23321"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="checkout-input"
                    />
                  </div>
                </div>
              </div>

              <label className="checkout-checkbox-label">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  style={{ accentColor: 'var(--color-gold-400)' }}
                />
                <span>Save this address for next time</span>
              </label>
            </div>

            {/* 3. Payment Method */}
            <div className="checkout-card">
              <h2 className="checkout-card-title">
                3. Payment Method
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Credit / Debit Card (Mada, Visa, Mastercard) */}
                <label className={`checkout-payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      style={{ accentColor: 'var(--color-gold-400)' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>
                      Credit / Debit Card
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', fontSize: '0.625rem', fontWeight: 700 }}>
                    <span style={{ padding: '0.15rem 0.4rem', background: '#241611', color: '#FAF7F2', borderRadius: '2px' }}>mada</span>
                    <span style={{ padding: '0.15rem 0.4rem', background: '#241611', color: '#FAF7F2', borderRadius: '2px' }}>VISA</span>
                    <span style={{ padding: '0.15rem 0.4rem', background: '#241611', color: '#FAF7F2', borderRadius: '2px' }}>MC</span>
                  </div>
                </label>

                {/* Apple Pay */}
                <label className={`checkout-payment-option ${paymentMethod === 'apple_pay' ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'apple_pay'}
                      onChange={() => setPaymentMethod('apple_pay')}
                      style={{ accentColor: 'var(--color-gold-400)' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>
                      Apple Pay
                    </span>
                  </div>
                  <span style={{ padding: '0.15rem 0.5rem', background: '#FFFFFF', color: '#000000', borderRadius: '2px', fontSize: '0.68rem', fontWeight: 700 }}>
                    Apple Pay
                  </span>
                </label>

                {/* Tabby */}
                <label className={`checkout-payment-option ${paymentMethod === 'tabby' ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'tabby'}
                      onChange={() => setPaymentMethod('tabby')}
                      style={{ accentColor: 'var(--color-gold-400)' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>
                      Tabby (4 interest-free payments)
                    </span>
                  </div>
                  <span style={{ padding: '0.15rem 0.5rem', background: '#3EED8B', color: '#000000', borderRadius: '2px', fontSize: '0.68rem', fontWeight: 700 }}>
                    tabby
                  </span>
                </label>

                {/* Tamara */}
                <label className={`checkout-payment-option ${paymentMethod === 'tamara' ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'tamara'}
                      onChange={() => setPaymentMethod('tamara')}
                      style={{ accentColor: 'var(--color-gold-400)' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>
                      Tamara (Split or pay later)
                    </span>
                  </div>
                  <span style={{ padding: '0.15rem 0.5rem', background: '#FFAE80', color: '#000000', borderRadius: '2px', fontSize: '0.68rem', fontWeight: 700 }}>
                    tamara
                  </span>
                </label>

                {/* STC Pay */}
                <label className={`checkout-payment-option ${paymentMethod === 'stc_pay' ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'stc_pay'}
                      onChange={() => setPaymentMethod('stc_pay')}
                      style={{ accentColor: 'var(--color-gold-400)' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>
                      STC Pay
                    </span>
                  </div>
                  <span style={{ padding: '0.15rem 0.5rem', background: '#4F008C', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.68rem', fontWeight: 700 }}>
                    stc pay
                  </span>
                </label>

                {/* Cash on Delivery */}
                <label className={`checkout-payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      style={{ accentColor: 'var(--color-gold-400)' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>
                      Cash on Delivery
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#9E8E85' }}>COD</span>
                </label>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-lumera-primary checkout-submit-btn"
            >
              {submitting ? 'SECURELY PROCESSING ORDER...' : `PLACE ORDER · ${formatPrice(total)}`}
            </button>
          </form>

          {/* RIGHT: Order Summary Desktop Card */}
          <div className="checkout-order-summary">
            <h3 className="checkout-summary-title">
              Order Summary
            </h3>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ position: 'relative', width: '52px', height: '64px', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#221510', flexShrink: 0 }}>
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill sizes="52px" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'var(--color-gold-400)' }}>
                        LUMÉRA
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 500, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9E8E85' }}>Qty: {item.quantity} {item.size ? `· ${item.size}` : ''}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', flexShrink: 0 }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#D8C7B2' }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#D8C7B2' }}>
                <span>Saudi Shipping</span>
                <span style={{ color: 'var(--color-gold-400)' }}>
                  {shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF' }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-gold-400)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Bottom 3 Trust Pillars */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '1.5rem', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.72rem', color: '#9E8E85' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={14} color="var(--color-gold-400)" />
                <span>Secure 256-bit SSL encrypted checkout</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={14} color="var(--color-gold-400)" />
                <span>100% Authentic Saudi luxury guarantee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={14} color="var(--color-gold-400)" />
                <span>Express courier tracking dispatched from Jeddah</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-page-wrapper {
          background-color: #140C09;
          min-height: 90vh;
          padding: 2.5rem 0 6rem 0;
        }

        .checkout-header {
          margin-bottom: 2rem;
        }

        .checkout-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.85rem, 4vw, 2.5rem);
          color: #FFFFFF;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .checkout-stepper {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          flex-wrap: wrap;
        }

        .checkout-step-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checkout-step-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.7rem;
        }

        .checkout-step-divider {
          color: #4A342B;
        }

        .checkout-mobile-summary-card {
          display: none;
          background-color: #190F0C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          margin-bottom: 1.5rem;
          overflow: hidden;
        }

        .checkout-mobile-summary-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .checkout-mobile-summary-dropdown {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background-color: #120907;
        }

        .checkout-error-banner {
          padding: 1rem;
          background-color: rgba(214, 69, 41, 0.15);
          border: 1px solid #D64529;
          color: #FFB2A3;
          border-radius: 3px;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
        }

        .checkout-layout-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 3rem;
          align-items: flex-start;
        }

        .checkout-form-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .checkout-card {
          padding: 2rem;
          background-color: #190F0C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 3px;
        }

        .checkout-card-title {
          font-size: 0.85rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-gold-400);
          margin-bottom: 1.25rem;
          font-weight: 600;
        }

        .checkout-label {
          display: block;
          font-size: 0.725rem;
          color: #B5A59D;
          margin-bottom: 0.4rem;
        }

        .checkout-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .checkout-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #130A08;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          border-radius: 2px;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .checkout-input:focus {
          border-color: var(--color-gold-400);
        }

        .checkout-select {
          cursor: pointer;
        }

        .checkout-phone-prefix {
          padding: 0.75rem 0.85rem;
          background-color: #241611;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-right: none;
          color: var(--color-gold-400);
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 2px 0 0 2px;
        }

        .checkout-phone-input {
          flex: 1;
          border-radius: 0 2px 2px 0;
        }

        .checkout-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.775rem;
          color: #D8C7B2;
          cursor: pointer;
        }

        .checkout-payment-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1rem;
          background-color: #130A08;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .checkout-payment-option.active {
          background-color: rgba(200, 162, 101, 0.08);
          border-color: var(--color-gold-400);
        }

        .checkout-submit-btn {
          padding: 1.15rem;
          font-size: 0.85rem;
          font-weight: 700;
          width: 100%;
          cursor: pointer;
          letter-spacing: 0.16em;
        }

        .checkout-order-summary {
          padding: 2rem;
          background-color: #190F0C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          position: sticky;
          top: 90px;
        }

        .checkout-summary-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.35rem;
          color: #FFFFFF;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
        }

        @media (max-width: 991px) {
          .checkout-layout-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .checkout-mobile-summary-card {
            display: block;
          }

          .checkout-order-summary {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .checkout-page-wrapper {
            padding: 1.5rem 0 calc(6rem + env(safe-area-inset-bottom, 0px)) 0;
          }

          .checkout-stepper {
            gap: 0.5rem;
            font-size: 0.68rem;
          }

          .checkout-step-num {
            width: 18px;
            height: 18px;
            font-size: 0.625rem;
          }

          .checkout-card {
            padding: 1.25rem 1rem;
          }

          .checkout-two-col {
            grid-template-columns: 1fr;
          }

          .checkout-payment-option {
            padding: 0.75rem 0.85rem;
          }

          .checkout-order-summary {
            padding: 1.25rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
