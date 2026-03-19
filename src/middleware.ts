import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/signin', '/signup', '/verify-otp', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const search = request.nextUrl.search;
  const token = request.cookies.get('testimonies_token')?.value;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isFileRequest = /\.[^/]+$/.test(pathname);

  if (isFileRequest) {
    return NextResponse.next();
  }

  if (!token && !isPublic) {
    const returnTo = encodeURIComponent(`${pathname}${search}`);
    return NextResponse.redirect(new URL(`/signin?returnTo=${returnTo}`, request.url));
  }

  if (token && isPublic) {
    const requested = request.nextUrl.searchParams.get('returnTo');
    const safeTarget = requested && requested.startsWith('/') ? requested : '/home';
    return NextResponse.redirect(new URL(safeTarget, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
