import { useState } from "react";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";

import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

interface Props {
    data: Fragment;
}

export function FragmentWeb({data}:Props){
    const [fragmentkey,setFragmentkey] = useState(0);
    const [copied,setCopied] = useState(false);

    const onRefresh = ()=>{
        setFragmentkey((prev)=>prev+1);
    }

    const handleCopy = ()=>{
        navigator.clipboard.writeText(data?.sandboxUrl);
        setCopied(true);
        setTimeout(()=>setCopied(false),2000)
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="p-2 bg-sidebar flex items-center gap-x-2">
                <Hint text="Refresh" side="bottom" align="start">
                    <Button 
                        size={"sm"} 
                        variant={"outline"} 
                        onClick={onRefresh}
                        disabled={!data?.sandboxUrl || copied}
                        className="justify-start text-start font-normal"
                        >
                        <RefreshCcwIcon />
                    </Button>
                </Hint>
                <Hint text="Click to Copy" side="bottom" align="start">

                    <Button size={"sm"} variant={"outline"} onClick={handleCopy}>
                        <span className="truncate">
                            {data?.sandboxUrl}
                        </span>
                </Button>
                </Hint>
                <Hint text="Open in new tab" side="bottom" align="start">

                    <Button 
                        size={"sm"}
                        disabled={!data?.sandboxUrl}
                        variant={"outline"}
                        onClick={()=>{
                            if(!data.sandboxUrl) return;
                            window.open(data?.sandboxUrl,"_blank");
                        }}
                        >
                        <ExternalLinkIcon />
                    </Button>
                </Hint>
            </div>
            <iframe
                key={fragmentkey}
                className="h-full w-full"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms"
                src = {data?.sandboxUrl}
            />
        </div>
    )
}