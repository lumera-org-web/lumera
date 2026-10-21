'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CustomerSafeProfile } from '@/services/customerAuth';
import { SaudiAddress } from '@/types';

interface CustomerAuthContextType {
  customer: CustomerSafeProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sendForgotOtp: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  verifyOtpCode: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: {
    name?: string;
    phone?: string;
    shipping_address?: Partial<SaudiAddress>;
  }) => Promise<{ success: boolean; error?: string }>;
  refreshCustomer: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerSafeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentCustomer = useCallback(async () => {
    try {
      const res = await fetch('/api/customer/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer || null);
      } else {
        setCustomer(null);
      }
    } catch {
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentCustomer();
  }, [fetchCurrentCustomer]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed' };
      }
      setCustomer(data.customer);
      return { success: true };
    } catch {
      return { success: false, error: 'Connection error. Please try again.' };
    }
  };

  const signup = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => {
    try {
      const res = await fetch('/api/customer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setCustomer(data.customer);
      return { success: true };
    } catch {
      return { success: false, error: 'Connection error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/customer/logout', { method: 'POST' });
    } finally {
      setCustomer(null);
    }
  };

  const sendForgotOtp = async (email: string) => {
    try {
      const res = await fetch('/api/customer/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to dispatch verification code.' };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: 'Network error. Please verify your connection.' };
    }
  };

  const verifyOtpCode = async (email: string, otp: string) => {
    try {
      const res = await fetch('/api/customer/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid code.' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Verification error.' };
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      const res = await fetch('/api/customer/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update password.' };
      }
      if (data.customer) {
        setCustomer(data.customer);
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  const updateProfile = async (updates: {
    name?: string;
    phone?: string;
    shipping_address?: Partial<SaudiAddress>;
  }) => {
    try {
      const res = await fetch('/api/customer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update profile.' };
      }
      setCustomer(data.customer);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        signup,
        logout,
        sendForgotOtp,
        verifyOtpCode,
        resetPassword,
        updateProfile,
        refreshCustomer: fetchCurrentCustomer,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
