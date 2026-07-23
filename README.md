# Testimonies.com Web Client

A Twitter-like browser experience for sharing testimonies of God's goodness. Built with **Next.js 16**, **TypeScript 6**, **Tailwind CSS v4**, **TanStack Query v5**, and **Axios**.

## Tech Stack

| Layer         | Technology                         |
| ------------- | ---------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack) |
| Language      | TypeScript 6 (strict — no `any`)   |
| Styling       | Tailwind CSS v4                    |
| Data Fetching | TanStack Query v5                  |
| HTTP Client   | Axios with interceptors            |
| Forms         | React Hook Form + Zod              |
| Icons         | Lucide React                       |
| Toasts        | Sonner                             |
| OTP Input     | react-otp-input                    |

## Getting Started

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your backend URL and API key:
#   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
#   NEXT_PUBLIC_API_KEY=your_api_key_here
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Start development server (Turbopack)
npm run dev
```

The backend (Express + MongoDB) must be running on port 5000 for API calls.

## Scripts

| Command            | Description                                   |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Start dev server with Turbopack               |
| `npm run build`    | Production build (TypeScript check + compile) |
| `npm start`        | Start production server                       |
| `npm run lint`     | Run ESLint 9                                  |
| `npx tsc --noEmit` | Standalone TypeScript check                   |

## Project Structure

```
src/
├── app/
│   ├── (public)/              # Unauthenticated routes (signin, signup, verify-otp, forgot-password)
│   ├── (app)/                 # Authenticated routes (home, explore, notifications, settings, etc.)
│   ├── layout.tsx             # Root layout (Inter font + Providers)
│   ├── providers.tsx          # AuthContext + QueryClientProvider + Toaster
│   ├── manifest.ts            # PWA manifest
│   ├── opengraph-image.tsx    # Server-generated OG card
│   └── twitter-image.tsx      # Server-generated Twitter card
├── components/
│   ├── common/                # 15 reusable UI primitives (Button, Input, Avatar, etc.)
│   ├── feed/                  # TestimonyCard, Composer, ReplyComposer, ReplyItem
│   ├── layout/                # AppLayout, AppSidebar
│   ├── settings/              # ProfileTab, AccountTab, PrivacyTab, SessionsTab, DangerZoneTab
│   └── profile/               # (reserved for future profile components)
├── hooks/                     # React Query hooks by domain (useAuth, useFeed, useProfile, etc.)
├── lib/                       # Axios client, utils, storage, validations
├── types/                     # TypeScript interfaces (api, auth, testimony, message, domain)
├── constants/                 # Route constants, storage keys
├── config/                    # Environment variable exports
└── proxy.ts                   # Next.js middleware (auth route protection)
```

## Implemented Modules

- **Auth**: Sign in, sign up (individual/org), OTP verification (send/resend/verify), password reset, session management, logout
- **Feed**: Infinite-scrolling home feed, trending, popular tags
- **Testimonies**: Create (text + media), like/unlike, reply/edit/delete, broadcast requests (approve/reject), secret testimonies
- **Profiles**: View by username, follow/unfollow, followers/following, profile/cover image upload, search
- **Settings**: Profile edit (individual/org), email/username/phone/password update, email OTP verification, privacy visibility, session management, account deletion
- **Notifications**: Follow requests, broadcast requests
- **Infinite Scroll**: All paginated lists use `useInfiniteQuery` + `useIntersectionObserver` sentinel

### Disabled (Backend Routes Commented Out)

The following modules are wired in the backend but the routes are commented out. Frontend hook files and types are kept for future re-enablement:

- **Messaging**: Conversations, messages, read receipts
- **Subscriptions**: Plans, subscribe, pay, cancel
- **Promotions**: Campaign CRUD, stats
- **Team**: Members, roles, permissions
- **Google Auth**: OAuth sign-in
- **KYC**: Identity verification

## Routes

| Path               | Auth      | Description                                      |
| ------------------ | --------- | ------------------------------------------------ |
| `/`                | —         | Root redirect (`/home` or `/signin`)             |
| `/signin`          | Public    | Email + password sign in                         |
| `/signup`          | Public    | Individual or organization registration          |
| `/verify-otp`      | Public    | OTP verification (signin/signup mode)            |
| `/forgot-password` | Public    | Password reset via email OTP                     |
| `/home`            | Protected | Main feed with composer                          |
| `/explore`         | Protected | Search people, testimonies, trending, tags       |
| `/notifications`   | Protected | Follow and broadcast requests                    |
| `/my-testimonies`  | Protected | User's own testimonies                           |
| `/post/[id]`       | Protected | Testimony detail with replies                    |
| `/u/[username]`    | Protected | User profile                                     |
| `/settings`        | Protected | Profile, account, privacy, sessions, danger zone |

## API Integration

- All API calls go through a shared Axios instance (`src/lib/api.ts`)
- Auth token is injected as `x-jwt-token` header via request interceptor
- API key is sent as `x-api-key` header
- 401/403 responses trigger automatic sign-out via response interceptor
- All list endpoints return `Paginated<T>` (never plain arrays)
- Response shape: `{ success: boolean, data: T, message?: string }` — extracted with `unwrap<T>()`
- Infinite queries use `getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined` with `initialPageParam: 1`

## Environment Variables

| Variable                   | Required | Default | Purpose                        |
| -------------------------- | -------- | ------- | ------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | Yes      | —       | Backend API base URL           |
| `NEXT_PUBLIC_API_KEY`      | Yes      | —       | API key for `x-api-key` header |
| `NEXT_PUBLIC_SITE_URL`     | Yes      | —       | Site URL for OG/Twitter cards  |

## Conventions

- `'use client'` only when hooks or browser APIs are needed — pages are server components by default
- Interactive logic extracted into co-located `*-content.tsx` client components
- All routes reference the single `ROUTES` constants file
- No `any` types — use `unknown` and narrow, or define a proper type
- Tailwind utility classes only — no inline styles or CSS modules
- Light theme only (white background, `#1f2947` primary, gray borders)
- Mutations invalidate relevant query keys on success
- Forms validate with Zod schemas and disable submit during loading

## Disabled Frontend Routes

The following backend routers are commented out in `backend/src/api/v1/routes/index.ts`:

- `subscription` (routes, admin routes, webhooks)
- `promotion` (routes, admin routes)
- `messaging` (routes)
- `team` (routes)
- `google-auth`
- `kyc`

Frontend hook files are kept at `src/hooks/use{Subscription,Promotion,Messaging,Team}.ts` for future use.
