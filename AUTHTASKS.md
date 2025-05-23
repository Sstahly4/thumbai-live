# Authentication & User Management Tasks (ThumbAI)

## Phase 1: Basic User Authentication with NextAuth.js & Prisma

### P1.1: Setup & Installation
- [x] **Task P1.1.1:** Install NextAuth.js and necessary dependencies:
    - Run `npm install next-auth`
- [x] **Task P1.1.2:** Install Prisma and related dependencies:
    - Run `npm install prisma --save-dev`
    - Run `npm install @prisma/client`
    - Run `npm install @next-auth/prisma-adapter`
- [x] **Task P1.1.3:** Initialize Prisma:
    - Run `npx prisma init --datasource-provider sqlite` (We'll start with SQLite for simplicity, can change to PostgreSQL/MySQL later if needed)

### P1.2: Prisma Schema Configuration
- [x] **Task P1.2.1:** Define NextAuth.js models in `prisma/schema.prisma`:
    - Add `User`, `Account`, `Session`, `VerificationToken` models as per NextAuth.js documentation.
    - Add a `Subscription` model (or fields to `User`) to store plan details (e.g., `planId`, `stripeCustomerId`, `stripeSubscriptionId`, `stripeSubscriptionStatus`, `currentPeriodEnd`). Initially, these can be optional.
    - Example `User` model fields:
        - `id            String    @id @default(cuid())`
        - `name          String?`
        - `email         String?   @unique`
        - `emailVerified DateTime?`
        - `image         String?`
        - `password      String?` (for credentials provider)
        - `accounts      Account[]`
        - `sessions      Session[]`
        - `stripeCustomerId         String?   @unique`
        - `stripeSubscriptionId     String?   @unique`
        - `stripePriceId            String?`
        - `stripeCurrentPeriodEnd   DateTime?`
        - `stripeSubscriptionStatus String?` // e.g., "active", "canceled", "incomplete", "past_due"
        - `planType                 String?`   // e.g., "free", "hobby", "creator", "pro"
        - `credits                  Int?      @default(1)` // For free trial/plan
- [x] **Task P1.2.2:** Run initial Prisma migration:
    - Run `npx prisma migrate dev --name init_auth` (This will create the database and apply the schema)
- [x] **Task P1.2.3:** Generate Prisma Client:
    - Run `npx prisma generate` (This should also run automatically after `migrate dev`)

### P1.3: NextAuth.js Configuration
- [x] **Task P1.3.1:** Create NextAuth.js API route:
    - Create file `app/api/auth/[...nextauth]/route.ts`.
- [x] **Task P1.3.2:** Configure NextAuth.js options in the API route:
    - Import `NextAuth` and necessary providers.
    - Instantiate `PrismaAdapter` and connect it.
    - Add `EmailProvider` for passwordless sign-in (magic links).
        - Requires setting up an email sending service (e.g., Resend, Nodemailer with SMTP - will need further setup and env vars for this). For now, magic links might only log to console if email sending isn't fully configured.
    - Add `CredentialsProvider` for email/password login.
        - Implement `authorize` function to find user by email and verify password (will need password hashing like `bcryptjs`).
    - Define session strategy (e.g., `jwt`).
    - Add `NEXTAUTH_SECRET` to environment variables.
    - Add `NEXTAUTH_URL` to environment variables.
- [x] **Task P1.3.3:** Create Prisma client instance:
    - Create a singleton Prisma client instance (e.g., in `lib/prisma.ts`).

### P1.4: Environment Variables
- [x] **Task P1.4.1:** Create or update `.env.local` file:
    - Add `DATABASE_URL` (Prisma will set a default for SQLite like `file:./dev.db`).
    - Add `NEXTAUTH_SECRET` (generate a strong secret key).
    - Add `NEXTAUTH_URL="http://localhost:3000"` (for local development).
    - (Later) Add email server variables for `EmailProvider` (e.g., `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_FROM`).
- [x] **Task P1.4.2:** Ensure `.env.local` is in `.gitignore`.

### P1.5: Frontend Integration
- [x] **Task P1.5.1:** Create a `SessionProvider` wrapper:
    - Create a client component (e.g., `components/AuthProvider.tsx` or `components/SessionProviderWrapper.tsx`) that wraps children with NextAuth.js's `SessionProvider`.
- [x] **Task P1.5.2:** Update root layout (`app/layout.tsx`):
    - Import and use the `SessionProvider` wrapper to make session data available to the entire app.
- [ ] **Task P1.5.3:** (Optional) Add basic sign-in/sign-out buttons to the header/navigation for testing.
    - Use `useSession`, `signIn()`, `signOut()` from `next-auth/react`.

### P1.6: Basic Signup & Login Pages
- [x] **Task P1.6.1:** Update `app/signup/page.tsx`:
    - Implement a form to capture email (and optionally password).
    - On submit, call `signIn()` with the chosen provider (e.g., 'email' for magic link, or 'credentials' if password provided).
- [x] **Task P1.6.2:** Create `app/login/page.tsx`:
    - Implement a form for email and password.
    - On submit, call `signIn('credentials', { email, password, redirect: false })`.
    - Handle login errors.
- [x] **Task P1.6.3:** Protect `app/dashboard/page.tsx`:
    - Use `useSession` to check for authentication status.
    - Redirect unauthenticated users to the login page.

## Phase 2: Stripe Integration for Payments & Subscriptions
- (Tasks to be defined later)

## Phase 3: Advanced User Management & Plan Logic
- (Tasks to be defined later) 




## Phase 4: Interactive Creator Wall of Fame (Mockup Generator)

### P4.1: Core Mockup Generation Logic
- [ ] **Task P4.1.1:** Design 3-5 base thumbnail template images (for various niches like gaming, tech, beauty, fitness).
- [ ] **Task P4.1.2:** Decide on mockup generation technology:
    - Option A: Client-side (JavaScript Canvas API for text overlay + watermark).
    - Option B: Server-side (Lightweight API endpoint for image generation).
- [ ] **Task P4.1.3:** Implement the chosen mockup generation logic.
    - Input: User text (channel name/niche), chosen template ID.
    - Process: Overlay text on template, add "Made with ThumbAI" watermark.
    - Output: Generated watermarked image (e.g., data URL or image path).

### P4.2: "Creator Wall of Fame" Component & Initial Display
- [ ] **Task P4.2.1:** Decide on component strategy:
    - Option A: Heavily modify existing `thumbai/components/parallax-section.tsx`.
    - Option B: Create new dedicated component (e.g., `thumbai/components/interactive-creator-wall.tsx`).
- [ ] **Task P4.2.2:** Implement chosen component structure for the grid display.
    - Initially, populate grid with 5-6 pre-generated AI mockups (using logic from P4.1.3) for various niches (e.g., "FutureTech Reviews," "EpicGameplay"). These should be watermarked.
    - Design and implement 1-2 "Reserved for You" / "Claim Your Spot" CTA slots in the grid, possibly with a pulsing animation or distinct styling. These slots will trigger the mockup interaction.

### P4.3: User Interaction Flow for Mockup Generation
- [ ] **Task P4.3.1:** Implement UI for mockup generation trigger (e.g., on clicking a "Claim Your Spot" CTA).
    - This UI should include a text input field for "Your Channel Name / Niche".
    - Optionally, allow selection from the 3-5 base templates.
- [ ] **Task P4.3.2:** Implement client-side logic to:
    - Take user input and selected template.
    - Call mockup generation function (from P4.1.3).
    - Display the returned watermarked mockup (e.g., replacing the "Claim Your Spot" slot, or in a dedicated preview area/modal).
- [ ] **Task P4.3.3:** After mockup display, show a clear CTA: "Publish to Wall & Remove Watermark – Sign Up Now!" linking to `/signup`.
- [ ] **Task P4.3.4:** (Optional) Allow user to screenshot/download their watermarked mockup.

### P4.4: Post-Sign-up Integration (Future Phase)
- [ ] **Task P4.4.1:** Define how a newly signed-up user's generated mockup (or a new thumbnail they create) replaces a placeholder or their mockup on the Wall of Fame.
- [ ] **Task P4.4.2:** Develop system to feature actual user-generated thumbnails (non-watermarked) on the Wall of Fame, replacing the initial AI-generated watermarked mockups over time.
- [ ] **Task P4.4.3:** Consider "Creator of the Week/Month" feature to incentivize engagement.



## Phase 5: Dashboard Account Settings Page

### P5.1: Setup, Navigation, and Basic Structure
- [x] **Task P5.1.1:** Design and implement user avatar/icon button in the main dashboard header.
    - Clicking this button should navigate to the account settings page (e.g., `/dashboard/settings`).
- [x] **Task P5.1.2:** Create the new account settings page component at `app/dashboard/settings/page.tsx`.
    - Implement a basic responsive two-column layout (inspired by the provided image) using Tailwind CSS. Main page title: "Settings". Subtitle: "You can manage your account, billing, and team settings here."
- [ ] **Task P5.1.3:** Protect the `/dashboard/settings` route. (DONE: Page accessible to all authenticated users. Subscription status will gate specific features/content *within* the page, not access to the page itself.)
    - Ensure user is authenticated (redirect to `/login` if not). (DONE)
    - Ensure user has an active subscription (e.g., `session.user.planType` is not 'free' or `stripeSubscriptionStatus` is 'active'). (DEFERRED to in-page component logic: Components will adapt based on plan type - e.g. show 'Upgrade' vs 'Manage Subscription')

### P5.2: Left Column Components - User & Account Details (UI First)
- [x] **Task P5.2.1:** Create `BasicInfoCard.tsx` component (`components/dashboard/settings/BasicInfoCard.tsx`).
    - UI: Display section title "Basic Information".
    - UI: Placeholder for user avatar (e.g., initials circle), name, and email fields.
- [x] **Task P5.2.2:** Create `AccountCard.tsx` component (`components/dashboard/settings/AccountCard.tsx`).
    - UI: Display section title "Account".
    - UI: Placeholder for Account Type (e.g., "Pro" badge) and an "Upgrade to Business" button.
    - UI: "Manage Subscription" button.
    - UI: "Advanced" collapsible/dropdown section (initially closed, no content needed yet).
- [x] **Task P5.2.3:** Create `ActiveSessionsCard.tsx` component (`components/dashboard/settings/ActiveSessionsCard.tsx`).
    - UI: Display section title "Active Sessions".
    - UI: List 2-3 mock active sessions with device type, creation time (e.g., "Desktop App Session - Created 3 months ago"), and a "Revoke" button for each.

### P5.3: Right Column Components - Usage & Billing Details (UI First)
- [x] **Task P5.3.1:** Create `UsageCard.tsx` component (`components/dashboard/settings/UsageCard.tsx`).
    - UI: Display section title "Usage".
    - UI: Text "Requests will refresh in X days" (mock data).
    - UI: Mock progress bars for "Premium models" (e.g., 450/500) and "Free models" (e.g., 0/No Limit).
    - UI: Mock status text like "You've hit your limit..." or "You've used 0 requests...".
    - UI: Informational text block: "Usage-based pricing allows you to pay for extra requests... Learn more" (link can be #).
    - UI: "Settings" subsection title.
    - UI: Toggles for "Enable usage-based pricing" and "Enable usage-based pricing for premium models".
    - UI: "Monthly spending limit:" label with a mock input field (e.g., showing $0).
    - UI: "Save" button.
- [x] **Task P5.3.2:** Create `CurrentUsageCard.tsx` component (`components/dashboard/settings/CurrentUsageCard.tsx`).
    - UI: Display section title "Current Usage".
    - UI: Mock current spending (e.g., "$0.04 of $0 limit").
    - UI: Month navigation (e.g., "< May 2025 >").
    - UI: Text about extra request costs (e.g., "1 extra fast premium request beyond 500/month * 4 cents per such request ... $0.04").
    - UI: "View Pricing Details" expandable section (initially closed, no content needed yet).
- [x] **Task P5.3.3:** Create `RecentUsageEvents.tsx` component (`components/dashboard/settings/RecentUsageEvents.tsx`).

### P5.4: Styling and Component Integration
- [x] **Task P5.4.1:** Integrate all created card components (`BasicInfoCard`, `AccountCard`, `ActiveSessionsCard`, `UsageCard`, `CurrentUsageCard`, `RecentUsageEvents`).



## Phase 6: Real Data Implementation for Account Settings

### P6.1: Active Sessions - Backend (Revised)
- [x] **Task P6.1.1:** Enhance Prisma `Session` model in `prisma/schema.prisma` to store `ipAddress`, `userAgent`, `location`, and `lastSeenAt`.
- [x] **Task P6.1.2:** Run Prisma migration for session-related model changes.
- [x] **Task P6.1.3:** Move session tracking from middleware to proper locations:
    - [x] Remove all Prisma usage from `middleware.ts`
    - [x] Add session tracking to NextAuth.js events in `lib/auth.ts` (for `lastSeenAt`)
    - [x] Update session info in the `signIn` and `session` events (for `lastSeenAt`; IP/UserAgent collection via `/api/user/session-update` is currently on hold due to errors)
- [ ] **Task P6.1.4:** Create API routes for session management:
    - [x] Implement `/api/user/sessions` GET route to fetch active sessions
    - [x] Implement `/api/user/sessions/{id}` DELETE route to revoke sessions

### P6.2: Active Sessions - Frontend
- [ ] **Task P6.2.1:** Modify `ActiveSessionsCard.tsx` to fetch session data from the API. (Reverted to mock data, real data fetching on hold)
- [ ] **Task P6.2.2:** Implement "Revoke" button functionality to call the DELETE endpoint. (Currently mocked with local state change)
- [ ] **Task P6.2.3:** Update UI to display actual session data (IP, user agent, last seen time). (On Hold - Reverted to mock data due to issues with IP/UserAgent collection and display preferences)

### P6.3: Authentication Error Handling & Recovery
- [x] **Task P6.3.1:** Implement robust error handling in NextAuth.js configuration.
- [x] **Task P6.3.2:** Add session recovery mechanism.
- [x] **Task P6.3.3:** Enhance client-side error handling.

### P6.4: Usage Tracking & Credits - Backend
- [ ] **Task P6.4.1:** Enhance `User` model with usage tracking fields.
- [ ] **Task P6.4.2:** Create usage tracking middleware.
- [ ] **Task P6.4.3:** Implement rate limiting and security measures.

### P6.5: Usage Stats API
- [ ] **Task P6.5.1:** Create new API endpoints for usage statistics.
- [ ] **Task P6.5.2:** Implement data aggregation for usage metrics.
- [ ] **Task P6.5.3:** Add monitoring and alerting.

### P6.6: Frontend Integration
- [ ] **Task P6.6.1:** Update dashboard components to display new metrics.
- [ ] **Task P6.6.2:** Implement real-time updates.
- [ ] **Task P6.6.3:** Enhance user feedback.

## Phase 7: Interactive Creator Wall of Fame (Mockup Generator)

### P7.1: Core Mockup Generation Logic
- [ ] **Task P7.1.1:** Design 3-5 base thumbnail template images (for various niches like gaming, tech, beauty, fitness).
- [ ] **Task P7.1.2:** Decide on mockup generation technology:
    - Option A: Client-side (JavaScript Canvas API for text overlay + watermark).
    - Option B: Server-side (Lightweight API endpoint for image generation).
- [ ] **Task P7.1.3:** Implement the chosen mockup generation logic.
    - Input: User text (channel name/niche), chosen template ID.
    - Process: Overlay text on template, add "Made with ThumbAI" watermark.
    - Output: Generated watermarked image (e.g., data URL or image path).

### P7.2: "Creator Wall of Fame" Component & Initial Display
- [ ] **Task P7.2.1:** Decide on component strategy:
    - Option A: Heavily modify existing `thumbai/components/parallax-section.tsx`.
    - Option B: Create new dedicated component (e.g., `thumbai/components/interactive-creator-wall.tsx`).
- [ ] **Task P7.2.2:** Implement chosen component structure for the grid display.
    - Initially, populate grid with 5-6 pre-generated AI mockups (using logic from P7.1.3) for various niches (e.g., "FutureTech Reviews," "EpicGameplay"). These should be watermarked.
    - Design and implement 1-2 "Reserved for You" / "Claim Your Spot" CTA slots in the grid, possibly with a pulsing animation or distinct styling. These slots will trigger the mockup interaction.

### P7.3: User Interaction Flow for Mockup Generation
- [ ] **Task P7.3.1:** Implement UI for mockup generation trigger (e.g., on clicking a "Claim Your Spot" CTA).
    - This UI should include a text input field for "Your Channel Name / Niche".
    - Optionally, allow selection from the 3-5 base templates.
- [ ] **Task P7.3.2:** Implement client-side logic to:
    - Take user input and selected template.
    - Call mockup generation function (from P7.1.3).
    - Display the returned watermarked mockup (e.g., replacing the "Claim Your Spot" slot, or in a dedicated preview area/modal).
- [ ] **Task P7.3.3:** After mockup display, show a clear CTA: "Publish to Wall & Remove Watermark – Sign Up Now!" linking to `/signup`.
- [ ] **Task P7.3.4:** (Optional) Allow user to screenshot/download their watermarked mockup.

### P7.4: Post-Sign-up Integration (Future Phase)
- [ ] **Task P7.4.1:** Define how a newly signed-up user's generated mockup (or a new thumbnail they create) replaces a placeholder or their mockup on the Wall of Fame.
- [ ] **Task P7.4.2:** Develop system to feature actual user-generated thumbnails (non-watermarked) on the Wall of Fame, replacing the initial AI-generated watermarked mockups over time.
- [ ] **Task P7.4.3:** Consider "Creator of the Week/Month" feature to incentivize engagement.

## Phase 8: Database Connection & Session Troubleshooting (REPLACED)

### P8.1: Session Management Best Practices
- [ ] **Task P8.1.1: Implement proper session tracking:**
    - Move all database operations out of middleware
    - Use NextAuth.js events for session updates
    - Use API routes for session management
    - Implement proper error handling
- [ ] **Task P8.1.2: Add session monitoring:**
    - Log session creation/deletion events
    - Track session duration and activity
    - Monitor for suspicious patterns
- [ ] **Task P8.1.3: Implement session cleanup:**
    - Add automated cleanup for expired sessions
    - Handle orphaned sessions
    - Implement session revocation cascade

## Phase 9: Payment-First Onboarding Flow

### P9.1: Email-Based Signup (No Password)
- [x] **Task P9.1.1:** Create API route `thumbai/app/api/auth/check-user-status/route.ts` to check if an email exists.
- [x] **Task P9.1.2:** Update `thumbai/app/signup/page.tsx`'s `handleSubmit` to call the `check-user-status` API.
    - If new user, redirect to `/initiate-payment?email=...`.
    - If existing user, show an error message.
- [x] **Task P9.1.3:** Create placeholder page `thumbai/app/initiate-payment/page.tsx`.

### P9.2: Stripe Checkout Integration
- [ ] **Task P9.2.1:** Set up Stripe account and get API keys.
- [ ] **Task P9.2.2:** Add Stripe API keys to `.env.local`.
- [ ] **Task P9.2.3:** Create API route (e.g., `/api/stripe/create-checkout-session`) that takes an email and plan details, then creates a Stripe Checkout session.
- [ ] **Task P9.2.4:** Update `thumbai/app/initiate-payment/page.tsx` to call this API and redirect the user to Stripe Checkout.
- [ ] **Task P9.2.5:** Create a Stripe webhook handler (e.g., `/api/stripe/webhook`) to listen for `checkout.session.completed` events.
- [ ] **Task P9.2.6:** In the webhook:
    - If the user is new (based on `client_reference_id` or metadata passed to Stripe containing the email), create a new user in the database with the Stripe Customer ID and subscription details.
    - If the user exists, update their record with the Stripe Customer ID and subscription details.
    - Log the user in programmatically (e.g., by creating a session).

### P9.3: Post-Payment Dashboard Onboarding
- [ ] **Task P9.3.1:** After successful payment and webhook processing, redirect the user to the dashboard (or a specific onboarding page like `/dashboard/welcome`).
- [ ] **Task P9.3.2:** On the dashboard/welcome page for new users, prompt them to set their name.
- [ ] **Task P9.3.3:** (Optional) Prompt new users to set a password for future logins (or emphasize magic link/OAuth).
- [ ] **Task P9.3.4:** Update `User` model in `prisma/schema.prisma` to include a flag like `hasCompletedOnboarding` or `nameSet`.

### P9.4: Email Login for Existing Users
- [ ] **Task P9.4.1:** On the login page (`thumbai/app/login/page.tsx`), if a user enters an email and a password field is present:
    - Attempt standard credentials login.
- [ ] **Task P9.4.2:** Implement a "Send Magic Link" option on the login page.
    - When clicked, user enters email.
    - Call NextAuth's `signIn('email', { email, redirect: false })`.
    - Show a confirmation message to check their email.

### P9.5: OAuth Integration with Payment Flow
- [ ] **Task P9.5.1:** When a user signs up with OAuth:
    - After successful OAuth, check if the user exists in the database.
    - If new OAuth user, redirect them to the `/initiate-payment?email=...` page (or directly to Stripe Checkout, passing user details).
    - Stripe webhook will handle user creation/update as in P9.2.
- [ ] **Task P9.5.2:** When an existing user signs in with OAuth, log them in as normal.