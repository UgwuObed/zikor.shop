import { useEffect } from 'react';
import { useRouter } from 'next/router';
// import { getSubdomain } from '../utils/subdomain';
import { getSubdomain } from "../../utils/subdomain";
import StorefrontPage from './store/[slug]';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subdomain = getSubdomain(window.location.hostname);
      
      // If there's a subdomain, it's a store page
      if (subdomain) {
        // Don't redirect, just render the StorefrontPage component
        return;
      }
      
      // If no subdomain, redirect to your main site
      router.replace('/dashboard'); // or wherever your main site is
    }
  }, [router]);

  // Check if we're on a subdomain
  if (typeof window !== 'undefined') {
    const subdomain = getSubdomain(window.location.hostname);
    if (subdomain) {
      // Render the storefront page directly
      return <StorefrontPage />;
    }
  }

  // Loading state or redirect to main site
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>Loading...</div>
    </div>
  );
};

export default HomePage;