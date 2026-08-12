// src/inngest/functions.ts
import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/db";
import { blurapi } from "@/lib/backend-client";

export const startGeneration = inngest.createFunction(
  { id: "start-generation", triggers: { event: "app/task.generate" } ,retries:3},
  async ({ event, step }) => {
    const generationId = await event.data?.generationId
    const userId = await event.data?.userId
    if(!generationId || !userId) throw new NonRetriableError("missing generation id or userId ")
    const generation = await prisma.generation.findFirst({
  where:{
    id:generationId,
    user_id:userId
  }});
  if(!generation) throw new NonRetriableError("generation not found or does not belongs to user")
  const input_media = await prisma.media.findFirst({
  where:{id:generation.input_media_id,user_id:userId},select:{key:true}})
  const output_key = generation.output_key
  const face = generation.face_id ? await prisma.face.findFirst({
    where:{
      id:generation.face_id,
      user_id:userId
    },
    select:{
    key:true
    }
  }):null
  if(!output_key || !input_media?.key) throw new NonRetriableError("missing output key or input media key")
    const response =await step.run({id:"generate-video"},async()=>{
  if(!output_key) throw new NonRetriableError("missing output key")
        const {response,data} =face ? await blurapi.POST("/api/blur-video/selective", {
          body:{
            blur_method:generation.blur_type.toLocaleLowerCase() as any,
            key:input_media.key,
            output_key:output_key,
            target_image:face.key
          }
        }):
        await blurapi.POST("/api/blur-video", {
          body:{
            blur_method:generation.blur_type.toLocaleLowerCase() as any,
            key:input_media.key,
            output_key:output_key,
          }
        });
        if(response.ok){
          if((data as any)?.success) return {ok:true}
           throw new Error("error generating video trying again")
        }
        throw new NonRetriableError("api error")
  });
  const output_media = await prisma.media.create({
    data:{
      user_id:generation.user_id,
      key:output_key
    },
    select:{
      id:true,
      key:true
    }
  });
  return output_media
  }
);