"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { playNotificationSound } from "@/components/editor/playnotification-sound";
import { useGenerationStore } from "@/store/generation-stores";

const useGenerationStatus = (id?: string) => {
  const trpc = useTRPC();
  const notified = useRef(false);
  const {setIsComplete} = useGenerationStore()
  const query = useQuery(
    trpc.generation.generation_status.queryOptions(
      { generationId: id! },
      {
        enabled: !!id,

        refetchInterval: (query) => {
          // Stop polling when generation has an output
          if (query.state.data) {
            return false;
          }

          return 5000;
        },
      }
    )
  );

  useEffect(() => {
    
    if (!id || !query.data || notified.current){
      return;}
setIsComplete(true)
    notified.current = true;
    playNotificationSound()
    playNotificationSound()
    toast.custom(
      (toastId) => (
        <Link
          href={`/history/${id}`}
          onClick={() => toast.dismiss(toastId)}
          className="group block w-[380px] rounded-2xl border border-lime-400/20 bg-[#151515] p-4 shadow-2xl shadow-black/40 transition hover:border-lime-400/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lime-400 text-black">
              <span className="text-lg">✓</span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">
                Generation complete
              </p>

              <p className="mt-0.5 text-sm text-neutral-400">
                Your generation is ready to view
              </p>
            </div>

            <span className="shrink-0 text-sm font-medium text-lime-400 transition group-hover:translate-x-0.5">
              View →
            </span>
          </div>
        </Link>
      ),
      {
        duration: 8000,
      }
    );

    // Desktop notification if permission was already granted
    if (
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("Generation complete", {
        body: "Your BlurField generation is ready to view.",
      });
    }
  }, [query.data, id]);

  return query;
};

export default useGenerationStatus;