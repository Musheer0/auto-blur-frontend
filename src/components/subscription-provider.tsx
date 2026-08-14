"use client";

import React, { createContext, useContext } from "react";
import { usage } from "@/generated/prisma/client";
import useSubscription from "@/hooks/useSubscription";

type SubscriptionContextType = usage;

const SubscriptionContext =
  createContext<SubscriptionContextType | null>(null);

const SubscriptionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isLoading, isError } = useSubscription();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen gap-4 flex-col items-center justify-center">
        Loading Subscription Status
        <div className="size-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <h1 className="text-lg font-semibold">
          Failed to load subscription
        </h1>
        <p className="text-sm text-muted-foreground">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  if (!data?.usage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Subscription not found.</p>
      </div>
    );
  }

  return (
    <SubscriptionContext.Provider value={data.usage}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error(
      "useSubscriptionContext must be used inside SubscriptionProvider",
    );
  }

  return context;
};

export default SubscriptionProvider;