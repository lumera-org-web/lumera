'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Layers, Image as ImageIcon, ShoppingCart, ExternalLink, Lock, KeyRound, LogOut, Sliders } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('lumera_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid password');
      }

      sessionStorage.setItem('lumera_admin_auth', 'true');
      setIsAuthenticated(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Access Denied');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lumera_admin_auth');
    setIsAuthenticated(false);
  };

  // Checking session
  if (isAuthenticated === null) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0D0705', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D8C7B2' }}>
        Verifying Security Credentials...
      </div>
    );
  }

  // Not Authenticated -> Show Luxury Password Gate
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0D0705',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: '#140C09',
            border: '1px solid var(--border-gold)',
            borderRadius: '4px',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <Logo width={170} height={68} href="#" />
          </div>

          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(200, 162, 101, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: 'var(--color-gold-400)',
            }}
          >
            <Lock size={22} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              color: '#FFFFFF',
              marginBottom: '0.4rem',
            }}
          >
            Admin & CMS Portal
          </h2>
          <p style={{ color: '#9E8E85', fontSize: '0.8rem', marginBottom: '2rem' }}>
            Enter your master password to manage Supabase products, Cloudinary assets, and Saudi orders.
          </p>

          {errorMsg && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(214, 69, 41, 0.15)',
                border: '1px solid #D64529',
                color: '#FFB2A3',
                fontSize: '0.8rem',
                borderRadius: '2px',
                marginBottom: '1.5rem',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="Enter Admin Password (e.g. lumera2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  backgroundColor: '#190F0C',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  borderRadius: '2px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  textAlign: 'center',
                  letterSpacing: '0.1em',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-lumera-primary"
              style={{ padding: '0.95rem', width: '100%', fontWeight: 700 }}
            >
              {loading ? 'Verifying...' : 'Unlock Portal'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
            <Link href="/" style={{ fontSize: '0.75rem', color: '#9E8E85' }}>
              ← Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const links = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Banners & CMS', href: '/admin/banners', icon: ImageIcon },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Store Settings', href: '/admin/settings', icon: Sliders },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0D0705', color: '#FAF7F2' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#140C09',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
        className="admin-sidebar"
      >
        <div style={{ marginBottom: '2.5rem' }}>
          <Logo width={150} height={60} href="/admin" />
          <div
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-400)',
              marginTop: '0.65rem',
              fontWeight: 600,
            }}
          >
            ADMIN & CMS PORTAL
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {links.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '2px',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: active ? 'var(--color-espresso-950)' : '#D8C7B2',
                  backgroundColor: active ? 'var(--color-gold-400)' : 'transparent',
                  fontWeight: active ? 700 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.75rem',
              color: '#9E8E85',
              transition: 'color 0.2s',
            }}
          >
            <ExternalLink size={15} />
            <span>View Public Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.75rem',
              color: '#E05A47',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <LogOut size={15} />
            <span>Lock Admin Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' }}>
        {children}
      </main>

      <style jsx>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 70px !important;
            padding: 1.5rem 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
