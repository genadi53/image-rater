/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "precise-swan-639.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
