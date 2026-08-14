"use client";

import { useContext } from "react";
import { AuthContext } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Crown,
  User,
  Settings,
  MessagesSquare,
  Languages,
  LogOut,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { useSubscriptionContext } from "./subscription-provider";
import SubscribeButton from "./auth/subscribe-button";


export function UserNav() {
  const session = useContext(AuthContext);
  const user = session?.user;
  const {allowed_limit ,no_of_videos_generated,plan} = useSubscriptionContext()
  const TOTAL_CREDITS = allowed_limit;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const creditsLeft = allowed_limit-no_of_videos_generated

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="rounded-full ring-offset-background transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2">
          <Avatar size="sm" className="ring-2 ring-lime-400/60">
            <AvatarImage
              src={user?.picture ?? undefined}
              alt={user?.name ?? "User"}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-80 bg-background border border-border rounded-2xl p-0 shadow-xl overflow-hidden"
      >
        {/* Header: user identity */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <Avatar size="sm" className="ring-2 ring-lime-400/60">
            <AvatarImage
              src={user?.picture ?? undefined}
              alt={user?.name ?? "User"}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate">
              {user?.name ?? "User"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {plan}
            </span>
          </div>
        </div>

        {/* Credits */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Credits</span>
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
              {creditsLeft} left
              <ChevronRight className="size-3.5" />
            </span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: TOTAL_CREDITS }).map((_, i) => (
              <span
                key={i}
                className={
                  "h-1.5 w-1.5 rounded-full " +
                  (i < creditsLeft ? "bg-lime-400" : "bg-muted")
                }
              />
            ))}
          </div>
        </div>

        <SubscribeButton/>
      
        <DropdownMenuSeparator className="mx-0 my-0" />

        <DropdownMenuSeparator className="mx-0 my-0" />

        <div className="py-1">
          <DropdownMenuItem
            className="gap-3 px-4 py-2.5 text-sm cursor-pointer"
            onClick={() => {
              window.location.href = "/api/auth/logout";
            }}
          >
            <LogOut className="size-4 text-muted-foreground" />
            Sign Out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
