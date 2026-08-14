"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "../user-nav";
import { ThemeSwitcher } from "../theme-switcher";
import SocialLinks from "./nav-links";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Your Media", href: "/media" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full flex px-4 py-2 items-center bg-sidebar/5">
      <div className="logo font-host flex items-center gap-3">
        <img
          src="/logo.png"
          width={30}
          height={30}
          className="rounded-2xl"
          alt=""
        />
        <h1 className="font-bold">BlurField</h1>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <SocialLinks />

      <div className="user ml-auto max-w-40 flex items-center gap-4">
        <UserNav />
      </div>
    </nav>
  );
};

export default Navbar;