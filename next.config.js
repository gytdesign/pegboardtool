/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // ✅ This disables server-side image optimization
  },
};

module.exports = nextConfig;