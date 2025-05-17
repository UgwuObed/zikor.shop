"use client"

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getSubdomain } from '../../../utils/subdomain';

export default function CheckoutSuccess() {
  const router = useRouter();
  const { reference, store_slug } = router.query;
  const storeSlug = store_slug || (typeof window !== 'undefined' ? getSubdomain(window.location.hostname) : null);

  useEffect(() => {

  }, [reference]);

  const handleContinueShopping = () => {
    if (storeSlug) {
      if (store_slug) {
        router.push(`/store/${storeSlug}`);
      } else {
        window.location.href = `https://${storeSlug}.zikor.shop`;
      }
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">Thank you for your order. We've sent a confirmation to your email.</p>
        <button
          onClick={handleContinueShopping}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}