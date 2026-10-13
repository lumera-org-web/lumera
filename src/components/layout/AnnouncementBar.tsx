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
    <div className="relative z-40 flex h-[38px] max-h-[38px] w-full items-center overflow-hidden border-b border-white/[0.07] bg-[#0D0705]">
      <div className="container-lumera flex h-full w-full items-center justify-between gap-3">
        {/* Main Announcement message */}
        <div className="flex min-w-0 flex-1 items-center overflow-hidden">
          <span className="block truncate text-[0.675rem] font-medium uppercase tracking-[0.12em] text-white">
            {mainText}
          </span>
        </div>

        {/* Right Country & Locale Selector */}
        <div className="flex shrink-0 items-center gap-[0.65rem] text-[0.675rem] uppercase tracking-[0.12em] text-[#D8C7B2]">
          <span className="inline-flex items-center gap-[0.35rem] whitespace-nowrap text-[#DEC197]">
            <span className="text-[0.85rem] leading-none">🇸🇦</span>
            <span className="hidden text-[0.625rem] tracking-[0.1em] md:inline">
              {t('market.saudi')}
            </span>
            <span className="inline text-[0.625rem] font-semibold tracking-[0.1em] md:hidden">
              {locale === 'ar' ? 'ر.س' : 'SAR'}
            </span>
          </span>
          <span className="opacity-35">·</span>
          <button
            onClick={toggleLocale}
            title="Toggle Arabic / English"
            type="button"
            className="cursor-pointer whitespace-nowrap rounded-[2px] border border-gold-400/30 bg-transparent px-[0.35rem] py-[0.15rem] text-[0.65rem] font-semibold tracking-[0.12em] text-white transition-colors hover:border-gold-400 hover:text-gold-400"
          >
            {locale === 'en' ? 'عربي' : 'EN'}
          </button>
        </div>
      </div>
    </div>
  );
};
