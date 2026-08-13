"use client";
import React from "react";
import DropzoneCard from "./upload-card";
import { BlurMethodSelect } from "./blur-method-select";
import { BlurMethod } from "@/types";
import { GenerateButton } from "./generate-button";
import FaceInput from "./face-input";

const BlurVideoEditor = () => {
  return (
    <div className="flex-1 flex flex-col w-full  overflow-y-auto p-3">
      <div className="flex flex-col overflow-y-auto flex-1">
        <div className="video w-full rounded-xl my-4 overflow-hidden relative">
          <div className="overlay absolute top-0 left-0 flex w-full h-full bg-gradient-to-b from-transparent to-black  z-10 p-3">
            <div className="text flex flex-col mt-auto">
              <p className="text-2xl uppercase font-black text-lime-400">
                Blur strangers
              </p>
              <p className="text-xs text-muted-foreground">
                blurs everyone except the selected person
              </p>
            </div>
          </div>
          <video src="12.mp4" muted loop autoPlay className=""></video>
        </div>

        <div className=" py-4 flex flex-col gap-2">
          <p className="font-semibold">Blur Type</p>
          <BlurMethodSelect />
        </div>
        <div className="target-v py-4 flex flex-col gap-2">
          <p className="font-semibold leading-none">Person Image</p>
          <p className="text-xs pb-2 text-muted-foreground leading-none">
            Clear image of the person you want keep unblured(optional)
          </p>
          <FaceInput />
        </div>
      </div>
    </div>
  );
};

export default BlurVideoEditor;
