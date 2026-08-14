import type { Metadata } from "next";
import AuthForm from "@/components/auth/auth-form";
import React from "react";

export const metadata: Metadata = {
  title: "Sign In",
};

const page = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <AuthForm />
    </div>
  );
};

export default page;
