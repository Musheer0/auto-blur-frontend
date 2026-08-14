import type { Metadata } from "next";
import HistoryList from "@/components/history/history-list";
import React from "react";

export const metadata: Metadata = {
  title: "Generation History",
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  return (
    <div className="flex-1 border bg-sidebar rounded-2xl p-2">
      <div className="header px-4 py-2">
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="text-sm  text-muted-foreground">
          your previously generation videos or images{" "}
        </p>
      </div>
      <HistoryList />
    </div>
  );
};

export default page;
