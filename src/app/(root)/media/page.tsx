"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import MediaList from "@/components/media/media-list";

const Page = () => {
  const router = useRouter();

  return (
    <div className=" px-4 ">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
          title="Go back"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div>
          <h1 className="text-lg font-semibold">Media</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all your uploaded media
          </p>
        </div>
      </div>

      <MediaList />
    </div>
  );
};

export default Page;