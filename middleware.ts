import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is a protected route
  const isProtectedRoute = pathname.startsWith('/chat');

  // Check if the user is authenticated
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and trying to access login/register, redirect to home
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/chat/:path*', '/login', '/register'],
};
