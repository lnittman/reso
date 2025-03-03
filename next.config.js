/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during production builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Other Next.js configuration options can go here
};

module.exports = nextConfig; 