"use client";
import React from "react";
import BlurVideoPreview from "./blur-video-preview";
import { useEditor } from "@/store/editor-store";
import BlurImagePreview from "./blur-image-preview";

const BlurPreview = () => {
  const {generation_type} = useEditor()
  return <div className="flex-1 border bg-sidebar rounded-2xl p-2">
    {
     generation_type!=="BLUR_PERSON_IMAGE" ?
     <BlurVideoPreview/>:
     <BlurImagePreview/>
    }
  </div>;
};

export default BlurPreview;
