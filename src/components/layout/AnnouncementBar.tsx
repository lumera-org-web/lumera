'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';
import { Banner } from '@/types';

interface AnnouncementBarProps {
  banners?: Banner[];
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ banners = [] }) => {
  const { locale, toggleLocale, t } = useLocale();

  // If dynamic announcement banner exists in Supabase, use it
  const announcementBanner = banners.find((b) => b.section_type === 'announcement');
  const mainText =
    locale === 'ar'
      ? announcementBanner?.title_ar || announcementBanner?.title || t('announcement.shipping')
      : announcementBanner?.title || t('announcement.shipping');

  return (
    <div
      style={{
        backgroundColor: '#0D0705',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        fontSize: '0.675rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#D8C7B2',
        padding: '0.45rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 40,
      }}
    >
      <div className="container-lumera" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 0.5rem' }}>
        {/* Left / Center Announcement messages */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', overflow: 'hidden' }}>
          <span style={{ whiteSpace: 'nowrap', fontWeight: 500, color: '#FFFFFF' }}>{mainText}</span>
          <span style={{ opacity: 0.35, display: 'none' }} className="d-md-inline">|</span>
          <span style={{ display: 'none', color: '#DEC197' }} className="d-md-inline">
            {t('announcement.authentic')}
          </span>
          <span style={{ opacity: 0.35, display: 'none' }} className="d-md-inline">|</span>
          <span style={{ display: 'none' }} className="d-md-inline">
            {t('announcement.returns')}
          </span>
        </div>

        {/* Right Country & Locale Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#DEC197' }}>
            <span style={{ fontSize: '0.85rem' }}>🇸🇦</span>
            <span style={{ fontSize: '0.625rem', letterSpacing: '0.1em' }}>{t('market.saudi')}</span>
          </span>
          <span style={{ opacity: 0.35 }}>·</span>
          <button
            onClick={toggleLocale}
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: '#FFFFFF',
              background: 'transparent',
              padding: '0.15rem 0.35rem',
              borderRadius: '2px',
              border: '1px solid rgba(200, 162, 101, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Toggle Arabic / English"
          >
            {locale === 'en' ? 'عربي' : 'EN'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 860px) {
          .d-md-inline {
            display: inline !important;
          }
        }
      `}</style>
    </div>
  );
};
