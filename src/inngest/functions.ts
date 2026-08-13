// src/inngest/functions.ts
import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/db";
import { blurapi } from "@/lib/backend-client";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";
import { generationStatus } from "@/generated/prisma/enums";

export const startGeneration = inngest.createFunction(
  {
    id: "start-generation",
    triggers: { event: "app/task.generate" },
    retries: 3,
  },
  async ({ event, step }) => {

    //sanitze input
    const generationId = await event.data?.generationId;
    const userId = await event.data?.userId;
    
    //helper functions 
    const updateGenerationStatus = async(status:generationStatus)=>{
        const updated_generaton = await prisma.generation.update({
          where: {
            id: generationId,
            user_id: userId,
          },
          data: {
            status: status,
          },
        });
        await redis.set(
          redisKeys.GENERATION(generationId, userId),
          updated_generaton,
          { ex: 60 * 5 },
        );

    }







    if (!generationId || !userId){
      updateGenerationStatus("FAILED")
      throw new NonRetriableError("missing generation id or userId ");
    }
    //fetch generation 
    const generation = await prisma.generation.findFirst({
      where: {
        id: generationId,
        user_id: userId,
      },
    });
    console.log(generation)
    await redis.set(redisKeys.GENERATION(generationId, userId), generation);
    if (!generation)
      throw new NonRetriableError(
        "generation not found or does not belongs to user",
      );

    //fetch input medias
    const input_media = await prisma.media.findFirst({
      where: { id: generation.input_media_id, user_id: userId },
      select: { key: true },
    });
    const output_key = generation.output_key;
    const face = generation.face_id
      ? await prisma.face.findFirst({
          where: {
            id: generation.face_id,
            user_id: userId,
          },
          select: {
            key: true,
          },
        })
      : null;
    if (!output_key || !input_media?.key){
     updateGenerationStatus("FAILED")
      throw new NonRetriableError("missing output key or input media key");
    }


    //generation video
    const response = await step.run({ id: "generate-video" }, async () => {
      if (!output_key){
        updateGenerationStatus("FAILED")
        throw new NonRetriableError("missing output key");}
      const { response, data } = face
        ? await blurapi.POST("/api/blur-video/selective", {
            body: {
              blur_method: generation.blur_type.toLocaleLowerCase() as any,
              key: input_media.key,
              output_key: output_key,
              target_image: face.key,
            },
          })
        : await blurapi.POST("/api/blur-video", {
            body: {
              blur_method: generation.blur_type.toLocaleLowerCase() as any,
              key: input_media.key,
              output_key: output_key,
            },
          });
      if (response.ok) {
        if ((data as any)?.success) return { ok: true };
        //update status on error 
        updateGenerationStatus("FAILED")
        throw new Error("error generating video trying again");
      }
      throw new NonRetriableError("api error");
    });

    //save output media
    const output_media = await prisma.media.create({
      data: {
        user_id: generation.user_id,
        key: output_key,
      },
      select: {
        id: true,
        key: true,
      },
    });
    //update status
    const updated_generaton = await prisma.generation.update({
      where: {
        id: generation.id,
        user_id: generation.user_id,
      },
      data: {
        output_media_id: output_media.id,
        status: "COMPLETED",
      },
    });
    await redis.set(
      redisKeys.GENERATION(generationId, userId),
      updated_generaton,
      { ex: 60 * 5 },
    );
    return { output_media, response };
  },
);
