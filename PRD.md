# Testimonies.com Web Client — Product Requirements Document (PRD)

## 1. Product Overview

### 1.1 Vision

The Testimonies.com web client is a Twitter-like platform where users share, discover, and engage with testimonies of God's goodness. It serves as both a public social feed and a personal spiritual diary accessible from any browser.

### 1.2 Mission

- Provide a seamless, accessible web experience for testimony sharing across all languages and cultures.
- Enable real-time social interactions: likes, replies, follows, and messaging.
- Offer premium tools for verified users including analytics, advertising, and broadcast management.
- Maintain a safe, faith-positive environment through moderation and reporting tools.

### 1.3 Target Users

- **Individual users (personal accounts)**: Share testimonies, follow channels, engage with content.
- **Organizations**: Manage branded channels, receive broadcast testimonies, manage teams.
- **Guests (logged-out)**: Browse trending testimonies with limited interaction.

---

## 2. Application Layout & Navigation

### 2.1 Logged-Out Welcome Screen

- Snapshot of recent trending testimonies (read-only, no interactions).
- Right sidebar: description of what Testimonies.com is about.
- Top-right area: advertisement slot.
- Left sidebar menus: Home, Help, Sign Up, Login, Premium, Promote.

### 2.2 Logged-In Home Layout

- Left sidebar menus: Home, Profile, Promote, Premium (if not subscribed), Dashboard (if subscribed), Help, Account Dropdown (logout / add account / switch account).
- Organization accounts additionally see a **Teams** menu item in the left sidebar.
- Right sidebar (top): suggested accounts to follow.
- Right sidebar (second): top trending testimonies.
- Right sidebar (top area): advertisement slot.
- Right sidebar (bottom, unsubscribed): subscription upsell description.
- Right sidebar (bottom, subscribed): mini analytics chart with link to full dashboard.

---

## 3. Authentication

### 3.1 Account Type Selection

- User selects **Personal** or **Organization** account before registration.

### 3.2 Registration

- **Personal**: Username, email, phone number, password.
- **Organization**: Display name (checked for uniqueness against verified accounts), headquarters address, email, contact number.
- Validation rules:
  - Username: unique, 3–30 chars, alphanumeric + underscore.
  - Email and phone number: unique, valid formats.
  - Password: 8+ characters, mixed case, number, special character.
- Age restriction: 16+ years minimum (organizations: founder must be 16+).
- Email and phone number verification on registration.

### 3.3 Login

- Username/email + password.
- 2FA enabled by default (email/SMS OTP) with explanation of why it matters.

### 3.4 Forgot Password

- Email-based reset flow.

### 3.5 Session Management

- JWT-based sessions with refresh token support.
- Support for multiple accounts (add/switch account).

---

## 4. Profile

### 4.1 Profile Display

- Profile image, cover photo, display name, bio, username, follower/following counts.
- Verified badge for verified accounts.
- Account type indicator (personal vs. organisation).
- Subscription status and link to upgrade if not subscribed.

### 4.2 Profile Actions

- Edit profile (display name, bio, contact info — differs by account type).
- Update profile image and cover photo.
- Share profile URL.
- Make profile public or private (private hides profile and all testimonies).
- Delete account (cascades to all testimonies and user data).

### 4.3 Theme

- Light/dark mode toggle; preference saved per device (not per profile).

### 4.4 Organization Profile Extras

- Team module visible only to the organization email owner.
- Broadcast tab showing received broadcast testimonies.
- Broadcast request management (approve/reject) if vetting is enabled.

---

## 5. Home Feed

### 5.1 Feed Content

- Normal posts from followed accounts.
- Broadcast posts from followed accounts (with broadcast indicator).
- Posts that followed accounts have interacted with.
- Top trending posts from accounts the user does not follow.
- Promoted/sponsored posts (with "Sponsored" tag).

### 5.2 Feed Interactions

- Like, reply, share on each post.
- Report/flag inappropriate content.
- Infinite scroll with pull-to-refresh equivalent (auto-load on scroll).

---

## 6. Testimonies

### 6.1 Creation Entry Points

- Main dialog box on the home screen with placeholder: _"Share what God did for you"_.
- Floating action button (bottom-right) for quick access.

### 6.2 Content Formats

| Format | Free Limit                    | Premium Limit                     | Notes                            |
| ------ | ----------------------------- | --------------------------------- | -------------------------------- |
| Text   | 100 characters, no formatting | 2,000 characters, rich formatting | Can be accompanied by images     |
| Video  | 1 minute                      | 1 hour                            | —                                |
| Audio  | 10 minutes                    | 1 hour                            | Auto-transcribed by the platform |

### 6.3 Privacy

- Default: public. Users can change default to private.
- Per-post privacy toggle (public / private).

### 6.4 Testimony Management

- View all own testimonies on profile page.
- Edit testimony (subscribed users only).
- Delete testimony.

### 6.5 Interactions

- Like, reply (comments), share.
- Replies are threaded under the testimony.
- Flag/report content.

### 6.6 Search & Discovery

- Full-text search across testimonies and users.
- Filter by date, language, content type.
- Trending testimonies section.

### 6.7 Reminders

- Platform sends periodic reminders of liked or saved testimonies to stir up faith (handled by backend jobs; web client displays notification/reminder UI).

---

## 7. Testimony Broadcasts

### 7.1 Sending a Broadcast

- While creating a testimony, user can select a verified organization to broadcast to.
- Broadcast format: text only.
- Only subscribed (verified) users can send broadcast posts.
- Unsubscribed users can send the testimony directly to the organization's inbox instead.
- Spam prevention: a user cannot broadcast the same post to multiple organizations repeatedly.

### 7.2 Organization Broadcast Management

- Broadcast tab on organization profile page.
- Organization can enable manual vetting (approve/reject each broadcast) or auto-approval.
- Controls to delete broadcast posts from their page.
- Archive broadcasts to remove them from the public page.
- Premium organizations can approve or decline incoming broadcasts.

### 7.3 Feed Display

- Broadcast posts appear in the feed with a broadcast indicator.

---

## 8. Social Graph

### 8.1 Follow / Unfollow

- Follow and unfollow any public account or organization.
- Follow requests for private accounts.

### 8.2 Followers & Following

- View followers and following lists with search.
- Mutual connection indicators.

### 8.3 Blocking & Reporting

- Block users (removes them from feed and messaging).
- Report accounts and content.

### 8.4 Recommendations

- Suggested accounts based on liked, shared, and commented content.
- Displayed in right sidebar and on a dedicated discovery page.

---

## 9. Messaging

### 9.1 Access

- Available to all users; premium accounts have spam protection and verified-only filters.

### 9.2 Features

- Real-time text and emoji messaging.
- Typing indicator, delivered status, read receipts.
- Edit a message within a specified time window.
- Delete a message (for self or for everyone).
- Conversation history with full-text search.
- Unread message count management.

### 9.3 Privacy Controls

- User can restrict who can message them: followers only, all organizations, only verified accounts, etc.
- Block and unblock users.

---

## 10. Subscription & Premium

### 10.1 Subscription Flow

1. User initiates subscription from profile or premium page.
2. Submits identity documents for KYC and liveness check.
3. Completes payment (Stripe / Paystack / Flutterwave).
4. Account is verified and premium features are unlocked.

- Payment may be collected before document submission to keep the user engaged; premium features unlock only after document approval.

### 10.2 Subscription Details Page

- Current plan, renewal date, payment history.
- Cancel subscription option.
- Benefits comparison (free vs. premium).

### 10.3 Premium Features Unlocked

- Verified profile badge.
- Extended text (2,000 chars), audio (1 hr), video (1 hr) limits.
- Rich text formatting.
- Post analytics dashboard.
- Access to advertising / promotions.
- Advanced messaging filters.
- Ability to approve/decline broadcast posts.
- Scheduled posts (future).

---

## 11. Promotions & Advertising

### 11.1 Access

- Only subscribed (verified) accounts can create promotions.
- Unsubscribed users are prompted to subscribe.

### 11.2 Campaign Types

- **General advert**: Promotes a product, service, or church program. Appears in dedicated ad sections.
- **Promoted testimony post**: Makes a specific testimony go viral. Appears in users' feeds with a "Sponsored" tag.

### 11.3 Campaign Management

- Starting page explains how promotions work.
- If user has at least one past campaign, show list of all campaigns.
- Create new campaign, learn about promotions, search/filter/delete/edit campaigns.
- Deactivate / activate campaign.
- Edit campaign (critical fields locked after activation).

### 11.4 Ad Opt-Out

- Subscribed users can opt out of certain or all promotion types.

---

## 12. Team Management (Organizations)

### 12.1 Access

- Visible only to the organization email owner in the left sidebar.
- Personal account holders can manage both personal and organization accounts.

### 12.2 Features

- List all team members with their permissions.
- Add team members by username (they must already have an account).
- Edit team member permissions.
- Remove team member.
- View team member activity history (limited to organization email access).
- Full search, pagination, and filter on all team data.

---

## 13. Analytics Dashboard (Premium)

### 13.1 Post Analytics

- Impressions, likes, comments, shares per testimony.

### 13.2 Account Analytics

- Follower count and growth over time.
- Subscription status and link to subscription page.
- Account creation date and lifetime stats.

### 13.3 Team Analytics (Organizations)

- Team member response rate and speed.
- Link to view detailed activity per team member.

---

## 14. Content Moderation & Safety

### 14.1 User-Facing Controls

- Report accounts and individual posts/comments.
- Flag inappropriate content.
- Hide comments on own posts.
- Block users.

### 14.2 Platform Notices

- Prominent education banners warning users about scams, fake prophets, and impersonation.
- Clear community guidelines accessible from all pages.

---

## 15. Search & Discovery

- Global search bar: search users, testimonies, hashtags.
- Filter results by content type, date, language.
- Trending section on home feed and dedicated explore page.
- Location-aware discovery (future).

---

## 16. Notifications

- In-app notification centre: likes, replies, follows, broadcast requests, messages, subscription updates, reminders.
- Notification preferences (granular opt-in/out per type).

---

## 17. Help & Support

- FAQ page.
- Contact support form.
- Community guidelines page.
- Privacy policy and terms of service pages.
- Scam awareness and safety education page.

---

## 18. Non-Functional Requirements

### 18.1 Tech Stack

- **Framework**: Next.js (App Router) with TypeScript strict mode.
- **Styling**: Tailwind CSS with design tokens.
- **Data Fetching**: React Query for remote state, caching, and invalidation.
- **HTTP**: Axios with auth + API-key headers injected via interceptors.
- **Real-time**: Socket.io client for messaging and live feed updates.

### 18.2 Performance

- Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1.
- Infinite scroll with virtualization for large feeds.
- Image optimization via Next.js Image component.
- API response caching with React Query.

### 18.3 Accessibility

- WCAG 2.1 AA compliance.
- Keyboard navigable, screen-reader friendly.
- Sufficient colour contrast in both light and dark modes.

### 18.4 Security

- Route protection for all authenticated pages.
- XSS prevention via sanitized rendering.
- CSRF protection.
- No sensitive data stored in localStorage unencrypted.

### 18.5 Internationalisation

- UI supports multiple languages (i18n-ready).
- Testimony content auto-translated via backend translation service.
