/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Handle subdomain routing
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>(?!www|api|admin)[^.]+)\\.zikor\\.shop',
          },
        ],
        destination: '/store/:subdomain',
      },
      // Handle other paths on subdomains  
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>(?!www|api|admin)[^.]+)\\.zikor\\.shop',
          },
        ],
        destination: '/:path*?subdomain=:subdomain',
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