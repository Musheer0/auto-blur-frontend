"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import React from "react";

const useGenerate = () => {
  const trpc = useTRPC();
  return useMutation(trpc.generation.create_generation.mutationOptions());
};

export default useGenerate;
