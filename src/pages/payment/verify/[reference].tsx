import { useRouter } from 'next/router';
import { useEffect } from 'react';


const PaymentRedirect = () => {
  const router = useRouter();
  const { reference } = router.query;
  
  
  const paymentReference = reference || 
                         router.asPath.split('/').pop()?.split('?')[0] || 
                         new URLSearchParams(window.location.search).get('reference');

  useEffect(() => {
    if (typeof paymentReference === 'string') {
      // Store the reference for the verification component
      localStorage.setItem('payment_reference', paymentReference);
      // Redirect to your verification page
      router.replace(`/plan/verify?reference=${paymentReference}`);
    }
  }, [paymentReference, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
        <p className="text-gray-700">Processing your payment...</p>
      </div>
    </div>
  );
};

export default PaymentRedirect;