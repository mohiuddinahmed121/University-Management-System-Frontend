import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   async rewrites() {
      return [
         {
            source: "/api/:path*",
            destination: "https://university-management-system-backen.vercel.app/api/:path*",
         },
      ];
   },
};

export default nextConfig;
