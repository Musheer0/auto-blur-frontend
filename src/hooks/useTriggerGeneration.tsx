"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import React from "react";

const useTriggerGeneration = () => {
  const trpc = useTRPC();
  return useMutation(trpc.generation.trigger_generation.mutationOptions());
};

export default useTriggerGeneration;
