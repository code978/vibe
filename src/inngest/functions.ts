import { Sandbox } from '@e2b/code-interpreter';
import { Agent, grok, gemini, createAgent, createTool, createNetwork } from "@inngest/agent-kit";

import { inngest } from "./client";
import { getSandbox, lastAssistanTextMessageContent } from './utils';
import { z } from 'zod';
import { PROMPT } from '@/prompt';

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
      description: 'An expert coding agent',
      system: PROMPT,
      model: gemini({ 
        model: "gemini-2.0-flash-lite",
        defaultParameters:{

        }
       }),
      tools:[
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({command},{step})=>{
            return await step?.run('terminal',async()=>{
              const buffers = {stdout: "", stderr: ""};

              try{
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command,{
                  onStdout: (data:string)=>{
                    buffers.stdout += data;
                  },
                  onStderr:(data:string)=>{
                    buffers.stderr += data;
                  }
                });
                return result.stdout;
              }
              catch(error){
                console.error(`Command failed : ${error} \n stdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`);
                return `Command failed : ${error} \n stdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
              }
            })
          },
        }),
        createTool({
          name: "createOrUpdateFile",
          description: "Create or update a file",
          parameters:z.object({
            files:z.array(
              z.object({
                path: z.string(),
                content: z.string()
              })
            )
          }),
          handler:async ({files},{step, network})=>{

            const newFiles = await step?.run('createOrUpdateFile',async()=>{
              try { 
                const updateFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for(const file of files){
                  await sandbox.files.write(file.path, file.content);
                  updateFiles[file.path] = file.content;
                }
                return updateFiles;
              } catch (error) {
                console.error(error);
                return "Error: "+ error;  
              }
            })

            if(typeof newFiles == "object"){
              network.state.data.file = newFiles;
            }
          }
        }),
        createTool({
          name: "readFiles",
          description:"Read files from the sandbox",
          parameters:z.object({
            files: z.array(z.string())
          }),
          handler: async ({files},{step})=>{
            return await step?.run("readFiles", async ()=>{
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for(const file of files){
                  const content = await sandbox.files.read(file);
                  contents.push({path:file,content});
                }
                return JSON.stringify(contents);
              } catch (error) {
                console.log(error);
                return "Error: "+ error;
              }
            })
          }
        })
      ],
      lifecycle: {
        onResponse : async ({result, network})=>{
          const lastAssistanTextMessageText = lastAssistanTextMessageContent(result);

          if(lastAssistanTextMessageText && network){
            if(lastAssistanTextMessageText.includes("<task_summary>")){
              network.state.data.summary = lastAssistanTextMessageText;
            }
          }
          return result;
        },
      }
    });

    const network = createNetwork({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 30,
      router: async ({network})=>{
        const summary = network.state.data.summary;

        if(summary){
          return;
        }

        return codeAgent;
      },
    })

    const result = await network.run(event.data.value);

    // const { output } = await codeAgent.run(
    //   `Write the following snippet: ${event.data.value}`,
    // );
    // console.log("Summarized output:", output);

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandboxId);
      const host =  sandbox.getHost(3000);
      return `https://${host}`;
    });


    // await step.sleep("wait-a-moment", "5s");

    return { 
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
     };
  },
);
