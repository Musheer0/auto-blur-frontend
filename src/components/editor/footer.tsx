// footer.tsx

import React from "react";
import { CatIcon, Coffee, Volume2 } from "lucide-react";

const GITHUB_URL = "https://github.com/Musheer0";
const COFFEE_URL = "https://paypal.me/musheer67";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-neutral-950/80 px-6 py-5">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Brand / copyright */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-300">
            BlurField
          </span>

          <span className="text-white/10">/</span>

          <span>
            Built for privacy, apparently
          </span>
        </div>

        {/* Technical note */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-600">
          <Volume2 className="size-3.5 text-neutral-500" />

          <span>
            P.S. Sound effects aren't MP3s — they're generated
            in real time using the Web Audio API oscillator.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-lime-400"
          >
            <CatIcon className="size-3.5" />
            GitHub
          </a>

          <span className="h-3.5 w-px bg-white/10" />
 <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-lime-400"
          >
            <CatIcon className="size-3.5" />
            Star the f**king repo
          </a>
        </div>
      </div>
    </footer>
  );
}