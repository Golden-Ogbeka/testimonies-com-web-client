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

  if (process.env.NODE_ENV === 'development') {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
