// src/inngest/functions.ts

import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/db";
import { blurapi } from "@/lib/backend-client";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";
import { generationStatus } from "@/generated/prisma/enums";
import { incrementGeneratedCount } from "@/dodo/data";

const GENERATION_CACHE_TTL = 60 * 5;

type GenerationContext = {
  generationId: string;
  userId: string;
};

/**
 * Small wrapper around console logging so all generation logs
 * have a consistent prefix and structured context.
 */
function log(
  level: "info" | "error" | "warn",
  message: string,
  context?: Record<string, unknown>,
) {
  console[level](`[generation] ${message}`, context ?? {});
}

/**
 * Update the generation status in both Postgres and Redis.
 *
 * Redis is updated after Postgres so the cache always contains
 * the latest persisted generation state.
 */
async function updateGenerationStatus(
  { generationId, userId }: GenerationContext,
  status: generationStatus,
) {
  const generation = await prisma.generation.update({
    where: {
      id: generationId,
      user_id: userId,
    },
    data: {
      status,
    },
  });

  await redis.set(
    redisKeys.GENERATION(generationId, userId),
    generation,
    {
      ex: GENERATION_CACHE_TTL,
    },
  );

  log("info", "Generation status updated", {
    generationId,
    userId,
    status,
  });

  return generation;
}

/**
 * Cache a generation for a short period.
 *
 * This is intentionally kept separate from database operations
 * so callers can explicitly decide when a generation should be cached.
 */
async function cacheGeneration(
  { generationId, userId }: GenerationContext,
  generation: unknown,
) {
  await redis.set(
    redisKeys.GENERATION(generationId, userId),
    generation,
    {
      ex: GENERATION_CACHE_TTL,
    },
  );
}

/**
 * Fetch the generation while ensuring it belongs to the user
 * that triggered the event.
 */
async function getGeneration({
  generationId,
  userId,
}: GenerationContext) {
  const generation = await prisma.generation.findFirst({
    where: {
      id: generationId,
      user_id: userId,
    },
  });

  // This is a permanent failure, so there is no point retrying it.
  if (!generation) {
    log("error", "Generation not found", {
      generationId,
      userId,
    });

    throw new NonRetriableError(
      "Generation not found or does not belong to user",
    );
  }

  // Cache the initial generation state for consumers that read it from Redis.
  await cacheGeneration(
    { generationId, userId },
    generation,
  );

  log("info", "Generation fetched", {
    generationId,
    userId,
    generationType: generation.generation_type,
    hasFace: Boolean(generation.face_id),
  });

  return generation;
}

/**
 * Fetch the input media belonging to the current user.
 *
 * Only the S3/storage key is needed by the blur API,
 * so we avoid fetching unnecessary columns.
 */
async function getInputMedia(
  generationId: string,
  userId: string,
  inputMediaId: string | null,
) {
  if (!inputMediaId) {
    log("error", "Generation has no input media", {
      generationId,
      userId,
    });

    return null;
  }

  const media = await prisma.media.findFirst({
    where: {
      id: inputMediaId,
      user_id: userId,
    },
    select: {
      key: true,
    },
  });

  log("info", "Input media fetched", {
    generationId,
    userId,
    found: Boolean(media),
  });

  return media;
}

/**
 * Fetch the target face used for selective blurring.
 *
 * A face is optional because normal blur operations do not
 * require a target image.
 */
async function getFace(
  generationId: string,
  userId: string,
  faceId: string | null,
) {
  if (!faceId) {
    return null;
  }

  const face = await prisma.face.findFirst({
    where: {
      id: faceId,
      user_id: userId,
    },
    select: {
      key: true,
    },
  });

  log("info", "Target face fetched", {
    generationId,
    userId,
    faceId,
    found: Boolean(face),
  });

  return face;
}

/**
 * Send the generation request to the blur backend.
 *
 * There are four possible endpoints:
 *
 * - image + normal blur
 * - image + selective blur
 * - video + normal blur
 * - video + selective blur
 *
 * The endpoint is selected from the generation type and
 * whether a target face exists.
 */
async function generateMedia({
  generation,
  inputKey,
  outputKey,
  faceKey,
}: {
  generation: Awaited<ReturnType<typeof getGeneration>>;
  inputKey: string;
  outputKey: string;
  faceKey?: string;
}) {
  const blurMethod =
    generation.blur_type.toLowerCase() as any;

  const isImage =
    generation.generation_type === "BLUR_PERSON_IMAGE";

  const endpoint = faceKey
    ? isImage
      ? "/api/blur-photo/selective"
      : "/api/blur-video/selective"
    : isImage
      ? "/api/blur-photo"
      : "/api/blur-video";

  log("info", "Starting media generation", {
    generationId: generation.id,
    generationType: generation.generation_type,
    endpoint,
    hasTargetFace: Boolean(faceKey),
  });

  /**
   * Call the appropriate backend endpoint based on
   * whether the generation is an image/video and whether
   * selective face blurring is enabled.
   */
  const { response, data } = faceKey
    ? isImage
      ? await blurapi.POST("/api/blur-photo/selective", {
          body: {
            blur_method: blurMethod,
            key: inputKey,
            output_key: outputKey,
            target_image: faceKey,
          },
        })
      : await blurapi.POST("/api/blur-video/selective", {
          body: {
            blur_method: blurMethod,
            key: inputKey,
            output_key: outputKey,
            target_image: faceKey,
          },
        })
    : isImage
      ? await blurapi.POST("/api/blur-photo", {
          body: {
            blur_method: blurMethod,
            key: inputKey,
            output_key: outputKey,
          },
        })
      : await blurapi.POST("/api/blur-video", {
          body: {
            blur_method: blurMethod,
            key: inputKey,
            output_key: outputKey,
          },
        });

  log("info", "Blur API responded", {
    generationId: generation.id,
    endpoint,
    httpStatus: response.status,
    ok: response.ok,
    success: (data as any)?.success,
  });

  /**
   * A non-2xx response is treated as a permanent API failure,
   * matching the original behavior.
   */
  if (!response.ok) {
    log("error", "Blur API request failed", {
      generationId: generation.id,
      endpoint,
      httpStatus: response.status,
    });

    throw new NonRetriableError(
      `Blur API request failed with status ${response.status}`,
    );
  }

  /**
   * The HTTP request succeeded, but the backend may still report
   * that media generation itself failed.
   *
   * Throwing a normal Error allows Inngest to retry the operation.
   */
  if (!(data as any)?.success) {
    log("error", "Blur API returned unsuccessful response", {
      generationId: generation.id,
      endpoint,
      response: data,
    });

    throw new Error(
      "Error generating media, retrying",
    );
  }

  return {
    ok: true,
  };
}

/**
 * Create the Media record for the generated output.
 */
async function createOutputMedia(
  generationId: string,
  userId: string,
  outputKey: string,
) {
  const outputMedia = await prisma.media.create({
    data: {
      user_id: userId,
      key: outputKey,
    },
    select: {
      id: true,
      key: true,
    },
  });

  log("info", "Output media created", {
    generationId,
    userId,
    mediaId: outputMedia.id,
    outputKey,
  });

  return outputMedia;
}

/**
 * Mark the generation as completed and update Redis
 * with the final generation state.
 */
async function completeGeneration(
  context: GenerationContext,
  outputMediaId: string,
) {
  const generation = await prisma.generation.update({
    where: {
      id: context.generationId,
      user_id: context.userId,
    },
    data: {
      output_media_id: outputMediaId,
      status: "COMPLETED",
    },
  });

  await cacheGeneration(context, generation);

  log("info", "Generation completed", {
    generationId: context.generationId,
    userId: context.userId,
    outputMediaId,
  });

  return generation;
}

/**
 * Main generation workflow.
 *
 * The function is intentionally kept as orchestration only:
 *
 * 1. Validate event
 * 2. Fetch generation data
 * 3. Generate media
 * 4. Save output media
 * 5. Mark generation as completed
 *
 * Inngest handles retries for normal errors.
 */
export const startGeneration = inngest.createFunction(
  {
    id: "start-generation",
    triggers: {
      event: "app/task.generate",
      
    },
    retries: 3,
  },

  async ({ event, step }) => {
    const generationId = event.data?.generationId;
    const userId = event.data?.userId;

    /**
     * Validate the event before querying the database.
     *
     * Without both identifiers there is no safe generation
     * record that we can operate on.
     */
    if (!generationId || !userId) {
      log("error", "Invalid generation event payload", {
        generationId,
        userId,
      });

      throw new NonRetriableError(
        "Missing generation id or userId",
      );
    }

    const context: GenerationContext = {
      generationId,
      userId,
    };

    log("info", "Generation started", context);

    /**
     * Load the generation and cache its initial state.
     */
    const generation = await getGeneration(context);

    /**
     * Load the input media required by the blur backend.
     */
    const inputMedia = await getInputMedia(
      generation.id,
      userId,
      generation.input_media_id,
    );

    /**
     * Load the target face when selective blurring is enabled.
     */
    const face = await getFace(
      generation.id,
      userId,
      generation.face_id,
    );

    const outputKey = generation.output_key;

    /**
     * These values are required by every blur operation.
     *
     * Missing values indicate invalid generation data,
     * so this should not be retried.
     */
    if (!outputKey || !inputMedia?.key) {
      log("error", "Generation is missing required media keys", {
        ...context,
        outputKey,
        inputMediaKey: inputMedia?.key,
      });

      await updateGenerationStatus(
        context,
        "FAILED",
      );

      throw new NonRetriableError(
        "Missing output key or input media key",
      );
    }

    /**
     * Run the actual media generation inside an Inngest step.
     *
     * Keeping the API call inside a step gives Inngest control
     * over execution and retries for this part of the workflow.
     */
    const response = await step.run(
      {
        id: "generate-video",
      },
      async () => {
        try {
          return await generateMedia({
            generation,
            inputKey: inputMedia.key,
            outputKey,
            faceKey: face?.key,
          });
        } catch (error) {
          await incrementGeneratedCount(userId); //rollback on error
          log("error", "Media generation failed", {
            ...context,
            error:
              error instanceof Error
                ? error.message
                : error,
          });

          /**
           * Preserve the original behavior:
           *
           * - NonRetriableError stops Inngest retries.
           * - Normal Error allows Inngest to retry.
           *
           * In both cases the generation is marked as FAILED.
           */
          await updateGenerationStatus(
            context,
            "FAILED",
          );

          throw error;
        }
      },
    );

    /**
     * The backend has successfully generated the output.
     * Create a Media record pointing to the generated file.
     */
    const outputMedia = await createOutputMedia(
      generation.id,
      userId,
      outputKey,
    );

    /**
     * Attach the generated media to the generation and
     * mark the generation as completed.
     */
    await completeGeneration(
      context,
      outputMedia.id,
    );

    log("info", "Generation pipeline finished", {
      ...context,
      outputMediaId: outputMedia.id,
    });

    return {
      output_media: outputMedia,
      response,
    };
  },
);