import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  updateCustomerProfile,
} from '@/services/customerAuth';

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('lumera_customer_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const payload = verifySessionToken(sessionCookie);
    if (!payload || !payload.sub) {
      return NextResponse.json({ error: 'Session expired. Please sign in again.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, shipping_address } = body;

    const updatedCustomer = await updateCustomerProfile(payload.sub, {
      name,
      phone,
      shipping_address,
    });

    return NextResponse.json({
      success: true,
      customer: updatedCustomer,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Could not update profile.' },
      { status: 500 }
    );
  }
}
