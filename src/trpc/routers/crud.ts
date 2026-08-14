import { redis } from "@/db/redis";
import { createTRPCRouter, protectedProcedure } from "../init";
import { redisKeys } from "@/lib/redis-keys";
import { face, generation, media } from "@/generated/prisma/client";
import prisma from "@/db";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { getImageUrl } from "@/features/s3/get-image-url";
const getGenerationById = async (
  id: string,
  userId: string,
  options?: { cacheIt: boolean },
) => {
  const cache = await redis.get<generation>(redisKeys.GENERATION(id, userId));
  if (cache) return cache;
  const generation = await prisma.generation.findFirst({
    where: {
      id,
      user_id: userId,
    },
  });
  if (!generation) throw new TRPCError({ code: "NOT_FOUND" });
  if (!options?.cacheIt)
    await redis.set<generation>(redisKeys.GENERATION(id, userId), generation, {
      ex: 60 * 15,
    });
  return generation;
};
const getMediaById = async (
  id: string,
  userId: string,
  options?: { cacheIt: boolean },
) => {
  const cache = await redis.get<media>(redisKeys.MEDIA(id, userId));
  if (cache) return cache;
  const media = await prisma.media.findFirst({
    where: {
      id,
      user_id: userId,
    },
  });
  if (!media) throw new TRPCError({ code: "NOT_FOUND" });
  if (!options?.cacheIt)
    await redis.set<media>(redisKeys.GENERATION(id, userId), media, {
      ex: 60 * 15,
    });
  return media;
};
export const getFaceById = async (
  id: string,
  userId: string,
  options?: { cacheIt: boolean },
) => {
  const cache = await redis.get<face>(redisKeys.FACE(id, userId));
  if (cache) return cache;
  const face = await prisma.face.findFirst({
    where: {
      id,
      user_id: userId,
    },
  });
  if (!face) throw new TRPCError({ code: "NOT_FOUND" });
  if (!options?.cacheIt)
    await redis.set<face>(redisKeys.GENERATION(id, userId), face, {
      ex: 60 * 15,
    });
  return face;
};
export const Crud = createTRPCRouter({
  getGenerationById: protectedProcedure
    .input(z.object({ generationID: z.string() }))
    .query(async ({ ctx, input }) => {
      const {output_key,...generation} =await  getGenerationById(input.generationID, ctx.session.user.id);
      
      if(( generation).status==="COMPLETED" && output_key){
        const media_url = await getImageUrl(output_key)
        return {...generation, media_url}
      }
      return {...generation, media_url:null}
    }),
  getMediaById: protectedProcedure
    .input(z.object({ mediaID: z.string() }))
    .query(async ({ ctx, input }) => {
      const {key, ...media} = await getMediaById(input.mediaID, ctx.session.user.id);
      const media_url = await getImageUrl(key)
      const  type =  key.endsWith(".mp4") ? "video":"image"
      console.log(type, key, media_url)
      return {...media, media_url,type}
    }),
  getFaceById: protectedProcedure
    .input(z.object({ faceID: z.string() }))
    .query(async ({ ctx, input }) => {
       const {key, ...media} = await getFaceById(input.faceID, ctx.session.user.id);
      const media_url = await getImageUrl(key)
      return {...media, media_url}
    }),
  getAllGenerations: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().int().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await prisma.generation.findMany({
        where: { user_id: ctx.session.user.id },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        skip: input.cursor ? 1 : 0,
        orderBy: { created_at: "desc" },
      });
      let nextCursor: string | null = null;
      if (items.length > input.limit) {
        nextCursor = items[items.length - 1].id;
        items.pop();
      }
      const promises = items
        .filter((ite) => ite.output_key !== null)
        .map(async (item) => {
          const output_url =(item.status==="COMPLETED" &&  item.output_media_id) && await getImageUrl(item.output_key!);
          return {
            id: item.id,
            face_id: item.face_id,
            input_media: item.input_media_id,
            output_media: item.output_media_id,
            output_media_url: output_url,
            created_at: item.created_at,
            blur_type: item.blur_type,
            generation_type: item.generation_type,
            status: item.status,
          };
        });
      const items_sanitized = await Promise.all(promises);
      return { items: items_sanitized, nextCursor };
    }),
  getAllMedia: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().int().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await prisma.media.findMany({
        where: { user_id: ctx.session.user.id },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        skip: input.cursor ? 1 : 0,
        orderBy: { created_at: "desc" },
      });
      let nextCursor: string | null = null;
      if (items.length > input.limit) {
        nextCursor = items[items.length - 1].id;
        items.pop();
      }
     const video_types =  [".mp4", ".mov", ".webm", ".avi", ".mkv"]
      const promises = items .map(async (item) => {
        const isVideo =video_types.map((v)=>item.key.endsWith(v)).filter((v)=>v!=false).length>0
          const output_url = await getImageUrl(item.key!);
          return {
            id: item.id,
            media_url: output_url,
            created_at: item.created_at,
            user_id:item.user_id,
            isVideo
         
          }})
              const items_sanitized = await Promise.all(promises);

      return { items:items_sanitized, nextCursor };
    }),
  getAllFaces: protectedProcedure.query(async ({ ctx }) => {
    const faces = await prisma.face.findMany({
      where: { user_id: ctx.session.user.id },
      orderBy: { created_at: "desc" },
    });
    const promises = faces.map(async (f) => {
      const img = await getImageUrl(f.key);
      return {
        id: f.id,
        media_id: f.media_id,
        created_id: f.created_at,
        image: img,
      };
    });
    const fs = await Promise.all(promises);
    return fs;
  }),
  deleteGenerationById: protectedProcedure
    .input(z.object({ generationID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const generation = await getGenerationById(
        input.generationID,
        ctx.session.user.id,
        { cacheIt: false },
      );
      await prisma.generation.delete({
        where: {
          id: generation.id,
          user_id: generation.user_id,
        },
      });
      await redis.del(redisKeys.GENERATION(generation.id, generation.user_id));
      return { ok: true };
    }),
  deleteMediaById: protectedProcedure
    .input(z.object({ mediaID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const media = await getMediaById(input.mediaID, ctx.session.user.id, {
        cacheIt: false,
      });
      await prisma.media.delete({
        where: {
          id: media.id,
          user_id: media.user_id,
        },
      });
      await redis.del(redisKeys.MEDIA(media.id, media.user_id));
      return { ok: true };
    }),
  deleteFaceById: protectedProcedure
    .input(z.object({ faceID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const face = await getFaceById(input.faceID, ctx.session.user.id, {
        cacheIt: false,
      });
      await prisma.face.delete({
        where: {
          id: face.id,
          user_id: face.user_id,
        },
      });
      await redis.del(redisKeys.FACE(face.id, face.user_id));
      return { ok: true };
    }),
});
