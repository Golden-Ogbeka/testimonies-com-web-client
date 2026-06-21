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

  signinWithReturnTo: (returnTo: string) => `/signin?returnTo=${encodeURIComponent(returnTo)}`,
  verifyOtp: (mode: string, email: string, returnTo?: string) =>
    `/verify-otp?mode=${encodeURIComponent(mode)}&email=${encodeURIComponent(email)}${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''}`,
  exploreTag: (tag: string) => `/explore?tag=${encodeURIComponent(tag)}`,
  post: (id: string) => `/post/${id}`,
  profile: (username: string | undefined) => `/u/${username ?? ''}`,
} as const;

export const PUBLIC_PATHS = [
  ROUTES.SIGNIN,
  ROUTES.SIGNUP,
  ROUTES.VERIFY_OTP,
  ROUTES.FORGOT_PASSWORD,
] as const;

export const DEFAULT_REDIRECT = ROUTES.HOME;
