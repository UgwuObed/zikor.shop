// next.config.js - Fallback approach using rewrites
module.exports = {
  async rewrites() {
    return [
      // Root path for subdomains
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>(?!www|api|admin).+)\\.zikor\\.shop',
          },
        ],
        destination: '/store/:subdomain',
      },
      // All other paths for subdomains
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>(?!www|api|admin).+)\\.zikor\\.shop',
          },
        ],
        destination: '/store/:subdomain/:path*',
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Add this to help with debugging
  experimental: {
    logging: {
      level: 'verbose',
    },
  },
}