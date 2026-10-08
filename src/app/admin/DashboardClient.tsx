'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, Image as ImageIcon, Layers, Plus, Sparkles, Check, RefreshCw, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

interface DashboardClientProps {
  initialProductCount: number;
  initialCategoryCount: number;
  initialOrderCount: number;
  initialBannerCount: number;
  recentOrders: any[];
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
  initialProductCount,
  initialCategoryCount,
  initialOrderCount,
  initialBannerCount,
  recentOrders,
}) => {
  const [productCount, setProductCount] = useState(initialProductCount);
  const [categoryCount, setCategoryCount] = useState(initialCategoryCount);
  const [orderCount, setOrderCount] = useState(initialOrderCount);
  const [bannerCount, setBannerCount] = useState(initialBannerCount);

  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [seedError, setSeedError] = useState('');

  const handlePopulateAll = async () => {
    if (!confirm('This will populate all default brands, categories, hero banners, and reference products (Lattafa, YSL, Dior, Amouage, Medicube, etc.) into Supabase. Proceed?')) return;

    setSeeding(true);
    setSeedError('');
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to populate data');

      setProductCount(data.stats.products);
      setCategoryCount(data.stats.categories);
      setBannerCount(data.stats.banners);
      setSeedSuccess(true);
    } catch (err: any) {
      setSeedError(err.message || 'Error seeding database');
    } finally {
      setSeeding(false);
    }
  };

  const stats = [
    { label: 'Products in Catalog', value: productCount, icon: Package, href: '/admin/products' },
    { label: 'Active Categories', value: categoryCount, icon: Layers, href: '/admin/categories' },
    { label: 'Saudi Orders', value: orderCount, icon: ShoppingCart, href: '/admin/orders' },
    { label: 'CMS Banners', value: bannerCount, icon: ImageIcon, href: '/admin/banners' },
  ];

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            LUMÉRA Admin & Merchandising
          </h1>
          <p style={{ color: '#9E8E85', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            Connected to Supabase PostgreSQL & Cloudinary CDN (vyrukryf).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handlePopulateAll}
            disabled={seeding}
            style={{
              padding: '0.85rem 1.5rem',
              backgroundColor: 'rgba(200, 162, 101, 0.15)',
              border: '1px solid var(--border-gold)',
              color: 'var(--color-gold-400)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
          >
            {seeding ? (
              <>
                <RefreshCw size={15} className="animate-spin" /> Populating Data...
              </>
            ) : seedSuccess ? (
              <>
                <Check size={15} /> Content Loaded!
              </>
            ) : (
              <>
                <Sparkles size={15} /> 1-Click Populate Storefront Content
              </>
            )}
          </button>

          <Link href="/admin/products" className="btn-lumera-primary">
            <Plus size={16} />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {seedSuccess && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(62, 237, 139, 0.12)', border: '1px solid #3EED8B', color: '#B4F8D3', borderRadius: '3px', marginBottom: '2rem', fontSize: '0.85rem' }}>
          ✓ Successfully populated all default products, categories, hero slides, and editorial banners in Supabase! You can now easily click &quot;Edit&quot; on any item to update prices or photos.
        </div>
      )}

      {seedError && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(214, 69, 41, 0.15)', border: '1px solid #D64529', color: '#FFB2A3', borderRadius: '3px', marginBottom: '2rem', fontSize: '0.85rem' }}>
          {seedError}. (Make sure you have run <code>supabase/schema.sql</code> in your Supabase SQL Editor).
        </div>
      )}

      {/* 1-Click Quick Banner Action */}
      {productCount === 0 && (
        <div
          style={{
            backgroundColor: '#190F0C',
            border: '1px dashed var(--border-gold)',
            borderRadius: '4px',
            padding: '2rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-gold-400)', marginBottom: '0.35rem' }}>
              ⚡ Your Storefront Catalog is Empty
            </div>
            <p style={{ color: '#D8C7B2', fontSize: '0.85rem', margin: 0, maxWidth: '580px', lineHeight: 1.5 }}>
              Click the button to instantly create all reference products (Lattafa Khamrah, YSL Libre, Dior, Medicube, Biodance, etc.) and all homepage sections. Afterwards, all you have to do is edit their prices or upload your photos!
            </p>
          </div>

          <button
            onClick={handlePopulateAll}
            disabled={seeding}
            className="btn-lumera-primary"
            style={{ padding: '0.85rem 1.75rem', fontWeight: 700 }}
          >
            <Sparkles size={16} />
            <span>Populate All Default Data Now</span>
          </button>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              style={{
                backgroundColor: '#190F0C',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.75rem',
                borderRadius: '3px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                transition: 'border-color 0.2s',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E8E85' }}>
                  {stat.label}
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.5rem', fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </div>
              </div>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(200, 162, 101, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold-400)',
                }}
              >
                <Icon size={18} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Fast Navigation Shortcut Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        <div style={{ backgroundColor: '#160E0B', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.75rem', borderRadius: '3px' }}>
          <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>Products & Prices</h3>
          <p style={{ color: '#9E8E85', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Update product names, SAR pricing, compare-at discounts, fragrance notes, and upload Cloudinary photos.
          </p>
          <Link href="/admin/products" className="btn-lumera-link" style={{ fontSize: '0.75rem' }}>
            Open Products Manager →
          </Link>
        </div>

        <div style={{ backgroundColor: '#160E0B', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.75rem', borderRadius: '3px' }}>
          <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>Banners & Editorial Sections</h3>
          <p style={{ color: '#9E8E85', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Update &quot;BEAUTY AFTER DARK&quot; hero slides, the announcement bar, fragrance editorial, and skincare ritual.
          </p>
          <Link href="/admin/banners" className="btn-lumera-link" style={{ fontSize: '0.75rem' }}>
            Open Banners Manager →
          </Link>
        </div>

        <div style={{ backgroundColor: '#160E0B', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.75rem', borderRadius: '3px' }}>
          <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>Orders & Deliveries</h3>
          <p style={{ color: '#9E8E85', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            View Saudi customer orders, tracking IDs, update dispatch status, and send Brevo shipping emails.
          </p>
          <Link href="/admin/orders" className="btn-lumera-link" style={{ fontSize: '0.75rem' }}>
            Open Orders Manager →
          </Link>
        </div>

        <div style={{ backgroundColor: '#160E0B', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.75rem', borderRadius: '3px' }}>
          <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>Categories & Families</h3>
          <p style={{ color: '#9E8E85', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Manage departments (Fragrance, Makeup, Skincare) and arched subcategories (Arabian, Floral, Lips).
          </p>
          <Link href="/admin/categories" className="btn-lumera-link" style={{ fontSize: '0.75rem' }}>
            Open Categories Manager →
          </Link>
        </div>

        <div style={{ backgroundColor: '#160E0B', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.75rem', borderRadius: '3px' }}>
          <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>Storefront Settings</h3>
          <p style={{ color: '#9E8E85', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Configure announcement bar ribbons, free Saudi delivery thresholds, and WhatsApp concierge.
          </p>
          <Link href="/admin/settings" className="btn-lumera-link" style={{ fontSize: '0.75rem' }}>
            Open Store Settings →
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div
        style={{
          backgroundColor: '#190F0C',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '3px',
          padding: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#FFFFFF', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Recent Customer Orders
          </h2>
          <Link href="/admin/orders" style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)' }}>
            View All Orders →
          </Link>
        </div>

        {!recentOrders || recentOrders.length === 0 ? (
          <p style={{ color: '#9E8E85', fontSize: '0.85rem', margin: 0 }}>
            No customer orders placed yet. Orders created via checkout will be listed here.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentOrders.map((ord: any) => (
              <div
                key={ord.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#130A08',
                  borderRadius: '2px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gold-400)' }}>
                    #{ord.order_number}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9E8E85' }}>
                    {ord.customer_name} · {ord.shipping_address?.city || 'Saudi Arabia'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                    {formatPrice(ord.total)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#3EED8B', textTransform: 'uppercase' }}>
                    {ord.order_status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
