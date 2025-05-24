module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>.+)\.zikor\.shop',
          },
        ],
        destination: '/store/:subdomain',
      },
    ];
  },
    images: {
      domains: ['res.cloudinary.com'],
    },
  }