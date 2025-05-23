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

## Inngest Integration Fixes (Resolving timeouts and 404 errors)
- [x] Debug and resolve Inngest 404 "Event key not found" error
  - [x] Verify correct event key naming conventions
  - [x] Ensure proper Inngest-Vercel permissions
- [x] Fix environment variable configuration
  - [x] Verify Vercel environment variables are correctly set
  - [x] Ensure proper environment-specific keys (Production vs Preview)
  - [x] Fix environment variable loading code to handle missing .env.local
- [x] Optimize Inngest configuration
  - [x] Configure appropriate timeouts for the function
  - [x] Set proper retry policy
  - [x] Ensure event subscriptions are correctly set up
- [x] Fix HTTP 405 Method Not Allowed error
  - [x] Verify Inngest API endpoint URLs and methods
  - [x] Check Inngest SDK version compatibility
  - [x] Configure apiUrl and event version explicitly
  - [x] Test with Inngest DevTools or CLI
  - [x] Implement direct fetch API workaround to bypass SDK issues
- [ ] Fix 404 Not Found error in Inngest API
  - [x] Update API endpoint URL to include trailing slash
  - [x] Ensure proper authentication header format
  - [x] Format payload according to Inngest API requirements
  - [ ] Add more detailed error logging for debugging
  - [ ] Validate Inngest account configuration
- [x] Reconfigure Inngest-Vercel integration
  - [x] Remove existing Inngest environment variables from Vercel
  - [x] Click "Configure" on the enabled "thumbai" project in Inngest
  - [x] Update the project settings and paths
  - [x] Generate new API keys if needed
  - [x] Add the new keys to Vercel environment variables
  - [x] Deploy with updated configuration
- [ ] Implement a reliable fallback mechanism
  - [x] Create a robust error handling system for Inngest failures
  - [x] Implement direct processing when appropriate
  - [ ] Provide clear logging for diagnostics
- [ ] Testing and validation
  - [ ] Test Inngest functions standalone
  - [ ] Verify end-to-end functionality
  - [ ] Confirm timeouts are properly handled
- [ ] Monitoring and observability
  - [ ] Set up Inngest dashboard monitoring
  - [ ] Implement detailed logging for Inngest job tracking
  - [ ] Add error reporting for failed jobs
- [ ] Local development setup
  - [ ] Configure Inngest for local development
  - [ ] Set up proper environment variable management
  - [ ] Create testing procedures for Inngest flows
- [ ] Documentation
  - [ ] Document Inngest configuration and setup
  - [ ] Provide troubleshooting guide for common issues
  - [ ] Document the fallback mechanism

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

## A/B Testing Thumbnails (Pro Feature)

### Backend Implementation (API & Inngest)
- [ ] **Task 1: Enhance System Prompt for Variations**
    - Modify `getSystemPrompt` function in `thumbai/app/api/generate/route.ts`.
    - Add an optional parameter (e.g., `variationType: 'main' | 'slight_variation' = 'main'`).
    - If `variationType` is `'slight_variation'`, append instructions to the base prompt asking for a single, clear visual difference suitable for A/B testing (e.g., different text color, slightly altered background hue, minor element change, add/remove an arrow). Emphasize keeping the core subject and composition the same.
    - Apply the same modification to `getSystemPrompt` in `thumbai/app/lib/inngest.ts`.

- [ ] **Task 2: Implement Pro Plan Simulation & Multi-Thumbnail Logic (API Route)**
    - In `thumbai/app/api/generate/route.ts` (`POST` handler):
        - Add a temporary boolean variable (e.g., `isProUser = true;`) to simulate a pro plan user. (Comment clearly that this needs to be replaced with actual user plan checking).
        - Determine `numThumbnailsToGenerate` (e.g., 2 if `isProUser` is true, else 1).
        - If `useInngest` is true, pass `numThumbnailsToGenerate` in the `data` payload when sending the event to Inngest.
        - For the direct generation path (if Inngest is not used or fails):
            - Implement a loop to generate `numThumbnailsToGenerate`.
            - In the first iteration (index 0), call `getSystemPrompt` with `variationType: 'main'`.
            - In subsequent iterations (index > 0), call `getSystemPrompt` with `variationType: 'slight_variation'`.
            - Collect all successfully generated thumbnail URLs into an array.
            - Ensure error handling within the loop correctly identifies which variation failed if an error occurs, and decide on a strategy (e.g., return successfully generated ones, or fail the whole batch).
        - Update the final response to include all generated thumbnail URLs.

- [ ] **Task 3: Update Inngest Function for Multi-Thumbnail Generation**
    - In `thumbai/app/lib/inngest.ts` (`generateThumbnail` function):
        - Retrieve `numThumbnailsToGenerate` from `event.data` (provide a default of 1 if not present for backward compatibility).
        - Implement a loop to generate `numThumbnailsToGenerate` images using `step.run` for each OpenAI call.
        - For the first image (index 0), call `getSystemPrompt` with `variationType: 'main'`.
        - For subsequent images (index > 0), call `getSystemPrompt` with `variationType: 'slight_variation'`.
        - Collect all successfully generated thumbnail URLs.
        - Update the job status in Redis with all generated thumbnail URLs.
        - Ensure robust error handling for each generation step within the loop.

### Frontend Implementation (Dashboard)
- [ ] **Task 4: Display Multiple Thumbnails**
    - Verify that `thumbai/app/dashboard/page.tsx` correctly displays multiple thumbnails if the API returns more than one in the `thumbnails` array. The existing `AspectRatioImage` component and mapping logic should handle this, but confirm.

- [ ] **Task 5: (Optional) Label A/B Test Thumbnails**
    - In `thumbai/app/dashboard/page.tsx`:
        - If two thumbnails are displayed, consider adding small UI labels (e.g., "Version A", "Version B" or "Original", "Variation") to distinguish them for the user.

### User Management & Monetization (Future Enhancement)
- [ ] **Task 6: Implement Real Pro Plan Check**
    - Replace the `isProUser` simulation in `thumbai/app/api/generate/route.ts` with actual logic.
    - This will likely involve:
        - Implementing user authentication (if not already present).
        - Checking the user's subscription status (e.g., querying a database or Stripe status) to determine if they are on a pro plan.

### Testing
- [ ] **Task 7: Test Pro Plan Flow**
    - With `isProUser` (or actual pro plan) enabled, verify that two thumbnails (main and variation) are generated and displayed.
    - Test with different prompts to ensure variations are subtle but noticeable.
- [ ] **Task 8: Test Basic Plan Flow**
    - With `isProUser` (or actual pro plan) disabled, verify that only one thumbnail is generated and displayed.
- [ ] **Task 9: Test Error Handling**
    - Simulate errors during the generation of one of the variations (for pro plan) and ensure the system handles it gracefully (e.g., returns the successfully generated one or an appropriate error message).

## AI-Powered Thumbnail Optimization (Pro Feature)

### Phase 1: Data Collection & Analysis Infrastructure
- [ ] **Task 1: Implement Click-Through Rate (CTR) Tracking**
    - Create new API endpoint `/api/analytics/ctr` to track thumbnail performance
    - Implement client-side tracking code for thumbnail clicks
    - Set up database schema for storing CTR data:
        - Thumbnail ID
        - View count
        - Click count
        - Timestamp
        - User ID (if authenticated)
        - Thumbnail metadata (style, colors, text placement)

- [ ] **Task 2: Thumbnail Feature Extraction**
    - Implement image analysis service to extract key features:
        - Dominant colors
        - Text placement and size
        - Face detection and emotion analysis
        - Object detection and positioning
        - Overall composition metrics
    - Store extracted features in database with thumbnail metadata

- [ ] **Task 3: Performance Analytics Dashboard**
    - Create new route `/dashboard/analytics` for pro users
    - Build UI components for displaying CTR metrics
    - Implement data visualization for performance trends
    - Add filtering and sorting capabilities by different metrics

### Phase 2: AI Model Integration
- [ ] **Task 4: Training Data Pipeline**
    - Create data processing scripts to format CTR and feature data
    - Implement data normalization and cleaning procedures
    - Set up validation pipeline for data quality
    - Create training/validation/test data splits

- [ ] **Task 5: AI Model Development**
    - Design and implement thumbnail success prediction model:
        - Input: Thumbnail features, historical performance data
        - Output: Predicted CTR score
    - Create model training pipeline
    - Implement model validation and testing procedures
    - Set up model versioning and tracking

- [ ] **Task 6: Real-time Optimization Integration**
    - Modify thumbnail generation pipeline to incorporate AI suggestions:
        - Add AI scoring step for generated thumbnails
        - Implement re-generation logic for low-scoring thumbnails
        - Create feedback loop for continuous model improvement
    - Update system prompts to include learned optimization patterns
    - Implement A/B testing for AI-optimized vs standard thumbnails

### Frontend Updates
- [ ] **Task 7: Pro Features UI**
    - Add AI optimization toggle in thumbnail generation form
    - Create UI for displaying optimization suggestions
    - Implement real-time preview of AI-suggested improvements
    - Add explanation tooltips for optimization decisions

### Testing & Validation
- [ ] **Task 8: Performance Testing**
    - Benchmark AI model inference time
    - Test system performance under load
    - Validate optimization suggestions against historical data
    - Implement monitoring for model drift

- [ ] **Task 9: User Acceptance Testing**
    - Create test scenarios for pro features
    - Document expected behavior and edge cases
    - Implement automated testing for critical paths
    - Gather feedback from beta users

### Documentation
- [ ] **Task 10: Technical Documentation**
    - Document AI model architecture and training process
    - Create API documentation for new endpoints
    - Write deployment and maintenance guides
    - Document data collection and privacy considerations





Add a better loading state for the user to see when it's finished 









## Hybrid Thumbnail Editor (Pro Feature)

**Phase 1: Robust Overlay Editor (MVP for Editing - Pro Feature)**

- [ ] **Task E1: Research and Select Client-Side Canvas Library**
    - Evaluate options like Fabric.js, Konva.js, or others for managing an interactive canvas with objects (text, shapes, images).
    - Consider ease of use, performance, features (object manipulation, serialization), and community support.
    - Make a selection and install the chosen library (e.g., `npm install fabric` or `npm install konva react-konva`).

- [ ] **Task E2: Design Editor UI/UX**
    - Plan the layout for the editing interface:
        - Canvas area displaying the base AI-generated thumbnail.
        - Toolbar for selecting tools (add text, add shape, upload image).
        - Properties panel for selected objects (e.g., font size/color for text, fill/stroke for shapes).
    - Define user interactions (selection, drag, resize, rotate objects).

- [ ] **Task E3: Implement Base Editor Component**
    - Create a new React component for the editor (e.g., `app/components/ThumbnailEditor.tsx`).
    - Initialize the chosen canvas library within this component.
    - Prop to accept the AI-generated thumbnail URL and load it as a static, non-editable background on the canvas.

- [ ] **Task E4: Implement Text Overlay Functionality**
    - Add a tool to create new text objects on the canvas.
    - Allow users to edit text content directly on the canvas or via an input field.
    - Implement controls to change font family (predefined list), font size, and text color (using a color picker like `react-colorful`).
    - Allow text objects to be moved and resized.
    - (Optional) Basic text styles: bold, italic, outline, shadow.

- [ ] **Task E5: Implement Shape/Icon Overlay Functionality**
    - Add tools to create basic shapes (e.g., arrows, rectangles, circles).
    - Provide a small library of common icons (e.g., using `lucide-react` or similar SVG icon library).
    - Allow users to change the fill color and stroke color/width of shapes/icons.
    - Allow shapes/icons to be moved, resized, and rotated.

- [ ] **Task E6: Implement Image Upload Overlay Functionality**
    - Allow users to upload their own images (e.g., channel logo, small graphics) to overlay on the thumbnail using `react-dropzone` or similar.
    - Allow uploaded images to be moved, resized, and rotated.

- [ ] **Task E7: Basic Layer Management**
    - Implement simple controls to bring selected overlay objects forward or send them backward relative to other overlays.

- [ ] **Task E8: Composite and Download Edited Thumbnail**
    - Implement a function to export the current state of the canvas (base AI image + all overlays) as a single PNG or JPG image.
    - This will involve using the canvas library's export feature (e.g., `canvas.toDataURL()` or `canvas.toBlob()`).

- [ ] **Task E9: Integrate Editor into Dashboard Flow (Pro Users)**
    - After a thumbnail is generated (or one is selected from A/B variations), pro users should see an "Edit" or "Fine-Tune" button.
    - Clicking this button should launch the `ThumbnailEditor` component (perhaps in a modal or a new view), passing the selected thumbnail URL to it.
    - Gate this button/functionality based on the pro plan check (Task M1).

**Phase 2: AI-Assisted Fine-Tuning (Advanced Pro Feature Enhancement)**

- [ ] **Task AIF1: Research AI Image Editing/Inpainting APIs**
    - Investigate AI models and APIs that support image-to-image editing or inpainting with text prompts (e.g., DALL-E Edits API, relevant Stability AI models/APIs, or other third-party services).
    - Focus on APIs that allow sending an input image, optionally a mask, and a text instruction to modify a specific part or aspect of the image.
    - Note their capabilities, limitations (e.g., can it understand "make the text red" if the text is part of a flat image?), pricing, and API parameters (e.g., `strength`, masking options).

- [ ] **Task AIF2: Design AI Fine-Tuning UI/UX**
    - Within the editor, add an "AI Refine" or "AI Assist" section/button.
    - Include a text input for the user to type their refinement prompt (e.g., "Make the text red," "Blend the arrow shadows," "Change the sky to sunset orange").

- [ ] **Task AIF3: Implement Client-Side Compositing for AI Input**
    - When "AI Refine" is triggered, the current state of the editor canvas (base AI image + all user-added overlays) must be flattened into a single image (e.g., as a base64 data URL or Blob).

- [ ] **Task AIF4: Create Backend Endpoint for AI Editing**
    - Develop a new API route (e.g., `/api/refine-image`).
    - This route will accept the composited image data (as base64 or multipart/form-data) and the user's refinement prompt.
    - It will then call the chosen AI image editing API with these inputs. If masking is supported and useful, the client might also need to send mask data.
    - It should handle responses and errors from the AI API.

- [ ] **Task AIF5: Integrate AI Editing Call into Editor**
    - The client-side editor calls the `/api/refine-image` endpoint.
    - On success, the newly modified image returned by the AI replaces the content of the editor canvas.
    - *UX Decision*: Define what happens to the existing manual overlays after AI refinement. For simplicity, the AI-refined image could replace the entire canvas content (base + overlays). The user can then add new overlays if desired, or re-run AI refinement on the new base.

- [ ] **Task AIF6: Experiment with AI Parameters & Prompt Engineering for Refinement**
    - Tune parameters like `strength` or `guidance_scale` in the AI editing API call to achieve subtle, controlled edits rather than drastic changes.
    - Develop strategies for prefixing or augmenting the user's refinement prompt to guide the AI effectively (e.g., adding context like "Only modify the text color to red, keep everything else the same as the input image.").

- [ ] **Task AIF7: Testing and Iteration for AI Refinement**
    - Thoroughly test various refinement prompts and scenarios.
    - Gather user feedback on the quality and predictability of AI edits.
    - Iterate on prompt strategies and parameter tuning.

### User Management & Monetization (For Both Editor Phases)
- [ ] **Task M1: Gate Editor Access by Pro Plan**
    - Ensure that both the overlay editor (Phase 1) and the AI fine-tuning capabilities (Phase 2) are accessible only to users on a pro plan.
    - This requires integrating the pro plan check (from A/B testing feature Task 6) before allowing access to editor features.

### Overall Editor Testing
- [ ] **Task OT1: Test Core Editor Functionality (Phase 1)**
    - Verify all overlay tools (text, shapes, image upload) work as expected.
    - Test object manipulation (move, resize, rotate, color change).
    - Test layer management.
    - Test image export/download functionality.
- [ ] **Task OT2: Test AI Refinement Functionality (Phase 2)**
    - Test end-to-end flow: manual edit -> AI refine prompt -> backend call -> canvas update.
    - Test various types of refinement prompts and their impact.
- [ ] **Task OT3: Test Pro Plan Gating for All Editor Features**
    - Confirm non-pro users cannot access the editor or AI refinement.

## Sketch/Reference Image to Thumbnail Feature

### Phase 1: Text-Prompt Focused Enhancement (Current Feasibility with `gpt-image-1` `images.generate`)
- [ ] **Task SR1: UI/UX - User Guidance for Sketch Description**
    - In `thumbai/app/dashboard/page.tsx`, near the sketch upload/draw area and the main prompt input:
        - Add clear instructional text guiding users to *describe the main elements and layout of their sketch/reference image in their text prompt* for the AI to follow.
        - Example: "If using a sketch, describe its key parts in your prompt (e.g., 'Person on the left, sun on the right, text at top: MY VIDEO')."
    - Reinforce this in the "Tips for effective thumbnails" section.

- [ ] **Task SR2: Backend - Enhance System Prompt for Sketch Description Adherence**
    - In the `getSystemPrompt` function (in `thumbai/app/api/generate/route.ts` and `thumbai/app/lib/inngest.ts`):
        - Add a specific instruction for the AI: "If the user's prompt describes a layout based on a sketch or reference (e.g., 'man on left, text on right'), adhere as closely as possible to that described layout. Interpret the user's prompt as the primary source for the visual content and structure."

- [ ] **Task SR3: Backend - Log Sketch/Reference Image Presence (for Future Analytics)**
    - In `/api/generate` (`POST` handler):
        - Check if `formData` contains `sketch` or `referenceImages`.
        - Log this information (e.g., `console.log("Sketch provided: true/false, Num Reference Images: X");`) alongside the `jobId`.
        - This data is *not* sent to the current OpenAI `images.generate` API but can be useful for future analysis of how often users provide these inputs.

### Phase 2: Advanced - True Image-to-Text Description for Stronger Sketch Influence (Future Enhancement)
- [ ] **Task SR4: Research Vision AI for Image-to-Text Description**
    - Investigate suitable AI models/APIs (e.g., GPT-4o via Chat Completions API with image input, Google Gemini Vision, or dedicated image captioning/VQA models).
    - Prioritize models that can provide concise, structured descriptions of image content and layout suitable for feeding into another generation prompt.
    - Note API capabilities, pricing, and ease of integration.

- [ ] **Task SR5: Implement Backend Image Description Service**
    - Create a new internal service/function (e.g., `getImageDescription(imageData: Buffer): Promise<string>`).
    - This service will:
        - Take image data (from user's sketch/reference) as input.
        - Call the selected Vision AI API (from Task SR4) with a specific prompt (e.g., "Describe the main elements, their relative positions, and any text in this sketch using keywords suitable for an image generation prompt.").
        - Process the Vision AI's response to extract a clean textual description.

- [ ] **Task SR6: Integrate Image Description into Generation Flow**
    - Modify the `/api/generate` endpoint and the `generateThumbnail` Inngest function:
        - If a `sketch` file is provided by the user:
            - **Before** calling `getSystemPrompt` for the main image generation, call the new `getImageDescription` service (Task SR5) with the sketch data.
            - Take the AI-generated description of the sketch and prepend or integrate it into the `userPrompt` string. E.g., `userPrompt = \`Based on a sketch showing: ${sketchDescription}. Now, ${originalUserPrompt}\`;`
        - The modified `userPrompt` (now containing the sketch description) is then used by `getSystemPrompt` and sent to `gpt-image-1`.
    - *Note on Reference Images*: Decide how to handle multiple reference images. Describing all of them and combining descriptions might make the prompt too long or confusing. Initially, focus on using the primary sketch. Reference images might conceptually influence the user's *own* text prompt.

- [ ] **Task SR7: Frontend - Update UI for Sketch Processing State**
    - If implementing the image-to-text step, the frontend needs to indicate this processing stage to the user.
    - Example: After sketch upload, before main generation, show a message like "Analyzing your sketch..." or update the loading state.

- [ ] **Task SR8: Testing and Prompt Refinement for Sketch-to-Text-to-Image**
    - Test with a wide variety of sketches (simple, complex, abstract, detailed).
    - Evaluate the quality of AI-generated sketch descriptions.
    - Evaluate how well `gpt-image-1` adheres to these descriptions when generating the final thumbnail.
    - Iterate heavily on the prompt used for the Vision AI (Task SR5) to get the most useful descriptions.

### Phase 3: Exploration - Direct Image Input to Generation/Editing API (Contingent on API Evolution)
- [ ] **Task SR9: Monitor AI API Landscape for Direct Sketch-Styling Features**
    - Continuously monitor OpenAI, Stability AI, Google, and other AI provider API updates.
    - Look for new features in `images.generate`, `images.edit`, or new dedicated endpoints that explicitly support providing a sketch or reference image for strong compositional guidance or direct re-styling (img2img with strong structural adherence).

- [ ] **Task SR10: Implement Direct Visual Reference if/when Available**
    - If a suitable API feature becomes available:
        - Refactor the backend to pass the sketch/reference image data directly to the appropriate AI API endpoint, along with the text prompt.
        - This might replace or augment the image-to-text description approach from Phase 2, depending on API capabilities.
