import { Inngest } from "inngest";
import OpenAI from "openai";
import { Redis } from "@upstash/redis";
import { loadEnvVars } from "../utils/env";

// Load environment variables manually to make sure they're available
loadEnvVars();

// Debug the environment variables
console.log("Inngest environment variables:");
console.log("INNGEST_EVENT_KEY present:", Boolean(process.env.INNGEST_EVENT_KEY));
console.log("INNGEST_EVENT_KEY length:", process.env.INNGEST_EVENT_KEY?.length || 0);
console.log("INNGEST_SIGNING_KEY present:", Boolean(process.env.INNGEST_SIGNING_KEY));
console.log("INNGEST_SIGNING_KEY length:", process.env.INNGEST_SIGNING_KEY?.length || 0);

// Initialize Redis client from environment variables
let redis: Redis | null = null;
try {
  // Check if env vars are present before initializing - use KV_* variables
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN
    });
    console.log("Upstash Redis client initialized successfully for Inngest");
  } else {
    console.error("Upstash Redis environment variables (KV_REST_API_*) not found. Cannot store results.");
  }
} catch (error) {
  console.error("Failed to initialize Upstash Redis client for Inngest:", error);
  redis = null; // Ensure redis is null if init fails
}

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "thumbai",
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
  // For local development
  isDev: process.env.NODE_ENV === 'development'
});

// Initialize OpenAI client safely
let openai: OpenAI | null = null;
try {
  const apiKey = process.env.OPENAI_API_KEY || '';
  if (apiKey && apiKey !== 'your_openai_api_key_here') {
    openai = new OpenAI({ apiKey }); 
    console.log("OpenAI client initialized successfully for Inngest");
  } else {
    console.warn("Invalid or empty OpenAI API key - Inngest function may fail");
  }
} catch (error) {
  console.error("Failed to initialize OpenAI client for Inngest:", error);
}

// Define the actual thumbnail generation function
export const generateThumbnail = inngest.createFunction(
  { 
    id: "generate-thumbnail", 
    name: "Thumbnail Generation",
    retries: 3,
    timeouts: {
      finish: '180s'  // Increased from 50s to 180s to give more buffer
    }
  },
  { event: "thumbai/thumbnail.generate" },
  async ({ event, step }) => {
    // Ensure redis is available before proceeding
    if (!redis) {
      console.error("Redis not configured or initialization failed. Aborting function.");
      return { success: false, message: "Internal server error: Redis not configured" };
    }
    
    const { prompt, jobId } = event.data as { prompt: string; jobId: string };
    const startTime = Date.now();
    console.log(`Inngest function started for job ${jobId}, prompt: "${prompt}"`);

    try {
      // ... existing code ...
      
      // Add timing log at the end
      const endTime = Date.now();
      console.log(`Image generation completed in ${(endTime - startTime) / 1000}s for job ${jobId}`);
      
      return { success: true, message: "Image generation completed" }; // Actual result should be in the existing code
    } catch (error) {
      const endTime = Date.now();
      console.error(`Image generation failed after ${(endTime - startTime) / 1000}s for job ${jobId}:`, error);
      throw error;
    }
  }
); 