"use client";

import { Crown, Settings } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useSubscriptionContext } from "../subscription-provider";
import useCreateSessionSubscription from "@/hooks/useCreateSession";
import useCreatePotralSessionSubscription from "@/hooks/useCreatePotralSession";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SubscribeButton = () => {
  const { plan } = useSubscriptionContext();

  const { mutate: createCheckout, isPending: isCheckoutPending } =
    useCreateSessionSubscription();

  const { mutate: createPortal, isPending: isPortalPending } =
    useCreatePotralSessionSubscription();

  const router = useRouter();

  const isFree = plan === "FREE";
  const isPending = isCheckoutPending || isPortalPending;

  const handleClick = () => {
    if (isFree) {
      createCheckout(
        undefined,
        {
          onSuccess: (data) => {
            if (data.checkout_url) {
              router.push(data.checkout_url);
            } else {
              toast.error("Unable to create checkout session");
            }
          },
          onError: () => {
            toast.error("Something went wrong. Try again.");
          },
        }
      );

      return;
    }

    createPortal(
      undefined,
      {
        onSuccess: (data) => {
          if (data.link) {
            router.push(data.link);
          } else {
            toast.error("Unable to open subscription portal");
          }
        },
        onError: () => {
          toast.error("Something went wrong. Try again.");
        },
      }
    );
  };

  return (
    <div className="mx-4 mb-3 flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Crown
          className="size-4 text-lime-400"
          fill="currentColor"
        />

        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {isFree ? "Become a Pro" : "Manage Subscription"}
          </span>

          {!isFree && (
            <span className="text-[11px] text-muted-foreground">
              {plan} plan
            </span>
          )}
        </div>
      </div>

      <Button
        onClick={handleClick}
        disabled={isPending}
        size="sm"
        className="h-7 rounded-full bg-lime-400 px-4 text-xs font-semibold text-black hover:bg-lime-400/90"
      >
        {isPending
          ? "Loading..."
          : isFree
            ? "Upgrade"
            : "Manage"}
      </Button>
    </div>
  );
};

export default SubscribeButton;