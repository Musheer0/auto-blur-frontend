"use client";
import React from "react";
import BlurVideoPreview from "./blur-video-preview";

const BlurPreview = () => {
  return <div className="flex-1 border bg-sidebar rounded-2xl p-2">
    <BlurVideoPreview/>
  </div>;
};

export default BlurPreview;
