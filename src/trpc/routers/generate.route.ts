import { createGenerationSchema } from "@/schemas/create-generation";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/db";
import { generation_type } from "@/generated/prisma/enums";
import { TRPCError } from "@trpc/server";
import { face, generation } from "@/generated/prisma/client";
import { createUploadUrl } from "@/features/s3/get-upload-url";
import z from "zod";
import { inngest } from "@/inngest/client";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";
import { getFaceById } from "./crud";
const getOutputKeySuffix = (type: generation_type, id: string) => {
  if (type === "BLUR_PERSON_IMAGE") return `${id}-${type}.png`;
  else return `${id}-${type}.mp4`;
};
export const generateRouter = createTRPCRouter({
  create_generation: protectedProcedure
    .input(createGenerationSchema)
    .mutation(async ({ ctx, input }) => {
      //validation
      if (!input.target_video && !input.target_image)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "missing video or image",
        });
      if (input.generation_type === "BLUR_PERSON_IMAGE" && !input.target_image)
        throw new TRPCError({ code: "BAD_REQUEST", message: "missing  image" });
      if (input.generation_type !== "BLUR_PERSON_IMAGE" && !input.target_video)
        throw new TRPCError({ code: "BAD_REQUEST", message: "missing  video" });
      const userId = ctx.session.user.id;
      // blur video excluding target
      if (input.generation_type === "BLUR_PERSON") {
        //create media for input video
        const media = await prisma.media.create({
          data: {
            user_id: userId,
            key: "",
          },
        });
        const key =
          userId +
          "/inputs/" +
          getOutputKeySuffix(input.generation_type, media.id);
        await prisma.media.update({
          where: { id: media.id },
          data: { key: key },
          select: null,
        });
        media.key = key;

        //create generation
        const generation = await prisma.generation.create({
          data: {
            user_id: userId,
            blur_type: input.blur_type,
            generation_type: input.generation_type,
            input_media_id: media.id,
            output_key: key.replace("/inputs/", "/outputs/"),
          },
        });
        //create face if uploaded
        let face: face | null = null;
        if (input.target_image_face) {
          const key =
            userId +
            "/" +
            "faces/" +
            getOutputKeySuffix("BLUR_PERSON_IMAGE", generation.id);
          const face_media = await prisma.media.create({
            data: {
              user_id: userId,
              key,
            },
            select: {
              id: true,
            },
          });
          face = await prisma.face.create({
            data: {
              user_id: userId,
              key,
              embedding: "",
              media_id: face_media.id,
            },
          });
          await prisma.generation.update({
            where: { id: generation.id },
            data: { face_id: face.id },
            select: null,
          });
          generation.face_id = face.id;
        }
        if (!generation.face_id && input.face_id) {
          const face = await getFaceById(input.face_id, userId);
          if (!face)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "invalid face id",
            });
               await prisma.generation.update({
            where: { id: generation.id },
            data: { face_id: face.id },
            select: null,
          });
          generation.face_id = input.face_id;
        }
        const video_upload = await createUploadUrl(media.key, "video/mp4");
        const face_upload = face
          ? await createUploadUrl(face?.key, "image/png")
          : null;
        return {
          generationId: generation.id,
          video_upload,
          face_upload,
          image_upload: null,
        };
      }
      // blur photo
      if (input.generation_type === "BLUR_PERSON_IMAGE") {
        //create media for input video
        const media = await prisma.media.create({
          data: {
            user_id: userId,
            key: "",
          },
        });
        const key =
          userId +
          "/inputs/" +
          getOutputKeySuffix(input.generation_type, media.id);
        await prisma.media.update({
          where: { id: media.id },
          data: { key: key },
          select: null,
        });
        media.key = key;

        //create generation
        const generation = await prisma.generation.create({
          data: {
            user_id: userId,
            blur_type: input.blur_type,
            generation_type: input.generation_type,
            input_media_id: media.id,
            output_key: key.replace("/inputs/", "/outputs/"),
          },
        });
        //create face if uploaded
        let face: face | null = null;
        if (input.target_image_face) {
          const key =
            userId +
            "/" +
            "faces/" +
            getOutputKeySuffix("BLUR_PERSON_IMAGE", generation.id);
          const face_media = await prisma.media.create({
            data: {
              user_id: userId,
              key,
            },
            select: {
              id: true,
            },
          });
          face = await prisma.face.create({
            data: {
              user_id: userId,
              key,
              embedding: "",
              media_id: face_media.id,
            },
          });
          await prisma.generation.update({
            where: { id: generation.id },
            data: { face_id: face.id },
            select: null,
          });
          await prisma.generation.update({
            where: { id: generation.id },
            data: { face_id: face.id },
            select: null,
          });
          generation.face_id = face.id;
        }
        if (!generation.face_id && input.face_id) {
          const face = await getFaceById(input.face_id, userId);
          if (!face)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "invalid face id",
            });
          await prisma.generation.update({
            where: { id: generation.id },
            data: { face_id: face.id },
            select: null,
          });
          generation.face_id = input.face_id;
        }
        const image_upload = await createUploadUrl(media.key, "image/png");
        const face_upload = face
          ? await createUploadUrl(face?.key, "image/png")
          : null;
        return {
          generationId: generation.id,
          image_upload: image_upload,
          face_upload,
          video_upload: null,
        };
      }

      // blur license
      if (input.generation_type === "BLUR_LICENSE_PLATE") {
        throw new TRPCError({ code: "NOT_IMPLEMENTED" });
      }
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "invalid generation type",
      });
    }),
trigger_generation: protectedProcedure
  .input(z.object({ generationId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    console.log("[trigger_generation] BEFORE SEND", {
      generationId: input.generationId,
      userId: ctx.session.user.id,
    });

    try {
      const result = await inngest.send({
        id: input.generationId,
        name: "app/task.generate",
        data: {
          generationId: input.generationId,
          userId: ctx.session.user.id,
        },
      });

      console.log("[trigger_generation] AFTER SEND", {
        generationId: input.generationId,
        result,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("[trigger_generation] SEND FAILED", error);

      throw error;
    }
  }),
  generation_status: protectedProcedure
    .input(z.object({ generationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const generationId = input.generationId;
      const generationcache = await redis.get<generation>(
        redisKeys.GENERATION(generationId, userId),
      );
      if (!generationcache) {
        const generation = await prisma.generation.findFirst({
          where: {
            id: generationId,
            user_id: userId,
          },
        });
        if (!generation) throw new TRPCError({ code: "NOT_FOUND" });
        if (generation.output_media_id)
          throw new TRPCError({ code: "BAD_REQUEST" });
        await redis.set(
          redisKeys.GENERATION(generationId, userId),
          generation,
          { ex: 60 * 5 },
        );
        return generation?.output_media_id;
      }

      return generationcache?.output_media_id;
    }),
});
