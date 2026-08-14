// src/trpc/rate-limit.ts
import { TRPCError } from "@trpc/server";
import { rateLimiters } from "@/db/rate-limit";

export async function checkRateLimit(
  limiter: keyof typeof rateLimiters,
  identifier: string
) {
  const result = await rateLimiters[limiter].limit(identifier);

  if (!result.success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests. Try again later.",
    });
  }

  return result;
}