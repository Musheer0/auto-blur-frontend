// src/lib/usage.ts

import prisma from "@/db";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";
import { user_plan, usage } from "@/generated/prisma/client";
import { PLAN_LIMITS } from "@/constants";

type CreateUsageParams = {
  userId: string;
  allowedLimit?: number;
  plan?: user_plan;
};

/**
 * Create usage record
 */
export const createUsage = async ({
  userId="",
  allowedLimit = 10,
  plan = user_plan.FREE,
}): Promise<usage> => {
  const data = await prisma.usage.create({
    data: {
      user_id: userId,
      allowed_limit: allowedLimit,
      plan,
    },
  });

  await redis.set(redisKeys.USAGE(userId), data);

  return data;
};

/**
 * Get usage by user ID.
 * Redis → Postgres fallback.
 */
export const getUsageByUserId = async (
  userId: string,
): Promise<usage | null> => {
  const key = redisKeys.USAGE(userId);

  const cached = await redis.get<usage>(key);

  if (cached) {
    return cached;
  }

  const data = await prisma.usage.findUnique({
    where: {
      user_id: userId,
    },
  });

  if (data) {
    await redis.set(key, data);
  }

  return data;
};

/**
 * Check whether user can generate a video.
 */
export const canGenerateVideo = async (
  userId: string,
): Promise<boolean> => {
  const data = await getUsageByUserId(userId);

  if (!data) {
    return false;
  }

  return data.no_of_videos_generated < data.allowed_limit;
};

/**
 * Reserve one generation.
 *
 * The DB condition makes this safe against concurrent requests.
 */
export const incrementGeneratedCount = async (
  userId: string,
): Promise<usage> => {
  const result = await prisma.usage.updateMany({
    where: {
      user_id: userId,
      no_of_videos_generated: {
        lt: prisma.usage.fields.allowed_limit,
      },
    },
    data: {
      no_of_videos_generated: {
        increment: 1,
      },
    },
  });

  if (result.count === 0) {
    throw new Error("No generations remaining");
  }

  const data = await prisma.usage.findUniqueOrThrow({
    where: {
      user_id: userId,
    },
  });

  await redis.set(redisKeys.USAGE(userId), data);

  return data;
};

/**
 * Rollback one generation after a server-side failure.
 */
export const decrementGeneratedCount = async (
  userId: string,
): Promise<usage> => {
  await prisma.usage.updateMany({
    where: {
      user_id: userId,
      no_of_videos_generated: {
        gt: 0,
      },
    },
    data: {
      no_of_videos_generated: {
        decrement: 1,
      },
    },
  });

  const data = await prisma.usage.findUniqueOrThrow({
    where: {
      user_id: userId,
    },
  });

  await redis.set(redisKeys.USAGE(userId), data);

  return data;
};

/**
 * Update user's plan.
 */
export const updateUsagePlan = async (
  userId: string,
  plan: user_plan,
): Promise<usage> => {
  const data = await prisma.usage.update({
    where: {
      user_id: userId,
    },
    data: {
      plan,
      allowed_limit:{increment:PLAN_LIMITS[plan]}
    },
  });

  await redis.set(redisKeys.USAGE(userId), data);

  return data;
};

/**
 * Update user's allowed generation limit.
 */
export const updateUsageLimit = async (
  userId: string,
  allowedLimit: number,
): Promise<usage> => {
  const data = await prisma.usage.update({
    where: {
      user_id: userId,
    },
    data: {
      allowed_limit: allowedLimit,
    },
  });

  await redis.set(redisKeys.USAGE(userId), data);

  return data;
};

/**
 * Delete usage record.
 */
export const deleteUsage = async (
  userId: string,
): Promise<usage> => {
  const data = await prisma.usage.delete({
    where: {
      user_id: userId,
    },
  });

  await redis.del(redisKeys.USAGE(userId));

  return data;
};