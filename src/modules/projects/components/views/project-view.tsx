"use client";

import { useTRPC } from "@/trpc/client";
import { 
    ResizableHandle, 
    ResizablePanel, 
    ResizablePanelGroup
} from '@/components/ui/resizable'

import MessageContainer from "../ui/message-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../ui/project-header";
import { FragmentWeb } from "../ui/fragment-web";

interface Props{
    projectId: string;
}


export const ProjectView = ({projectId}:Props)=>{


    const [activeFragment, setActiveFragment] = useState<Fragment|null>(null);

    const trpc = useTRPC();
    // const {data:project} = useSuspenseQuery(trpc.project.getOne.queryOptions({id: projectId}));

    // const {data: messages} = useSuspenseQuery(trpc.message.getMany.queryOptions({projectId: projectId}));

    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                defaultSize={35}
                minSize={20}
                className="flex flex-col min-h-0"
                >
                    <Suspense fallback={<div>Loading Project...</div>}>
                        <ProjectHeader projectId={projectId} />
                    </Suspense>
                    <Suspense fallback={<div>Loading...</div>}>
                    <MessageContainer 
                    activeFragment={activeFragment}
                    setActiveFragment={setActiveFragment}
                    projectId={projectId}
                    
                    />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle />

                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                    {/* TODO */}
                    {/* {JSON.stringify(messages,null,2)} */}
                    {!!activeFragment && <FragmentWeb data ={activeFragment}/>}
                </ResizablePanel>

            </ResizablePanelGroup>
        </div>
    )


}