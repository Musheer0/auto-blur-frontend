"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useGenerate = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.generation.create_generation.mutationOptions(),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: trpc.usage.getUsage.queryKey(),
      });
    },
  });
};

export default useGenerate;