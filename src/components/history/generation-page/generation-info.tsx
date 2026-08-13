"use client"

import React from "react"
import {
  CheckCircle2,
  Download,
  FileVideo,
  ScanFace,
  Sparkles,
  CircleDot,
  ArrowLeft,
} from "lucide-react"
import { generationType } from "./generation-view"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const GenerationInfo = ({ data }: { data: generationType }) => {
  const isCompleted = data.status === "COMPLETED"
  const router = useRouter()
  return (
    <aside className="w-full max-w-[390px] shrink-0 rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 text-white">
      {/* Header */}
      <div className="mb-6">
        <Button onClick={()=>router.back()} className={"px-0 opacity-50 pb-4 text-muted-foreground"} variant={"link"} size={"xs"}><ArrowLeft/> Back</Button>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/40">
          <Sparkles className="size-3.5" />
          Generation
        </div>

        <h2 className="break-all text-2xl font-semibold tracking-tight text-lime-400">
          #{data.id}
        </h2>


        <p className="mt-3 text-sm text-white/40">
          {data.created_at.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}

          {" • "}

          {data.created_at.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="h-px bg-white/10" />

      {/* Generation metadata */}
      <div className="my-5 space-y-5">
        <InfoRow
          icon={<FileVideo className="size-4" />}
          label="Generation Type"
          value={data.generation_type}
        />

        <InfoRow
          icon={<Sparkles className="size-4" />}
          label="Blur Type"
          value={data.blur_type}
        />

        <InfoRow
          icon={<CircleDot className="size-4" />}
          label="Status"
          value={data.status}
          valueClassName="text-lime-400"
        />

        <InfoRow
          icon={<ScanFace className="size-4" />}
          label="Face Used"
          value={data.face_id ?? "None"}
        />
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <StatRow label="Input Media" value={shortId(data.input_media_id)} />

        <StatRow
          label="Output Media"
          value={
            data.output_media_id
              ? shortId(data.output_media_id)
              : "Not available"
          }
        />

        <StatRow label="Updated" value={formatDate(data.updated_at)} />
      </div>

      {/* Download */}
      {data.media_url && (
        <a
          href={data.media_url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-lime-400 font-semibold text-black transition hover:bg-lime-300 active:scale-[0.98]"
        >
          <Download className="size-4" />
          Download Output
        </a>
      )}
    </aside>
  )
}

const InfoRow = ({
  icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClassName?: string
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="text-white/60">{icon}</div>

      <span className="text-sm text-white/50">{label}</span>

      <span
        className={`ml-auto max-w-[150px] truncate text-right text-sm font-medium uppercase ${valueClassName || "text-white/90"}`}
      >
        {value}
      </span>
    </div>
  )
}

const StatRow = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-white/50">{label}</span>
      <span className="max-w-[170px] truncate font-mono text-white/80">
        {value}
      </span>
    </div>
  )
}

function shortId(id: string) {
  if (id.length <= 16) return id

  return `${id.slice(0, 8)}...${id.slice(-6)}`
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default GenerationInfo