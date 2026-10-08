'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, RefreshCw, Sliders, ShieldCheck, Phone, Mail, MapPin, Truck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Storefront & Announcement Bar
  const [announcementEn, setAnnouncementEn] = useState('COMPLIMENTARY SAUDI DELIVERY');
  const [announcementAr, setAnnouncementAr] = useState('توصيل مجاني داخل المملكة العربية السعودية');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('300');
  const [deliveryTiming, setDeliveryTiming] = useState('Complimentary delivery in Jeddah within 24-48 hours. Express delivery across Saudi Arabia (2-4 business days).');

  // Concierge & Boutique
  const [whatsapp, setWhatsapp] = useState('+966 50 123 4567');
  const [supportEmail, setSupportEmail] = useState('concierge@lumera.sa');
  const [showroomAddress, setShowroomAddress] = useState('Prince Mohammed Bin Abdulaziz St (Tahliya), Al-Rawdah, Jeddah 23432, Saudi Arabia');
  const [instagram, setInstagram] = useState('@lumera.beauty');
  const [tiktok, setTiktok] = useState('@lumera.sa');

  const loadSettings = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('banners')
        .select('*')
        .eq('section_type', 'announcement')
        .single();

      if (data) {
        if (data.title) setAnnouncementEn(data.title);
        if (data.title_ar) setAnnouncementAr(data.title_ar);
      }

      // Check localStorage for other settings
      const saved = localStorage.getItem('lumera_store_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.freeShippingThreshold) setFreeShippingThreshold(parsed.freeShippingThreshold);
        if (parsed.deliveryTiming) setDeliveryTiming(parsed.deliveryTiming);
        if (parsed.whatsapp) setWhatsapp(parsed.whatsapp);
        if (parsed.supportEmail) setSupportEmail(parsed.supportEmail);
        if (parsed.showroomAddress) setShowroomAddress(parsed.showroomAddress);
        if (parsed.instagram) setInstagram(parsed.instagram);
        if (parsed.tiktok) setTiktok(parsed.tiktok);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();

      // Upsert announcement in banners table
      const { data: existing } = await supabase
        .from('banners')
        .select('id')
        .eq('section_type', 'announcement')
        .single();

      if (existing) {
        await supabase
          .from('banners')
          .update({
            title: announcementEn,
            title_ar: announcementAr,
            subtitle: 'AUTHENTIC PRODUCTS',
            description: 'EASY RETURNS',
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('banners').insert({
          section_type: 'announcement',
          title: announcementEn,
          title_ar: announcementAr,
          subtitle: 'AUTHENTIC PRODUCTS',
          description: 'EASY RETURNS',
          display_order: 1,
          is_active: true,
        });
      }

      // Save to localStorage
      localStorage.setItem(
        'lumera_store_settings',
        JSON.stringify({
          freeShippingThreshold,
          deliveryTiming,
          whatsapp,
          supportEmail,
          showroomAddress,
          instagram,
          tiktok,
        })
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(`Error saving settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
          Storefront Settings & Announcements
        </h1>
        <p style={{ color: '#9E8E85', fontSize: '0.85rem', marginTop: '0.35rem' }}>
          Configure live announcement bar ribbons, Saudi shipping rules, and Jeddah concierge contact details.
        </p>
      </div>

      {success && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(62, 237, 139, 0.12)', border: '1px solid #3EED8B', color: '#B4F8D3', borderRadius: '3px', marginBottom: '2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Check size={18} />
          <span>Store settings saved successfully! All storefront updates are now live.</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9E8E85' }}>
          Loading store settings...
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
          {/* Section 1: Announcement Bar */}
          <div style={{ backgroundColor: '#160E0B', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--color-gold-400)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 1.25rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={18} />
              <span>Storefront Announcement Bar</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Announcement Text (English)
                </label>
                <input
                  type="text"
                  value={announcementEn}
                  onChange={(e) => setAnnouncementEn(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Announcement Text (Arabic / بالعربية)
                </label>
                <input
                  type="text"
                  value={announcementAr}
                  onChange={(e) => setAnnouncementAr(e.target.value)}
                  dir="rtl"
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>
                Saudi Free Shipping Minimum (SAR)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                style={{ width: '200px', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Section 2: Concierge & Jeddah Showroom */}
          <div style={{ backgroundColor: '#160E0B', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--color-gold-400)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 1.25rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={18} />
              <span>Customer Concierge & Boutique Location</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>WhatsApp Concierge</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Jeddah Boutique Flagship Address</label>
              <input
                type="text"
                value={showroomAddress}
                onChange={(e) => setShowroomAddress(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Instagram Handle</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>TikTok Handle</label>
                <input
                  type="text"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-lumera-primary"
            style={{ padding: '1rem 2rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.65rem' }}
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save Storefront Settings</span>
          </button>
        </form>
      )}
    </div>
  );
}
