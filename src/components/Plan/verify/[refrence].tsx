import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PaymentRedirect = () => {
  const router = useRouter();
  const { reference, trxref } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (!router.isReady) return;
    
    // Get the reference from either query param or path
    const paymentReference = reference || trxref || router.asPath.split('/').pop()?.split('?')[0];
    
    if (paymentReference) {
      // Store the reference in localStorage for verification
      localStorage.setItem("payment_reference", paymentReference.toString());
      
      // Redirect to the verification page
      router.replace(`/plan/verify?reference=${paymentReference}`);
    } else {
      setError("Payment reference not found. Please contact support.");
      setIsLoading(false);
    }
  }, [reference, trxref, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-gray-100">
      <div className="text-center">
        {isLoading ? (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-800 border-t-transparent mb-4"></div>
            <p className="text-gray-700">Processing your payment...</p>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              onClick={() => router.push('/plan')}
            >
              Return to Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentRedirect;