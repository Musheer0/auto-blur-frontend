"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useGetAllMedia, useDeleteMediaById } from "@/hooks/useCrud";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type MediaItem = {
  id: string;
  media_url: string;
  isVideo: boolean;
  created_at: Date;
};

interface MediaCardProps {
  item: MediaItem;
  onDeleteClick: (item: MediaItem) => void;
  isDeleting: boolean;
}

const MediaCard = ({ item, onDeleteClick, isDeleting }: MediaCardProps) => {
  return (
    <div className="group overflow-hidden rounded-xl border bg-background">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <span className="absolute left-2 top-2 z-10 rounded-md bg-black/60 px-2 py-1 text-[10px] uppercase text-white backdrop-blur">
          {item.isVideo ? "Video" : "Image"}
        </span>

        {item.isVideo ? (
          <video
            src={item.media_url}
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={item.media_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <span className="block truncate text-xs text-muted-foreground">
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-1 text-[10px] uppercase",
              item.isVideo
                ? "bg-blue-500/10 text-blue-500"
                : "bg-emerald-500/10 text-emerald-500",
            )}
          >
            {item.isVideo ? "Video" : "Image"}
          </span>

          <button
            type="button"
            onClick={() => onDeleteClick(item)}
            disabled={isDeleting}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:pointer-events-none disabled:opacity-50"
            title="Delete media"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MediaList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useGetAllMedia({
    limit: 10,
  });

  const deleteMedia = useDeleteMediaById();

  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);

  const media = data?.pages.flatMap((page) => page.items) ?? [];

  const handleDeleteClick = (item: MediaItem) => {
    setMediaToDelete(item);
  };

  const handleConfirmDelete = () => {
    if (!mediaToDelete) return;
    deleteMedia.mutate(
      { mediaID: mediaToDelete.id },
      {
        onSettled: () => setMediaToDelete(null),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-video animate-pulse rounded-xl border bg-muted/30"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
        Failed to load media
      </div>
    );
  }

  if (!media.length) {
    return (
      <div className="flex min-h-60 items-center justify-center text-sm text-muted-foreground">
        No media yet
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {media.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onDeleteClick={handleDeleteClick}
            isDeleting={deleteMedia.isPending}
          />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}

      <AlertDialog
        open={!!mediaToDelete}
        onOpenChange={(open) => !open && setMediaToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this media?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {mediaToDelete?.isVideo ? "video" : "image"}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMedia.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMedia.isPending}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleteMedia.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MediaList;