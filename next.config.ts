import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects(){
    return [
      {
        permanent:false,
        source:"/onboard",
        destination:"/generate"
      },
      // {
      //   permanent:false,
      //   source:"/",
      //   destination:"/generate"
      // }
    ]
  }
};

export default nextConfig;
