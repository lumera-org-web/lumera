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
    <div className="lumera-announcement-bar">
      <div className="container-lumera announcement-inner">
        {/* Left / Center Announcement messages */}
        <div className="announcement-content">
          <span className="announcement-main-text">{mainText}</span>
          <span className="announcement-divider d-md-inline">|</span>
          <span className="announcement-sub-text d-md-inline">
            {t('announcement.authentic')}
          </span>
          <span className="announcement-divider d-md-inline">|</span>
          <span className="announcement-sub-text d-md-inline">
            {t('announcement.returns')}
          </span>
        </div>

        {/* Right Country & Locale Selector */}
        <div className="announcement-actions">
          <span className="announcement-country">
            <span className="country-flag">🇸🇦</span>
            <span className="country-text-desktop">{t('market.saudi')}</span>
            <span className="country-text-mobile">{locale === 'ar' ? 'ر.س' : 'SAR'}</span>
          </span>
          <span className="action-dot">·</span>
          <button
            onClick={toggleLocale}
            className="locale-toggle-btn"
            title="Toggle Arabic / English"
            type="button"
          >
            {locale === 'en' ? 'عربي' : 'EN'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .lumera-announcement-bar {
          background-color: #0D0705;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          font-size: 0.675rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #D8C7B2;
          padding: 0.45rem 0;
          position: relative;
          z-index: 40;
          width: 100%;
        }

        .announcement-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 0.75rem;
        }

        .announcement-content {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
        }

        .announcement-main-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
          color: #FFFFFF;
          display: block;
        }

        .announcement-divider {
          opacity: 0.35;
          display: none;
        }

        .announcement-sub-text {
          display: none;
          color: #DEC197;
          white-space: nowrap;
        }

        .announcement-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }

        .announcement-country {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #DEC197;
          white-space: nowrap;
        }

        .country-flag {
          font-size: 0.85rem;
          line-height: 1;
        }

        .country-text-desktop {
          display: inline;
          font-size: 0.625rem;
          letter-spacing: 0.1em;
        }

        .country-text-mobile {
          display: none;
          font-size: 0.625rem;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .action-dot {
          opacity: 0.35;
        }

        .locale-toggle-btn {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #FFFFFF;
          background: transparent;
          padding: 0.15rem 0.35rem;
          border-radius: 2px;
          border: 1px solid rgba(200, 162, 101, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .locale-toggle-btn:hover {
          border-color: var(--color-gold-400);
          color: var(--color-gold-400);
        }

        @media (min-width: 860px) {
          .d-md-inline {
            display: inline !important;
          }
        }

        @media (max-width: 768px) {
          .country-text-desktop {
            display: none !important;
          }
          .country-text-mobile {
            display: inline !important;
          }
          .announcement-inner {
            gap: 0.5rem;
          }
          .announcement-main-text {
            font-size: 0.63rem;
            letter-spacing: 0.08em;
          }
        }
      `}</style>
    </div>
  );
};
