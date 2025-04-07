import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PaymentRedirect = () => {
  const router = useRouter();
  const { reference, trxref } = router.query;
  
  useEffect(() => {
    // Handle both reference formats
    const ref = reference || trxref;
    if (ref) {
      router.replace(`/plan/verify?reference=${ref}`);
    } else {
      // Fallback to check URL path for reference
      const pathRef = window.location.pathname.split('/').pop();
      if (pathRef) {
        router.replace(`/plan/verify?reference=${pathRef}`);
      } else {
        // If no reference found, redirect to home or error page
        router.replace('/');
      }
    }
  }, [reference, trxref, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-800 border-t-transparent mb-4"></div>
        <p className="text-gray-700">Processing your payment...</p>
      </div>
    </div>
  );
};

export default PaymentRedirect;