# Testimonies Web Client PRD

## Product Goal
Build a Twitter-like web experience for sharing testimonies, replies, and faith-driven conversations, fully integrated with the existing user APIs.

## Users
- Individual users sharing testimonies and engaging through likes/replies/follows.
- Organizations managing branded profiles, team members, promotions, and broadcast workflows.

## Success Metrics
- Signup to first-post conversion.
- Feed engagement: likes, replies, shares/follows.
- 7-day retention and repeat posting.
- Message response rate.

## Core Capabilities
1. Authentication and account lifecycle (signup/signin OTP/password, sessions, reset password).
2. Social graph and profiles (follow/unfollow, followers/following, blocks, profile visibility).
3. Feed and testimonies (create/read/update/delete testimonies, replies, likes, trending/tags).
4. Messaging (contacts, conversations, read states, edit/delete message).
5. Monetization and growth (subscription, promotions, optional team workflows for organizations).
6. Utility and support (FAQ, address lookup, share profile URLs).

## Functional Requirements
- All user API domains mapped to frontend hooks and pages.
- Route protection for authenticated areas.
- Unified design system and reusable components based on provided screens.
- Loading, empty, error, optimistic update states for user actions.

## Non-Functional Requirements
- Next.js App Router + TypeScript strict.
- Tailwind-based themed design tokens.
- React Query for remote state caching and invalidation.
- Axios transport with auth + API-key headers.

## Out of Scope
- Admin platform features.
- Unimplemented backend realtime socket events (fallback polling used where needed).
