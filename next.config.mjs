/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/plan/verify',
          destination: '/plan/verify', 
        },
      ];
    },
  };
  
  export default nextConfig;
  