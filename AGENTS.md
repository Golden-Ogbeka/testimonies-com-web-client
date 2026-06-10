# Testimonies.com Web Client — AI Agent Guidelines

## 1. Project Overview

Next.js web client for Testimonies.com — a Twitter-like browser experience for sharing testimonies of God's goodness. Built with Next.js 16 (App Router), TypeScript 6, Tailwind CSS v4, TanStack Query v5, and Axios.

## 2. Technology Stack

### 2.1 Core
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 6 (strict — no `any`)
- **Styling**: Tailwind CSS v4
- **Data Fetching**: TanStack Query v5
- **HTTP Client**: Axios with interceptors
- **Real-time**: Socket.io client
- **State**: React Query for server state; React context/useState for local UI state

### 2.2 Development
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Formatting**: Prettier (format on save)
- **Type Checking**: `tsc --noEmit`

## 3. Project Structure

```
src/
├── app/                    # Next.js App Router pages/layouts
│   ├── (public)/          # Unauthenticated routes (signin, signup, verify-otp, forgot-password)
│   ├── (app)/             # Authenticated routes (home, explore, profile, messages, etc.)
│   ├── layout.tsx
│   └── page.tsx           # Root redirect (/ → /home or /signin)
├── components/
│   ├── common/            # Reusable UI components (Button, Input, Avatar, PageHeader, TabBar, etc.)
│   ├── feed/              # TestimonyCard, Composer
│   └── layout/            # AppLayout, AppSidebar, AppMobileNav
├── hooks/                 # React Query hooks by domain
├── lib/                   # Axios client, utils, storage
├── types/                 # TypeScript interfaces
├── constants/             # App-wide constants
└── config/                # Environment variable exports
```

## 4. Naming Conventions

- **Files/Directories**: kebab-case (`testimony-card.tsx`, `use-feed.ts`)
- **Components**: PascalCase (`TestimonyCard`)
- **Hooks**: camelCase prefixed with `use` (`useFeed`, `useAuth`)
- **Types/Interfaces**: PascalCase (`TestimonyPost`, `UserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_TEXT_LENGTH`)
- **API functions**: camelCase (`getTestimonies`, `createTestimony`)

## 5. Development Rules

### 5.1 TypeScript
- Strict mode is always on. Never use `any` — use `unknown` and narrow, or define a proper type.
- Define interfaces for all API response shapes and component props.
- Use `type` for unions/intersections, `interface` for object shapes.

### 5.2 Components
- Use functional components only with `'use client'` when hooks or browser APIs are needed.
- Keep components small and single-responsibility.
- Extract reusable UI into `src/components/common/`.
- Feature-specific components live alongside their page/route or in `src/components/`.
- Always handle loading, empty, and error states explicitly.

### 5.3 Data Fetching
- All server data goes through React Query hooks in `src/hooks/`.
- Never fetch directly inside a component — always use a hook.
- Use optimistic updates for like, follow, and message actions.
- Invalidate relevant query keys after mutations.

```typescript
export const useTestimonies = (params: FeedParams) =>
  useQuery({
    queryKey: ['testimonies', params],
    queryFn: () => testimonyApi.getFeed(params),
  });

export const useCreateTestimony = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: testimonyApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonies'] }),
  });
};
```

### 5.4 Axios Client
- A single Axios instance lives in `src/lib/axios.ts`.
- Auth token and `x-api-key` are injected via request interceptors.
- 401/403 responses trigger automatic sign-out via response interceptor.
- Never create ad-hoc Axios instances outside `src/lib/`.

### 5.5 Routing & Auth Protection
- Use Next.js middleware (`src/middleware.ts`) for route protection.
- Authenticated routes are grouped under `(app)/`.
- Unauthenticated routes are grouped under `(public)/`.
- Redirect unauthenticated users to `/signin`; redirect authenticated users away from public pages.
- Profile route is at `/(app)/u/[username]` to benefit from auth middleware.

### 5.6 Styling
- Use Tailwind utility classes exclusively — no inline styles, no CSS modules.
- Follow the design system: `#2C3248` primary (solid fills), white backgrounds, gray secondary, red danger.
- Light theme only (white background, subtle gray borders).
- Use rounded borders (`rounded-lg`, `rounded-xl`, `rounded-full`).

### 5.7 Forms
- Validate all inputs client-side before submission.
- Show field-level error messages.
- Disable submit buttons while a mutation is in flight.
- Never submit sensitive data (passwords, tokens) in query strings.

### 5.8 Real-time (Socket.io)
- Socket client is initialised once in a provider at the app root.
- Connect only when authenticated; disconnect on logout.
- Use socket events only for messaging and live feed updates.
- Always clean up socket listeners in `useEffect` return functions.

## 6. Code Reuse

Every UI pattern that appears more than once must become a reusable component in `src/components/common/`:

| Component | Usage |
|-----------|-------|
| `OtpInput` | Wraps `react-otp-input` with consistent styling |
| `PageHeader` | Sticky header with icon + title |
| `TabBar` | Tab navigation with optional icons and badges |
| `SearchInput` | Search field with magnifier icon |
| `Pagination` | Prev/next page controls |
| `UserRow` | Avatar + name + username (optionally linked) |
| `StatusBadge` | Green/gray/red pill for active/pending/rejected states |
| `SelectableCard` | Card with selection ring on click |
| `SpinnerPage` | Full-page centered spinner for suspense fallback |

Custom hooks in `src/hooks/`:

| Hook | Purpose |
|------|---------|
| `useCooldown` | Countdown timer for OTP resend flows |

## 7. API Integration

### 7.1 API Modules
Each domain has its own API module in `src/lib/api/`:

| Module | Responsibility |
|--------|---------------|
| `auth.ts` | Register, login, OTP, logout, password reset |
| `testimonies.ts` | CRUD, likes, replies, broadcasts |
| `feed.ts` | Home feed, trending |
| `profile.ts` | Profile view/edit, follow/unfollow, block |
| `messaging.ts` | Conversations, messages, read receipts |
| `subscription.ts` | Plans, status, payment, cancel |
| `promotions.ts` | Campaign CRUD, activate/deactivate |
| `team.ts` | Members, roles, permissions, activity |
| `search.ts` | Global search |
| `notifications.ts` | Notification list and preferences |

### 7.2 Response Handling
- All API responses follow the backend's `{ success, data, message }` shape.
- Extract `data` inside the API module function, not in the hook or component.
- Surface `error.response.data.error.message` in user-facing error toasts.

## 8. Security Rules

- Sanitize any user-generated HTML before rendering (use `dompurify`).
- Never store JWT tokens in localStorage — use httpOnly cookies or memory + refresh token rotation.
- Validate all form inputs before sending to the API.
- Do not expose the API key in client-side logs or error messages.

## 9. Performance Rules

- Use `next/image` for all images.
- Lazy-load off-screen components with `dynamic(() => import(...), { ssr: false })`.
- Virtualise long lists (feed, messages) to avoid DOM bloat.
- Avoid unnecessary re-renders: `useMemo` for expensive computations, `useCallback` for stable callbacks.

## 10. Testing

- Unit test utility functions and custom hooks.
- Integration test key user flows (login, create testimony, send message).
- Maintain 80%+ coverage on `src/hooks/` and `src/lib/`.
- Use Jest + React Testing Library.

## 11. Code Review Checklist

- [ ] No `any` types introduced.
- [ ] Loading, empty, and error states handled in every data-dependent component.
- [ ] New API calls go through a hook, not directly in a component.
- [ ] Mutations invalidate the correct query keys.
- [ ] Forms validate inputs and disable submit during loading.
- [ ] Accessibility: interactive elements have labels, keyboard navigation works.
- [ ] No hardcoded strings that should be constants or env vars.
- [ ] README updated if new env vars, routes, or modules are added.

## 12. Do Not

- Do not create pages outside the `(public)/` or `(app)/` route groups without a clear reason.
- Do not bypass the Axios instance for API calls.
- Do not store sensitive data unencrypted in localStorage or sessionStorage.
- Do not add new npm dependencies without checking if the need can be met by existing ones.
- Do not commit `.env.local` or any file containing real secrets.
- Do not use `any` — always define a proper type or use `unknown`.
- Do not duplicate UI patterns — create a reusable component instead.
