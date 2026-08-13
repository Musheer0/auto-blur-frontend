"use client";

import { useState } from "react";
import BlurVideoEditor from "./blur-video-editor";
import { GenerateButton } from "./generate-button";
import BlurImageEditor from "./blur-img-editor";
import { useEditor } from "@/store/editor-store";
import { generation_type } from "@/generated/prisma/enums";

const tabs: {
  value: generation_type;
  label: string;
  component: any;
}[] = [
  {
    value: "BLUR_PERSON",
    label: "Video",
    component: <BlurVideoEditor />,
  },
  {
    value: "BLUR_PERSON_IMAGE",
    label: "Image",
    component: <BlurImageEditor />,
  },
  {
    value: "BLUR_LICENSE_PLATE",
    label: "License Plate",
    component: <><p className="p-2">Soon brother soon...</p></>,
  },
] as const;

const EditorInput = () => {
  const { setGenerationType, generation_type } = useEditor();
  const activeTab = tabs.find((tab) => tab.value === generation_type);

  return (
    <div className="flex h-full flex-col border overflow-hidden max-w-[300px] rounded-2xl bg-sidebar">
      {/* Tabs header */}
      <div className="shrink-0 border-b border-white/[0.06]">
        <div className="flex items-center justify-between gap-7 px-5">
          {tabs.map((tab) => {
            const isActive = generation_type === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setGenerationType(tab.value);
                }}
                className={`
                  relative
                  cursor-pointer
                  shrink-0
                  select-none
                  whitespace-nowrap
                  bg-transparent
                  py-3
                  text-[15px]
                  font-medium
                  outline-none
                  transition-colors
                  hover:bg-transparent
                  focus:bg-transparent
                  focus:outline-none
                  ${
                    isActive
                      ? "text-white"
                      : "text-white/45 hover:text-white/70"
                  }
                `}
              >
                {tab.label}

                {isActive && (
                  <div className="absolute inset-x-0 top-full h-[2px] bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 w-full overflow-y-auto">
        {activeTab?.component}
      </div>
      <div className="generate-btn p-3">
        <GenerateButton />
      </div>
    </div>
  );
};

export default EditorInput;
