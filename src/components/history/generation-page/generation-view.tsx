"use client"

import React from "react"
import { inferProcedureOutput } from "@trpc/server"
import { AppRouter } from "@/trpc/routers/_app"
import { useGetGenerationById } from "@/hooks/useCrud"
import GenerationInfo from "./generation-info"
import GenerationOutput from "./generation-output"
import GenerationMedia from "./generation-media"
import GenerationFace from "./generation-face"

export type generationType = inferProcedureOutput<
  AppRouter["crud"]["getGenerationById"]
>

const GenerationView = ({ id }: { id: string }) => {
  const { data, isLoading, isError } = useGetGenerationById(id)

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-sm text-white/40">
          Loading generation...
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-5 text-sm text-white/50">
          Generation not found
        </div>
      </div>
    )
  }

  const generation: generationType = {
    ...data,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  }

  return (
    <main className="min-h-[calc(100vh-80px)] w-full px-5 pb-8">
      <div className="mx-auto flex w-full max-w-[1800px] gap-5">
        {/* Left sidebar */}
        <div className="flex flex-col gap-4">
        <GenerationInfo data={generation} />
                     {generation.face_id &&  <GenerationFace face_id={generation.face_id}/>}

        </div>
        {/* Main content */}
        <section className="min-w-0 flex-1">
         <GenerationOutput data={generation}/>
         <div className="bottom w-full flex flex-col  py-4 items-center gap-4">
            <GenerationMedia mediaId={generation.input_media_id}/>
         </div>
        </section>
      </div>
    </main>
  )
}

export default GenerationView