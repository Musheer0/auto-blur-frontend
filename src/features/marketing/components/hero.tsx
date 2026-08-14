"use client"
import { useRef, useState, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Sparkles,
  Play,
  Check,
  ChevronsLeftRight,
  Upload,
  Shield,
} from "lucide-react";

export default function Hero() {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<boolean>(false);

  const updatePos = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(100, Math.max(0, pct)));
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    updatePos(e.clientX);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updatePos(e.clientX);
  };

  const stopDragging = () => {
    draggingRef.current = false;
  };

  return (
    <section className="w-full bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        {/* Left column */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-lime-400" />
            <span className="text-xs font-medium text-foreground">
              Privacy first. Always.
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            Blur strangers.
            <br />
            <span className="text-lime-400">Keep yourself.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Upload your video, select your face, and let BlurField
            automatically blur everyone else in the video. Your privacy.
            Your story.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button className="rounded-full bg-lime-400 px-6 text-neutral-900 hover:bg-lime-300">
              Try BlurField free
              <Sparkles className="ml-1.5 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-border bg-transparent px-6 text-foreground hover:bg-muted/40"
            >
              <Play className="mr-1.5 h-4 w-4 fill-current" />
              Watch demo
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-lime-400" />
              <span className="text-sm text-muted-foreground">
                No credit card required
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-lime-400" />
              <span className="text-sm text-muted-foreground">
                Your data stays private
              </span>
            </div>
          </div>
        </div>

        {/* Right column — before/after comparison */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div
            ref={containerRef}
            className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerLeave={stopDragging}
          >
            {/* Original image (full) */}
            <img
              src="/before.png"
              alt="Original, unblurred"
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            {/* Blurred image (clipped) */}
            <div
              className="absolute inset-0 h-full w-full overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <img
                src="/after.png"
                alt="Blurred, strangers obscured"
                className="h-full w-full object-cover "
                draggable={false}
              />
            </div>

            {/* Badges */}
            <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
              Original
            </span>
            <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
              Blurred
            </span>

            {/* Divider line + handle */}
            <div
              className="absolute inset-y-0 w-0.5 bg-lime-400"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lime-400 text-neutral-900 shadow-md">
                <ChevronsLeftRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-400/10">
                <Shield className="h-4 w-4 text-lime-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Only you stay visible.
                </p>
                <p className="text-xs text-muted-foreground">
                  Everyone else is automatically blurred.
                </p>
              </div>
            </div>
            <Button className="hidden shrink-0 rounded-full bg-lime-400 px-5 text-neutral-900 hover:bg-lime-300 sm:inline-flex">
              Upload your video
              <Upload className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}