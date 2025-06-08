import { serve } from "inngest/next";
import { inngest, helloWorld } from "@/lib/inngest";

// Create an API that serves your Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    /* Your other Inngest functions here */
  ],
}); 