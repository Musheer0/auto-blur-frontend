"use client";

import { useGetAllFaces } from "@/hooks/useCrud";
import { useEditor } from "@/store/editor-store";
import React from "react";

const FacesList = () => {
  const { face_id, setFaceId, setTargetImageFace } = useEditor();
  const { isPending, isError, data } = useGetAllFaces();

  if (isPending) {
    return (
      <div className="w-full">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 w-20 shrink-0 animate-pulse rounded-xl bg-zinc-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-24 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 px-4 text-sm text-red-400">
        Failed to load faces
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 text-sm text-zinc-500">
        No saved faces yet
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-zinc-100">Saved faces</h3>

          <p className="text-xs text-zinc-500">Select a face to use</p>
        </div>

        <span className="text-xs text-zinc-500">
          {data.length} {data.length === 1 ? "face" : "faces"}
        </span>
      </div>

      <div className="flex max-h-80 gap-3 overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700 hover:scrollbar-thumb-lime-400/70">
        {data.map((face) => {
          const selected = face_id === face.id;

          return (
            <button
              key={face.id}
              type="button"
              onClick={() => {
                setFaceId(face.id);
                setTargetImageFace(null);
              }}
              className={`
                                group relative shrink-0 overflow-hidden
                                rounded-xl border-2 transition-all duration-200
                                focus:outline-none focus-visible:ring-2
                                focus-visible:ring-lime-400
                                ${
                                  selected
                                    ? "border-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.2)]"
                                    : "border-zinc-800 hover:border-zinc-600"
                                }
                            `}
            >
              <img
                src={face.image}
                alt="Saved face"
                className="h-20 w-20 object-cover transition-transform duration-200 group-hover:scale-105"
              />

              {selected && (
                <div className="absolute inset-0 flex items-center justify-center bg-lime-400/10">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-400 text-black shadow-lg">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.415 0l-3.25-3.25a1 1 0 011.415-1.42l2.543 2.544 6.543-6.544a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FacesList;
