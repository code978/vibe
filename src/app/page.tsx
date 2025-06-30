"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const page = () => {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const {data: messages} = useQuery(trpc.message.getMany.queryOptions());
const createMessage = useMutation(trpc.message.create.mutationOptions({
  onSuccess: () => {
    toast.success(`Message Created`,);
  }
}));

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input value={value} onChange={(e) => setValue(e.target.value)}/>
      <Button disabled={createMessage.isPending} 
      onClick={() => createMessage.mutate({ value: value })}>
        Invoke Background Job
        </Button>
        {JSON.stringify(messages,null,2)}
    </div>
  );
}
export default page;