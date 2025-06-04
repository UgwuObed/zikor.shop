import { useRouter } from 'next/router';
import Store from "../../components/Store/[slug]";
import "../../app/globals.css";

export default function StorePage() {
  const router = useRouter();
  const { slug } = router.query;
  
  // Handle loading state while router is ready
  if (!router.isReady || !slug || typeof slug !== 'string') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin mx-auto mb-4 border-blue-500"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }
  
  return <Store slug={slug} />;
}