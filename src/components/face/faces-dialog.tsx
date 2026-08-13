"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FacesList from "./faces-list";

type FacesDialogProps = {
  children: React.ReactNode;
};

const FacesDialog = ({ children }: FacesDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Select a face</DialogTitle>

          <DialogDescription className="text-zinc-500">
            Choose one of your saved faces to use for this generation.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2">
          <FacesList />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FacesDialog;
