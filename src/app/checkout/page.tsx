'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
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

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [receiveWhatsApp, setReceiveWhatsApp] = useState(true);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jeddah'); // Jeddah as primary market focus
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
      <div style={{ backgroundColor: '#140C09', minHeight: '80vh', padding: '6rem 0' }}>
        <div className="container-lumera" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: '#FFFFFF', fontSize: '2rem', marginBottom: '1rem' }}>
            Your Bag is Empty
          </h1>
          <p style={{ color: '#9E8E85', marginBottom: '2rem' }}>
            Please select items before proceeding to checkout.
          </p>
          <Link href="/shop" className="btn-lumera-primary">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#140C09', minHeight: '90vh', padding: '2.5rem 0 6rem 0' }}>
      <div className="container-lumera">
        {/* Step Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: '#FFFFFF',
              marginBottom: '1rem',
            }}
          >
            Checkout
          </h1>

          {/* Stepper matching reference */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 1 ? 'var(--color-gold-400)' : '#7E6F67' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: step >= 1 ? 'var(--color-gold-400)' : '#2A1A14', color: '#0D0705', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem' }}>
                1
              </span>
              <span>Shipping</span>
            </div>
            <span style={{ color: '#4A342B' }}>—</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 2 ? 'var(--color-gold-400)' : '#7E6F67' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: step >= 2 ? 'var(--color-gold-400)' : '#2A1A14', color: step >= 2 ? '#0D0705' : '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem' }}>
                2
              </span>
              <span>Payment</span>
            </div>
            <span style={{ color: '#4A342B' }}>—</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 3 ? 'var(--color-gold-400)' : '#7E6F67' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: step >= 3 ? 'var(--color-gold-400)' : '#2A1A14', color: step >= 3 ? '#0D0705' : '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem' }}>
                3
              </span>
              <span>Review</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(214, 69, 41, 0.15)', border: '1px solid #D64529', color: '#FFB2A3', borderRadius: '3px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'flex-start',
          }}
        >
          {/* LEFT: Checkout Form */}
          <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* 1. Contact Information */}
            <div style={{ padding: '2rem', backgroundColor: '#190F0C', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px' }}>
              <h2 style={{ fontSize: '0.9rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold-400)', marginBottom: '1.25rem', fontWeight: 600 }}>
                Contact Information
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.725rem', color: '#B5A59D', marginBottom: '0.4rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#130A08',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      borderRadius: '2px',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.725rem', color: '#B5A59D', marginBottom: '0.4rem' }}>
                    Saudi Mobile Phone (+966) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ padding: '0.75rem 0.85rem', backgroundColor: '#241611', border: '1px solid rgba(255, 255, 255, 0.12)', borderRight: 'none', color: 'var(--color-gold-400)', fontSize: '0.85rem', fontWeight: 600 }}>
                      +966
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        backgroundColor: '#130A08',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFFFFF',
                        borderRadius: '0 2px 2px 0',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.775rem', color: '#D8C7B2', cursor: 'pointer' }}>
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
            <div style={{ padding: '2rem', backgroundColor: '#190F0C', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px' }}>
              <h2 style={{ fontSize: '0.9rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold-400)', marginBottom: '1.25rem', fontWeight: 600 }}>
                Delivery Address (Saudi Arabia)
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.725rem', color: '#B5A59D', marginBottom: '0.4rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First and last name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#130A08',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      borderRadius: '2px',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.725rem', color: '#B5A59D', marginBottom: '0.4rem' }}>
                    Street Address & District *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Hamra District, King Abdulaziz Branch Rd"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#130A08',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      borderRadius: '2px',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.725rem', color: '#B5A59D', marginBottom: '0.4rem' }}>
                      City (Saudi Arabia) *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#130A08',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFFFFF',
                        borderRadius: '2px',
                        fontSize: '0.85rem',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {SAUDI_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c} {c === 'Jeddah' ? '★ Same-Day Delivery' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.725rem', color: '#B5A59D', marginBottom: '0.4rem' }}>
                      Postal Code / National Address (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 23321"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#130A08',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFFFFF',
                        borderRadius: '2px',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.775rem', color: '#D8C7B2', cursor: 'pointer' }}>
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
            <div style={{ padding: '2rem', backgroundColor: '#190F0C', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px' }}>
              <h2 style={{ fontSize: '0.9rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold-400)', marginBottom: '1.25rem', fontWeight: 600 }}>
                Payment Method
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Credit / Debit Card (Mada, Visa, Mastercard) */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: paymentMethod === 'card' ? 'rgba(200, 162, 101, 0.08)' : '#130A08',
                    border: paymentMethod === 'card' ? '1px solid var(--color-gold-400)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
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
                  <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.65rem', fontWeight: 700 }}>
                    <span style={{ padding: '0.15rem 0.4rem', background: '#241611', color: '#FAF7F2', borderRadius: '2px' }}>mada</span>
                    <span style={{ padding: '0.15rem 0.4rem', background: '#241611', color: '#FAF7F2', borderRadius: '2px' }}>VISA</span>
                    <span style={{ padding: '0.15rem 0.4rem', background: '#241611', color: '#FAF7F2', borderRadius: '2px' }}>MC</span>
                  </div>
                </label>

                {/* Apple Pay */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: paymentMethod === 'apple_pay' ? 'rgba(200, 162, 101, 0.08)' : '#130A08',
                    border: paymentMethod === 'apple_pay' ? '1px solid var(--color-gold-400)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
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
                  <span style={{ padding: '0.15rem 0.5rem', background: '#FFFFFF', color: '#000000', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 700 }}>
                    Apple Pay
                  </span>
                </label>

                {/* Tabby */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: paymentMethod === 'tabby' ? 'rgba(200, 162, 101, 0.08)' : '#130A08',
                    border: paymentMethod === 'tabby' ? '1px solid var(--color-gold-400)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'tabby'}
                      onChange={() => setPaymentMethod('tabby')}
                      style={{ accentColor: 'var(--color-gold-400)' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>
                      Tabby (Split in 4 interest-free payments)
                    </span>
                  </div>
                  <span style={{ padding: '0.15rem 0.5rem', background: '#3EED8B', color: '#000000', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 700 }}>
                    tabby
                  </span>
                </label>

                {/* Tamara */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: paymentMethod === 'tamara' ? 'rgba(200, 162, 101, 0.08)' : '#130A08',
                    border: paymentMethod === 'tamara' ? '1px solid var(--color-gold-400)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
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
                  <span style={{ padding: '0.15rem 0.5rem', background: '#FFAE80', color: '#000000', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 700 }}>
                    tamara
                  </span>
                </label>

                {/* STC Pay */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: paymentMethod === 'stc_pay' ? 'rgba(200, 162, 101, 0.08)' : '#130A08',
                    border: paymentMethod === 'stc_pay' ? '1px solid var(--color-gold-400)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
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
                  <span style={{ padding: '0.15rem 0.5rem', background: '#4F008C', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 700 }}>
                    stc pay
                  </span>
                </label>

                {/* Cash on Delivery */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: paymentMethod === 'cod' ? 'rgba(200, 162, 101, 0.08)' : '#130A08',
                    border: paymentMethod === 'cod' ? '1px solid var(--color-gold-400)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      style={{ accentColor: 'var(--color-gold-400)' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>
                      Cash on Delivery (Jeddah & Major Cities)
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
              className="btn-lumera-primary"
              style={{ padding: '1.15rem', fontSize: '0.85rem', fontWeight: 700, width: '100%' }}
            >
              {submitting ? 'SECURELY PROCESSING ORDER...' : 'PLACE ORDER'}
            </button>
          </form>

          {/* RIGHT: Order Summary */}
          <div
            style={{
              padding: '2rem',
              backgroundColor: '#190F0C',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              position: 'sticky',
              top: '100px',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                color: '#FFFFFF',
                marginBottom: '1.5rem',
              }}
            >
              Order Summary
            </h3>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ position: 'relative', width: '56px', height: '68px', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#221510', flexShrink: 0 }}>
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill sizes="56px" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'var(--color-gold-400)' }}>
                        LUMÉRA
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 500, lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9E8E85' }}>Qty: {item.quantity} {item.size ? `· ${item.size}` : ''}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
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

            {/* Bottom 3 Trust Pillars matching reference */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '2rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.725rem', color: '#9E8E85' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={15} color="var(--color-gold-400)" />
                <span>Secure 256-bit SSL encrypted checkout</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={15} color="var(--color-gold-400)" />
                <span>100% Authentic Saudi luxury guarantee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={15} color="var(--color-gold-400)" />
                <span>Express courier tracking dispatched from Jeddah</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
