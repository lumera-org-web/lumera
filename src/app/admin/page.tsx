import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { DashboardClient } from './DashboardClient';

export const revalidate = 0; // always fresh in admin

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  let productCount = 0;
  let categoryCount = 0;
  let orderCount = 0;
  let bannerCount = 0;
  let recentOrders: any[] = [];

  try {
    const [pRes, cRes, oRes, bRes, ordRes] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('banners').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

    productCount = pRes.count || 0;
    categoryCount = cRes.count || 0;
    orderCount = oRes.count || 0;
    bannerCount = bRes.count || 0;
    recentOrders = ordRes.data || [];
  } catch (err) {
    console.error('[AdminDashboardPage query error]', err);
  }

  return (
    <DashboardClient
      initialProductCount={productCount}
      initialCategoryCount={categoryCount}
      initialOrderCount={orderCount}
      initialBannerCount={bannerCount}
      recentOrders={recentOrders}
    />
  );
}
