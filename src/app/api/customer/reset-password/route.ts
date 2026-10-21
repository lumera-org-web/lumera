import { NextRequest, NextResponse } from 'next/server';
import {
  verifyOtp,
  invalidateOtp,
  updateCustomerPassword,
  findCustomerByEmail,
  toSafeProfile,
  createSessionToken,
} from '@/services/customerAuth';
import { sendPasswordResetSuccessEmail } from '@/services/brevo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, verification code, and new password are required.' },
        { status: 400 }
      );
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 1. Verify OTP
    const otpVerification = await verifyOtp(email, otp, 'reset_password');
    if (!otpVerification.success) {
      return NextResponse.json(
        { error: otpVerification.error || 'Invalid or expired verification code.' },
        { status: 400 }
      );
    }

    // 2. Update password
    await updateCustomerPassword(email, newPassword);

    // 3. Invalidate used OTP
    await invalidateOtp(email, 'reset_password');

    // 4. Retrieve updated customer
    const customer = await findCustomerByEmail(email);
    if (!customer) {
      return NextResponse.json(
        { error: 'Account not found.' },
        { status: 404 }
      );
    }

    // 5. Send confirmation security email via Brevo
    sendPasswordResetSuccessEmail({
      email: customer.email,
      name: customer.name,
    }).catch((e) => console.error('[Brevo password reset confirmation email error]', e));

    // 6. Create session token
    const safeProfile = toSafeProfile(customer);
    const token = createSessionToken(safeProfile);

    const response = NextResponse.json({
      success: true,
      customer: safeProfile,
      message: 'Your password has been successfully reset. You are now signed in.',
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
    console.error('[Reset password error]', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred while resetting your password.' },
      { status: 500 }
    );
  }
}
