"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const trpc = useTRPC();

  
  
  const createProject = useMutation(trpc.project.create.mutationOptions({
    onError: (error) => {
      toast.success(error.message);
    },
    onSuccess: (data) => {
      console.log(data);
      router.push(`/projects/${data.id}`)    
    }
  }));

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">

      <Input value={value} onChange={(e) => setValue(e.target.value)}/>
      <Button disabled={createProject.isPending} 
      onClick={() => createProject.mutate({ value: value })}>
        Invoke Background Job
        </Button>
        </div>
    </div>
  );
}
export default page;