import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and public API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/products') ||
    pathname.startsWith('/api/categories') ||
    pathname.startsWith('/api/config') ||
    pathname.startsWith('/api/checkout') ||
    pathname.startsWith('/api/payment-status') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Public routes that don't need authentication
  const publicRoutes = [
    '/',
    '/login',
    '/vendedor',
    '/success',
    '/failure',
    '/pending'
  ];

  const isPublicRoute = publicRoutes.includes(pathname) || 
                       pathname.startsWith('/product/') || 
                       pathname.startsWith('/category/');

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'default-secret') as any;
    
    // Check if admin route requires admin role
    if ((pathname.startsWith('/admin') || pathname.startsWith('/config')) && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login and clear cookie
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};