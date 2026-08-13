"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  UploadCloud,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "@/store/editor-store";

export type DropzoneCardType = "image" | "video" | "face";

interface DropzoneCardProps {
  type: DropzoneCardType;
}
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 200 * 1024 * 1024;
const ACCEPT_MAP: Record<DropzoneCardType, Record<string, string[]>> = {
  image: {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
  },
  video: {
    "video/*": [".mp4", ".mov", ".webm", ".avi", ".mkv"],
  },
  face: {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
  },
};

const COPY: Record<DropzoneCardType, { title: string; subtitle: string }> = {
  image: {
    title: "Upload image",
    subtitle: "PNG, JPG, GIF or WEBP",
  },
  video: {
    title: "Upload video",
    subtitle: "MP4, MOV, WEBM or AVI",
  },
  face: {
    title: "Upload image",
    subtitle: "PNG, JPG, GIF or WEBP",
  },
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function DropzoneCard({ type }: DropzoneCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    target_image,
    target_video,
    setTargetImage,
    setTargetVideo,
    target_image_face,
    setTargetImageFace,
  } = useEditor();

  const file =
    type === "image"
      ? target_image
      : type === "face"
        ? target_image_face
        : target_video;

  // Create image preview
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file, type]);

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        setError(
          rejections[0].errors[0]?.message ?? "That file can't be uploaded.",
        );
        return;
      }

      setError(null);

      const next = accepted[0] ?? null;
      console.log("DROPZONE", {
        type,
        target_image,
        target_image_face,
        target_video,
        file,
      });
      if (!next) return;

      if (type === "image") {
        setTargetImage(next);
      } else if (type === "face") {
        setTargetImageFace(next);
      } else {
        setTargetVideo(next);
      }
    },
    [type, setTargetImage, setTargetVideo, setTargetImageFace],
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setError(null);

      if (type === "image") {
        setTargetImage(null);
      } else if (type === "face") {
        setTargetImageFace(null);
      } else {
        setTargetVideo(null);
      }
    },
    [type, setTargetImage, setTargetVideo],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPT_MAP[type],
    maxFiles: 1,
    multiple: false,
    noClick: !!file,
    noKeyboard: !!file,
    maxSize: type==="video" ? MAX_VIDEO_SIZE :MAX_IMAGE_SIZE
  });

  const { title, subtitle } = COPY[type];
  const TypeIcon = type === "image" || type === "face" ? ImageIcon : VideoIcon;

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex w-full h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-6 text-center outline-none transition-colors",
        isDragActive && "border-primary bg-accent/40",
        !file && "cursor-pointer hover:border-primary/60 hover:bg-accent/20",
      )}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="flex w-full flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove file"
            className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {previewUrl && (type === "image" || type === "face") ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="h-32 w-full max-w-xs rounded-xl object-cover ring-1 ring-border"
            />
          ) : previewUrl && type === "video" ? (
            <video
              src={previewUrl}
              controls
              preload="metadata"
              className="h-80   rounded-xl object-cover ring-1 ring-border"
            />
          ) : null}
          <div className="max-w-full space-y-0.5">
            <p className="truncate text-sm font-medium text-foreground">
              {file.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            className="text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            Replace file
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center -space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground ring-4 ring-card">
              <TypeIcon className="h-4 w-4" />
            </div>

            <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground ring-4 ring-card">
              <UploadCloud className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default DropzoneCard;
