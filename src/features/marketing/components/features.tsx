import type { LucideIcon } from "lucide-react";
import { ShieldCheck, ScanFace, UserRound, Zap } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Protect privacy",
    description: "Blur faces of strangers to protect their identity.",
  },
  {
    icon: ScanFace,
    title: "AI face detection",
    description: "Advanced AI detects  and tracks faces accurately (no llm providers see your video/image our servers handle them locally) .",
  },
  {
    icon: UserRound,
    title: "Keep yourself",
    description: "Upload your face image to keep yourself unblurred.",
  },
  {
    icon: Zap,
    title: "Fast & easy",
    description: "Get privacy-safe videos in just a few minutes.",
  },
];

export default function FeatureStrip() {
  return (
    <section id="features" className="w-full bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-border bg-card px-8 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-lime-400/10">
                <feature.icon className="h-4 w-4 text-lime-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {feature.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}