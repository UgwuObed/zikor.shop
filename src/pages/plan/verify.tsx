import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import "../../app/globals.css";

const PaymentVerificationClient = dynamic(
  () => import('../../components/Plan/verification'),
  { 
    ssr: false,
    loading: () => <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4">Loading payment verification...</div>
  }
);

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentVerificationClient />
    </Suspense>
  );
}