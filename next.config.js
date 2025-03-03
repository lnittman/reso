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
  // Webpack configuration to resolve React issues
  webpack: (config, { isServer }) => {
    // Ensure React is properly resolved
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom')
    };
    
    return config;
  },
  // Other Next.js configuration options can go here
};

module.exports = nextConfig; 