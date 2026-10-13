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
      <div className="flex min-h-[80vh] items-center bg-[#140C09] px-4 py-24">
        <div className="container-lumera mx-auto max-w-[480px] text-center">
          <div className="mx-auto mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
            <ShoppingBag size={30} />
          </div>
          <h1 className="mb-3 font-serif text-[2.25rem] uppercase text-white">
            Your Bag is Empty
          </h1>
          <p className="mb-8 text-[0.9rem] text-[#9E8E85]">
            Please select your desired fragrances, makeup, or skincare before checking out.
          </p>
          <Link href="/shop" className="btn-lumera-primary px-8 py-[0.95rem]">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-[#140C09] py-10 pb-24 max-[768px]:pb-[calc(6rem+env(safe-area-inset-bottom,0px))] max-[768px]:pt-6">
      <div className="container-lumera">
        {/* Step Header */}
        <div className="mb-8">
          <h1 className="mb-3 font-serif text-[clamp(1.85rem,4vw,2.5rem)] uppercase tracking-[0.04em] text-white">
            Checkout
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[0.75rem] uppercase tracking-[0.12em] max-[768px]:gap-2 max-[768px]:text-[0.68rem]">
            <div className="flex items-center gap-2 text-gold-400">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gold-400 text-[0.7rem] font-bold text-[#0D0705] max-[768px]:h-[18px] max-[768px]:w-[18px] max-[768px]:text-[0.625rem]">
                1
              </span>
              <span>Shipping</span>
            </div>
            <span className="text-[#4A342B]">—</span>
            <div className="flex items-center gap-2 text-gold-400">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gold-400 text-[0.7rem] font-bold text-[#0D0705] max-[768px]:h-[18px] max-[768px]:w-[18px] max-[768px]:text-[0.625rem]">
                2
              </span>
              <span>Payment</span>
            </div>
            <span className="text-[#4A342B]">—</span>
            <div className="flex items-center gap-2 text-[#7E6F67]">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2A1A14] text-[0.7rem] font-bold text-[#FAF7F2] max-[768px]:h-[18px] max-[768px]:w-[18px] max-[768px]:text-[0.625rem]">
                3
              </span>
              <span>Review</span>
            </div>
          </div>
        </div>

        {/* Mobile Compact Order Summary Collapsible Banner */}
        <div className="mb-6 hidden overflow-hidden rounded-[3px] border border-white/[0.08] bg-[#190F0C] max-[991px]:block">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="flex w-full cursor-pointer items-center justify-between bg-transparent p-[0.85rem_1rem]"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-gold-400" />
              <span className="text-[0.8rem] font-medium text-[#FAF7F2]">
                {mobileSummaryOpen ? 'Hide order summary' : 'Show order summary'}
              </span>
              {mobileSummaryOpen ? (
                <ChevronUp size={14} className="text-[#9E8E85]" />
              ) : (
                <ChevronDown size={14} className="text-[#9E8E85]" />
              )}
            </div>
            <span className="text-[0.9rem] font-bold text-gold-400">
              {formatPrice(total)}
            </span>
          </button>

          {mobileSummaryOpen && (
            <div className="border-t border-white/[0.06] bg-[#120907] p-4">
              <div className="mb-4 flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-[54px] w-[44px] shrink-0 overflow-hidden rounded-[2px] bg-[#221510]">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[0.5rem] text-gold-400">
                          LUMÉRA
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[0.78rem] font-medium text-white">
                        {item.name}
                      </div>
                      <div className="text-[0.68rem] text-[#9E8E85]">
                        Qty: {item.quantity} {item.size ? `· ${item.size}` : ''}
                      </div>
                    </div>
                    <div className="shrink-0 text-[0.8rem] font-semibold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-[0.45rem] border-t border-white/[0.08] pt-3 text-[0.78rem]">
                <div className="flex justify-between text-[#D8C7B2]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#D8C7B2]">
                  <span>Saudi Shipping</span>
                  <span className="text-gold-400">
                    {shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-[3px] border border-[#D64529] bg-[#D64529]/15 p-4 text-[0.85rem] text-[#FFB2A3]">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-8 min-[992px]:grid-cols-[1fr_380px] min-[992px]:gap-12">
          {/* LEFT: Checkout Form */}
          <form onSubmit={handleSubmitOrder} className="flex flex-col gap-8">
            {/* 1. Contact Information */}
            <div className="rounded-[3px] border border-white/[0.08] bg-[#190F0C] p-8 max-[768px]:p-[1.25rem_1rem]">
              <h2 className="mb-5 text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-gold-400">
                1. Contact Information
              </h2>

              <div className="mb-4 grid grid-cols-2 gap-4 max-[768px]:grid-cols-1">
                <div>
                  <label className="mb-[0.4rem] block text-[0.725rem] text-[#B5A59D]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-4 py-3 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="mb-[0.4rem] block text-[0.725rem] text-[#B5A59D]">
                    Saudi Mobile (+966) *
                  </label>
                  <div className="flex w-full items-center">
                    <span className="rounded-l-[2px] border border-r-0 border-white/[0.12] bg-[#241611] px-[0.85rem] py-3 text-[0.85rem] font-semibold text-gold-400">
                      +966
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full flex-1 rounded-l-none rounded-r-[2px] border border-white/[0.12] bg-[#130A08] px-4 py-3 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                    />
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-[0.65rem] text-[0.775rem] text-[#D8C7B2]">
                <input
                  type="checkbox"
                  checked={receiveWhatsApp}
                  onChange={(e) => setReceiveWhatsApp(e.target.checked)}
                  className="accent-[#DEC197]"
                />
                <span>Receive order updates & shipment tracking via WhatsApp</span>
              </label>
            </div>

            {/* 2. Delivery Address */}
            <div className="rounded-[3px] border border-white/[0.08] bg-[#190F0C] p-8 max-[768px]:p-[1.25rem_1rem]">
              <h2 className="mb-5 text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-gold-400">
                2. Delivery Address (Saudi Arabia)
              </h2>

              <div className="mb-5 flex flex-col gap-4">
                <div>
                  <label className="mb-[0.4rem] block text-[0.725rem] text-[#B5A59D]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First and last name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-4 py-3 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="mb-[0.4rem] block text-[0.725rem] text-[#B5A59D]">
                    Street Address & District *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Hamra District, King Abdulaziz Branch Rd"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-4 py-3 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 max-[768px]:grid-cols-1">
                  <div>
                    <label className="mb-[0.4rem] block text-[0.725rem] text-[#B5A59D]">
                      City (Saudi Arabia) *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full cursor-pointer rounded-[2px] border border-white/[0.12] bg-[#130A08] px-4 py-3 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                    >
                      {SAUDI_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c} {c === 'Jeddah' ? '★ Same-Day Delivery' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-[0.4rem] block text-[0.725rem] text-[#B5A59D]">
                      Postal Code / National Address (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 23321"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full rounded-[2px] border border-white/[0.12] bg-[#130A08] px-4 py-3 text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
                    />
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-[0.65rem] text-[0.775rem] text-[#D8C7B2]">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="accent-[#DEC197]"
                />
                <span>Save this address for next time</span>
              </label>
            </div>

            {/* 3. Payment Method */}
            <div className="rounded-[3px] border border-white/[0.08] bg-[#190F0C] p-8 max-[768px]:p-[1.25rem_1rem]">
              <h2 className="mb-5 text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-gold-400">
                3. Payment Method
              </h2>

              <div className="flex flex-col gap-[0.85rem]">
                {/* Credit / Debit Card (Mada, Visa, Mastercard) */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-[2px] border bg-[#130A08] p-[0.9rem_1rem] transition-all max-[768px]:p-[0.75rem_0.85rem] ${
                    paymentMethod === 'card'
                      ? 'border-gold-400 bg-gold-400/[0.08]'
                      : 'border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-[#DEC197]"
                    />
                    <span className="text-[0.85rem] font-medium text-white">
                      Credit / Debit Card
                    </span>
                  </div>
                  <div className="flex gap-[0.35rem] text-[0.625rem] font-bold">
                    <span className="rounded-[2px] bg-[#241611] px-[0.4rem] py-[0.15rem] text-[#FAF7F2]">
                      mada
                    </span>
                    <span className="rounded-[2px] bg-[#241611] px-[0.4rem] py-[0.15rem] text-[#FAF7F2]">
                      VISA
                    </span>
                    <span className="rounded-[2px] bg-[#241611] px-[0.4rem] py-[0.15rem] text-[#FAF7F2]">
                      MC
                    </span>
                  </div>
                </label>

                {/* Apple Pay */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-[2px] border bg-[#130A08] p-[0.9rem_1rem] transition-all max-[768px]:p-[0.75rem_0.85rem] ${
                    paymentMethod === 'apple_pay'
                      ? 'border-gold-400 bg-gold-400/[0.08]'
                      : 'border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'apple_pay'}
                      onChange={() => setPaymentMethod('apple_pay')}
                      className="accent-[#DEC197]"
                    />
                    <span className="text-[0.85rem] font-medium text-white">
                      Apple Pay
                    </span>
                  </div>
                  <span className="rounded-[2px] bg-white px-2 py-[0.15rem] text-[0.68rem] font-bold text-black">
                    Apple Pay
                  </span>
                </label>

                {/* Tabby */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-[2px] border bg-[#130A08] p-[0.9rem_1rem] transition-all max-[768px]:p-[0.75rem_0.85rem] ${
                    paymentMethod === 'tabby'
                      ? 'border-gold-400 bg-gold-400/[0.08]'
                      : 'border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'tabby'}
                      onChange={() => setPaymentMethod('tabby')}
                      className="accent-[#DEC197]"
                    />
                    <span className="text-[0.85rem] font-medium text-white">
                      Tabby (4 interest-free payments)
                    </span>
                  </div>
                  <span className="rounded-[2px] bg-[#3EED8B] px-2 py-[0.15rem] text-[0.68rem] font-bold text-black">
                    tabby
                  </span>
                </label>

                {/* Tamara */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-[2px] border bg-[#130A08] p-[0.9rem_1rem] transition-all max-[768px]:p-[0.75rem_0.85rem] ${
                    paymentMethod === 'tamara'
                      ? 'border-gold-400 bg-gold-400/[0.08]'
                      : 'border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'tamara'}
                      onChange={() => setPaymentMethod('tamara')}
                      className="accent-[#DEC197]"
                    />
                    <span className="text-[0.85rem] font-medium text-white">
                      Tamara (Split or pay later)
                    </span>
                  </div>
                  <span className="rounded-[2px] bg-[#FFAE80] px-2 py-[0.15rem] text-[0.68rem] font-bold text-black">
                    tamara
                  </span>
                </label>

                {/* STC Pay */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-[2px] border bg-[#130A08] p-[0.9rem_1rem] transition-all max-[768px]:p-[0.75rem_0.85rem] ${
                    paymentMethod === 'stc_pay'
                      ? 'border-gold-400 bg-gold-400/[0.08]'
                      : 'border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'stc_pay'}
                      onChange={() => setPaymentMethod('stc_pay')}
                      className="accent-[#DEC197]"
                    />
                    <span className="text-[0.85rem] font-medium text-white">
                      STC Pay
                    </span>
                  </div>
                  <span className="rounded-[2px] bg-[#4F008C] px-2 py-[0.15rem] text-[0.68rem] font-bold text-white">
                    stc pay
                  </span>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-[2px] border bg-[#130A08] p-[0.9rem_1rem] transition-all max-[768px]:p-[0.75rem_0.85rem] ${
                    paymentMethod === 'cod'
                      ? 'border-gold-400 bg-gold-400/[0.08]'
                      : 'border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#DEC197]"
                    />
                    <span className="text-[0.85rem] font-medium text-white">
                      Cash on Delivery
                    </span>
                  </div>
                  <span className="text-[0.7rem] text-[#9E8E85]">COD</span>
                </label>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-lumera-primary w-full p-[1.15rem] text-[0.85rem] font-bold tracking-[0.16em]"
            >
              {submitting ? 'SECURELY PROCESSING ORDER...' : `PLACE ORDER · ${formatPrice(total)}`}
            </button>
          </form>

          {/* RIGHT: Order Summary Desktop Card */}
          <div className="static rounded-[3px] border border-white/[0.08] bg-[#190F0C] p-8 max-[768px]:p-[1.25rem_1rem] min-[992px]:sticky min-[992px]:top-[90px]">
            <h3 className="mb-5 font-serif text-[1.35rem] uppercase text-white">
              Order Summary
            </h3>

            {/* Items */}
            <div className="mb-5 flex flex-col gap-[0.85rem]">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-[0.85rem]">
                  <div className="relative h-[64px] w-[52px] shrink-0 overflow-hidden rounded-[2px] bg-[#221510]">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="52px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[0.55rem] text-gold-400">
                        LUMÉRA
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[0.8rem] font-medium leading-[1.3] text-white">
                      {item.name}
                    </div>
                    <div className="text-[0.7rem] text-[#9E8E85]">
                      Qty: {item.quantity} {item.size ? `· ${item.size}` : ''}
                    </div>
                  </div>
                  <div className="shrink-0 text-[0.85rem] font-semibold text-white">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-[0.65rem] border-t border-white/[0.06] pt-4">
              <div className="flex justify-between text-[0.8rem] text-[#D8C7B2]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[0.8rem] text-[#D8C7B2]">
                <span>Saudi Shipping</span>
                <span className="text-gold-400">
                  {shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/[0.08] pt-4 text-[1.15rem] font-semibold text-white">
                <span>Total</span>
                <span className="text-gold-400">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Bottom 3 Trust Pillars */}
            <div className="mt-6 flex flex-col gap-[0.65rem] border-t border-white/[0.08] pt-5 text-[0.72rem] text-[#9E8E85]">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-gold-400" />
                <span>Secure 256-bit SSL encrypted checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-gold-400" />
                <span>100% Authentic Saudi luxury guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-gold-400" />
                <span>Express courier tracking dispatched from Jeddah</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
