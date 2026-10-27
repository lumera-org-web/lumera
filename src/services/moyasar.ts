/**
 * Moyasar Payment Gateway Service
 * Handles Invoice creation, Payment verification, and 3D-Secure redirects.
 */

const MOYASAR_API_BASE = 'https://api.moyasar.com/v1';

function getAuthHeader(): string {
  const secretKey = process.env.MOYASAR_SECRET_KEY || '';
  if (!secretKey) {
    console.warn('[Moyasar] MOYASAR_SECRET_KEY is not defined in environment');
  }
  return 'Basic ' + Buffer.from(secretKey + ':').toString('base64');
}

export interface CreateInvoiceParams {
  amountInSAR: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}

export interface MoyasarInvoiceResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  url: string;
  callback_url: string;
  payments?: Array<{
    id: string;
    status: string;
    amount: number;
    fee: number;
    source: Record<string, any>;
  }>;
}

export interface MoyasarPaymentResponse {
  id: string;
  status: 'initiated' | 'paid' | 'failed' | 'authorized' | 'captured' | 'refunded';
  amount: number;
  fee: number;
  currency: string;
  description: string;
  amount_format: string;
  fee_format: string;
  invoice_id?: string;
  ip?: string;
  created_at: string;
  updated_at: string;
  source: {
    type: string;
    company?: string;
    name?: string;
    number?: string;
    message?: string;
    gateway_id?: string;
    reference_number?: string;
  };
}

/**
 * Creates a hosted invoice checkout session in Moyasar.
 * Amount is automatically converted from SAR to Halalas (x100).
 */
export async function createMoyasarInvoice(params: CreateInvoiceParams): Promise<MoyasarInvoiceResponse> {
  const amountInHalalas = Math.round(params.amountInSAR * 100);

  const payload = {
    amount: amountInHalalas,
    currency: 'SAR',
    description: `LUMÉRA Luxury Order #${params.orderNumber}`,
    callback_url: params.callbackUrl,
    metadata: {
      order_number: params.orderNumber,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      ...params.metadata,
    },
  };

  const response = await fetch(`${MOYASAR_API_BASE}/invoices`, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[Moyasar API Invoice Error]', data);
    throw new Error(data.message || data.error || 'Failed to create Moyasar payment session');
  }

  return data as MoyasarInvoiceResponse;
}

/**
 * Retrieves a payment by ID to verify that it was successfully paid.
 */
export async function getMoyasarPayment(paymentId: string): Promise<MoyasarPaymentResponse> {
  const response = await fetch(`${MOYASAR_API_BASE}/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      Authorization: getAuthHeader(),
    },
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[Moyasar API Payment Error]', data);
    throw new Error(data.message || 'Failed to verify payment status with Moyasar');
  }

  return data as MoyasarPaymentResponse;
}

/**
 * Retrieves an invoice by ID to check its payment statuses.
 */
export async function getMoyasarInvoice(invoiceId: string): Promise<MoyasarInvoiceResponse> {
  const response = await fetch(`${MOYASAR_API_BASE}/invoices/${invoiceId}`, {
    method: 'GET',
    headers: {
      Authorization: getAuthHeader(),
    },
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[Moyasar API Invoice Fetch Error]', data);
    throw new Error(data.message || 'Failed to retrieve invoice from Moyasar');
  }

  return data as MoyasarInvoiceResponse;
}
