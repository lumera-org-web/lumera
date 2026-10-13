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
      className={`fixed inset-0 z-[100] flex bg-black/75 backdrop-blur-[6px] ${
        isRtl ? 'justify-start' : 'justify-end'
      }`}
      onClick={closeDrawer}
    >
      <div
        className={`flex h-full w-full max-w-[min(440px,100vw)] flex-col bg-[#140C09] ${
          isRtl
            ? 'animate-slide-in-left border-r border-white/[0.08]'
            : 'animate-slide-in-right border-l border-white/[0.08]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] p-6">
          <div className="flex items-center gap-[0.65rem]">
            <ShoppingBag size={20} className="text-gold-400" />
            <h3 className="m-0 font-serif text-[1.15rem] tracking-[0.05em] text-white">
              {t('cart.title')}
            </h3>
            <span className="text-[0.8rem] text-[#9E8E85]">
              ({items.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </div>

          <button
            onClick={closeDrawer}
            aria-label="Close bag"
            className="p-[0.35rem] text-[#D8C7B2] transition-colors hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-[#9E8E85]">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.03] text-gold-400">
                <ShoppingBag size={28} />
              </div>
              <p className="mb-2 text-[1rem] text-[#FAF7F2]">
                {t('cart.empty')}
              </p>
              <p className="mb-6 max-w-[240px] text-[0.8rem] leading-[1.5]">
                Explore our curated fragrance, makeup, and skincare edits.
              </p>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="btn-lumera-outline !text-[0.7rem]"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-white/[0.05] pb-5"
              >
                {/* Thumb */}
                <div className="relative h-[92px] w-[74px] shrink-0 overflow-hidden rounded-[2px] bg-[#1E120D]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="74px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[0.6rem] text-gold-400">
                      LUMÉRA
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col">
                  {item.brandName && (
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-gold-400">
                      {item.brandName}
                    </span>
                  )}
                  <h4 className="my-[0.15rem] text-[0.85rem] font-normal leading-[1.3] text-white">
                    {item.name}
                  </h4>
                  {item.size && (
                    <span className="text-[0.7rem] text-[#9E8E85]">
                      {item.size}
                    </span>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-2">
                    {/* Qty Selector */}
                    <div className="flex items-center rounded-[2px] border border-white/10">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-[0.45rem] py-[0.2rem] text-[#D8C7B2] transition-colors hover:text-white"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-[20px] px-[0.4rem] text-center text-[0.75rem] text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-[0.45rem] py-[0.2rem] text-[#D8C7B2] transition-colors hover:text-white"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price & Delete */}
                    <div className="flex items-center gap-3">
                      <span className="text-[0.85rem] font-semibold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-[0.2rem] text-[#7E6F67] transition-colors hover:text-[#D64529]"
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
          <div className="border-t border-white/[0.08] bg-[#0F0806] p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
            <div className="mb-2 flex justify-between text-[0.8rem] text-[#D8C7B2]">
              <span>{t('cart.subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="mb-4 flex justify-between text-[0.8rem] text-[#D8C7B2]">
              <span>{t('cart.shipping')} (Saudi Arabia)</span>
              <span className="font-semibold text-gold-400">
                {shippingFee === 0 ? t('cart.complimentary') : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="mb-5 flex justify-between border-t border-white/[0.08] pt-3 text-[1rem] font-semibold text-white">
              <span>Total</span>
              <span className="text-gold-400">{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="btn-lumera-primary w-full p-[0.95rem] text-[0.75rem] font-bold"
            >
              <span>{t('cart.checkout')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
