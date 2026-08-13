"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, BookOpen, Sparkle, SparklesIcon } from "lucide-react";

const links = [
  {
    href: "/history",
    label: "History",
    icon: Folder,
  },
  {
    href: "/generate",
    label: "Generate",
    icon: SparklesIcon,
  },
];

const EditorLinks = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center w-fit gap-1 rounded-xl  bg-[#151617] p-1">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`
              flex py-2 items-center gap-2 rounded-xl px-5
              text-sm font-medium
              transition-colors
              ${
                isActive
                  ? "bg-[#1c1d1f] text-white shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
                  : "text-white/45 hover:text-white/70"
              }
            `}
          >
            <Icon className="size-[19px]" strokeWidth={1.7} />

            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default EditorLinks;
