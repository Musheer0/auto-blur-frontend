"use client";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import React from "react";

export const useGetGenerationById = (generationID: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.crud.getGenerationById.queryOptions({ generationID }));
};

export const useGetMediaById = (mediaID: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.crud.getMediaById.queryOptions({ mediaID }));
};

export const useGetFaceById = (faceID: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.crud.getFaceById.queryOptions({ faceID }));
};

export const useGetAllGenerations = (limit = 20) => {
  const trpc = useTRPC();

  return useInfiniteQuery(
    trpc.crud.getAllGenerations.infiniteQueryOptions(
      { limit },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      },
    ),
  );
};

export const useGetAllMedia = (input: {
  cursor?: string | null;
  limit?: number;
}) => {
  const trpc = useTRPC();
  return useQuery(trpc.crud.getAllMedia.queryOptions(input));
};

export const useGetAllFaces = () => {
  const trpc = useTRPC();
  return useQuery(trpc.crud.getAllFaces.queryOptions());
};

export const useDeleteGenerationById = () => {
  const trpc = useTRPC();
  return useMutation(trpc.crud.deleteGenerationById.mutationOptions());
};

export const useDeleteMediaById = () => {
  const trpc = useTRPC();
  return useMutation(trpc.crud.deleteMediaById.mutationOptions());
};

export const useDeleteFaceById = () => {
  const trpc = useTRPC();
  return useMutation(trpc.crud.deleteFaceById.mutationOptions());
};
