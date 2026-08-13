"use client"

import React from "react"
import { Download } from "lucide-react"
import { generationType } from "./generation-view"

const GenerationOutput = ({ data }: { data: generationType }) => {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">
          Output <span className="text-white/40">(Blurred)</span>
        </h2>

        {data.media_url && (
          <a
            href={data.media_url}
            download
            className="
              inline-flex size-9 items-center justify-center
              rounded-lg border border-white/10
              text-white/50 transition
              hover:bg-white/[0.05] hover:text-white
            "
            title="Download output"
          >
            <Download className="size-4" />
          </a>
        )}
      </div>

      <div className="aspect-video overflow-hidden rounded-xl bg-black">
        {data.media_url ? (
          <video
            src={data.media_url}
            controls
            preload="metadata"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/30">
            No output available
          </div>
        )}
      </div>
    </section>
  )
}

export default GenerationOutput