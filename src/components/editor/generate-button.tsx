"use client";

import { Button } from "@/components/ui/button";
import { uploadToS3 } from "@/features/s3/upload-to-s3";
import useGenerate from "@/hooks/useGenerate";
import useTriggerGeneration from "@/hooks/useTriggerGeneration";
import { useEditor } from "@/store/editor-store";
import { TRPCClientError } from "@trpc/client";
import React from "react";
import { toast } from "sonner";

interface GenerateButtonProps extends React.ComponentProps<typeof Button> {}

export function GenerateButton({ className, ...props }: GenerateButtonProps) {
  const {
    blur_type,
    generation_type,
    target_image,
    target_video,
    target_image_face,
    face_id,
  } = useEditor();

  const { mutateAsync } = useGenerate();
  const { mutateAsync: triggerGeneration } = useTriggerGeneration();

  const [loading, setLoading] = React.useState(false);

  const handleCreate = async () => {
    if (loading) return;

    // -------------------------
    // Validation
    // -------------------------

    if (generation_type === "BLUR_PERSON_IMAGE" && !target_image) {
      toast.error("Missing image");
      return;
    }

    if (generation_type === "BLUR_PERSON" && !target_video) {
      toast.error("Missing source video");
      return;
    }

    if (!blur_type || !generation_type) {
      toast.error("Invalid configuration, please reload the page");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Processing...");

    try {
      // -------------------------
      // 1. Create generation
      // -------------------------

      const data = await mutateAsync({
        blur_type,
        generation_type,
        target_image: target_image?.size ?? null,
        target_image_face: target_image_face?.size ?? null,
        target_video: target_video?.size ?? null,
        face_id: face_id || undefined,
      });

      // -------------------------
      // 2. Upload files
      // -------------------------

      const uploads = [];

      if (target_video && data.video_upload) {
        uploads.push({
          file: target_video,
          upload: await data.video_upload,
        });
      }

      if (target_image_face && data.face_upload) {
        uploads.push({
          file: target_image_face,
          upload: await data.face_upload,
        });
      }

      if (target_image && data.image_upload) {
        uploads.push({
          file: target_image,
          upload: await data.image_upload,
        });
      }

      for (const { file, upload } of uploads) {
        toast.loading(`Uploading ${file.name}`, {
          id: toastId,
        });

        await uploadToS3(file, upload);
      }

      // -------------------------
      // 3. Start generation
      // -------------------------

      toast.loading("Starting generation...", {
        id: toastId,
      });

      await triggerGeneration({
        generationId: data.generationId,
      });

      // -------------------------
      // Done
      // -------------------------

      toast.success("Generation started", {
        id: toastId,
        description: "Your video is being generated in the background.",
      });
    } catch (error) {
      console.error(error);

      let message = "Error generating video";

      if (error instanceof TRPCClientError) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message, {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCreate}
      disabled={loading}
      {...props}
      className={`
        h-auto! w-full
        rounded-xl
        cursor-pointer
        py-1.5
        z-999
        relative
        border-0
        bg-[#d7ff00]
        text-xl font-semibold text-black
        shadow-[0_5px_0_#8eaa00]
        transition-all
        hover:bg-[#d7ff00]
        hover:shadow-[0_3px_0_#8eaa00]
        hover:translate-y-[2px]
        active:translate-y-[5px]
        active:shadow-none
        disabled:pointer-events-none
        disabled:opacity-60
        ${className ?? ""}
      `}
    >
      <span>{loading ? "Generating..." : "Generate"}</span>

      <div className="flex items-center gap-1">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path
            d="M11.8525 4.21651L11.7221 3.2387C11.6906 3.00226 11.4889 2.82568 11.2504 2.82568C11.0118 2.82568 10.8102 3.00226 10.7786 3.23869L10.6483 4.21651C10.2658 7.0847 8.00939 9.34115 5.14119 9.72358L4.16338 9.85396C3.92694 9.88549 3.75037 10.0872 3.75037 10.3257C3.75037 10.5642 3.92694 10.7659 4.16338 10.7974L5.14119 10.9278C8.00938 11.3102 10.2658 13.5667 10.6483 16.4349L10.7786 17.4127C10.8106 17.6491 11.0118 17.8257 11.2504 17.8257C11.4889 17.8257 11.6906 17.6491 11.7221 17.4127L11.8525 16.4349C12.2349 13.5667 14.4913 11.3102 17.3595 10.9278L18.3374 10.7974C18.5738 10.7659 18.7504 10.5642 18.7504 10.3257C18.7504 10.0872 18.5738 9.88549 18.3374 9.85396L17.3595 9.72358C14.4913 9.34115 12.2349 7.0847 11.8525 4.21651Z"
            fill="currentColor"
          />
          <path
            d="M4.6519 14.7568L4.82063 14.2084C4.84491 14.1295 4.91781 14.0757 5.00037 14.0757C5.08292 14.0757 5.15582 14.1291 5.1801 14.2084L5.34883 14.7568C5.56525 15.4602 6.11587 16.0108 6.81925 16.2272L7.36762 16.3959C7.44652 16.4202 7.50037 16.4931 7.50037 16.5757C7.50037 16.6582 7.44652 16.7311 7.36762 16.7554L6.81926 16.9241C6.11587 17.1406 5.56525 17.6912 5.34883 18.3946L5.1801 18.9429C5.15582 19.0218 5.08292 19.0757 5.00037 19.0757C4.91781 19.0757 4.84491 19.0218 4.82063 18.9429L4.65191 18.3946C4.43548 17.6912 3.88486 17.1406 3.18147 16.9241L2.63311 16.7554C2.55421 16.7311 2.50037 16.6582 2.50037 16.5757C2.50037 16.4931 2.55421 16.4202 3.18148 16.2272L3.18147 16.2272C3.88486 16.0102 4.43548 15.4602 4.6519 14.7568Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </Button>
  );
}
