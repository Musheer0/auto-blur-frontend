"use client";

import { useEditor } from "@/store/editor-store";
import React from "react";
import DropzoneCard from "./upload-card";
import FacesDialog from "@/components/face/faces-dialog";

const FaceInput = () => {
  const { face_id, setFaceId } = useEditor();

  return (
    <div className="flex flex-col gap-3">
      {!face_id ? (
        <>
          <DropzoneCard type="face" />

          <FacesDialog>
            <button
              type="button"
              className="
                                flex w-full items-center justify-center gap-2
                                rounded-xl border border-zinc-800
                                bg-zinc-900/50 px-4 py-3
                                text-sm font-medium text-zinc-200
                                transition-colors
                                hover:border-lime-400/50
                                hover:bg-lime-400/5
                                hover:text-lime-300
                            "
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Select saved face
            </button>
          </FacesDialog>
        </>
      ) : (
        <div
          className="
                        flex items-center justify-between
                        rounded-xl border border-lime-400/30
                        bg-lime-400/5 p-3
                    "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                                flex h-9 w-9 shrink-0 items-center
                                justify-center rounded-lg
                                bg-lime-400/10 text-lime-400
                            "
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-100">Face selected</p>

              <p className="truncate text-xs text-zinc-500">{face_id}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFaceId(null)}
            className="
                            shrink-0 rounded-lg px-3 py-2
                            text-xs font-medium text-red-400
                            transition-colors
                            hover:bg-red-400/10
                            hover:text-red-300
                        "
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default FaceInput;
