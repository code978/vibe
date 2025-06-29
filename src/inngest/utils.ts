import {Sandbox} from '@e2b/code-interpreter';

export async function getSandbox(sandboxId: string) {
    try {
        const sandbox = await Sandbox.connect(sandboxId);
        return sandbox;
    } catch (error) {
        console.error("Error fetching sandbox:", error);
        throw new Error("Failed to retrieve sandbox");
    }
}