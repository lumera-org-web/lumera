import { NextRequest, NextResponse } from 'next/server';
import {
  findCustomerByEmail,
  verifyPassword,
  toSafeProfile,
  createSessionToken,
} from '@/services/customerAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const customer = await findCustomerByEmail(email);
    if (!customer) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, customer.salt, customer.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const safeProfile = toSafeProfile(customer);
    const token = createSessionToken(safeProfile);

    const response = NextResponse.json({
      success: true,
      customer: safeProfile,
    });

    response.cookies.set('lumera_customer_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An error occurred during authentication.' },
      { status: 500 }
    );
  }
}
