import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import prisma from "@/db";
import { usage } from "@/generated/prisma/client";
import { createUsage, getUsageByUserId, updateUsagePlan } from "@/dodo/data";
import { PLAN_LIMITS, PLAN_MAP } from "@/constants";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: "test_mode",
  webhookKey: process.env.DODO_WH!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const event = client.webhooks.unwrap(body, {
      headers: {
        "webhook-id": req.headers.get("webhook-id")!,
        "webhook-signature": req.headers.get("webhook-signature")!,
        "webhook-timestamp": req.headers.get("webhook-timestamp")!,
      },
    });
    if(event.type==="subscription.active" ||event.type==="subscription.renewed"){
        const customerId = event.data.customer.customer_id
        const customer = await client.customers.retrieve(customerId);
        const addons = event.data.addons.map((a)=>{
            return a.quantity
        }).reduce((a, b)=>a+b);
        const product_id = event.data.product_id
        const db_user = await prisma.user.findUnique({where:{
            dodo_customer_id:customer.customer_id
        }})
        if(!db_user) {
            return NextResponse.json(
      {
        success: false,
        error: "Customer does not exist",
      },
      { status: 400 },
    );
        }
     let usage:usage|null;
     usage = await getUsageByUserId(db_user.id)
     if(!usage) {
        usage = await createUsage({userId:db_user.id, allowedLimit:PLAN_LIMITS.FREE, plan:"FREE"})
     }
     const product = await client.products.retrieve(product_id);
     if(!product) 
         return NextResponse.json(
      {
        success: false,
        error: "product does not exist",
      },
      { status: 400 },
    );
    if( PLAN_MAP.PRO===product_id){
        console.log(product.name+"subscribed ")
        await updateUsagePlan(db_user.id, "PRO");
    }
    console.log("Dodo webhook received");
    console.log("Event:", event.type);

    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Dodo webhook error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Invalid webhook",
      },
      { status: 400 },
    );
  }
}