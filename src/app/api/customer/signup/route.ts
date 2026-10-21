import { NextRequest, NextResponse } from 'next/server';
import { createCustomer, createSessionToken } from '@/services/customerAuth';
import { sendWelcomeCustomerEmail } from '@/services/brevo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const safeProfile = await createCustomer({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : undefined,
      password,
    });

    // Create session token
    const token = createSessionToken(safeProfile);

    // Send Welcome Email asynchronously via Brevo
    sendWelcomeCustomerEmail({
      email: safeProfile.email,
      name: safeProfile.name,
    }).catch((e) => console.error('[Brevo welcome email error]', e));

    const response = NextResponse.json({
      success: true,
      customer: safeProfile,
    });

    // Set secure HTTP-only session cookie (30 days)
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
      { error: err.message || 'An error occurred while creating your account.' },
      { status: 400 }
    );
  }
}
