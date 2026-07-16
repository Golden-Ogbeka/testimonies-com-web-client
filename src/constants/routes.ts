export const ROUTES = {
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',

  HOME: '/home',
  EXPLORE: '/explore',
  NOTIFICATIONS: '/notifications',
  MY_TESTIMONIES: '/my-testimonies',
  SETTINGS: '/settings',

  // Brand/public pages
  LANDING: '/',
  ABOUT: '/about',
  TERMS: '/terms',
  PRIVACY_POLICY: '/privacy-policy',
  COOKIE_POLICY: '/cookie-policy',
  FAQS: '/faqs',

  signinWithReturnTo: (returnTo: string) => `/signin?returnTo=${encodeURIComponent(returnTo)}`,
  verifyOtp: (mode: string, email: string, returnTo?: string) =>
    `/verify-otp?mode=${encodeURIComponent(mode)}&email=${encodeURIComponent(email)}${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''}`,
  exploreTag: (tag: string) => `/explore?tag=${encodeURIComponent(tag)}`,
  post: (id: string) => `/post/${id}`,
  profile: (username: string | undefined) => `/u/${username ?? ''}`,
} as const;

// Auth pages - redirect logged-in users away
export const AUTH_PUBLIC_PATHS = [ROUTES.SIGNIN, ROUTES.SIGNUP, ROUTES.VERIFY_OTP, ROUTES.FORGOT_PASSWORD] as const;

// Brand pages - always accessible
export const BRAND_PUBLIC_PATHS = [
  ROUTES.LANDING,
  ROUTES.ABOUT,
  ROUTES.TERMS,
  ROUTES.PRIVACY_POLICY,
  ROUTES.COOKIE_POLICY,
  ROUTES.FAQS,
] as const;

// All public paths combined
export const PUBLIC_PATHS = [...AUTH_PUBLIC_PATHS, ...BRAND_PUBLIC_PATHS] as const;

export const DEFAULT_REDIRECT = ROUTES.HOME;
