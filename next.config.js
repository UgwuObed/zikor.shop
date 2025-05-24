/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Handle subdomain routing - rewrite to your actual page path
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>.*)\\.zikor\\.shop',
          },
        ],
        destination: '/store/:subdomain', // This should match your file structure
      },
      // Handle all paths on subdomains (for additional pages like checkout)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>.*)\\.zikor\\.shop',
          },
        ],
        destination: '/:path*', // Keep other paths intact
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },

  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;