import { NextResponse } from 'next/server';

export function middleware(request) {
  const currentUser = request.cookies.get('nextvlogauthtoken')?.value;

  if (currentUser && request.nextUrl.pathname.startsWith('/createVlog')) {
    return NextResponse.redirect(new URL('/user', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/user',
    '/createVlog'
  ],
};
