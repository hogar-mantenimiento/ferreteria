import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'token';
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'default-secret';

const testUsers = {
  'admin@test.com': {
    id: '1', email: 'admin@test.com', password: 'admin123', name: 'Admin User', role: 'admin',
  },
  'user@test.com': {
    id: '2', email: 'user@test.com', password: 'user123', name: 'Regular User', role: 'user',
  },
} as const;

export async function POST(request: NextRequest) {
  try {
    const bypass = process.env.DEV_AUTH_BYPASS === 'true';

    // Si bypass está activo, forzamos login como admin sin validar nada
    if (bypass) {
      const admin = testUsers['admin@test.com'];
      const token = jwt.sign(
        { userId: admin.id, email: admin.email, role: admin.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const res = NextResponse.json({ user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } });
      res.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    // Modo normal (sin bypass)
    const { email, password } = (await request.json()) as { email?: string; password?: string };
    const normalizedEmail = (email || '').trim().toLowerCase();
    const pwd = password || '';

    if (!normalizedEmail || !pwd) {
      return NextResponse.json({ message: 'Email y contraseña son requeridos' }, { status: 400 });
    }
    const user = testUsers[normalizedEmail as keyof typeof testUsers];
    if (!user || user.password !== pwd) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
