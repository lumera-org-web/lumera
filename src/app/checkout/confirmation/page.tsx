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
    <div className="order-confirmation-wrapper">
      <div className="container-lumera confirmation-container">
        <div className="confirmation-icon-badge">
          <CheckCircle2 size={40} strokeWidth={1.5} />
        </div>

        <div className="confirmation-tag">ORDER CONFIRMED</div>

        <h1 className="confirmation-title">Thank You For Your Order</h1>

        <p className="confirmation-lead">
          Your luxury parcel is now being prepared with utmost care. A confirmation email with full details has been sent to your address.
        </p>

        {/* Order Details Card */}
        <div className="confirmation-card">
          <div className="confirmation-row">
            <span className="confirmation-row-label">Order Reference</span>
            <span className="confirmation-row-value order-ref">#{orderNumber}</span>
          </div>

          {total !== null && (
            <div className="confirmation-row">
              <span className="confirmation-row-label">Total Amount</span>
              <span className="confirmation-row-value total-val">{formatPrice(total)}</span>
            </div>
          )}

          <div className="confirmation-row delivery-row">
            <span className="confirmation-row-label">Estimated Delivery</span>
            <span className="confirmation-row-value delivery-val">
              Jeddah: 24–48 hours · KSA: 2–3 business days
            </span>
          </div>

          <div className="confirmation-perks">
            <div className="confirmation-perk">
              <Package size={14} color="var(--color-gold-400)" />
              <span>Complimentary signature gift-box packaging</span>
            </div>
            <div className="confirmation-perk">
              <ShieldCheck size={14} color="var(--color-gold-400)" />
              <span>100% Authentic verified luxury guaranteed</span>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link href="/shop" className="btn-lumera-primary confirmation-btn">
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </Link>
          <Link href="/account" className="confirmation-link">
            Track Parcel In Account →
          </Link>
        </div>
      </div>

      <style>{`
        .order-confirmation-wrapper {
          background-color: #140C09;
          min-height: 85vh;
          padding: 4.5rem 1rem 7rem 1rem;
          display: flex;
          align-items: center;
        }

        .confirmation-container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          width: 100%;
        }

        .confirmation-icon-badge {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background-color: rgba(200, 162, 101, 0.12);
          border: 1px solid var(--color-gold-400);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
          color: var(--color-gold-400);
          box-shadow: 0 0 24px rgba(200, 162, 101, 0.2);
        }

        .confirmation-tag {
          font-size: 0.75rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-gold-400);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .confirmation-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 5vw, 2.75rem);
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.85rem;
          line-height: 1.15;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .confirmation-lead {
          color: #D8C7B2;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .confirmation-card {
          background-color: #190F0C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          padding: 1.75rem;
          margin-bottom: 2rem;
          text-align: left;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
        }

        .confirmation-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.85rem;
        }

        .confirmation-row-label {
          color: #9E8E85;
          font-size: 0.8rem;
        }

        .confirmation-row-value {
          font-weight: 600;
          color: #FFFFFF;
        }

        .confirmation-row-value.order-ref {
          color: var(--color-gold-400);
          letter-spacing: 0.05em;
        }

        .confirmation-row-value.total-val {
          color: #FFFFFF;
        }

        .delivery-row {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .delivery-val {
          color: #D8C7B2;
          font-size: 0.8rem;
          font-weight: 400;
        }

        .confirmation-perks {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          margin-top: 1rem;
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #B5A59D;
        }

        .confirmation-perk {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .confirmation-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .confirmation-btn {
          width: 100%;
          max-width: 340px;
          padding: 0.95rem 2rem;
          font-size: 0.75rem;
        }

        .confirmation-link {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-gold-400);
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .confirmation-link:hover {
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .order-confirmation-wrapper {
            padding: 2.5rem 1rem calc(6rem + env(safe-area-inset-bottom, 0px)) 1rem;
            min-height: auto;
          }

          .confirmation-card {
            padding: 1.25rem 1rem;
          }

          .confirmation-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .delivery-val {
            text-align: left;
          }

          .confirmation-btn {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
