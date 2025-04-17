# YouTube Thumbnail Generator MVP Tasks (ThumbAI)
<!-- MVP only – stick to core features until validated -->

## Project Setup
- [x] Initialize Next.js project
- [x] Set up project structure (pages, components, API routes)
- [x] Configure basic styling with Tailwind CSS
- [x] Set up environment variables for API keys

## Frontend Implementation
- [x] Build dashboard page (where users interact with the tool)
- [x] Build upload component for sketch/image
- [x] Implement canvas for drawing rough sketches
- [x] Build reference photo upload component (multiple files)
- [x] Create text prompt input with guidelines
- [x] Design thumbnail preview gallery component
- [x] Implement loading/processing state UI

## Backend Implementation
- [x] Set up API endpoint for thumbnail generation
- [x] Implement file upload handling and storage
- [x] Integrate with AI API (Anthropic/OpenAI) for image generation
- [x] Create prompt engineering logic to optimize thumbnails for CTR
- [x] Implement error handling for API calls
- [x] Add rate limiting to prevent abuse
- [x] Add download functionality for generated thumbnails

## Thumbnail Generation Logic
- [x] Design prompt template incorporating user inputs
- [x] Set parameters for generating high-CTR thumbnails (contrast, emotion, etc.)
- [x] Implement logic to generate multiple variations
- [x] Add fallback mechanism if AI generation fails

## Asynchronous Processing Architecture (To avoid Vercel timeouts)
- [x] Choose and research an asynchronous task execution method (e.g., Inngest, Zeplo, BullMQ, Vercel Background Functions)
- [x] Install and configure the chosen task queue/system
- [x] Refactor the thumbnail generation API endpoint:
    - [x] Modify endpoint to enqueue the generation job instead of running it synchronously
    - [x] Ensure endpoint returns an immediate success response to the client
- [x] Create a separate worker/handler function:
    - [x] Implement logic to pull jobs from the queue
    - [x] Execute the actual AI image generation and storage logic within this worker
- [x] Update frontend to handle asynchronous flow (e.g., show processing state, poll for results, or implement WebSockets)
- [x] Test the end-to-end asynchronous flow thoroughly
- [x] Deploy and monitor the new architecture

## Stripe Integration
- [ ] Set up Stripe account and test mode
- [x] Create simple checkout page for $5/month subscription
- [ ] Implement Stripe payment processing API endpoint
- [x] Add success/failure handling for payments
- [ ] Implement basic session tracking (no login, but track payment status)

## Testing & Deployment
- [ ] Manually test all user flows
- [x] Deploy to Vercel/Netlify
- [ ] Test payment flow in production with test cards
- [ ] Set up basic analytics to track usage

## Nice-to-have (If Time Permits)
- [ ] Implement basic image editing tools for generated thumbnails
- [ ] Add option to regenerate specific thumbnails
- [ ] Create simple "save for later" functionality using local storage
- [ ] Add social sharing options
