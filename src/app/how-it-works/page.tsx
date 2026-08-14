import {
  ArrowRight,
  BellRing,
  Download,
  Images,
  Play,
  Upload,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Blurfield Works",
  description:
    "Upload a video, optionally choose the face you want to keep visible, and Blurfield automatically blurs everyone else's faces. Processing runs in the background and your privacy-safe video is ready when you are.",
};

const videoSteps = [
  {
    title: "Upload your video",
    description:
      "Drop the video you want to clean up into the editor. Your files are uploaded securely and stay private.",
    icon: Upload,
  },
  {
    title: "Optional: keep one face visible",
    description:
      "Want to stay unblurred while everyone else is blurred? Upload a clear image of the face to keep, or capture a screenshot of the face straight from the video when it's fully visible.",
    icon: User,
    optional: true,
  },
  {
    title: "Hit Generate",
    description:
      "Blurfield uploads your files and starts detecting every face in the video. You'll see the progress right on screen.",
    icon: Play,
  },
  {
    title: "Do your thing",
    description:
      "Generation keeps running in the background. Close the tab, walk away, grab a coffee — the app notifies you when it's done.",
    icon: BellRing,
  },
  {
    title: "Download & share",
    description:
      "Grab your privacy-safe video from the results page and share it without exposing anyone's identity.",
    icon: Download,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-6 py-16 gap-16">
      <header className="flex flex-col gap-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">
          How it works
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          Blur faces in videos automatically
        </h1>
        <p className="max-w-xl text-lg leading-8 text-muted-foreground">
          Blurfield automatically blurs everyone else&apos;s faces in your video
          so you can share it without compromising anyone&apos;s privacy — and
          keeps the person you choose fully visible.
        </p>
      </header>

      <section aria-labelledby="video-steps-heading">
        <h2
          id="video-steps-heading"
          className="text-2xl font-bold tracking-tight"
        >
          Blurring a video
        </h2>
        <ol className="mt-8 flex flex-col gap-6">
          {videoSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border bg-sidebar p-6"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lime-400 font-black text-black">
                    {index + 1}
                  </span>
                  <Icon className="size-5 text-lime-400" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    {step.optional && (
                      <span className="rounded-full border border-lime-400/40 px-2 py-0.5 text-xs font-medium text-lime-400">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="image-blur-heading">
        <div className="flex flex-col gap-3 rounded-2xl border bg-sidebar p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-accent">
              <Images className="size-5 text-lime-400" />
            </span>
            <h2
              id="image-blur-heading"
              className="text-2xl font-bold tracking-tight"
            >
              Need to blur a photo instead?
            </h2>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            The same flow works for a single image. Upload a photo, optionally
            tell Blurfield which face to keep, and it will blur the rest for you
            in seconds.
          </p>
        </div>
      </section>

      <section aria-labelledby="cta-heading">
        <div className="flex flex-col items-start gap-6 rounded-2xl border bg-sidebar p-8">
          <h2 id="cta-heading" className="text-2xl font-bold tracking-tight">
            Ready to make your videos privacy-safe?
          </h2>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Upload a video, pick the face you want to keep visible, and let
            Blurfield blur every other face automatically.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 rounded-full bg-[#d7ff00] px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-lime-400/90"
            >
              Start blurring
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in to get started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
