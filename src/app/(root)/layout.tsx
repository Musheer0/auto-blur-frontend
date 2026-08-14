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
import Footer from "@/components/editor/footer";
import SubscriptionProvider from "@/components/subscription-provider";
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
        <SubscriptionProvider>
        <AuthProvider>
            <div
            className="flex h-screen  flex-col min-h-screen w-full items-center"
          >
              <Navbar />
              <Toaster
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
               {children}
              </main>
              <Footer/>
          </div>
        </AuthProvider>
        </SubscriptionProvider>
      </TRPCReactProvider>
    </ReactQueryClientProvider>
  );
};

export default Layout;
