'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Search, Clock, CheckCircle2, Truck, ArrowRight, User } from 'lucide-react';
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
    <div style={{ backgroundColor: '#140C09', minHeight: '85vh', padding: '3rem 0 6rem 0' }}>
      <div className="container-lumera" style={{ maxWidth: '840px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.25rem',
              color: '#FFFFFF',
              marginBottom: '0.5rem',
            }}
          >
            Customer Care & Order Tracking
          </h1>
          <p style={{ color: '#9E8E85', fontSize: '0.9rem' }}>
            Track your parcel dispatch across Jeddah and Saudi Arabia or manage your orders.
          </p>
        </div>

        {/* Order Lookup Card */}
        <div
          style={{
            padding: '2.5rem',
            backgroundColor: '#190F0C',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '3px',
            marginBottom: '3rem',
          }}
        >
          <h2 style={{ fontSize: '1rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold-400)', marginBottom: '1rem', fontWeight: 600 }}>
            Track Your Order
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#D8C7B2', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Enter your order reference code (e.g. LUM-123456) received in your confirmation email or SMS.
          </p>

          <form onSubmit={handleTrackOrder} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              required
              placeholder="e.g. LUM-884219"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '0.85rem 1rem',
                backgroundColor: '#130A08',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                borderRadius: '2px',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-lumera-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.75rem' }}
            >
              {loading ? 'Searching...' : 'Track Parcel'}
            </button>
          </form>

          {notFound && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(214, 69, 41, 0.1)', border: '1px solid #D64529', color: '#FFB2A3', borderRadius: '2px', fontSize: '0.85rem' }}>
              No order found matching &quot;{orderQuery}&quot;. Please verify the order reference.
            </div>
          )}

          {searchedOrder && (
            <div
              style={{
                marginTop: '2rem',
                padding: '1.75rem',
                backgroundColor: '#150D0A',
                border: '1px solid var(--border-gold)',
                borderRadius: '2px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#9E8E85' }}>Order</span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-gold-400)' }}>
                    #{searchedOrder.order_number}
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9E8E85' }}>Status</span>
                  <div style={{ color: '#3EED8B', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {searchedOrder.order_status}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.8rem', color: '#D8C7B2', marginBottom: '1.25rem' }}>
                <div>
                  <strong>Customer:</strong> {searchedOrder.customer_name}
                </div>
                <div>
                  <strong>City:</strong> {searchedOrder.shipping_address?.city || 'Jeddah'}
                </div>
                <div>
                  <strong>Total:</strong> {formatPrice(searchedOrder.total)}
                </div>
                <div>
                  <strong>Payment:</strong> {searchedOrder.payment_status}
                </div>
              </div>

              {searchedOrder.items && searchedOrder.items.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E8E85', marginBottom: '0.5rem' }}>
                    Items Ordered
                  </h4>
                  {searchedOrder.items.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#FFFFFF', padding: '0.25rem 0' }}>
                      <span>{item.quantity}x {item.product_name}</span>
                      <span>{formatPrice(item.total_price)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Concierge Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '3px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>Jeddah Concierge</h3>
            <p style={{ fontSize: '0.8rem', color: '#9E8E85', lineHeight: 1.5, marginBottom: '1rem' }}>
              Personal beauty consultations and urgent same-day delivery coordination in Jeddah.
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', fontWeight: 600 }}>concierge@lumera.sa</span>
          </div>

          <div style={{ padding: '1.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '3px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>Admin / CMS Portal</h3>
            <p style={{ fontSize: '0.8rem', color: '#9E8E85', lineHeight: 1.5, marginBottom: '1rem' }}>
              Authorized management of inventory, Cloudinary uploads, banners, and Saudi orders.
            </p>
            <Link href="/admin" className="btn-lumera-link" style={{ fontSize: '0.7rem' }}>
              Open Admin Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
