/** @type {import('next').NextConfig} */
const isStaticExport = 'false'; // Or 'true' depending on your use case

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    BUILD_STATIC_EXPORT: isStaticExport,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api.moderndecordiaries.com',
        pathname: '/media/cover_images/**', // Adjust path based on actual image location
      },
    ],
  },
};

module.exports = nextConfig;
