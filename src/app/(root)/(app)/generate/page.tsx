import type { Metadata } from "next";
import BlurPreview from "@/components/editor/blur-preview";
import React from "react";

export const metadata: Metadata = {
  title: "Blur Faces in Videos and Images",
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return <BlurPreview />;
};

export default page;
