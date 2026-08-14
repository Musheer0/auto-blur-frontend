export const cookie_name = "autoflow-session";
export const bucket = process.env.S3_BUCKET;
import { user_plan } from "@/generated/prisma/client";

export const PLAN_LIMITS: Record<user_plan, number> = {
  [user_plan.FREE]: 10,
  [user_plan.PRO]: 29,
};
export const PLAN_MAP: Record<user_plan, string|null> = {
  [user_plan.FREE]: null,
  [user_plan.PRO]: process.env.PRODUCT_ID!,
};
export const ADDON_LIMIT = 10;
if (!bucket) throw new Error("missing bucket name");
