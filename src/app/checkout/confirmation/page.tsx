import React from 'react';
import Link from 'next/link';
import { CheckCircle2, PackageCheck, Mail, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

interface ConfirmationPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrderConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const search = await searchParams;
  const orderNumber = (search.order as string) || 'LUM-884219';
  const total = search.total ? Number(search.total) : null;

  return (
    <div style={{ backgroundColor: '#140C09', minHeight: '85vh', padding: '5rem 0 8rem 0' }}>
      <div className="container-lumera" style={{ maxWidth: '640px', textAlign: 'center' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(200, 162, 101, 0.15)',
            border: '1px solid var(--color-gold-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem auto',
            color: 'var(--color-gold-400)',
          }}
        >
          <CheckCircle2 size={42} strokeWidth={1.5} />
        </div>

        <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-400)', marginBottom: '0.5rem', fontWeight: 600 }}>
          ORDER CONFIRMED
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            color: '#FFFFFF',
            marginBottom: '1rem',
          }}
        >
          Thank You For Your Order
        </h1>

        <p style={{ color: '#D8C7B2', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Your luxury parcel is now being prepared with utmost care. A confirmation email with full details has been sent to your address.
        </p>

        <div
          style={{
            backgroundColor: '#190F0C',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '3px',
            padding: '1.75rem',
            marginBottom: '2.5rem',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9E8E85' }}>Order Reference</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gold-400)' }}>
              #{orderNumber}
            </span>
          </div>

          {total !== null && (
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#9E8E85' }}>Total Amount</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                {formatPrice(total)}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#9E8E85' }}>Estimated Delivery</span>
            <span style={{ fontSize: '0.85rem', color: '#D8C7B2' }}>
              Jeddah: 24–48 hours · KSA: 2–3 business days
            </span>
          </div>
        </div>

        <Link href="/shop" className="btn-lumera-primary" style={{ padding: '1rem 2.5rem' }}>
          <span>Continue Shopping</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
