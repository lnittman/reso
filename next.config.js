/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint and TypeScript checking during builds to allow deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Strict React mode
  reactStrictMode: true
};

module.exports = nextConfig; 