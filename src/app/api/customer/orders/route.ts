import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/services/customerAuth';
import { getPublicClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('lumera_customer_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ orders: [] });
    }

    const payload = verifySessionToken(sessionCookie);
    if (!payload || !payload.email) {
      return NextResponse.json({ orders: [] });
    }

    const supabase = getPublicClient();

    // Query orders matching email or user_id
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .or(`customer_email.eq.${payload.email},user_id.eq.${payload.sub}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Customer orders query error]', error);
      // Fallback: try querying solely by customer_email
      const { data: fallbackData } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('customer_email', payload.email)
        .order('created_at', { ascending: false });

      return NextResponse.json({ orders: fallbackData || [] });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (err: any) {
    console.error('[Customer orders error]', err);
    return NextResponse.json({ orders: [] });
  }
}
