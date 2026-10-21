import { NextRequest, NextResponse } from 'next/server';
import {
  findCustomerByEmail,
  generateNumericOtp,
  storeOtp,
} from '@/services/customerAuth';
import { sendPasswordResetOtpEmail } from '@/services/brevo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const customer = await findCustomerByEmail(normalizedEmail);

    if (!customer) {
      // Return clear error so customer knows to sign up
      return NextResponse.json(
        { error: 'No account found with this email address. Please create an account.' },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = generateNumericOtp();

    // Store hashed OTP with 10-min expiration
    await storeOtp(normalizedEmail, otp, 'reset_password');

    // Send email via Brevo
    const emailResult = await sendPasswordResetOtpEmail({
      email: normalizedEmail,
      name: customer.name,
      otp,
    });

    if (!emailResult.success) {
      console.error('[Brevo OTP error]', emailResult.error);
      return NextResponse.json(
        { error: 'Could not deliver verification email. Please try again shortly or contact concierge.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'A 6-digit security verification code has been dispatched to your email address.',
    });
  } catch (err: any) {
    console.error('[Forgot password error]', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
