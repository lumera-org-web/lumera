import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, COOKIE_NAME, isAdminAuthorized } from '@/utils/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const configuredPassword = process.env.ADMIN_PASSWORD || 'lumera2026';

    if (password === configuredPassword) {
      const token = createAdminToken();
      const response = NextResponse.json({ success: true });

      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json({ error: 'Incorrect administrative password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const isAuth = isAdminAuthorized(req);
  if (isAuth) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
