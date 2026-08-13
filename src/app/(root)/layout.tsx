import EditorInput from "@/components/editor/editor-input";
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/editor/navbar";
import { Space_Grotesk, Host_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import EditorLinks from "@/components/links-tab";
import ReactQueryClientProvider from "@/components/query-client-provider";
import AuthProvider from "@/components/auth-provider";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";
const h = Host_Grotesk({
  subsets: ["latin"],
});
const s = Space_Grotesk({
  subsets: ["latin"],
});
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryClientProvider>
      <TRPCReactProvider>
        <AuthProvider>
          <div
            suppressHydrationWarning
            className="flex h-screen  flex-col min-h-screen w-full items-center"
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <Toaster
                className="bg-lime-400 text-background"
                closeButton
                theme="dark"
                richColors
              />
              <main
                className={cn(
                  "w-full p-3 flex-1 flex  overflow-y-auto",
                  h.className,
                  s.className,
                )}
              >
                <EditorInput />
                <div className="right flex-1 h-full  flex flex-col gap-4 px-3">
                  <EditorLinks />
                  {children}
                </div>
              </main>
            </ThemeProvider>
          </div>
        </AuthProvider>
      </TRPCReactProvider>
    </ReactQueryClientProvider>
  );
};

export default Layout;
