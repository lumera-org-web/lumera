/**
 * Brevo Transactional Email Service
 * Handles server-side dynamic emails (Order Confirmations, Shipping, Welcome)
 */

interface BrevoRecipient {
  email: string;
  name?: string;
}

interface SendEmailParams {
  to: BrevoRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendBrevoEmail({
  to,
  subject,
  htmlContent,
  textContent,
}: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'concierge@lumera.sa';
  const senderName = process.env.BREVO_SENDER_NAME || 'LUMÉRA';

  if (!apiKey) {
    console.warn('[Brevo] BREVO_API_KEY not configured. Email suppressed for logging.');
    return { success: true, messageId: 'simulated_local' };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to,
        subject,
        htmlContent,
        textContent,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[Brevo] API Error:', err);
      return { success: false, error: JSON.stringify(err) };
    }

    const data = await res.json();
    return { success: true, messageId: data.messageId };
  } catch (error: any) {
    console.error('[Brevo] Network Exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends luxury Order Confirmation Email to the customer
 */
export async function sendOrderConfirmation(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  items?: any[];
}) {
  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #140C09; color: #FAF7F2; padding: 40px 24px; border: 1px solid #C8A265;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #DEC197; letter-spacing: 4px; font-weight: normal; margin: 0;">LUMÉRA</h1>
        <p style="color: #9E8E85; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Saudi Arabia</p>
      </div>
      <p style="font-size: 16px; line-height: 1.6;">Dear ${order.customer_name},</p>
      <p style="font-size: 15px; line-height: 1.6; color: #E3D9D2;">
        Thank you for choosing LUMÉRA. Your order <strong style="color: #DEC197;">#${order.order_number}</strong> has been received and is being prepared with utmost care for swift delivery.
      </p>
      <div style="margin: 30px 0; padding: 20px; background: #1A100C; border: 1px solid rgba(255,255,255,0.08);">
        <h3 style="margin-top: 0; color: #DEC197; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
        <p style="margin: 8px 0; color: #E3D9D2;">Total: <strong style="color: #FFFFFF;">SAR ${order.total}</strong></p>
        <p style="margin: 8px 0; color: #9E8E85; font-size: 13px;">Estimated delivery to Jeddah / KSA: 1–3 business days.</p>
      </div>
      <p style="font-size: 14px; color: #9E8E85; line-height: 1.6;">
        If you have any questions or require bespoke assistance, reply directly to this email or reach out to our concierge team.
      </p>
      <div style="text-align: center; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
        <p style="font-size: 12px; color: #9E8E85; letter-spacing: 1px;">LUMÉRA BEAUTY & FRAGRANCE — SAUDI ARABIA</p>
      </div>
    </div>
  `;

  return sendBrevoEmail({
    to: [{ email: order.customer_email, name: order.customer_name }],
    subject: `Your LUMÉRA Order #${order.order_number} has been received`,
    htmlContent: html,
  });
}

/**
 * Sends Order Shipping Notification
 */
export async function sendShippingEmail(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  tracking_number?: string;
  courier?: string;
}) {
  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #140C09; color: #FAF7F2; padding: 40px 24px; border: 1px solid #C8A265;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #DEC197; letter-spacing: 4px; font-weight: normal; margin: 0;">LUMÉRA</h1>
      </div>
      <p style="font-size: 16px;">Dear ${order.customer_name},</p>
      <p style="font-size: 15px; color: #E3D9D2; line-height: 1.6;">
        Your luxury parcel for order <strong style="color: #DEC197;">#${order.order_number}</strong> is now on its way via ${order.courier || 'Express Courier'}.
      </p>
      ${order.tracking_number ? `<p style="background: #1A100C; padding: 12px; color: #DEC197;">Tracking Reference: ${order.tracking_number}</p>` : ''}
    </div>
  `;

  return sendBrevoEmail({
    to: [{ email: order.customer_email, name: order.customer_name }],
    subject: `Your LUMÉRA Order #${order.order_number} is on its way`,
    htmlContent: html,
  });
}
