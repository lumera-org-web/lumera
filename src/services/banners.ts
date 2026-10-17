import { getPublicClient } from '@/utils/supabase/server';
import { Banner } from '@/types';

const FALLBACK_ANNOUNCEMENT: Banner = {
  id: 'announcement-fallback',
  section_type: 'announcement',
  title: 'COMPLIMENTARY SAUDI DELIVERY',
  title_ar: 'توصيل مجاني داخل المملكة العربية السعودية',
  subtitle: 'AUTHENTIC PRODUCTS',
  subtitle_ar: null,
  description: 'EASY RETURNS',
  description_ar: 'إرجاع سهل ومضمون',
  cta_text: null,
  cta_text_ar: null,
  cta_link: null,
  image_url: null,
  mobile_image_url: null,
  cloudinary_public_id: null,
  display_order: 1,
  is_active: true,
  created_at: new Date().toISOString(),
};

export async function getBanners(sectionType?: string): Promise<Banner[]> {
  try {
    const supabase = getPublicClient();
    let query = supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (sectionType) {
      query = query.eq('section_type', sectionType);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[getBanners warning]', error?.message || error?.details || error);
      return sectionType === 'announcement' ? [FALLBACK_ANNOUNCEMENT] : [];
    }

    const results = (data as Banner[]) || [];
    if (results.length === 0 && sectionType === 'announcement') {
      return [FALLBACK_ANNOUNCEMENT];
    }
    return results;
  } catch (err: any) {
    console.warn('[getBanners exception]', err?.message || err);
    return sectionType === 'announcement' ? [FALLBACK_ANNOUNCEMENT] : [];
  }
}

export async function getHeroBanners(): Promise<Banner[]> {
  return getBanners('hero');
}

export async function getAnnouncementBanners(): Promise<Banner[]> {
  return getBanners('announcement');
}
