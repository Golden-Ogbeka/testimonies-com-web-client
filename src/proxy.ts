import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ROUTES, PUBLIC_PATHS, AUTH_PUBLIC_PATHS, DEFAULT_REDIRECT } from '@/constants/routes';
const COOKIE_NAME = 'testimonies_token';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const search = request.nextUrl.search;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isAuthPage = AUTH_PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isFileRequest = /\.[^/]+$/.test(pathname);
  const isRoot = pathname === '/';

  if (isFileRequest) return NextResponse.next();

  let response: NextResponse;

  if (isRoot) {
    if (token) {
      response = NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    } else {
      response = NextResponse.next();
    }
  } else if (!token && !isPublic) {
    const returnTo = `${pathname}${search}`;
    response = NextResponse.redirect(new URL(ROUTES.signinWithReturnTo(returnTo), request.url));
  } else if (token && isAuthPage) {
    const requested = request.nextUrl.searchParams.get('returnTo');
    const safeTarget = requested && requested.startsWith('/') ? requested : DEFAULT_REDIRECT;
    response = NextResponse.redirect(new URL(safeTarget, request.url));
  } else {
    response = NextResponse.next();
  }

  // Disable caching for redirect responses to prevent browser redirect caching loops
  const isRedirect = response.headers.has('location') || (response.status >= 300 && response.status < 400);
  if (isRedirect) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
