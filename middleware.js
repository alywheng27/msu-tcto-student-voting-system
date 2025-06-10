import { NextResponse } from 'next/server';
import { cookies } from "next/headers"

export function middleware(request) {
  // Protect all /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Look for the UserTypeID cookie
    
    if (!request.cookies.get('UserID')?.value) {
      const loginUrl = new URL('/login', request.url);
      // Optional: you can add ?from=originalPath for redirect after login
      loginUrl.searchParams.set('from', request.nextUrl.pathname);

      console.log(`Redirected to Login from ${request.nextUrl.pathname}`)
      return NextResponse.redirect(loginUrl);
    }
  }else if (request.nextUrl.pathname.startsWith('/voter')) {
    // Look for the UserTypeID cookie
    
    if (!request.cookies.get('UserID')?.value) {
      const loginUrl = new URL('/login', request.url);
      // Optional: you can add ?from=originalPath for redirect after login
      loginUrl.searchParams.set('from', request.nextUrl.pathname);

      console.log(`Redirected to Login from ${request.nextUrl.pathname}`)
      return NextResponse.redirect(loginUrl);
    }
  }

  // If authenticated, just continue
  return NextResponse.next();
}

// Only match middleware to all routes except static, _next, and api
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
