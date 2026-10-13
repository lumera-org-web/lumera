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
      <div className="flex min-h-[80vh] items-center bg-[#140C09] px-4 py-24">
        <div className="container-lumera mx-auto max-w-[480px] text-center">
          <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
            <ShoppingBag size={32} />
          </div>
          <h1 className="mb-3 font-serif text-[2.25rem] uppercase text-white">
            {t('cart.empty')}
          </h1>
          <p className="mx-auto mb-8 max-w-[420px] text-[0.9rem] text-[#9E8E85]">
            Explore our curated fragrance, makeup, and skincare edits.
          </p>
          <Link href="/shop" className="btn-lumera-primary px-9 py-[0.95rem]">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[#140C09] py-12 pb-24 max-[768px]:pb-[calc(7rem+env(safe-area-inset-bottom,0px))] max-[768px]:pt-6">
      <div className="container-lumera">
        <h1 className="mb-8 font-serif text-[clamp(2rem,4vw,2.75rem)] uppercase tracking-[0.04em] text-white max-[768px]:mb-5">
          {t('cart.title')}
        </h1>

        <div className="grid grid-cols-1 items-start gap-8 min-[992px]:grid-cols-[1fr_380px] min-[992px]:gap-10">
          {/* Items List */}
          <div className="flex flex-col gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 rounded-[3px] border border-white/[0.06] bg-[#190F0C] p-6 max-[768px]:gap-[0.85rem] max-[768px]:p-[1rem_0.85rem]"
              >
                {/* Thumb */}
                <div className="relative h-[104px] w-[84px] shrink-0 overflow-hidden rounded-[2px] bg-[#221510] max-[768px]:h-[90px] max-[768px]:w-[70px]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[0.65rem] text-gold-400">
                      LUMÉRA
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {item.brandName && (
                        <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-gold-400">
                          {item.brandName}
                        </span>
                      )}
                      <h3 className="my-[0.2rem] text-[0.95rem] font-normal leading-[1.35] text-white max-[768px]:text-[0.88rem]">
                        {item.name}
                      </h3>
                      {item.size && (
                        <span className="block text-[0.75rem] text-[#9E8E85]">
                          Size: {item.size}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-[#7E6F67] transition-colors hover:text-[#D64529]"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-[2px] border border-white/[0.12] bg-[#120907]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex items-center justify-center px-[0.6rem] py-[0.35rem] text-[#D8C7B2] transition-colors hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-[22px] px-[0.4rem] text-center text-[0.8rem] font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex items-center justify-center px-[0.6rem] py-[0.35rem] text-[#D8C7B2] transition-colors hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="text-[1rem] font-semibold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="static rounded-[3px] border border-white/[0.08] bg-[#190F0C] p-8 max-[768px]:p-[1.25rem_1rem] min-[992px]:sticky min-[992px]:top-[90px]">
            <h2 className="mb-5 font-serif text-[1.35rem] uppercase text-white">
              Order Summary
            </h2>

            <div className="mb-[0.85rem] flex justify-between text-[0.85rem] text-[#D8C7B2]">
              <span>{t('cart.subtotal')}</span>
              <span className="font-medium text-white">{formatPrice(subtotal)}</span>
            </div>

            <div className="mb-[0.85rem] flex justify-between text-[0.85rem] text-[#D8C7B2]">
              <span>{t('cart.shipping')} (Saudi Arabia)</span>
              <span className="font-semibold text-gold-400">
                {shippingFee === 0 ? t('cart.complimentary') : formatPrice(shippingFee)}
              </span>
            </div>

            <div className="mb-7 flex justify-between border-t border-white/[0.08] pt-5 text-[1.2rem] font-semibold text-white">
              <span>Total</span>
              <span className="text-gold-400">{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              className="btn-lumera-primary w-full p-[1.05rem] text-[0.82rem] font-bold tracking-[0.16em]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>

            <div className="mt-6 flex flex-col gap-2 text-[0.725rem] text-[#9E8E85]">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-gold-400" />
                <span>Complimentary Jeddah & KSA delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-gold-400" />
                <span>100% Authentic Saudi luxury guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
