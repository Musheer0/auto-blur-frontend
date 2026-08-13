"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useGenerationStatus = (id: string) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.generation.generation_status.queryOptions({ generationId: id }),
  );
};

export default useGenerationStatus;
