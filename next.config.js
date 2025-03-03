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
  // Use React 18 compatibility mode
  reactStrictMode: true,
  experimental: {
    // Disable React server components for now
    serverComponentsExternalPackages: [],
  },
  // Webpack configuration to resolve React issues
  webpack: (config, { isServer }) => {
    // Ensure React is properly resolved
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
      'react/jsx-runtime': require.resolve('react/jsx-runtime')
    };
    
    return config;
  },
  // Other Next.js configuration options can go here
};

module.exports = nextConfig; 