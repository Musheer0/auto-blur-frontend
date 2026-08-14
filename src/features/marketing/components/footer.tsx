import { Button } from "@/components/ui/button";
import type { SVGProps } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

//@ts-ignore
type IconComponent = (props: SVGProps<SVGSVGElement>) => any;

interface SocialLink {
  icon: IconComponent;
  href: string;
  label: string;
}

// lucide-react doesn't ship brand/logo icons (trademark reasons),
// so social marks are small inline SVGs matching lucide's stroke style.
const XIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.6L18.9 2zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20z" />
  </svg>
);

const GithubIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.03-.01-1.87-2.78.51-3.5-.7-3.72-1.34-.13-.33-.68-1.35-1.16-1.62-.4-.22-.97-.75-.01-.77.9-.01 1.55.84 1.76 1.19 1.03 1.75 2.68 1.26 3.34.96.1-.75.4-1.26.72-1.55-2.52-.29-5.16-1.28-5.16-5.68 0-1.25.44-2.28 1.16-3.08-.12-.29-.5-1.47.11-3.06 0 0 .95-.31 3.1 1.18a10.6 10.6 0 0 1 5.64 0c2.15-1.49 3.1-1.18 3.1-1.18.61 1.59.23 2.77.11 3.06.72.8 1.16 1.82 1.16 3.08 0 4.41-2.65 5.39-5.18 5.67.41.36.77 1.07.77 2.16 0 1.56-.01 2.82-.01 3.2 0 .27.18.6.69.49A10.2 10.2 0 0 0 22 12.2C22 6.58 17.52 2 12 2z" />
  </svg>
);

const LinkedinIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);

const columns: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQs", href: "#faqs" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "#privacy" },
      { label: "Terms of service", href: "#terms" },
      { label: "Data processing", href: "#data" },
    ],
  },
];

const socialLinks: SocialLink[] = [
  { icon: XIcon, href: "https://twitter.com/musheer_an", label: "X (Twitter)" },
  { icon: GithubIcon, href: "https://github.com/Musheer0", label: "GitHub" },
  { icon: LinkedinIcon, href: "https://www.linkedin.com/in/musheer-an-2b5658282", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top: brand + newsletter */}
        <div className="flex flex-col justify-between gap-10 border-b border-border pb-12 lg:flex-row lg:items-start">
          <div className="max-w-sm">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="BlurField" className="h-7 w-7" />
              <span className="text-lg font-semibold text-foreground">
                BlurField
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Blur strangers, keep yourself. Privacy-safe videos, powered by
              AI face detection.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-lime-400" />
              <span className="text-xs font-medium text-foreground">
                Privacy first. Always.
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <p className="text-sm font-medium text-foreground">
              Get privacy tips in your inbox
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Occasional updates, no spam.
            </p>
            <form className="mt-4 flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="h-10 flex-1 rounded-full border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime-400/40"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-full bg-lime-400 text-neutral-900 hover:bg-lime-300"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Middle: link columns */}
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.heading}>
              <p className="text-sm font-medium text-foreground">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
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
            </div>
          ))}
        </div>

        {/* Bottom: copyright + socials */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlurField. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-lime-400/40 hover:text-lime-400"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}