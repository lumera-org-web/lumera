'use client';

import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, Send } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { formatPrice } from '@/utils/formatters';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string, order: any) => {
    setUpdatingId(orderId);
    try {
      const supabase = createClient();
      await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      // Trigger Brevo status update email if shipped
      if (newStatus === 'shipped') {
        await fetch('/api/brevo/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'shipping',
            orderNumber: order.order_number,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            courier: order.courier || 'Saudi Post / Aramex',
            trackingNumber: order.tracking_number || `SA-${Date.now().toString().slice(-6)}`,
          }),
        }).catch(() => {});
      }

      await loadOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#FFFFFF', margin: 0 }}>
          Saudi Orders & Fulfillment
        </h1>
        <p style={{ color: '#9E8E85', fontSize: '0.85rem', marginTop: '0.35rem' }}>
          Manage customer orders, update delivery status, and automatically trigger Brevo email notifications.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9E8E85' }}>
          Loading orders from Supabase...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#190F0C', borderRadius: '3px', border: '1px dashed rgba(200, 162, 101, 0.2)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-gold-400)', marginBottom: '0.5rem' }}>
            No Orders Received Yet
          </div>
          <p style={{ color: '#9E8E85', fontSize: '0.85rem' }}>
            When customers place orders via the storefront checkout, they will appear here with Saudi delivery details.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: '#190F0C',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
                padding: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-gold-400)', fontFamily: 'var(--font-serif)' }}>
                      #{order.order_number}
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: '#9E8E85' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#FFFFFF', marginTop: '0.35rem' }}>
                    {order.customer_name} ({order.customer_email} · {order.customer_phone})
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#D8C7B2', marginTop: '0.2rem' }}>
                    📍 {order.shipping_address?.address}, {order.shipping_address?.city || 'Jeddah'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF' }}>
                    {formatPrice(order.total)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', textTransform: 'uppercase', marginTop: '0.2rem' }}>
                    Payment: {order.payment_method} ({order.payment_status})
                  </div>
                </div>
              </div>

              {/* Items */}
              {order.items && order.items.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#9E8E85', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Ordered Products
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {order.items.map((item: any) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#FAF7F2' }}>
                        <span>{item.quantity}x {item.product_name} {item.variant_title ? `(${item.variant_title})` : ''}</span>
                        <span>{formatPrice(item.total_price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update Action Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9E8E85' }}>Current Status:</span>
                  <span style={{ padding: '0.2rem 0.6rem', backgroundColor: '#241611', color: 'var(--color-gold-400)', borderRadius: '2px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {order.order_status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {order.order_status !== 'processing' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'processing', order)}
                      disabled={updatingId === order.id}
                      style={{ padding: '0.4rem 0.85rem', backgroundColor: '#130A08', border: '1px solid rgba(255,255,255,0.1)', color: '#D8C7B2', fontSize: '0.725rem', borderRadius: '2px' }}
                    >
                      Set Processing
                    </button>
                  )}
                  {order.order_status !== 'shipped' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'shipped', order)}
                      disabled={updatingId === order.id}
                      style={{ padding: '0.4rem 0.85rem', backgroundColor: 'rgba(200, 162, 101, 0.15)', border: '1px solid var(--border-gold)', color: 'var(--color-gold-400)', fontSize: '0.725rem', borderRadius: '2px', fontWeight: 600 }}
                    >
                      Mark Shipped (Brevo Email)
                    </button>
                  )}
                  {order.order_status !== 'delivered' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'delivered', order)}
                      disabled={updatingId === order.id}
                      style={{ padding: '0.4rem 0.85rem', backgroundColor: '#130A08', border: '1px solid #3EED8B', color: '#3EED8B', fontSize: '0.725rem', borderRadius: '2px' }}
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
