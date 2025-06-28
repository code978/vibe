import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-red-500">Welcome to My App</h1>
      <p className="text-lg text-gray-700">This is a simple Next.js application.</p>
      <Button variant={"destructive"} size={"lg"} className="mt-6 px-8">
        Click Me
      </Button>
    </div>
  );
}
export default page;