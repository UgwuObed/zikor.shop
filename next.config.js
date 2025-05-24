/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
 return [
     
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>.*)\\.zikor\\.shop',
          },
        ],
        destination: '/store/:subdomain',
      },
      
      {
        source: '/store/:slug',
        destination: '/store/:slug',
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