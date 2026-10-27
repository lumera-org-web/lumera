'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Layers, Image as ImageIcon, ShoppingCart, ExternalLink, Lock, LogOut, Sliders } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

import { AdminConfirmProvider, useAdminConfirm } from '@/components/admin/ConfirmModal';
import { AdminToastProvider } from '@/components/admin/AdminToast';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { confirm } = useAdminConfirm();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth')
      .then((res) => {
        if (res.ok) {
          sessionStorage.setItem('lumera_admin_auth', 'true');
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('lumera_admin_auth');
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
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

  const handleLogoutClick = () => {
    confirm({
      title: 'Sign Out of Admin Portal',
      message: 'Are you sure you want to sign out and lock the admin panel? You will need your admin password to log in again.',
      confirmText: 'Sign Out',
      cancelText: 'Stay Logged In',
      variant: 'danger',
      iconType: 'logout',
      onConfirm: async () => {
        try {
          await fetch('/api/admin/auth', { method: 'DELETE' });
        } catch {}
        sessionStorage.removeItem('lumera_admin_auth');
        setIsAuthenticated(false);
      },
    });
  };

  // Checking session
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D0705] text-[#D8C7B2]">
        Verifying Security Credentials...
      </div>
    );
  }

  // Not Authenticated -> Show Luxury Password Gate
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D0705] p-8">
        <div className="w-full max-w-[440px] rounded border border-gold-400/30 bg-[#140C09] p-10 text-center shadow-[0_20px_40px_rgba(0,0,0,0.7)] max-[768px]:p-6">
          <div className="mb-6 flex justify-center">
            <Logo width={170} height={68} href="#" />
          </div>

          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
            <Lock size={22} />
          </div>

          <h2 className="mb-[0.4rem] font-serif text-[1.5rem] text-white">
            Admin & CMS Portal
          </h2>
          <p className="mb-8 text-[0.8rem] text-[#9E8E85]">
            Enter your master password to manage Supabase products, Cloudinary assets, and Saudi orders.
          </p>

          {errorMsg && (
            <div className="mb-6 rounded-[2px] border border-[#D64529] bg-[#D64529]/15 p-3 text-[0.8rem] text-[#FFB2A3]">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input
              type="password"
              required
              placeholder="Enter Admin Password (e.g. lumera2026)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full rounded-[2px] border border-white/[0.12] bg-[#190F0C] p-[0.9rem_1rem] text-center text-[0.9rem] tracking-[0.1em] text-white outline-none focus:border-gold-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-lumera-primary w-full p-[0.95rem] font-bold"
            >
              {loading ? 'Verifying...' : 'Unlock Portal'}
            </button>
          </form>

          <div className="mt-8 border-t border-white/[0.08] pt-6">
            <Link href="/" className="text-[0.75rem] text-[#9E8E85] transition-colors hover:text-white">
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
    <div className="flex h-screen overflow-hidden bg-[#0D0705] text-[#FAF7F2]">
      {/* Sidebar */}
      <aside className="flex h-screen w-[260px] shrink-0 flex-col overflow-y-auto border-r border-white/[0.08] bg-[#140C09] p-8 max-[768px]:w-[70px] max-[768px]:p-[1.5rem_0.5rem]">
        <div className="mb-10 max-[768px]:hidden">
          <Logo width={150} height={60} href="/admin" />
          <div className="mt-[0.65rem] text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
            ADMIN & CMS PORTAL
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-[2px] p-[0.75rem_1rem] text-[0.8rem] uppercase tracking-[0.08em] transition-all duration-150 max-[768px]:justify-center max-[768px]:px-2 ${
                  active
                    ? 'bg-gold-400 font-bold text-espresso-950'
                    : 'bg-transparent font-medium text-[#D8C7B2] hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="max-[768px]:hidden">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-[0.85rem] border-t border-white/[0.08] pt-6 max-[768px]:items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-[0.75rem] text-[#9E8E85] transition-colors hover:text-white"
          >
            <ExternalLink size={15} />
            <span className="max-[768px]:hidden">View Public Storefront</span>
          </Link>

          <button
            onClick={handleLogoutClick}
            className="flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-[0.75rem] text-[#E05A47] transition-opacity hover:opacity-80"
          >
            <LogOut size={15} />
            <span className="max-[768px]:hidden">Lock Admin Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="h-screen min-w-0 flex-1 overflow-y-auto p-10 max-[768px]:p-6">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminConfirmProvider>
      <AdminToastProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </AdminToastProvider>
    </AdminConfirmProvider>
  );
}
