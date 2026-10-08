import { NextRequest, NextResponse } from 'next/server';
import { sendShippingEmail } from '@/services/brevo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, orderNumber, customerName, customerEmail, courier, trackingNumber } = body;

    if (type === 'shipping') {
      await sendShippingEmail({
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        courier,
        tracking_number: trackingNumber,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Brevo notification route error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
