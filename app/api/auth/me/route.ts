import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'token';
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'default-secret';

export async function GET(request: NextRequest) {
  try {
    const bypass = process.env.DEV_AUTH_BYPASS === 'true';
    const token = request.cookies.get(COOKIE_NAME)?.value;

    // Si bypass activo y no hay token, devolvemos usuario demo igual
    if (bypass && !token) {
      return NextResponse.json({
        user: { id: '1', email: 'admin@test.com', name: 'Admin User', role: 'admin' },
      });
    }

    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.email === 'admin@test.com' ? 'Admin User' : 'Regular User',
      role: decoded.role,
    };
    return NextResponse.json({ user });
  } catch {
    const res = NextResponse.json({ user: null }, { status: 200 });
    res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
    return res;
  }
}
