import { getUsageByUserId } from "@/dodo/data";
import { createTRPCRouter, protectedProcedure } from "../init";

export const UsageRouter = createTRPCRouter({
    getUsage:protectedProcedure
    .query(async({ctx})=>{
        const usage = getUsageByUserId(ctx.session.user.id)
        return usage
    })
})