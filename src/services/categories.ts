import { getPublicClient } from '@/utils/supabase/server';
import { Category } from '@/types';

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('[getCategories warning]', error?.message || error?.details || error);
      return [];
    }

    return (data as Category[]) || [];
  } catch (err: any) {
    console.warn('[getCategories exception]', err?.message || err);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Category;
  } catch {
    return null;
  }
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) return [];
    return (data as Category[]) || [];
  } catch {
    return [];
  }
}
