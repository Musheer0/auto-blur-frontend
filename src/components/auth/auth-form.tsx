"use client";
import React, { useState } from "react";
import TextLoop from "@/components/TextLoop";

const AuthForm = () => {
  const [redirecting, setIsRedirecting] = useState(false);
  const handleClick = () => {
    setIsRedirecting(true);
    window.location.href = "/api/auth/google/sign-in";
  };
  return (
    <div
      onClick={handleClick}
      className="flex relative items-center justify-center  flex-1"
    >
      <p className="absolute top-10 left-1/2 text-center -translate-x-1/2">
        AutoBlur
        <br />
        Blur strangers effortlessly.(seriously)
      </p>

      <TextLoop
        path={""}
        text={
          !redirecting ? "Click Anywhere To Sign In With Google" : "Loading..."
        }
        shape="wave"
        speed={90}
        direction="forward"
        separator="✦"
        curviness={90}
        fontSize={46}
        fontWeight={800}
        letterSpacing={2}
        uppercase
        color="#ffffff"
        ribbon
        ribbonColor="#5227FF"
        ribbonWidth={86}
        pauseOnHover={redirecting}
      />
    </div>
  );
};

export default AuthForm;
