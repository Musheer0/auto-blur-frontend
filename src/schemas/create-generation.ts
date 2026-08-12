import { z } from "zod";
import { blur_type, generation_type } from "@/generated/prisma/enums";

export const createGenerationSchema = z.object({
  generation_type: z.nativeEnum(generation_type),

  blur_type: z.nativeEnum(blur_type),

  target_image: z
    .number()
    .nullable()
    .refine(
      (size) => size === null || size <= 10 * 1024 * 1024,
      "Image size must be less than 10 MB",
    ),
  target_video: z
    .number()
    .nullable()
    .refine(
      (size) => size === null || size <= 200 * 1024 * 1024,
      "Video size must be less than 200 MB",
    ),
      target_image_face: z
    .number()
    .nullable()
    .refine(
      (size) => size === null || size <= 10 * 1024 * 1024,
      "Image size must be less than 10 MB",
    ),

});