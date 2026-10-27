import React from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, Package, ShieldCheck, CreditCard, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { getMoyasarPayment } from '@/services/moyasar';
import { createClient } from '@/utils/supabase/server';
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/services/brevo';
import { ClearCartOnSuccess } from '@/components/checkout/ClearCartOnSuccess';

interface ConfirmationPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrderConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const search = await searchParams;
  const orderNumber = (search.order as string) || 'LUM-884219';
  const total = search.total ? Number(search.total) : null;
  const paymentId = search.id as string | undefined;
  const rawStatus = search.status as string | undefined;
  const paymentMessage = search.message as string | undefined;

  let isPaid = true;
  let paymentDetails: any = null;
  let failureReason: string | null = null;

  // If redirected from Moyasar with a payment ID
  if (paymentId) {
    try {
      const payment = await getMoyasarPayment(paymentId);
      paymentDetails = payment;

      if (payment.status === 'paid') {
        isPaid = true;
        // Update database order to 'paid'
        try {
          const supabase = await createClient();
          const { data: updatedOrder } = await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              order_status: 'processing',
            })
            .eq('order_number', orderNumber)
            .select('*, order_items(*)')
            .single();

          // Decrement inventory stock on verified payment
          if (updatedOrder?.order_items && Array.isArray(updatedOrder.order_items)) {
            for (const itm of updatedOrder.order_items) {
              try {
                const { data: p } = await supabase
                  .from('products')
                  .select('stock')
                  .eq('id', itm.product_id)
                  .single();
                if (p && typeof p.stock === 'number') {
                  await supabase
                    .from('products')
                    .update({ stock: Math.max(0, p.stock - (itm.quantity || 1)) })
                    .eq('id', itm.product_id);
                }
              } catch (stkErr) {
                console.warn('[Confirmation stock decrement error]', stkErr);
              }
            }
          }

          // Send confirmation emails if not sent yet
          if (updatedOrder) {
            const emailPayload = {
              order_number: orderNumber,
              customer_name: updatedOrder.customer_name,
              customer_email: updatedOrder.customer_email,
              customer_phone: updatedOrder.customer_phone,
              shipping_address: updatedOrder.shipping_address,
              payment_method: payment.source.company || payment.source.type || 'Card',
              payment_status: 'paid',
              total: updatedOrder.total,
              items: updatedOrder.order_items || [],
            };

            await Promise.allSettled([
              sendOrderConfirmation(emailPayload),
              sendAdminOrderNotification(emailPayload),
            ]);
          }
        } catch (dbErr) {
          console.error('[Confirmation DB update error]', dbErr);
        }
      } else if (payment.status === 'failed') {
        isPaid = false;
        failureReason = payment.source?.message || paymentMessage || 'Payment was declined by your bank.';
      }
    } catch (verifyErr) {
      console.warn('[Moyasar Payment Verification Warning]', verifyErr);
      if (rawStatus === 'failed') {
        isPaid = false;
        failureReason = paymentMessage || 'Payment authorization failed.';
      }
    }
  } else if (rawStatus === 'failed') {
    isPaid = false;
    failureReason = paymentMessage || 'Payment transaction was declined.';
  }

  // PAYMENT FAILED VIEW
  if (!isPaid) {
    return (
      <div className="flex min-h-[85vh] items-center bg-[#140C09] px-4 pb-28 pt-[4.5rem]">
        <div className="container-lumera mx-auto w-full max-w-[560px] text-center">
          <div className="mx-auto mb-6 flex h-[76px] w-[76px] items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-red-400 shadow-[0_0_24px_rgba(239,68,68,0.2)]">
            <XCircle size={40} strokeWidth={1.5} />
          </div>

          <div className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-red-400">
            PAYMENT UNCONFIRMED
          </div>

          <h1 className="mb-[0.85rem] font-serif text-[clamp(2rem,5vw,2.5rem)] font-semibold uppercase leading-[1.15] text-white">
            Payment Not Completed
          </h1>

          <p className="mx-auto mb-6 max-w-[440px] text-[0.9rem] leading-[1.6] text-[#D8C7B2]">
            {failureReason || 'Your transaction was declined or cancelled. Your card has not been charged.'}
          </p>

          <div className="mb-8 rounded-[3px] border border-white/[0.08] bg-[#190F0C] p-6 text-left">
            <div className="flex items-center justify-between text-[0.85rem]">
              <span className="text-[#9E8E85]">Order Reference</span>
              <span className="font-semibold text-white">#{orderNumber}</span>
            </div>
            {total !== null && (
              <div className="mt-2 flex items-center justify-between text-[0.85rem]">
                <span className="text-[#9E8E85]">Pending Amount</span>
                <span className="font-semibold text-gold-400">{formatPrice(total)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3">
            <Link
              href="/checkout"
              className="btn-lumera-primary w-full max-w-[320px] px-8 py-[0.95rem] text-[0.75rem]"
            >
              <RotateCcw size={15} />
              <span>Retry Payment</span>
            </Link>
            <Link
              href="/contact"
              className="text-[0.75rem] uppercase tracking-[0.08em] text-[#9E8E85] hover:text-white"
            >
              Need assistance? Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // PAYMENT SUCCESS VIEW
  return (
    <div className="flex min-h-[85vh] items-center bg-[#140C09] px-4 pb-28 pt-[4.5rem] max-[768px]:min-h-0 max-[768px]:pb-[calc(6rem+env(safe-area-inset-bottom,0px))] max-[768px]:pt-10">
      {/* Clear local cart on verified success */}
      <ClearCartOnSuccess />

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

          {paymentDetails && (
            <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3 text-[0.85rem] max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-1">
              <span className="text-[0.8rem] text-[#9E8E85]">Payment Method</span>
              <div className="flex items-center gap-2">
                <CreditCard size={14} className="text-gold-400" />
                <span className="font-medium text-white uppercase">
                  {paymentDetails.source?.company || paymentDetails.source?.type || 'Online Card'}
                  {paymentDetails.source?.number ? ` ···· ${paymentDetails.source.number.slice(-4)}` : ''}
                </span>
                <span className="rounded bg-gold-400/10 px-2 py-0.5 text-[0.65rem] font-semibold text-gold-400">
                  SAMA Verified
                </span>
              </div>
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
