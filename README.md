# Testimonies Web Client

Twitter-like web client for testimonies, built with Next.js App Router, Tailwind, React Query, and Axios.

## 📋 Documentation

- **[Product Requirements Document (PRD)](./PRD.md)** — Full feature specifications for the web client
- **[Agent Guidelines](./AGENTS.md)** — Development rules and coding standards for AI agents

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create env file:
```bash
cp .env.example .env.local
```

3. Update values in `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_API_KEY`

4. Start development:
```bash
npm run dev
```

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run build`

## Architecture

- App routes: `src/app`
- Shared UI: `src/components/common`
- Domain hooks: `src/hooks`
- Infrastructure: `src/lib`
- PRD docs: `docs/prd`

## Implemented Modules

- Auth (password + OTP flow)
- Feed/testimonies/replies/likes
- Profiles/follow flow
- Messaging (send/edit/delete/read)
- Subscription (plans/status/history/cancel)
- Promotions (create/activate/deactivate/delete)
- Team (members/roles/assign/deactivate/reactivate)
