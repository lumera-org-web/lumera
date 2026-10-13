'use client';

import React, { useState } from 'react';
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
    <div className="min-h-[85vh] bg-[#140C09] py-12 pb-24 max-[768px]:pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] max-[768px]:pt-6">
      <div className="container-lumera mx-auto max-w-[840px]">
        <div className="mb-8">
          <h1 className="mb-2 font-serif text-[clamp(1.85rem,4vw,2.5rem)] uppercase tracking-[0.04em] text-white">
            Customer Care & Order Tracking
          </h1>
          <p className="text-[0.9rem] leading-[1.5] text-[#9E8E85]">
            Track your parcel dispatch across Jeddah and Saudi Arabia or manage your orders.
          </p>
        </div>

        {/* Order Lookup Card */}
        <div className="mb-10 rounded-[3px] border border-white/[0.08] bg-[#190F0C] p-9 max-[768px]:p-[1.25rem_1rem]">
          <h2 className="mb-3 text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-gold-400">
            Track Your Order
          </h2>
          <p className="mb-5 text-[0.85rem] leading-[1.5] text-[#D8C7B2]">
            Enter your order reference code (e.g. LUM-884219) received in your confirmation email or SMS.
          </p>

          <form onSubmit={handleTrackOrder} className="flex w-full gap-3 max-[768px]:flex-col">
            <input
              type="text"
              required
              placeholder="e.g. LUM-884219"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="flex-1 rounded-[2px] border border-white/[0.12] bg-[#130A08] px-4 py-[0.85rem] text-[0.85rem] text-white outline-none transition-colors focus:border-gold-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-lumera-primary whitespace-nowrap px-7 py-[0.85rem] text-[0.75rem] font-bold max-[768px]:w-full"
            >
              {loading ? 'Searching...' : 'Track Parcel'}
            </button>
          </form>

          {notFound && (
            <div className="mt-5 rounded-[2px] border border-[#D64529] bg-[#D64529]/10 p-[0.9rem_1rem] text-[0.85rem] text-[#FFB2A3]">
              No order found matching &quot;{orderQuery}&quot;. Please verify the order reference code.
            </div>
          )}

          {searchedOrder && (
            <div className="mt-7 rounded-[2px] border border-gold-400/30 bg-[#150D0A] p-6 max-[768px]:p-4">
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <span className="text-[0.72rem] uppercase text-[#9E8E85]">Order Reference</span>
                  <h3 className="m-0 font-serif text-[1.15rem] tracking-[0.05em] text-gold-400">
                    #{searchedOrder.order_number}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[0.72rem] uppercase text-[#9E8E85]">Status</span>
                  <div className="text-[0.85rem] font-semibold uppercase text-[#3EED8B]">
                    {searchedOrder.order_status}
                  </div>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 text-[0.82rem] text-[#D8C7B2] max-[768px]:grid-cols-2">
                <div>
                  <span className="mr-[0.35rem] text-[#9E8E85]">Customer:</span>
                  <span className="text-white">{searchedOrder.customer_name}</span>
                </div>
                <div>
                  <span className="mr-[0.35rem] text-[#9E8E85]">City:</span>
                  <span className="text-white">{searchedOrder.shipping_address?.city || 'Jeddah'}</span>
                </div>
                <div>
                  <span className="mr-[0.35rem] text-[#9E8E85]">Total:</span>
                  <span className="font-semibold text-gold-400">
                    {formatPrice(searchedOrder.total)}
                  </span>
                </div>
                <div>
                  <span className="mr-[0.35rem] text-[#9E8E85]">Payment:</span>
                  <span className="uppercase text-white">
                    {searchedOrder.payment_status}
                  </span>
                </div>
              </div>

              {searchedOrder.items && searchedOrder.items.length > 0 && (
                <div className="border-t border-white/[0.06] pt-[0.85rem]">
                  <h4 className="mb-2 text-[0.72rem] uppercase tracking-[0.1em] text-[#9E8E85]">
                    Items Ordered ({searchedOrder.items.length})
                  </h4>
                  {searchedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between gap-4 py-[0.35rem] text-[0.8rem] text-white">
                      <span className="truncate">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="shrink-0 font-semibold">
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
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5 max-[768px]:grid-cols-1">
          <div className="rounded-[3px] border border-white/[0.06] bg-[#190F0C] p-6">
            <h3 className="mb-[0.4rem] text-[0.9rem] font-semibold text-white">Jeddah Concierge</h3>
            <p className="mb-[0.85rem] text-[0.8rem] leading-[1.5] text-[#9E8E85]">
              Personal beauty consultations and urgent same-day delivery coordination in Jeddah.
            </p>
            <span className="text-[0.75rem] font-semibold text-gold-400">concierge@lumera.sa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
