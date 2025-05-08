module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      }
    ]
  },
    images: {
      domains: ['res.cloudinary.com'],
    },
  }