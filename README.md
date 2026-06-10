# Testimonies.com Web Client

A Twitter-like web client for sharing testimonies of God's goodness. Built with **Next.js 16**, **TypeScript 6**, **Tailwind CSS v4**, **TanStack Query v5**, and **Axios**.

Users can sign up (individual or organization), post testimonies with media, like/reply, follow others, send direct messages, manage subscriptions, create promotions, and collaborate in teams.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 6 (strict) |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack Query v5 |
| HTTP Client | Axios with interceptors |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Toasts | Sonner |
| OTP Input | react-otp-input |

## Getting Started

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your backend URL and API key:
#   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
#   NEXT_PUBLIC_API_KEY=your_api_key_here

# Start development server
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type check without emitting files |

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Sign in, sign up, verify OTP, forgot password
│   ├── (app)/             # Authenticated pages (home, explore, profile, messages, etc.)
│   ├── layout.tsx         # Root layout with Inter font + Providers
│   ├── providers.tsx      # Auth context, QueryClient, Toaster
│   └── page.tsx           # Root redirect logic
├── components/
│   ├── common/            # Reusable UI primitives
│   ├── feed/              # TestimonyCard, Composer
│   └── layout/            # AppLayout, AppSidebar, AppMobileNav
├── hooks/                 # React Query hooks (useAuth, useFeed, useProfile, etc.)
├── lib/                   # Axios client, storage, utilities
├── types/                 # TypeScript interfaces
├── constants/             # App-wide constants
└── config/                # Environment variable exports
```

## Implemented Modules

- **Auth**: Sign in, sign up (individual/org), OTP verification, password reset, session management
- **Feed**: Infinite scrolling feed, trending, popular tags
- **Testimonies**: Create, edit, delete, like, reply, broadcast, stats
- **Profiles**: View by username, follow/unfollow, followers/following, profile/cover image upload
- **Messaging**: Conversations, send/edit/delete, search, read receipts, unread badges
- **Subscriptions**: Plans, subscribe, pay, verify payment, history, cancel
- **Promotions**: Create, activate/deactivate, edit, delete, stats, ad view
- **Team**: Members, roles, permissions, activity log, add/remove members, assign roles
- **Notifications**: Follow requests, broadcast requests (approve/reject)

## Backend

The backend (Express + MongoDB) runs separately. See the [backend repository](https://github.com/anomalyco/testimonies-com-backend) for setup and API documentation.

API base URL is configured via `NEXT_PUBLIC_API_BASE_URL` in `.env.local`.
