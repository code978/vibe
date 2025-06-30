import { projectRouter } from '@/modules/projects/server/procedure';
import { createTRPCRouter } from '../init';
import { messageRouter } from '@/modules/messages/server/procedure';

export const appRouter = createTRPCRouter({
  message: messageRouter,
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;