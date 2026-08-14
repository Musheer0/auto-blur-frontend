import { getUsageByUserId } from "@/dodo/data";
import { createTRPCRouter, protectedProcedure } from "../init";
import { create_session } from "@/dodo/create-session";
import { client } from "@/dodo/client";
import { createDodoCustomer } from "@/dodo/create-customer";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";
import prisma from "@/db";

export const UsageRouter = createTRPCRouter({
    getUsage:protectedProcedure
    .query(async({ctx})=>{
        const usage =await getUsageByUserId(ctx.session.user.id)
        return {usage}
    }),
    create_session:protectedProcedure.mutation(async({ctx})=>{
        const user = ctx.session.user
        const url = await create_session(user.email,user.name)
        return url
    }),
        view_subscription:protectedProcedure.mutation(async({ctx})=>{
        const user = ctx.session.user
        if(!user.dodo_customer_id){
            const customer = await createDodoCustomer(user.email, user.name)
            await redis.del(redisKeys.SESSION(user.id,ctx.session.id))
            await prisma.user.update({where:{id:user.id},data:{dodo_customer_id:customer}})
            user.dodo_customer_id = customer
        }
        const url = await client.customers.customerPortal.create(user.dodo_customer_id, {
    return_url: `${process.env.APP}/generate`,
  });
        return url
    })
})