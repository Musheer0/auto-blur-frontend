"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Image as ImageIcon, Video as VideoIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropzoneCardType = "image" | "video";

interface DropzoneCardProps {
  /** Which kind of media this dropzone accepts */
  type: DropzoneCardType;
  /** Called with the selected file, or null when it's removed */
  onUpload?: (file: File | null) => void;
  /** Controlled value — pass a File (or array) to drive the preview externally */
  selectedFiles?: File | File[] | null;
  className?: string;
}

const ACCEPT_MAP: Record<DropzoneCardType, Record<string, string[]>> = {
  image: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"] },
  video: { "video/*": [".mp4", ".mov", ".webm", ".avi", ".mkv"] },
};

const COPY: Record<DropzoneCardType, { title: string; subtitle: string }> = {
  image: { title: "Upload image", subtitle: "PNG, JPG, GIF or WEBP" },
  video: { title: "Upload video", subtitle: "MP4, MOV, WEBM or AVI" },
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function DropzoneCard({ type, onUpload, selectedFiles, className }: DropzoneCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Support controlled usage via `selectedFiles`
  useEffect(() => {
    if (selectedFiles === undefined) return;
    const next = Array.isArray(selectedFiles) ? selectedFiles[0] ?? null : selectedFiles;
    setFile(next);
  }, [selectedFiles]);

  // Build/clean up an object URL for image previews
  useEffect(() => {
    if (!file || type !== "image") {
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
        setError(rejections[0].errors[0]?.message ?? "That file can't be uploaded.");
        return;
      }
      setError(null);
      const next = accepted[0] ?? null;
      setFile(next);
      onUpload?.(next);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPT_MAP[type],
    maxFiles: 1,
    multiple: false,
    noClick: !!file,
    noKeyboard: !!file,
  });

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setFile(null);
      setError(null);
      onUpload?.(null);
    },
    [onUpload]
  );

  const { title, subtitle } = COPY[type];
  const TypeIcon = type === "image" ? ImageIcon : VideoIcon;

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex w-full max-w-sm flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-6 text-center outline-none transition-colors",
        isDragActive && "border-primary bg-accent/40",
        !file && "cursor-pointer hover:border-primary/60 hover:bg-accent/20",
        className
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

          {type === "image" && previewUrl ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="h-28 w-28 rounded-xl object-cover ring-1 ring-border"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-foreground">
              <VideoIcon className="h-6 w-6" />
            </div>
          )}

          <div className="max-w-full space-y-0.5">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
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