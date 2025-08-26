/** @type {import('next').NextConfig} */
const nextConfig = {  
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable service worker
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost', 'via.placeholder.com', 'picsum.photos']
  },
    env: {
    CUSTOM_KEY: 'my-value',
  },
};

module.exports = nextConfig;