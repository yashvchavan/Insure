// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedRoutes = ['/user-dashboard', '/policy', '/claims'];
  const authRoutes = ['/user-login', '/admin-login'];

  // Check protected routes
  if (protectedRoutes.some(route => path.startsWith(route))) {
    const token = request.cookies.get('access_token')?.value;
    const authState = request.cookies.get('auth_state')?.value;

    if (!token || authState !== 'authenticated') {
      return NextResponse.redirect(new URL('/user-login', request.url));
    }
  }

  // Prevent authenticated users from accessing auth routes
  if (authRoutes.includes(path)) {
    const authState = request.cookies.get('auth_state')?.value;
    if (authState === 'authenticated') {
      return NextResponse.redirect(new URL('/user-dashboard', request.url));
    }
  }

  return NextResponse.next();
}