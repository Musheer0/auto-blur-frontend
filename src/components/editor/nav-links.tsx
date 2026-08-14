"use client";

import { CatIcon, Star, Coffee } from "lucide-react";

const X_URL = "https://x.com/musheer_an";
const GITHUB_PROFILE_URL = "https://github.com/Musheer0";
const REPO_URL = "https://github.com/Musheer0/auto-blur-frontend";
const COFFEE_URL = "https://paypal.me/musheer67";

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function SocialLinks() {
  return (
    <div className="flex items-center ml-auto gap-4 bg-neutral-950 px-4 py-2.5">
      <a
        href={X_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[13px] text-neutral-400 hover:text-lime-400 transition-colors"
      >
        <XIcon className="size-3.5" />
        Follow
      </a>

      <span className="h-3.5 w-px bg-white/10" />

      <a
        href={GITHUB_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[13px] text-neutral-400 hover:text-lime-400 transition-colors"
      >
        <CatIcon className="size-3.5" />
        Musheer0
      </a>

      <span className="h-3.5 w-px bg-white/10" />

      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[13px] text-neutral-400 hover:text-lime-400 transition-colors"
      >
        <Star className="size-3.5" />
        Star repo
      </a>

      <span className="h-3.5 w-px bg-white/10" />

      <a
        href={COFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full bg-lime-400 px-3 py-1 text-[13px] font-semibold text-black hover:bg-lime-400/90 transition-colors"
      >
        <Coffee className="size-3.5" />
        Buy me a coffee
      </a>
    </div>
  );
}
