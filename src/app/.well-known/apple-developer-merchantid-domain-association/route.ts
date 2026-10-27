import { NextResponse } from 'next/server';

/**
 * Serves the Apple Pay domain association file required by Apple and Moyasar
 * for enabling Apple Pay sheet checkouts on Safari and iOS devices.
 */
export async function GET() {
  const content =
    process.env.APPLE_PAY_DOMAIN_ASSOCIATION ||
    '7B2276657273696F6E223A312C227073704964223A226D6F7961736172227D';

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
