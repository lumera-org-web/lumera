import { getPublicClient } from '@/utils/supabase/server';
import { Banner } from '@/types';

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
      console.error('[getBanners error]', error);
      return [];
    }

    return (data as Banner[]) || [];
  } catch (err) {
    console.error('[getBanners exception]', err);
    return [];
  }
}

export async function getHeroBanners(): Promise<Banner[]> {
  return getBanners('hero');
}

export async function getAnnouncementBanners(): Promise<Banner[]> {
  return getBanners('announcement');
}
