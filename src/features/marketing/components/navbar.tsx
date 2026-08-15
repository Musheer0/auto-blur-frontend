import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "how-it-works" },
   { label: "Github", href: "https://github.com/Musheer0" },
  ];

  return (
    <header className="w-full bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="BlurField" className="h-7 w-7" />
          <span className="text-lg font-semibold text-foreground">
            BlurField
          </span>
        </a>

        {/* Center nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Sign in
          </a>
          <Button
            className="bg-lime-400 text-neutral-900 hover:bg-lime-300 font-medium rounded-full px-5"
          >
            <a href="/login" className="flex items-center gap-1.5">
              Get started
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </nav>
    </header>
  );
}