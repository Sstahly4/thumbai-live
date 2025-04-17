import { Inngest } from "inngest";
import { serve } from "inngest/next";

// Create a client to send and receive events
// TODO: Replace "ThumbAI" with your actual app name if desired
export const inngest = new Inngest({ id: "ThumbAI" });

// Define an example Inngest function
// TODO: Replace this with your actual thumbnail generation function
const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello, World!" };
  }
);

// Create an API that serves zero functions
// TODO: Add your actual Inngest functions here
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    /* Your Inngest functions */
  ],
}); 