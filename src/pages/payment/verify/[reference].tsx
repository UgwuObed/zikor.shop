import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';

const PaymentRedirect = () => {
  const router = useRouter();
  const { reference } = router.query;

  useEffect(() => {
    if (reference && typeof reference === 'string') {
      // Store reference in cookie (works on server and client)
      setCookie('payment_reference', reference, { path: '/' });
      
      // Redirect to your verification page
      window.location.href = `/plan/verify?reference=${reference}`;
    }
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
        <p>Finalizing your payment...</p>
      </div>
    </div>
  );
};

export default PaymentRedirect;