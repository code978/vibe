import { Sandbox } from '@e2b/code-interpreter';
import { Agent, grok, gemini, createAgent } from "@inngest/agent-kit";

import { inngest } from "./client";
import { getSandbox } from './utils';

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // download step

    const sandboxId = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-3");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer.  You write readable, maintable code. you write simple Next.js & React snippets.",
      model: gemini({ model: "gemini-2.0-flash-lite" }),
    });

    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`,
    );
    console.log("Summarized output:", output);

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandboxId);
      const host =  sandbox.getHost(3000);
      return `https://${host}`;
    });


    // await step.sleep("wait-a-moment", "5s");

    return { output, sandboxUrl };
  },
);
