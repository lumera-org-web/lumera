/**
 * Brevo Transactional Email Service
 * Handles server-side dynamic emails (Order Confirmations, Admin Alerts, Shipping, Payment Updates, Order Status)
 * Supports both Brevo REST API (xkeysib-*) and Brevo SMTP Relay (xsmtpsib-*)
 */

import nodemailer from 'nodemailer';

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

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.BREVO_SENDER_EMAIL || 'mrithulmridhu05@gmail.com';

export async function sendBrevoEmail({
  to,
  subject,
  htmlContent,
  textContent,
}: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.BREVO_SMTP_KEY || process.env.BREVO_API_KEY;
  const smtpLogin = process.env.BREVO_SMTP_LOGIN || 'bd67a9001@smtp-brevo.com';
  const smtpHost = process.env.BREVO_SMTP_SERVER || 'smtp-relay.brevo.com';
  const smtpPort = Number(process.env.BREVO_SMTP_PORT) || 587;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'LUMÉRA Concierge';

  if (!apiKey) {
    console.warn('[Brevo] Brevo credentials not configured. Email suppressed for logging.');
    return { success: true, messageId: 'simulated_local' };
  }

  // 1. If key is an SMTP key (starts with 'xsmtpsib-') or BREVO_SMTP_KEY is set, use Nodemailer SMTP relay
  if (apiKey.startsWith('xsmtpsib-') || process.env.BREVO_SMTP_KEY) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false, // STARTTLS
        auth: {
          user: smtpLogin,
          pass: apiKey,
        },
      });

      const recipientList = to.map((r) => (r.name ? `"${r.name}" <${r.email}>` : r.email)).join(', ');

      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: recipientList,
        subject,
        text: textContent || htmlContent.replace(/<[^>]*>/g, ''),
        html: htmlContent,
      });

      console.log('[Brevo SMTP] Email successfully sent:', recipientList, 'MsgId:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (smtpErr: any) {
      console.error('[Brevo SMTP Error]:', smtpErr);
      return { success: false, error: smtpErr.message };
    }
  }

  // 2. Otherwise use Brevo REST API (xkeysib-...)
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
      console.error('[Brevo REST API Error]:', err);
      return { success: false, error: JSON.stringify(err) };
    }

    const data = await res.json();
    console.log('[Brevo REST] Email successfully sent to:', to.map((r) => r.email).join(', '), 'MsgId:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error: any) {
    console.error('[Brevo Network Exception]:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Shared HTML luxury email template wrappers and formatters
 */
function wrapLuxuryEmail(bodyContent: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>LUMÉRA</title>
    </head>
    <body style="margin: 0; padding: 24px 10px; background-color: #0D0705; font-family: 'Georgia', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, serif; color: #FAF7F2;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background: #140C09; border: 1px solid #C8A265; border-radius: 4px; overflow: hidden;">
        <tr>
          <td style="padding: 36px 28px 24px 28px; text-align: center; border-bottom: 1px solid rgba(200, 162, 101, 0.25); background: #190F0C;">
            <h1 style="color: #DEC197; letter-spacing: 5px; font-weight: normal; margin: 0; font-size: 26px; text-transform: uppercase;">LUMÉRA</h1>
            <p style="color: #9E8E85; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 6px 0 0 0;">Saudi Arabia · Haute Parfumerie &amp; Beauty</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px 28px;">
            ${bodyContent}
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 28px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.08); background: #110907;">
            <p style="font-size: 11px; color: #9E8E85; letter-spacing: 1.5px; margin: 0 0 6px 0; text-transform: uppercase;">LUMÉRA BEAUTY &amp; FRAGRANCE · SAUDI ARABIA</p>
            <p style="font-size: 11px; color: #786C65; margin: 0;">Prince Mohammed Bin Abdulaziz St (Tahliya), Jeddah · Concierge WhatsApp: +966 50 123 4567</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function renderItemsHtml(items: any[] = []): string {
  if (!items || items.length === 0) return '';
  const rows = items
    .map((item) => {
      const name = item.product_name || item.name || 'Luxury Selection';
      const variant = item.variant_title || item.size || '';
      const qty = item.quantity || 1;
      const unit = Number(item.unit_price || item.price || 0);
      const lineTotal = Number(item.total_price || unit * qty);

      return `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #FAF7F2; font-size: 14px;">
            <strong style="color: #FFFFFF;">${name}</strong>
            ${variant ? `<br><span style="color: #9E8E85; font-size: 12px;">Size / Variant: ${variant}</span>` : ''}
          </td>
          <td style="padding: 12px 10px; border-bottom: 1px solid rgba(255,255,255,0.06); text-align: center; color: #E3D9D2; font-size: 13px;">
            ×${qty}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); text-align: right; color: #DEC197; font-size: 14px; font-weight: 600;">
            SAR ${lineTotal.toFixed(2)}
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="border-bottom: 1px solid rgba(200, 162, 101, 0.3); color: #9E8E85; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
          <th style="text-align: left; padding-bottom: 8px;">Product</th>
          <th style="text-align: center; padding-bottom: 8px;">Qty</th>
          <th style="text-align: right; padding-bottom: 8px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function formatAddress(address: any): string {
  if (!address) return 'Saudi Arabia Express Delivery';
  if (typeof address === 'string') return address;
  const parts = [address.fullName, address.address, address.city || 'Jeddah', address.postalCode].filter(Boolean);
  return parts.join(', ');
}

/**
 * 1. Sends luxury Order Confirmation Email to the customer
 */
export async function sendOrderConfirmation(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: any;
  payment_method?: string;
  payment_status?: string;
  total: number;
  items?: any[];
}) {
  const itemsHtml = renderItemsHtml(order.items);
  const formattedAddress = formatAddress(order.shipping_address);
  const paymentBadge = (order.payment_status || 'paid').toUpperCase();
  const paymentMethodLabel = (order.payment_method || 'card').toUpperCase();

  const body = `
    <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Dear ${order.customer_name},</p>
    <p style="font-size: 15px; line-height: 1.6; color: #E3D9D2;">
      Thank you for choosing LUMÉRA. Your order <strong style="color: #DEC197;">#${order.order_number}</strong> has been received and is being prepared with utmost artisanal care for swift dispatch across the Kingdom.
    </p>

    <div style="margin: 24px 0; padding: 20px; background: #1A100C; border: 1px solid rgba(200, 162, 101, 0.2); border-radius: 3px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px; margin-bottom: 14px;">
        <span style="color: #DEC197; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Order #${order.order_number}</span>
        <span style="font-size: 11px; padding: 3px 8px; background: rgba(200, 162, 101, 0.15); color: #DEC197; border-radius: 2px; text-transform: uppercase;">
          ${paymentMethodLabel} · ${paymentBadge}
        </span>
      </div>

      ${itemsHtml}

      <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px; margin-top: 10px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #9E8E85; margin-bottom: 6px;">
          <span>Complimentary Saudi Delivery</span>
          <span style="color: #3EED8B;">FREE</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; color: #FFFFFF; font-weight: bold;">
          <span>Order Total</span>
          <span style="color: #DEC197;">SAR ${Number(order.total).toFixed(2)}</span>
        </div>
      </div>
    </div>

    <div style="margin: 24px 0; padding: 16px; background: #160D0A; border-left: 3px solid #C8A265; font-size: 13px; line-height: 1.6;">
      <strong style="color: #DEC197; display: block; margin-bottom: 4px;">Delivery Destination</strong>
      <span style="color: #D8C7B2;">${formattedAddress}</span>
      ${order.customer_phone ? `<br><span style="color: #9E8E85; font-size: 12px;">Contact Phone: ${order.customer_phone}</span>` : ''}
    </div>

    <p style="font-size: 14px; color: #9E8E85; line-height: 1.6; margin-bottom: 0;">
      Our concierge team will notify you as soon as your luxury parcel is dispatched with real-time tracking reference.
    </p>
  `;

  const html = wrapLuxuryEmail(body);

  return sendBrevoEmail({
    to: [{ email: order.customer_email, name: order.customer_name }],
    subject: `Order Confirmed: #${order.order_number} — LUMÉRA Haute Parfumerie`,
    htmlContent: html,
  });
}

/**
 * 2. Sends Automatic New Order Notification to Admin
 */
export async function sendAdminOrderNotification(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: any;
  payment_method?: string;
  payment_status?: string;
  total: number;
  items?: any[];
}) {
  const itemsHtml = renderItemsHtml(order.items);
  const formattedAddress = formatAddress(order.shipping_address);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const body = `
    <div style="padding: 12px 16px; background: rgba(200, 162, 101, 0.15); border: 1px solid #C8A265; border-radius: 3px; margin-bottom: 20px;">
      <span style="font-size: 12px; font-weight: bold; color: #DEC197; letter-spacing: 1px; text-transform: uppercase;">
        🔔 NEW CUSTOMER ORDER RECEIVED
      </span>
    </div>

    <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #FFFFFF;">
      A new order <strong style="color: #DEC197;">#${order.order_number}</strong> was just placed on the LUMÉRA Saudi storefront.
    </p>

    <!-- Customer Details Card -->
    <div style="background: #1A100C; border: 1px solid rgba(255,255,255,0.08); padding: 18px; border-radius: 3px; margin: 20px 0;">
      <h3 style="margin: 0 0 12px 0; font-size: 13px; color: #DEC197; text-transform: uppercase; letter-spacing: 1px;">Customer Information</h3>
      <table style="width: 100%; font-size: 13px; color: #E3D9D2; line-height: 1.6;">
        <tr>
          <td style="width: 35%; color: #9E8E85;">Full Name:</td>
          <td><strong>${order.customer_name}</strong></td>
        </tr>
        <tr>
          <td style="color: #9E8E85;">Email:</td>
          <td><a href="mailto:${order.customer_email}" style="color: #DEC197; text-decoration: none;">${order.customer_email}</a></td>
        </tr>
        <tr>
          <td style="color: #9E8E85;">Phone:</td>
          <td>${order.customer_phone || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="color: #9E8E85;">Destination:</td>
          <td>${formattedAddress}</td>
        </tr>
        <tr>
          <td style="color: #9E8E85;">Payment Method:</td>
          <td><span style="text-transform: uppercase; color: #FFFFFF;">${order.payment_method || 'card'}</span></td>
        </tr>
        <tr>
          <td style="color: #9E8E85;">Payment Status:</td>
          <td><strong style="color: ${order.payment_status === 'paid' ? '#3EED8B' : '#E6A23C'}; text-transform: uppercase;">${order.payment_status || 'paid'}</strong></td>
        </tr>
      </table>
    </div>

    <!-- Items Card -->
    <div style="background: #1A100C; border: 1px solid rgba(255,255,255,0.08); padding: 18px; border-radius: 3px; margin: 20px 0;">
      <h3 style="margin: 0 0 12px 0; font-size: 13px; color: #DEC197; text-transform: uppercase; letter-spacing: 1px;">Ordered Items</h3>
      ${itemsHtml}
      <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; text-align: right; font-size: 16px; font-weight: bold; color: #FFFFFF;">
        Total: <span style="color: #DEC197;">SAR ${Number(order.total).toFixed(2)}</span>
      </div>
    </div>

    <!-- Admin CTA -->
    <div style="text-align: center; margin: 30px 0 10px 0;">
      <a href="${siteUrl}/admin/orders" style="display: inline-block; padding: 12px 28px; background: #C8A265; color: #140C09; font-weight: bold; text-decoration: none; border-radius: 2px; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">
        Manage Order in Admin Portal →
      </a>
    </div>
  `;

  const html = wrapLuxuryEmail(body);

  return sendBrevoEmail({
    to: [{ email: ADMIN_EMAIL, name: 'LUMÉRA Admin' }],
    subject: `🔔 [NEW ORDER] #${order.order_number} - ${order.customer_name} (SAR ${order.total})`,
    htmlContent: html,
  });
}

/**
 * 3. Sends Payment Update Notification to Customer
 */
export async function sendPaymentUpdateEmail(params: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  payment_method?: string;
  payment_status: string; // 'paid', 'pending', 'authorized', 'failed', 'refunded'
  total: number;
}) {
  const statusUpper = params.payment_status.toUpperCase();
  const isPaid = params.payment_status.toLowerCase() === 'paid';
  const isFailed = params.payment_status.toLowerCase() === 'failed';
  const isRefunded = params.payment_status.toLowerCase() === 'refunded';

  let badgeColor = '#DEC197';
  let badgeBg = 'rgba(200, 162, 101, 0.15)';
  let statusMessage = `Your payment status for order #${params.order_number} is currently ${statusUpper}.`;

  if (isPaid) {
    badgeColor = '#3EED8B';
    badgeBg = 'rgba(62, 237, 139, 0.15)';
    statusMessage = `We have successfully received and verified your payment of <strong>SAR ${Number(params.total).toFixed(2)}</strong> for order <strong>#${params.order_number}</strong>. Thank you!`;
  } else if (isFailed) {
    badgeColor = '#FF6B6B';
    badgeBg = 'rgba(255, 107, 107, 0.15)';
    statusMessage = `Your payment for order <strong>#${params.order_number}</strong> could not be completed. Please review your payment details or contact our concierge for assistance.`;
  } else if (isRefunded) {
    badgeColor = '#A78BFA';
    badgeBg = 'rgba(167, 139, 250, 0.15)';
    statusMessage = `A refund of <strong>SAR ${Number(params.total).toFixed(2)}</strong> has been initiated for order <strong>#${params.order_number}</strong>.`;
  }

  const body = `
    <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Dear ${params.customer_name},</p>
    <p style="font-size: 15px; line-height: 1.6; color: #E3D9D2;">
      ${statusMessage}
    </p>

    <div style="margin: 24px 0; padding: 20px; background: #1A100C; border: 1px solid rgba(255,255,255,0.08); border-radius: 3px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <span style="color: #9E8E85; font-size: 13px;">Order Number</span>
        <strong style="color: #DEC197; font-size: 14px;">#${params.order_number}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <span style="color: #9E8E85; font-size: 13px;">Payment Status</span>
        <span style="padding: 4px 10px; background: ${badgeBg}; color: ${badgeColor}; font-weight: bold; border-radius: 2px; font-size: 12px; text-transform: uppercase;">
          ${statusUpper}
        </span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <span style="color: #9E8E85; font-size: 13px;">Payment Method</span>
        <span style="color: #FFFFFF; font-size: 13px; text-transform: uppercase;">${params.payment_method || 'Online Payment'}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px;">
        <span style="color: #9E8E85; font-size: 13px;">Amount</span>
        <strong style="color: #DEC197; font-size: 16px;">SAR ${Number(params.total).toFixed(2)}</strong>
      </div>
    </div>

    <p style="font-size: 14px; color: #9E8E85; line-height: 1.6; margin-bottom: 0;">
      If you have any questions regarding your payment, feel free to reply to this email or contact the LUMÉRA concierge.
    </p>
  `;

  const html = wrapLuxuryEmail(body);

  return sendBrevoEmail({
    to: [{ email: params.customer_email, name: params.customer_name }],
    subject: `Payment Update: Order #${params.order_number} (${statusUpper}) — LUMÉRA`,
    htmlContent: html,
  });
}

/**
 * 4. Sends Order Status Notification (Processing, Shipped, Delivered, Cancelled)
 */
export async function sendOrderStatusEmail(params: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  order_status: string; // 'processing', 'shipped', 'delivered', 'cancelled'
  courier?: string;
  tracking_number?: string;
  items?: any[];
  total?: number;
}) {
  const status = (params.order_status || 'processing').toLowerCase();
  let title = `Update on Order #${params.order_number}`;
  let description = '';
  let badgeColor = '#DEC197';
  let badgeBg = 'rgba(200, 162, 101, 0.15)';

  if (status === 'shipped') {
    title = `Your LUMÉRA Order #${params.order_number} Has Been Shipped`;
    description = `Your luxury parcel has been carefully prepared and dispatched with our courier partner. It is currently on its way to your destination in Saudi Arabia.`;
    badgeColor = '#DEC197';
  } else if (status === 'delivered') {
    title = `Your LUMÉRA Order #${params.order_number} Has Been Delivered`;
    description = `Your order has been successfully delivered. We sincerely hope you enjoy your luxury fragrances and beauty selections from LUMÉRA.`;
    badgeColor = '#3EED8B';
    badgeBg = 'rgba(62, 237, 139, 0.15)';
  } else if (status === 'processing') {
    title = `Your LUMÉRA Order #${params.order_number} is Being Prepared`;
    description = `Our artisans are actively selecting and boxing your curated luxury items with utmost care and precision.`;
    badgeColor = '#60A5FA';
    badgeBg = 'rgba(96, 165, 250, 0.15)';
  } else if (status === 'cancelled') {
    title = `Order #${params.order_number} Cancelled`;
    description = `Your order #${params.order_number} has been cancelled. If this was unexpected or if you require assistance, our concierge is available at any time.`;
    badgeColor = '#FF6B6B';
    badgeBg = 'rgba(255, 107, 107, 0.15)';
  }

  const itemsHtml = renderItemsHtml(params.items);

  const body = `
    <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Dear ${params.customer_name},</p>
    <p style="font-size: 15px; line-height: 1.6; color: #E3D9D2;">
      ${description}
    </p>

    <div style="margin: 24px 0; padding: 20px; background: #1A100C; border: 1px solid rgba(255,255,255,0.08); border-radius: 3px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <span style="color: #9E8E85; font-size: 13px;">Order Status</span>
        <span style="padding: 4px 10px; background: ${badgeBg}; color: ${badgeColor}; font-weight: bold; border-radius: 2px; font-size: 12px; text-transform: uppercase;">
          ${status}
        </span>
      </div>

      ${
        params.courier
          ? `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="color: #9E8E85; font-size: 13px;">Carrier / Courier</span>
          <span style="color: #FFFFFF; font-size: 13px;">${params.courier}</span>
        </div>
      `
          : ''
      }

      ${
        params.tracking_number
          ? `
        <div style="display: flex; justify-content: space-between; align-items: center; background: #140C09; padding: 12px; border: 1px solid rgba(200, 162, 101, 0.25); border-radius: 2px; margin-top: 10px;">
          <span style="color: #DEC197; font-size: 13px; font-weight: bold;">Tracking Reference:</span>
          <span style="color: #FFFFFF; font-family: monospace; font-size: 14px; letter-spacing: 1px;">${params.tracking_number}</span>
        </div>
      `
          : ''
      }
    </div>

    ${itemsHtml}

    <p style="font-size: 14px; color: #9E8E85; line-height: 1.6; margin-bottom: 0;">
      Should you need to update delivery instructions or require bespoke assistance, please reach out directly to our concierge team.
    </p>
  `;

  const html = wrapLuxuryEmail(body);

  return sendBrevoEmail({
    to: [{ email: params.customer_email, name: params.customer_name }],
    subject: `${title} — LUMÉRA`,
    htmlContent: html,
  });
}

/**
 * Backwards compatibility helper for Shipping
 */
export async function sendShippingEmail(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  tracking_number?: string;
  courier?: string;
}) {
  return sendOrderStatusEmail({
    ...order,
    order_status: 'shipped',
  });
}
