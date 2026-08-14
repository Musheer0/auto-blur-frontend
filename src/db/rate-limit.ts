// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/db/redis";

export const rateLimiters = {
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    prefix: "ratelimit:api",
  }),

  generation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(6, "1 m"),
    prefix: "ratelimit:generation",
  }),
};