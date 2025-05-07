export default {
    async rewrites() {
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<slug>.+)\\.zikor\\.shop',
            },
          ],
          destination: '/store/:slug/:path*',
        },
      ];
    },
    images: {
      domains: ['res.cloudinary.com'],
    },
  }