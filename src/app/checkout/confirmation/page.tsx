import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Package, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

interface ConfirmationPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrderConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const search = await searchParams;
  const orderNumber = (search.order as string) || 'LUM-884219';
  const total = search.total ? Number(search.total) : null;

  return (
    <div className="flex min-h-[85vh] items-center bg-[#140C09] px-4 pb-28 pt-[4.5rem] max-[768px]:min-h-0 max-[768px]:pb-[calc(6rem+env(safe-area-inset-bottom,0px))] max-[768px]:pt-10">
      <div className="container-lumera mx-auto w-full max-w-[600px] text-center">
        <div className="mx-auto mb-6 flex h-[76px] w-[76px] items-center justify-center rounded-full border border-gold-400 bg-gold-400/[0.12] text-gold-400 shadow-[0_0_24px_rgba(200,162,101,0.2)]">
          <CheckCircle2 size={40} strokeWidth={1.5} />
        </div>

        <div className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-gold-400">
          ORDER CONFIRMED
        </div>

        <h1 className="mb-[0.85rem] font-serif text-[clamp(2rem,5vw,2.75rem)] font-semibold uppercase leading-[1.15] tracking-[0.02em] text-white">
          Thank You For Your Order
        </h1>

        <p className="mx-auto mb-8 max-w-[480px] text-[0.95rem] leading-[1.6] text-[#D8C7B2]">
          Your luxury parcel is now being prepared with utmost care. A confirmation email with full details has been sent to your address.
        </p>

        {/* Order Details Card */}
        <div className="mb-8 rounded-[3px] border border-white/[0.08] bg-[#190F0C] p-7 text-left shadow-[0_8px_32px_rgba(0,0,0,0.35)] max-[768px]:p-[1.25rem_1rem]">
          <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3 text-[0.85rem] max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-1">
            <span className="text-[0.8rem] text-[#9E8E85]">Order Reference</span>
            <span className="font-semibold tracking-[0.05em] text-gold-400">#{orderNumber}</span>
          </div>

          {total !== null && (
            <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3 text-[0.85rem] max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-1">
              <span className="text-[0.8rem] text-[#9E8E85]">Total Amount</span>
              <span className="font-semibold text-white">{formatPrice(total)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[0.85rem] max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-1">
            <span className="text-[0.8rem] text-[#9E8E85]">Estimated Delivery</span>
            <span className="text-[0.8rem] font-normal text-[#D8C7B2] max-[768px]:text-left">
              Jeddah: 24–48 hours · KSA: 2–3 business days
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4 text-[0.75rem] text-[#B5A59D]">
            <div className="flex items-center gap-2">
              <Package size={14} className="text-gold-400" />
              <span>Complimentary signature gift-box packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-gold-400" />
              <span>100% Authentic verified luxury guaranteed</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/shop"
            className="btn-lumera-primary w-full max-w-[340px] px-8 py-[0.95rem] text-[0.75rem] max-[768px]:max-w-full"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/account"
            className="text-[0.75rem] uppercase tracking-[0.1em] text-gold-400 no-underline transition-opacity hover:opacity-80"
          >
            Track Parcel In Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
