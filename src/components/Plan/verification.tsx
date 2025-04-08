import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { BiCheckCircle, BiErrorCircle, BiLoader, BiArrowBack } from 'react-icons/bi';
import apiClient from '../../apiClient';

interface Subscription {
  start_date: string;
  end_date: string;
  billing_cycle: 'monthly' | 'yearly';
  plan_name?: string;
  amount?: number;
}

const PaymentVerificationPage = () => {
  const router = useRouter();
  const { reference, payment, message: urlMessage, token: callbackToken } = router.query;
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [statusMessage, setStatusMessage] = useState('Verifying your payment...');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    if (!reference && !payment) {
      setVerificationStatus('error');
      setStatusMessage('No payment reference provided');
      return;
    }

    // Handle direct callback cases first
    if (payment === "success") {
      handleSuccessCallback();
      return;
    } else if (payment === "failed") {
      handleFailedCallback();
      return;
    }

    // Otherwise proceed with normal verification
    verifyPayment();
  }, [reference, payment, urlMessage, callbackToken, retryCount]);

  const handleSuccessCallback = () => {
    if (callbackToken) {
      localStorage.setItem('accessToken', callbackToken as string);
    }
    setVerificationStatus('success');
    setStatusMessage(urlMessage?.toString() || 'Payment successful! Your plan has been activated.');
    
    // Still verify with backend to get subscription details
    if (reference) {
      verifyPayment();
    } else {
      setTimeout(() => router.push('/store/storefront'), 3000);
    }
  };

  const handleFailedCallback = () => {
    setVerificationStatus('error');
    setStatusMessage(urlMessage?.toString() || 'Payment failed. Please try again.');
  };

  const verifyPayment = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setVerificationStatus('error');
        setStatusMessage('Authentication error. Please login again.');
        setTimeout(() => router.push('/auth/login'), 3000);
        return;
      }
      
      const response = await apiClient.get(`/payment/verify/${reference}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        handleVerificationSuccess(response.data);
      } else {
        handleVerificationError(response.data.message);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      handleVerificationError(
        error.response?.data?.message || 
        'Payment verification failed. Please contact support.'
      );
      
      // Auto-retry up to 3 times with delay
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setStatusMessage(`Retrying verification... (${retryCount + 1}/3)`);
        }, 2000 * (retryCount + 1));
      }
    }
  };

  const handleVerificationSuccess = (data: any) => {
    setVerificationStatus('success');
    setStatusMessage(data.message || 'Payment verified successfully!');
    setSubscription(data.subscription);
    
    localStorage.removeItem('payment_reference');
    
    setTimeout(() => {
      router.push(data.redirect_url || '/store/storefront');
    }, 3000);
  };

  const handleVerificationError = (message: string) => {
    setVerificationStatus('error');
    setStatusMessage(message);
  };

  const handleRetry = () => {
    setVerificationStatus('loading');
    setStatusMessage('Retrying verification...');
    setRetryCount(0);
    verifyPayment();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-purple-50 to-white">
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15 
        }}
      >
        <div className={`w-full h-2 ${
          verificationStatus === 'loading' ? 'bg-purple-500' :
          verificationStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        
        <div className="px-8 pt-10 pb-8">
          <div className="flex flex-col items-center">
            <motion.div 
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                verificationStatus === 'loading' ? 'bg-purple-100' :
                verificationStatus === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {verificationStatus === 'loading' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                >
                  <BiLoader size={40} className="text-purple-600" />
                </motion.div>
              )}
              
              {verificationStatus === 'success' && (
                <BiCheckCircle size={40} className="text-green-600" />
              )}
              
              {verificationStatus === 'error' && (
                <BiErrorCircle size={40} className="text-red-600" />
              )}
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {verificationStatus === 'loading' ? 'Verifying Payment' :
               verificationStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
            </h2>
            
            <p className="text-gray-600 text-center mb-8">{statusMessage}</p>
          </div>
          
          {subscription && (
            <motion.div 
              className="bg-gray-50 rounded-xl p-6 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-medium text-gray-700 mb-4 text-center">Subscription Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {subscription.plan_name && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Plan</p>
                    <p className="text-gray-800 font-medium">{subscription.plan_name}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Start Date</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(subscription.start_date).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">End Date</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(subscription.end_date).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Billing Cycle</p>
                  <p className="text-gray-800 font-medium">
                    {subscription.billing_cycle === 'yearly' ? 'Annual' : 'Monthly'}
                  </p>
                </div>

                {subscription.amount && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount</p>
                    <p className="text-gray-800 font-medium">
                      ₦{subscription.amount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {verificationStatus === 'success' ? (
            <motion.div 
              className="flex items-center justify-center text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-1"></div>
                <span>Redirecting</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >...</motion.span>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col space-y-3">
              <motion.button
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium transition-all"
                whileHover={{ 
                  backgroundColor: "#7c3aed",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)" 
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleRetry}
              >
                Try Again
              </motion.button>
              
              <motion.button
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all flex items-center justify-center"
                whileHover={{ 
                  backgroundColor: "#e5e7eb",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => router.push('/plan/payment')}
              >
                <BiArrowBack className="mr-2" />
                Back to Plans
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentVerificationPage;