import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // download step
    console.log(step);
    await step.sleep("wait-a-moment", "30s");
    // transctip setp
    await step.sleep("wait-a-moment", "10s");
    // summary step
    await step.sleep("wait-a-moment", "5s");

    return { message: `Hello ${event.data.email}!` };
  },
);
