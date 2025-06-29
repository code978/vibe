import { inngest } from "./client";
import { Agent, grok, gemini, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // download step

    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer.  You write readable, maintable code. you write simple Next.js & React snippets.",
      model: gemini({ model: "gemini-2.0-flash-lite" }),
    });

    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`,
    );
    console.log("Summarized output:", output);

    // await step.sleep("wait-a-moment", "5s");

    return { output };
  },
);
