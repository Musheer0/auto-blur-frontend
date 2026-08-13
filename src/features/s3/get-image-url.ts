"use server";

import { bucket } from "@/constants";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "./client";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";

const MEDIA_URL_TTL = 60 * 60 * 10; // 10 hours

export async function getImageUrl(key: string) {
  const cacheKey = redisKeys.S3_MEDIA_URL(key);

  const cachedUrl = await redis.get<string>(cacheKey);

  if (cachedUrl) {
    return cachedUrl;
  }

  const mediaUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    {
      expiresIn: MEDIA_URL_TTL,
    },
  );

  await redis.set(cacheKey, mediaUrl, {
    ex: MEDIA_URL_TTL/1.5,
  });

  return mediaUrl;
}