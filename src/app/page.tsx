import prisma from "@/lib/db";

const page = async () => {

  const posts = await prisma.user.findMany();

  return (
    <div>
      `${JSON.stringify(posts, null, 2)}`
    </div>
  );
}
export default page;