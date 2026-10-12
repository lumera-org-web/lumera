import { NextRequest, NextResponse } from 'next/server';
import {
  sendShippingEmail,
  sendOrderStatusEmail,
  sendPaymentUpdateEmail,
  sendOrderConfirmation,
  sendAdminOrderNotification,
} from '@/services/brevo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      orderNumber,
      order_number,
      customerName,
      customer_name,
      customerEmail,
      customer_email,
      customerPhone,
      customer_phone,
      orderStatus,
      order_status,
      paymentMethod,
      payment_method,
      paymentStatus,
      payment_status,
      courier,
      trackingNumber,
      tracking_number,
      items,
      total,
      shippingAddress,
      shipping_address,
    } = body;

    const ordNum = orderNumber || order_number;
    const custName = customerName || customer_name || 'Valued Client';
    const custEmail = customerEmail || customer_email;
    const ordStatus = orderStatus || order_status;
    const payStatus = paymentStatus || payment_status;
    const payMethod = paymentMethod || payment_method;
    const trackNum = trackingNumber || tracking_number;
    const shipAddr = shippingAddress || shipping_address;
    const phone = customerPhone || customer_phone;

    if (!ordNum) {
      return NextResponse.json({ error: 'orderNumber is required' }, { status: 400 });
    }

    // 1. Order Status Notifications (Processing, Shipped, Delivered, Cancelled)
    if (type === 'order_status' || type === 'status') {
      if (!custEmail) {
        return NextResponse.json({ error: 'customerEmail is required for status notifications' }, { status: 400 });
      }
      const result = await sendOrderStatusEmail({
        order_number: ordNum,
        customer_name: custName,
        customer_email: custEmail,
        order_status: ordStatus || 'processing',
        courier,
        tracking_number: trackNum,
        items,
        total: Number(total) || 0,
      });
      return NextResponse.json(result);
    }

    // 2. Shipping Notification (Backwards compatibility)
    if (type === 'shipping') {
      if (!custEmail) {
        return NextResponse.json({ error: 'customerEmail is required' }, { status: 400 });
      }
      const result = await sendShippingEmail({
        order_number: ordNum,
        customer_name: custName,
        customer_email: custEmail,
        courier,
        tracking_number: trackNum,
      });
      return NextResponse.json(result);
    }

    // 3. Payment Updates (Paid, Pending, Failed, Refunded)
    if (type === 'payment' || type === 'payment_update') {
      if (!custEmail) {
        return NextResponse.json({ error: 'customerEmail is required' }, { status: 400 });
      }
      const result = await sendPaymentUpdateEmail({
        order_number: ordNum,
        customer_name: custName,
        customer_email: custEmail,
        payment_method: payMethod,
        payment_status: payStatus || 'paid',
        total: Number(total) || 0,
      });
      return NextResponse.json(result);
    }

    // 4. Order Confirmation Trigger
    if (type === 'order_confirmation') {
      if (!custEmail) {
        return NextResponse.json({ error: 'customerEmail is required' }, { status: 400 });
      }
      const result = await sendOrderConfirmation({
        order_number: ordNum,
        customer_name: custName,
        customer_email: custEmail,
        customer_phone: phone,
        shipping_address: shipAddr,
        payment_method: payMethod,
        payment_status: payStatus,
        total: Number(total) || 0,
        items,
      });
      return NextResponse.json(result);
    }

    // 5. Admin Alert Trigger
    if (type === 'admin_alert') {
      const result = await sendAdminOrderNotification({
        order_number: ordNum,
        customer_name: custName,
        customer_email: custEmail || 'concierge@lumera.sa',
        customer_phone: phone,
        shipping_address: shipAddr,
        payment_method: payMethod,
        payment_status: payStatus,
        total: Number(total) || 0,
        items,
      });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Unrecognized notification type' }, { status: 400 });
  } catch (err: any) {
    console.error('[Brevo notification route error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
