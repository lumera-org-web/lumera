import { NextRequest, NextResponse } from 'next/server';
import { getPublicClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || searchParams.get('query') || '').trim();

    if (!query || query.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const supabase = getPublicClient();

    // Query active products matching the search query in name or description
    // Limiting to 4 items as requested
    const { data, error } = await supabase
      .from('products')
      .select('id, name, name_ar, slug, price, compare_at_price, images:product_images(image_url, is_primary)')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('price', { ascending: false })
      .limit(4);

    if (error) {
      console.warn('[search API warning]', error.message);
      return NextResponse.json({ products: [] });
    }

    const products = (data || []).map((p: any) => {
      // Find primary image or fall back to first image
      const primaryImg = p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || null;
      return {
        id: p.id,
        name: p.name,
        name_ar: p.name_ar,
        slug: p.slug,
        price: p.price,
        compare_at_price: p.compare_at_price,
        image_url: primaryImg,
      };
    });

    return NextResponse.json({ products });
  } catch (err: any) {
    console.warn('[search API exception]', err?.message || err);
    return NextResponse.json({ products: [] });
  }
}
