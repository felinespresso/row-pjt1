import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { 
    serverActions: { 
        bodySizeLimit: "20mb" 
    }, 
  }, 
  images: { 
    remotePatterns:[ 
        { 
            protocol: "https", 
            hostname: "m2ddvo4efnox0vlb.public.blob.vercel-storage.com", 
        } 
    ] 
  }
};

export default nextConfig;
