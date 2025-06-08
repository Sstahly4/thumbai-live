// lib/inngest.ts
import { Inngest } from "inngest";

// Create a client to send and receive events
// TODO: Replace "ThumbAI" with your actual app name if desired
export const inngest = new Inngest({ id: "ThumbAI" });

// Define an example Inngest function
// TODO: Replace this with your actual thumbnail generation function
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello, World!" };
  }
); 