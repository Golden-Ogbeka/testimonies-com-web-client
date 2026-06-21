import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ROUTES, PUBLIC_PATHS, DEFAULT_REDIRECT } from '@/constants/routes';
const COOKIE_NAME = 'testimonies_token';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const search = request.nextUrl.search;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isFileRequest = /\.[^/]+$/.test(pathname);
  const isRoot = pathname === '/';

  if (isFileRequest) return NextResponse.next();

  if (isRoot) {
    if (token) return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
  }

  if (!token && !isPublic) {
    const returnTo = `${pathname}${search}`;
    return NextResponse.redirect(new URL(ROUTES.signinWithReturnTo(returnTo), request.url));
  }

  if (token && isPublic) {
    const requested = request.nextUrl.searchParams.get('returnTo');
    const safeTarget = requested && requested.startsWith('/') ? requested : DEFAULT_REDIRECT;
    return NextResponse.redirect(new URL(safeTarget, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
