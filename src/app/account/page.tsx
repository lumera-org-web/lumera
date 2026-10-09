'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Search, Clock, CheckCircle2, Truck, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { formatPrice } from '@/utils/formatters';

export default function AccountPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setNotFound(false);
    setSearchedOrder(null);

    try {
      const supabase = createClient();
      const cleanNum = orderQuery.trim().toUpperCase();

      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('order_number', cleanNum)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setSearchedOrder(data);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page-wrapper">
      <div className="container-lumera account-container">
        <div className="account-header">
          <h1 className="account-title">
            Customer Care & Order Tracking
          </h1>
          <p className="account-lead">
            Track your parcel dispatch across Jeddah and Saudi Arabia or manage your orders.
          </p>
        </div>

        {/* Order Lookup Card */}
        <div className="account-track-card">
          <h2 className="account-section-tag">
            Track Your Order
          </h2>
          <p className="account-track-desc">
            Enter your order reference code (e.g. LUM-884219) received in your confirmation email or SMS.
          </p>

          <form onSubmit={handleTrackOrder} className="account-track-form">
            <input
              type="text"
              required
              placeholder="e.g. LUM-884219"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="account-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-lumera-primary account-track-btn"
            >
              {loading ? 'Searching...' : 'Track Parcel'}
            </button>
          </form>

          {notFound && (
            <div className="account-not-found">
              No order found matching &quot;{orderQuery}&quot;. Please verify the order reference code.
            </div>
          )}

          {searchedOrder && (
            <div className="account-order-result">
              <div className="account-order-header-row">
                <div>
                  <span className="account-order-subtext">Order Reference</span>
                  <h3 className="account-order-ref">
                    #{searchedOrder.order_number}
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="account-order-subtext">Status</span>
                  <div className="account-order-status">
                    {searchedOrder.order_status}
                  </div>
                </div>
              </div>

              <div className="account-order-details-grid">
                <div>
                  <span className="account-field-label">Customer:</span>
                  <span className="account-field-val">{searchedOrder.customer_name}</span>
                </div>
                <div>
                  <span className="account-field-label">City:</span>
                  <span className="account-field-val">{searchedOrder.shipping_address?.city || 'Jeddah'}</span>
                </div>
                <div>
                  <span className="account-field-label">Total:</span>
                  <span className="account-field-val" style={{ color: 'var(--color-gold-400)', fontWeight: 600 }}>
                    {formatPrice(searchedOrder.total)}
                  </span>
                </div>
                <div>
                  <span className="account-field-label">Payment:</span>
                  <span className="account-field-val" style={{ textTransform: 'uppercase' }}>
                    {searchedOrder.payment_status}
                  </span>
                </div>
              </div>

              {searchedOrder.items && searchedOrder.items.length > 0 && (
                <div className="account-order-items-list">
                  <h4 className="account-order-items-tag">
                    Items Ordered ({searchedOrder.items.length})
                  </h4>
                  {searchedOrder.items.map((item: any) => (
                    <div key={item.id} className="account-order-item-row">
                      <span className="account-order-item-title">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="account-order-item-price">
                        {formatPrice(item.total_price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Concierge Cards */}
        <div className="account-concierge-grid">
          <div className="account-concierge-card">
            <h3 className="account-concierge-title">Jeddah Concierge</h3>
            <p className="account-concierge-desc">
              Personal beauty consultations and urgent same-day delivery coordination in Jeddah.
            </p>
            <span className="account-concierge-email">concierge@lumera.sa</span>
          </div>

          <div className="account-concierge-card">
            <h3 className="account-concierge-title">Admin / CMS Portal</h3>
            <p className="account-concierge-desc">
              Authorized management of inventory, Cloudinary uploads, banners, and Saudi orders.
            </p>
            <Link href="/admin" className="account-concierge-link">
              Open Admin Portal →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .account-page-wrapper {
          background-color: #140C09;
          min-height: 85vh;
          padding: 3rem 0 6rem 0;
        }

        .account-container {
          max-width: 840px;
        }

        .account-header {
          margin-bottom: 2rem;
        }

        .account-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.85rem, 4vw, 2.5rem);
          color: #FFFFFF;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .account-lead {
          color: #9E8E85;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .account-track-card {
          padding: 2.25rem;
          background-color: #190F0C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          margin-bottom: 2.5rem;
        }

        .account-section-tag {
          font-size: 0.85rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-gold-400);
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .account-track-desc {
          font-size: 0.85rem;
          color: #D8C7B2;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }

        .account-track-form {
          display: flex;
          gap: 0.75rem;
          width: 100%;
        }

        .account-input {
          flex: 1;
          padding: 0.85rem 1rem;
          background-color: #130A08;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          border-radius: 2px;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .account-input:focus {
          border-color: var(--color-gold-400);
        }

        .account-track-btn {
          padding: 0.85rem 1.75rem;
          font-size: 0.75rem;
          white-space: nowrap;
          font-weight: 700;
        }

        .account-not-found {
          margin-top: 1.25rem;
          padding: 0.9rem 1rem;
          background-color: rgba(214, 69, 41, 0.1);
          border: 1px solid #D64529;
          color: #FFB2A3;
          border-radius: 2px;
          font-size: 0.85rem;
        }

        .account-order-result {
          margin-top: 1.75rem;
          padding: 1.5rem;
          background-color: #150D0A;
          border: 1px solid var(--border-gold);
          border-radius: 2px;
        }

        .account-order-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0.75rem;
        }

        .account-order-subtext {
          font-size: 0.72rem;
          color: #9E8E85;
          text-transform: uppercase;
        }

        .account-order-ref {
          margin: 0;
          font-size: 1.15rem;
          color: var(--color-gold-400);
          letter-spacing: 0.05em;
        }

        .account-order-status {
          color: #3EED8B;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .account-order-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.75rem;
          font-size: 0.82rem;
          color: #D8C7B2;
          margin-bottom: 1.25rem;
        }

        .account-field-label {
          color: #9E8E85;
          margin-right: 0.35rem;
        }

        .account-field-val {
          color: #FFFFFF;
        }

        .account-order-items-list {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 0.85rem;
        }

        .account-order-items-tag {
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9E8E85;
          margin-bottom: 0.5rem;
        }

        .account-order-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #FFFFFF;
          padding: 0.35rem 0;
          gap: 1rem;
        }

        .account-order-item-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .account-order-item-price {
          font-weight: 600;
          flex-shrink: 0;
        }

        .account-concierge-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .account-concierge-card {
          padding: 1.5rem;
          background-color: #190F0C;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 3px;
        }

        .account-concierge-title {
          font-size: 0.9rem;
          color: #FFFFFF;
          margin-bottom: 0.4rem;
        }

        .account-concierge-desc {
          font-size: 0.8rem;
          color: #9E8E85;
          line-height: 1.5;
          margin-bottom: 0.85rem;
        }

        .account-concierge-email {
          font-size: 0.75rem;
          color: var(--color-gold-400);
          font-weight: 600;
        }

        .account-concierge-link {
          font-size: 0.75rem;
          color: var(--color-gold-400);
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .account-page-wrapper {
            padding: 1.5rem 0 calc(6.5rem + env(safe-area-inset-bottom, 0px)) 0;
          }

          .account-track-card {
            padding: 1.25rem 1rem;
          }

          .account-track-form {
            flex-direction: column;
          }

          .account-track-btn {
            width: 100%;
          }

          .account-order-result {
            padding: 1rem;
          }

          .account-order-details-grid {
            grid-template-columns: 1fr 1fr;
          }

          .account-concierge-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
