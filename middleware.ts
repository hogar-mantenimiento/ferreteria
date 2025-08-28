// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'token';
const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'default-secret');

export async function middleware(request: NextRequest) {
  // 1) BYPASS TOTAL en dev si el flag está prendido
  if (process.env.DEV_AUTH_BYPASS === 'true') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // 2) Rutas/estáticos que no pasan por auth
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/products') ||
    pathname.startsWith('/api/categories') ||
    pathname.startsWith('/api/config') ||
    pathname.startsWith('/api/checkout') ||
    pathname.startsWith('/api/payment-status') ||
    pathname.startsWith('/api/mercadopago')
  ) {
    return NextResponse.next();
  }

  // 3) Públicas
  const PUBLIC_ROUTES = new Set([
    '/', '/login', '/vendedor', '/success', '/failure', '/pending', '/cart',
  ]);
  const PUBLIC_PREFIXES = ['/product/', '/category/'];

  const isPublic =
    PUBLIC_ROUTES.has(pathname) || PUBLIC_PREFIXES.some(p => pathname.startsWith(p));

  if (isPublic) return NextResponse.next();

  // 4) Protegidas
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if ((pathname.startsWith('/admin') || pathname.startsWith('/config')) && payload.role !== 'admin') {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch {
    const url = new URL('/login', request.url);
    const res = NextResponse.redirect(url);
    res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
