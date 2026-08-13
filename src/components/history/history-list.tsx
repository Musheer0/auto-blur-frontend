"use client";

import Link from "next/link";
import React from "react";
import { useGetAllGenerations } from "@/hooks/useCrud";
import { cn } from "@/lib/utils";

const HistoryList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useGetAllGenerations();

  const generations = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-xl border bg-muted/30"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
        Failed to load history
      </div>
    );
  }

  if (!generations.length) {
    return (
      <div className="flex min-h-60 items-center justify-center text-sm text-muted-foreground">
        No generations yet
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {generations.map((item) => (
          <Link
            key={item.id}
            href={`/history/${item.id}`}
            className="group overflow-hidden rounded-xl border bg-background transition-colors hover:bg-muted/30"
          >
            <div className="aspect-video relative overflow-hidden bg-muted">
                   <span className="shrink-0 absolute top-2 left-2 rounded-md bg-muted px-2 py-1 text-[10px] uppercase text-muted-foreground">
                  {item.blur_type}
                </span>
              {(item.output_media_url && item.output_media) ? (
                <>
                  {item.generation_type === "BLUR_PERSON_IMAGE" && (
                    <img
                      src={item.output_media_url}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  {item.generation_type === "BLUR_PERSON" && (
                    <video
                    controls
                      src={item.output_media_url}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No preview
                </div>
              )}
            </div>

            <div className="space-y-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {item.generation_type}
                </span>

               <span className={cn(
                "shrink-0  rounded-md bg-muted px-2 py-1 text-[10px] uppercase text-muted-foreground",
                item.status=="STARTED" && 'bg-yellow-500/20',item.status=="COMPLETED" && 'bg-emerald-500/20',
                item.status=="FAILED" && 'bg-red-500/20'
               )}>
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-muted disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
