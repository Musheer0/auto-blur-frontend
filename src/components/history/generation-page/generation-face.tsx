"use client"

import { useGetFaceById } from "@/hooks/useCrud"
import { ExternalLink, ScanFace } from "lucide-react"
import React from "react"

const GenerationFace = ({ face_id }: { face_id: string }) => {
  const { data, isLoading, isError } = useGetFaceById(face_id)

  return (
    <section className="rounded-2xl w-[390px] border border-white/10 bg-[#0d0d0d] p-5">
      <div className="mb-4 flex items-center gap-2">
        <ScanFace className="size-4 text-white/60" />

        <h2 className="text-sm font-medium text-white">
          Face Used
        </h2>
      </div>

      {isLoading ? (
        <div className="flex aspect-video items-center justify-center rounded-xl bg-white/[0.03]">
          <span className="text-sm text-white/30">
            Loading face...
          </span>
        </div>
      ) : isError || !data ? (
        <div className="flex aspect-video items-center justify-center rounded-xl bg-white/[0.03]">
          <span className="text-sm text-white/30">
            Unable to load face
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-4 ">
          {/* Face preview */}
          <div className="overflow-hidden rounded-xl bg-black">
            <img
              src={data.media_url}
              alt="Face used for generation"
              className="aspect-video h-full w-full object-contain"
            />
          </div>

          {/* Metadata */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <FaceInfo
                label="ID"
                value={data.id}
              />

              <FaceInfo
                label="Created"
                value={formatDate(data.created_at.toDateString())}
              />

              <FaceInfo
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
              View Face
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      )}
    </section>
  )
}

const FaceInfo = ({
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

      <p className="truncate font-mono text-xs text-white/70">
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

export default GenerationFace