import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  findCustomerById,
  findCustomerByEmail,
  toSafeProfile,
} from '@/services/customerAuth';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('lumera_customer_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ customer: null });
    }

    const payload = verifySessionToken(sessionCookie);
    if (!payload || !payload.sub) {
      return NextResponse.json({ customer: null });
    }

    // Lookup customer
    let customer = await findCustomerById(payload.sub);
    if (!customer && payload.email) {
      customer = await findCustomerByEmail(payload.email);
    }

    if (!customer) {
      return NextResponse.json({ customer: null });
    }

    return NextResponse.json({
      customer: toSafeProfile(customer),
    });
  } catch (err: any) {
    return NextResponse.json({ customer: null });
  }
}
