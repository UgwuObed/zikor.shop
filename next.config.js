/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add any other existing configuration
  
  // Add this for domain handling
  images: {
    domains: ['res.cloudinary.com'], // Add any domains you use for images
  },
  
  // This helps Vercel understand your domain structure
  // Remove this if you're not using i18n
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    domains: [
      {
        domain: 'zikor.shop',
        defaultLocale: 'en',
      },
    ],
  },
};

module.exports = nextConfig;