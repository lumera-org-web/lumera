import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const configuredPassword = process.env.ADMIN_PASSWORD || 'lumera2026';

    if (password === configuredPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Incorrect administrative password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}
