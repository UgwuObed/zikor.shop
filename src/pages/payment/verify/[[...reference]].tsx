// pages/payment/verify/[[...reference]].tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const PaymentRedirectComponent = dynamic(
  () => import('../../../components/Plan/verify/[refrence]'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-gray-100">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
      </div>
    )
  }
);

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentRedirectComponent />
    </Suspense>
  );
}