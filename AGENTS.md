# Testimonies.com Web Client — Agent Guidelines

## 1. Project Overview

This is the Next.js web client for Testimonies.com. It provides a Twitter-like browser experience for sharing testimonies of God's goodness. Built with Next.js App Router, TypeScript, Tailwind CSS, React Query, and Axios.

## 2. Technology Stack

### 2.1 Core Technologies
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode — no `any`)
- **Styling**: Tailwind CSS with design tokens
- **Data Fetching**: React Query (TanStack Query v5)
- **HTTP Client**: Axios with interceptors
- **Real-time**: Socket.io client
- **State**: React Query for server state; React context/useState for local UI state

### 2.2 Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier (format on save)
- **Type Checking**: `tsc --noEmit`

## 3. Project Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/            # Auth route group (login, register, otp)
│   ├── (main)/            # Authenticated route group
│   │   ├── feed/
│   │   ├── profile/
│   │   ├── messages/
│   │   ├── promotions/
│   │   ├── subscription/
│   │   ├── team/
│   │   └── dashboard/
│   ├── layout.tsx
│   └── page.tsx           # Public welcome/landing page
├── components/
│   └── common/            # Shared reusable UI components
├── hooks/                 # Domain-specific React Query hooks
├── lib/                   # Axios client, socket client, utilities
├── types/                 # TypeScript interfaces and types
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
- Use functional components only.
- Keep components small and single-responsibility.
- Extract reusable UI into `src/components/common/`.
- Feature-specific components live alongside their page/route.
- Always handle loading, empty, and error states explicitly.

### 5.3 Data Fetching
- All server data goes through React Query hooks in `src/hooks/`.
- Never fetch directly inside a component — always use a hook.
- Use optimistic updates for like, follow, and message actions.
- Invalidate relevant query keys after mutations.

```typescript
// Example hook pattern
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
- 401/403 responses trigger automatic logout via response interceptor.
- Never create ad-hoc Axios instances outside `src/lib/`.

### 5.5 Routing & Auth Protection
- Use Next.js middleware (`src/middleware.ts`) for route protection.
- Authenticated routes are grouped under `(main)/`.
- Unauthenticated routes are grouped under `(auth)/`.
- Redirect unauthenticated users to `/login`; redirect authenticated users away from auth pages.

### 5.6 Styling
- Use Tailwind utility classes exclusively — no inline styles, no CSS modules unless unavoidable.
- Follow the existing design system: white backgrounds, blue primary actions, gray secondary, red danger.
- Support both light and dark modes using Tailwind `dark:` variants.
- Theme preference is stored per device (localStorage), not in the user profile.

### 5.7 Forms
- Validate all inputs client-side before submission.
- Show field-level error messages.
- Disable submit buttons while a mutation is in flight.
- Never submit sensitive data (passwords, tokens) in query strings.

### 5.8 Real-time (Socket.io)
- Socket client is initialised once in a provider at the app root.
- Connect only when the user is authenticated; disconnect on logout.
- Use socket events only for messaging and live feed updates.
- Always clean up socket listeners in `useEffect` return functions.

## 6. API Integration

### 6.1 API Modules
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

### 6.2 Response Handling
- All API responses follow the backend's `{ success, data, message }` shape.
- Extract `data` inside the API module function, not in the hook or component.
- Surface `error.response.data.error.message` in user-facing error toasts.

## 7. Security Rules

- Sanitize any user-generated HTML before rendering (use a library like `dompurify`).
- Never store JWT tokens in localStorage — use httpOnly cookies or memory + refresh token rotation.
- Validate all form inputs before sending to the API.
- Do not expose the API key in client-side logs or error messages.

## 8. Performance Rules

- Use `next/image` for all images.
- Lazy-load off-screen components with `dynamic(() => import(...), { ssr: false })` where appropriate.
- Virtualise long lists (feed, messages) to avoid DOM bloat.
- Avoid unnecessary re-renders: memoize expensive computations with `useMemo`; stable callbacks with `useCallback`.

## 9. Testing

- Unit test utility functions and custom hooks.
- Integration test key user flows (login, create testimony, send message).
- Maintain 80%+ coverage on `src/hooks/` and `src/lib/`.
- Use Jest + React Testing Library.

## 10. Code Review Checklist

- [ ] No `any` types introduced.
- [ ] Loading, empty, and error states handled in every data-dependent component.
- [ ] New API calls go through a hook, not directly in a component.
- [ ] Mutations invalidate the correct query keys.
- [ ] Forms validate inputs and disable submit during loading.
- [ ] Dark mode variants added for new UI elements.
- [ ] No hardcoded strings that should be constants or env vars.
- [ ] Accessibility: interactive elements have labels, keyboard navigation works.
- [ ] README updated if new env vars, routes, or modules are added.

## 11. Do Not

- Do not create pages outside the `(auth)/` or `(main)/` route groups without a clear reason.
- Do not bypass the Axios instance for API calls.
- Do not store sensitive data unencrypted in localStorage or sessionStorage.
- Do not add new npm dependencies without checking if the need can be met by existing ones.
- Do not commit `.env.local` or any file containing real secrets.
