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
const h = Host_Grotesk({
  subsets: ["latin"],
});
const s = Space_Grotesk({
  subsets: ["latin"],
});
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
      
          <>
               <EditorInput />
                <div className="right flex-1 h-full  flex flex-col gap-4 px-3">
                  <EditorLinks />
                  {children}
                </div>
          </>
  );
};

export default Layout;
