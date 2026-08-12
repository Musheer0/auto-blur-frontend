import { bucket } from "@/constants";
import { s3 } from "./client";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB

export async function createUploadUrl(
  key: string,
  contentType: string,
) {
  const isVideo = contentType.startsWith("video/");
  const isImage = contentType.startsWith("image/");

  if (!isVideo && !isImage) {
    throw new Error("Only images and videos are allowed");
  }

  const maxSize = isVideo
    ? MAX_VIDEO_SIZE
    : MAX_IMAGE_SIZE;

  const { url, fields } = await createPresignedPost(s3, {
    Bucket: bucket!,
    Key: key,

    Conditions: [
      ["content-length-range", 1, maxSize],
      ["starts-with", "$Content-Type", isVideo ? "video/" : "image/"],
    ],

    Fields: {
      "Content-Type": contentType,
    },

    Expires: 60*15,
  });

  return {
    url,
    fields,
    maxSize,
  };
}