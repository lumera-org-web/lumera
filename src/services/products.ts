import { getPublicClient } from '@/utils/supabase/server';
import { Product } from '@/types';

export interface ProductFilterOptions {
  categorySlug?: string;
  brandSlug?: string;
  isTrending?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
  limit?: number;
  offset?: number;
}

export async function getProducts(options: ProductFilterOptions = {}): Promise<{
  products: Product[];
  total: number;
}> {
  try {
    const supabase = getPublicClient();

    let query = supabase
      .from('products')
      .select('*, brand:brands(*), category:categories(*), images:product_images(*), variants:product_variants(*)', { count: 'exact' })
      .eq('is_active', true);

    if (options.isTrending) {
      query = query.eq('is_trending', true);
    }
    if (options.isBestseller) {
      query = query.eq('is_bestseller', true);
    }
    if (options.isNew) {
      query = query.eq('is_new', true);
    }
    if (options.isFeatured) {
      query = query.eq('is_featured', true);
    }

    if (options.categorySlug) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', options.categorySlug)
        .single();

      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    if (options.brandSlug) {
      const { data: br } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', options.brandSlug)
        .single();

      if (br) {
        query = query.eq('brand_id', br.id);
      }
    }

    if (options.minPrice !== undefined) {
      query = query.gte('price', options.minPrice);
    }
    if (options.maxPrice !== undefined) {
      query = query.lte('price', options.maxPrice);
    }

    // Sorting
    switch (options.sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    if (options.limit) {
      const from = options.offset || 0;
      const to = from + options.limit - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('[getProducts error]', error);
      return { products: [], total: 0 };
    }

    return {
      products: (data as Product[]) || [],
      total: count || 0,
    };
  } catch (err) {
    console.error('[getProducts exception]', err);
    return { products: [], total: 0 };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, brand:brands(*), category:categories(*), images:product_images(*), variants:product_variants(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    if (data.images && Array.isArray(data.images)) {
      data.images.sort((a: any, b: any) => a.display_order - b.display_order);
    }

    return data as Product;
  } catch (err) {
    console.error('[getProductBySlug exception]', err);
    return null;
  }
}

export async function getTrendingProducts(limit: number = 8): Promise<Product[]> {
  const res = await getProducts({ isTrending: true, limit });
  return res.products;
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  if (!searchTerm || searchTerm.trim().length === 0) return [];
  try {
    const supabase = getPublicClient();
    const cleanTerm = searchTerm.trim();
    const { data, error } = await supabase
      .from('products')
      .select('*, brand:brands(*), category:categories(*), images:product_images(*)')
      .eq('is_active', true)
      .ilike('name', `%${cleanTerm}%`)
      .limit(10);

    if (error) return [];
    return (data as Product[]) || [];
  } catch {
    return [];
  }
}
