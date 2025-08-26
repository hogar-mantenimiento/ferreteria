import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'token';

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    return res;
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
