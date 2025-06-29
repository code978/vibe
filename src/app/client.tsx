'use client';

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";


export const Client = () =>{
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.createAI.queryOptions({text: "Hello"}));

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    )
}