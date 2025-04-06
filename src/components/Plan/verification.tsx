'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { BiCheckCircle, BiErrorCircle, BiLoaderCircle } from "react-icons/bi";
import apiClient from '../../apiClient';

const PaymentVerificationPage = () => {
  const router = useRouter();
  const [reference, setReference] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failure'>('verifying');
  const [message, setMessage] = useState("We're verifying your payment...");
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);

  // Get reference safely
  useEffect(() => {
    setIsClient(true);
    const ref = router.query.reference || getCookie('payment_reference');
    if (typeof ref === 'string' || ref === null) {
      setReference(ref);
    } else {
      setReference(null);
    }
  }, [router.query]);

  // Payment verification logic
  useEffect(() => {
    if (!isClient || !reference) return;
    
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setVerificationStatus('failure');
      setMessage("Authentication error. Please log in again.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await apiClient.get(`/payment/verify/${reference}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.data.success) {
          setVerificationStatus('success');
          setMessage(response.data.message);
          setSubscription(response.data.subscription);
          startCountdown();
        } else {
          setVerificationStatus('failure');
          setMessage(response.data.message || "Payment verification failed.");
        }
      } catch (error: any) {
        setVerificationStatus('failure');
        const errorMsg = error.response?.data?.message || 
                        "An error occurred during payment verification. Please contact support.";
        setMessage("Payment verification failed.");
        setError(errorMsg);
      }
    };

    verifyPayment();
  }, [reference, isClient]);

  // Helper function to get cookies
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          router.push("/store/storefront");
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const handleManualContinue = () => {
    if (verificationStatus === 'success') {
      router.push("/store/storefront");
    } else {
      router.push("/plan/payment"); 
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p>Loading payment verification...</p>
        </div>
      </div>
    );
  }

  if (!reference) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <BiErrorCircle className="mx-auto text-red-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Reference Missing</h2>
          <p className="text-gray-600 mb-6">Please try the payment process again.</p>
          <button 
            onClick={() => router.push("/plan/payment")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Back to Payment
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-gray-100 flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center"
      >
        {verificationStatus === 'verifying' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="mx-auto text-purple-600 mb-6"
          >
            <BiLoaderCircle size={80} />
          </motion.div>
        )}

        {verificationStatus === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto text-purple-500 mb-6"
          >
            <BiCheckCircle size={80} />
          </motion.div>
        )}

        {verificationStatus === 'failure' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto text-red-500 mb-6"
          >
            <BiErrorCircle size={80} />
          </motion.div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {verificationStatus === 'verifying' ? 'Verifying Payment' : 
           verificationStatus === 'success' ? 'Payment Successful!' : 
           'Payment Verification Failed'}
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 rounded-lg p-4 mb-6 text-left"
          >
            <h3 className="font-medium text-purple-800 mb-2">Subscription Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Plan:</div>
              <div className="font-medium text-gray-800">
                {subscription.plan_id === 1 ? "Starter" : 
                 subscription.plan_id === 2 ? "Pro" : "Business"}
              </div>
              
              <div className="text-gray-600">Billing Cycle:</div>
              <div className="font-medium text-gray-800 capitalize">
                {subscription.billing_cycle}
              </div>
              
              <div className="text-gray-600">Start Date:</div>
              <div className="font-medium text-gray-800">
                {new Date(subscription.start_date).toLocaleDateString()}
              </div>
              
              <div className="text-gray-600">Expiry Date:</div>
              <div className="font-medium text-gray-800">
                {new Date(subscription.end_date).toLocaleDateString()}
              </div>
              
              <div className="text-gray-600">Status:</div>
              <div className="font-medium text-purple-600 capitalize">
                {subscription.status}
              </div>
            </div>
          </motion.div>
        )}

        {verificationStatus === 'success' && (
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to your storefront in {countdown} seconds...
          </p>
        )}

        <motion.button
          onClick={handleManualContinue}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
            verificationStatus === 'success' 
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
              : verificationStatus === 'failure'
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
              : 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {verificationStatus === 'success' 
            ? 'Continue to Storefront' 
            : verificationStatus === 'failure'
            ? 'Back to Plans'
            : 'Please wait...'}
        </motion.button>

        {verificationStatus === 'failure' && (
          <div className="mt-6 text-sm text-gray-600">
            <p>
              If you believe this is an error, please contact our support team for assistance.
            </p>
            <a href="mailto:support@zikor.shop" className="text-purple-600 hover:text-purple-800 font-medium mt-2 inline-block">
              Contact Support
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentVerificationPage;