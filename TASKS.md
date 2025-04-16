# YouTube Thumbnail Generator MVP Tasks

## Project Setup
- [ ] Initialize Next.js project
- [ ] Set up project structure (pages, components, API routes)
- [ ] Configure basic styling with Tailwind CSS
- [ ] Set up environment variables for API keys

## Frontend Implementation
- [ ] Build dashboard page (where users interact with the tool)
- [ ] Build upload component for sketch/image
- [ ] Implement canvas for drawing rough sketches
- [ ] Build reference photo upload component (multiple files)
- [ ] Create text prompt input with guidelines
- [ ] Design thumbnail preview gallery component
- [ ] Implement loading/processing state UI

## Backend Implementation
- [ ] Set up API endpoint for thumbnail generation
- [ ] Implement file upload handling and storage
- [ ] Integrate with AI API (Anthropic/OpenAI) for image generation
- [ ] Create prompt engineering logic to optimize thumbnails for CTR
- [ ] Implement error handling for API calls
- [ ] Add rate limiting to prevent abuse
- [ ] Add download functionality for generated thumbnails

## Thumbnail Generation Logic
- [ ] Design prompt template incorporating user inputs
- [ ] Set parameters for generating high-CTR thumbnails (contrast, emotion, etc.)
- [ ] Implement logic to generate multiple variations
- [ ] Add fallback mechanism if AI generation fails

## Stripe Integration
- [ ] Set up Stripe account and test mode
- [ ] Create simple checkout page for $5/month subscription
- [ ] Implement Stripe payment processing API endpoint
- [ ] Add success/failure handling for payments
- [ ] Implement basic session tracking (no login, but track payment status)

## Testing & Deployment
- [ ] Manually test all user flows
- [ ] Deploy to Vercel/Netlify
- [ ] Test payment flow in production with test cards
- [ ] Set up basic analytics to track usage

## Nice-to-have (If Time Permits)
- [ ] Implement basic image editing tools for generated thumbnails
- [ ] Add option to regenerate specific thumbnails
- [ ] Create simple "save for later" functionality using local storage
- [ ] Add social sharing options
