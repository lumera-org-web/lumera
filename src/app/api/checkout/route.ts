import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendOrderConfirmation } from '@/services/brevo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, contact, shippingAddress, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!contact?.email || !contact?.phone || !shippingAddress?.fullName) {
      return NextResponse.json({ error: 'Incomplete contact or shipping details' }, { status: 400 });
    }

    const supabase = await createClient();

    // Server-side price calculation to ensure security (Rule 65)
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      // Lookup real price from Supabase
      const { data: dbProduct } = await supabase
        .from('products')
        .select('id, name, price, stock')
        .eq('id', item.productId)
        .single();

      const unitPrice = dbProduct ? Number(dbProduct.price) : Number(item.price);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const totalItemPrice = unitPrice * quantity;

      calculatedSubtotal += totalItemPrice;
      verifiedItems.push({
        product_id: item.productId,
        product_name: dbProduct?.name || item.name,
        product_image: item.imageUrl || null,
        variant_title: item.size || null,
        unit_price: unitPrice,
        quantity,
        total_price: totalItemPrice,
      });
    }

    const shippingFee = 0; // Complimentary Saudi delivery
    const discount = 0;
    const finalTotal = calculatedSubtotal + shippingFee - discount;

    const orderNumber = `LUM-${Date.now().toString().slice(-6)}`;

    // Insert order in Supabase
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: shippingAddress.fullName,
        customer_email: contact.email,
        customer_phone: contact.phone,
        shipping_address: shippingAddress,
        subtotal: calculatedSubtotal,
        shipping_fee: shippingFee,
        discount,
        total: finalTotal,
        currency: 'SAR',
        payment_method: paymentMethod || 'card',
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
        order_status: 'processing',
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('[Order creation error]', orderError);
      return NextResponse.json({ error: 'Could not create order in database' }, { status: 500 });
    }

    // Insert order items
    if (orderData?.id) {
      const itemsToInsert = verifiedItems.map((vi) => ({
        ...vi,
        order_id: orderData.id,
      }));
      await supabase.from('order_items').insert(itemsToInsert);
    }

    // Trigger Brevo transactional email
    try {
      await sendOrderConfirmation({
        order_number: orderNumber,
        customer_name: shippingAddress.fullName,
        customer_email: contact.email,
        total: finalTotal,
      });
    } catch (emailErr) {
      console.warn('[Brevo order confirmation email error]', emailErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: orderData?.id,
      total: finalTotal,
    });
  } catch (error: any) {
    console.error('[Checkout API Exception]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
