import {Sandbox} from '@e2b/code-interpreter';
import { AgentResult, TextMessage } from '@inngest/agent-kit';

export async function getSandbox(sandboxId: string) {
    try {
        const sandbox = await Sandbox.connect(sandboxId);
        return sandbox;
    } catch (error) {
        console.error("Error fetching sandbox:", error);
        throw new Error("Failed to retrieve sandbox");
    }
}


export function lastAssistanTextMessageContent(result: AgentResult){
    const lastAssistanTextMessageIndex = result.output.findLastIndex(
        (message) => message.role === 'assistant' 
    );

    const message = result.output[lastAssistanTextMessageIndex] as TextMessage | undefined;

    return message?.content ? 
        typeof message.content === 'string'
            ? message.content
            : message.content.map((c)=>c.text).join('')
        : undefined;    
}