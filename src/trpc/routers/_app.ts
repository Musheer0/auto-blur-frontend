import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { generateRouter } from "./generate.route";
import { Crud } from "./crud";

export const appRouter = createTRPCRouter({
  generation: generateRouter,
  crud: Crud,
});

// export type definition of API
export type AppRouter = typeof appRouter;
