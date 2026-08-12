import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { generateRouter } from './generate.route';
 
export const appRouter = createTRPCRouter({
  generation:generateRouter
});
 
// export type definition of API
export type AppRouter = typeof appRouter;