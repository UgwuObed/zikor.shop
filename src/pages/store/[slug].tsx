// pages/store/[slug].tsx - Enhanced debugging
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Store from "../../components/Store/[slug]";
import "../../app/globals.css";

export default function StorePage() {
  const router = useRouter();
  const { slug } = router.query;
  
  useEffect(() => {
    console.log('=== STORE PAGE DEBUG ===');
    console.log('Router isReady:', router.isReady);
    console.log('Full router.query:', router.query);
    console.log('Slug from query:', slug);
    console.log('Router asPath:', router.asPath);
    console.log('Router pathname:', router.pathname);
    console.log('Window location:', typeof window !== 'undefined' ? window.location.href : 'SSR');
    console.log('========================');
  }, [router.isReady, router.query, slug, router.asPath]);
  
  // Show loading state longer to see what's happening
  if (!router.isReady) {
    console.log('⏳ Router not ready yet...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin mx-auto mb-4 border-blue-500"></div>
          <p className="text-gray-600">Router loading...</p>
        </div>
      </div>
    );
  }
  
  if (!slug || typeof slug !== 'string') {
    console.log('❌ No slug found. Query:', router.query);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin mx-auto mb-4 border-red-500"></div>
          <p className="text-gray-600">No store slug found</p>
          <p className="text-sm text-gray-500 mt-2">Query: {JSON.stringify(router.query)}</p>
          <p className="text-sm text-gray-500">Path: {router.asPath}</p>
        </div>
      </div>
    );
  }
  
  console.log('✅ Rendering Store component with slug:', slug);
  return <Store slug={slug} />;
}