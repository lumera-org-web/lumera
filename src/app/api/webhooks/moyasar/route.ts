import { NextRequest, NextResponse } from 'next/server';
import { getMoyasarPayment } from '@/services/moyasar';
import { createClient } from '@/utils/supabase/server';
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/services/brevo';

/**
 * Moyasar Webhook Listener
 * Reconciles payments asynchronously if a client closes their browser before redirecting.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Extract payment ID from webhook payload
    const paymentId = body?.data?.id || body?.id;
    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID in webhook payload' }, { status: 400 });
    }

    // Verify payment integrity directly with Moyasar REST API
    const verifiedPayment = await getMoyasarPayment(paymentId);
    if (!verifiedPayment || verifiedPayment.status !== 'paid') {
      return NextResponse.json({ message: 'Payment not in paid status, ignored' }, { status: 200 });
    }

    const orderNumber = verifiedPayment.source?.message?.includes('LUM-')
      ? verifiedPayment.source.message
      : (body?.data?.metadata?.order_number || body?.data?.description?.match(/LUM-\d+/)?.[0]);

    const orderId = body?.data?.metadata?.order_id;

    const supabase = await createClient();

    let query = supabase.from('orders').select('*, order_items(*)');
    if (orderId) {
      query = query.eq('id', orderId);
    } else if (orderNumber) {
      query = query.eq('order_number', orderNumber);
    } else {
      return NextResponse.json({ message: 'No matching order found for payment' }, { status: 200 });
    }

    const { data: order } = await query.single();

    if (!order) {
      return NextResponse.json({ message: 'Order record not found' }, { status: 200 });
    }

    // If order was already marked paid, do not duplicate actions
    if (order.payment_status === 'paid') {
      return NextResponse.json({ message: 'Order already marked as paid' }, { status: 200 });
    }

    // Update order status
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        order_status: 'processing',
      })
      .eq('id', order.id);

    // Decrement inventory stock
    if (order.order_items && Array.isArray(order.order_items)) {
      for (const item of order.order_items) {
        try {
          const { data: prod } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();

          if (prod && typeof prod.stock === 'number') {
            await supabase
              .from('products')
              .update({ stock: Math.max(0, prod.stock - (item.quantity || 1)) })
              .eq('id', item.product_id);
          }
        } catch (stkErr) {
          console.warn('[Webhook stock decrement error]', stkErr);
        }
      }
    }

    // Dispatch confirmation emails
    try {
      const emailPayload = {
        order_number: order.order_number,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        shipping_address: order.shipping_address,
        payment_method: verifiedPayment.source?.company || verifiedPayment.source?.type || 'Online Card',
        payment_status: 'paid',
        total: order.total,
        items: order.order_items || [],
      };

      await Promise.allSettled([
        sendOrderConfirmation(emailPayload),
        sendAdminOrderNotification(emailPayload),
      ]);
    } catch (emailErr) {
      console.warn('[Webhook Brevo notification error]', emailErr);
    }

    return NextResponse.json({ success: true, message: 'Order updated and verified via webhook' }, { status: 200 });
  } catch (error: any) {
    console.error('[Moyasar Webhook Handler Exception]', error);
    return NextResponse.json({ error: error.message || 'Webhook processing error' }, { status: 500 });
  }
}
