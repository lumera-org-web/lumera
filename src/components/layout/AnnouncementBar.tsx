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
      className="lumera-announcement-bar"
      style={{
        backgroundColor: '#0D0705',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        height: '38px',
        maxHeight: '38px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        zIndex: 40,
      }}
    >
      <div
        className="container-lumera announcement-inner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          gap: '0.75rem',
        }}
      >
        {/* Main Announcement message */}
        <div
          className="announcement-content"
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: '1 1 auto',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <span
            className="announcement-main-text"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 500,
              color: '#FFFFFF',
              display: 'block',
              fontSize: '0.675rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {mainText}
          </span>
        </div>

        {/* Right Country & Locale Selector */}
        <div
          className="announcement-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexShrink: 0,
            fontSize: '0.675rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#D8C7B2',
          }}
        >
          <span
            className="announcement-country"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#DEC197',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>🇸🇦</span>
            <span
              className="d-none d-md-inline"
              style={{ display: 'none', fontSize: '0.625rem', letterSpacing: '0.1em' }}
            >
              {t('market.saudi')}
            </span>
            <span
              className="d-inline d-md-none"
              style={{ fontSize: '0.625rem', letterSpacing: '0.1em', fontWeight: 600 }}
            >
              {locale === 'ar' ? 'ر.س' : 'SAR'}
            </span>
          </span>
          <span style={{ opacity: 0.35 }}>·</span>
          <button
            onClick={toggleLocale}
            className="locale-toggle-btn"
            title="Toggle Arabic / English"
            type="button"
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
              whiteSpace: 'nowrap',
            }}
          >
            {locale === 'en' ? 'عربي' : 'EN'}
          </button>
        </div>
      </div>
    </div>
  );
};
