import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Automatically Blur Faces in Videos for Privacy | Blurfield",
    template: "%s | Blurfield",
  },
  description:
    "Blurfield automatically detects and blurs other people's faces in videos to protect privacy. Upload your video, tell Blurfield which face is yours, and download a privacy-safe video that keeps you visible while everyone else is blurred.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "Blurfield",
    title: "Automatically Blur Faces in Videos for Privacy | Blurfield",
    description:
      "Blurfield automatically blurs other people's faces in videos. Keep your own face visible while everyone else stays private.",
    images: [{ url: "/og.png", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary",
    title: "Automatically Blur Faces in Videos for Privacy | Blurfield",
    description:
      "Blurfield automatically blurs other people's faces in videos. Keep your own face visible while everyone else stays private.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: {children:React.ReactNode}) {
  return (
    <html
    suppressHydrationWarning
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
        {children}
      </ThemeProvider>
        </body>
    </html>
  );
}
