import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PaymentRedirect = () => {
  const router = useRouter();
  const { reference } = router.query;
  
  useEffect(() => {
    if (!router.isReady) return;
    
    const ref = reference || new URLSearchParams(window.location.search).get('reference');
    
    if (ref) {
      localStorage.setItem('payment_reference', ref.toString());
      router.replace(`/plan/verify?reference=${ref}`);
    } else {
      router.replace('/plan/verify?error=no_reference');
    }
  }, [router.isReady, reference, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing payment...</p>
      </div>
    </div>
  );
};

export default PaymentRedirect;