import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/services/customerAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and verification code are required.' },
        { status: 400 }
      );
    }

    const result = await verifyOtp(email, otp, 'reset_password');
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Invalid verification code.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Verification failed.' },
      { status: 500 }
    );
  }
}
