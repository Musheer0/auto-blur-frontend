"use client"

import { useGetMediaById } from "@/hooks/useCrud"
import { ExternalLink, FileVideo } from "lucide-react"
import React from "react"

const GenerationMedia = ({ mediaId }: { mediaId: string }) => {
  const { data, isLoading, isError } = useGetMediaById(mediaId)

  return (
    <section className="rounded-2xl border border-white/10  bg-[#0d0d0d] p-5">
      <div className="mb-4 flex items-center gap-2">
        <FileVideo className="size-4 text-white/60" />

        <h2 className="text-sm font-medium text-white">
          Input Media
        </h2>
      </div>

      {isLoading ? (
        <div className="flex aspect-video items-center justify-center rounded-xl bg-white/[0.03]">
          <span className="text-sm text-white/30">
            Loading media...
          </span>
        </div>
      ) : isError || !data ? (
        <div className="flex aspect-video items-center justify-center rounded-xl bg-white/[0.03]">
          <span className="text-sm text-white/30">
            Unable to load media
          </span>
        </div>
      ) : (
        <div className="grid gap-4  md:grid-cols-[1fr_180px]">
          {/* Preview */}
          <div className="overflow-hidden rounded-xl bg-black">
            {data.type === "video" ? (
              <video
                src={data.media_url}
                controls
                preload="metadata"
                className="aspect-video h-full w-full object-contain"
              />
            ) : (
              <img
                src={data.media_url}
                alt="Input media"
                className="aspect-video h-full w-full object-contain"
              />
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <MediaInfo
                label="ID"
                value={data.id}
              />

              <MediaInfo
                label="Type"
                value={data.type}
              />

              <MediaInfo
                label="Created"
                value={formatDate(data.created_at.toDateString())}
              />

              <MediaInfo
                label="Updated"
                value={formatDate(data.updated_at.toDateString())}
              />
            </div>

            <a
              href={data.media_url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-5 flex items-center justify-center gap-2
                rounded-lg border border-white/10
                px-3 py-2 text-xs font-medium
                text-white/60 transition
                hover:bg-white/[0.05] hover:text-white
              "
            >
              View Media
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      )}
    </section>
  )
}

const MediaInfo = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  return (
    <div>
      <p className="mb-1 text-xs text-white/35">
        {label}
      </p>

      <p className="truncate font-mono text-xs uppercase text-white/70">
        {value}
      </p>
    </div>
  )
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default GenerationMedia