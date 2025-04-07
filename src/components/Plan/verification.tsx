import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { BiCheckCircle, BiErrorCircle, BiLoader } from 'react-icons/bi';
import apiClient from '../../apiClient';

interface Subscription {
  start_date: string;
  end_date: string;
  billing_cycle: 'monthly' | 'yearly';
}

const PaymentVerificationPage = () => {
  const router = useRouter();
  const { reference, trxref } = router.query;
  
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('Click the button below to verify your payment');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  
  const handleVerifyClick = async () => {
    if (verificationStatus === 'loading') return;
    
    const paymentRef = reference || trxref;
    if (!paymentRef) {
      setVerificationStatus('error');
      setMessage('No payment reference found. Please contact support.');
      return;
    }
    
    // Set loading state
    setVerificationStatus('loading');
    setMessage('Verifying your payment...');
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setVerificationStatus('error');
        setMessage('Authentication error. Please login again.');
        setTimeout(() => router.push('/auth/login'), 3000);
        return;
      }
      
      const response = await apiClient.get(`/payment/verify/${paymentRef}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setVerificationStatus('success');
        setMessage(response.data.message || 'Payment verified successfully!');
        setSubscription(response.data.subscription);
        
        localStorage.removeItem('payment_reference');
        
        setTimeout(() => {
          if (response.data.redirect_url) {
            router.push(response.data.redirect_url);
          } else {
            router.push('/store/storefront');
          }
        }, 3000);
      } else {
        setVerificationStatus('error');
        setMessage(response.data.message || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setMessage(error.response?.data?.message || 'Payment verification failed. Please contact support.');
    }
  };
  
  const handleRetry = () => {
    setVerificationStatus('idle');
    setMessage('Click the button below to create your subscription');
  };
  
  const handleGoToStore = () => {
    router.push('/store/storefront');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-purple-50 to-white">
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className={`w-full h-2 ${
          verificationStatus === 'idle' ? 'bg-gray-300' :
          verificationStatus === 'loading' ? 'bg-purple-500' :
          verificationStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        
        <div className="px-8 pt-10 pb-8">
          <div className="flex flex-col items-center">
            <motion.div 
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                verificationStatus === 'idle' ? 'bg-gray-100' :
                verificationStatus === 'loading' ? 'bg-purple-100' :
                verificationStatus === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {verificationStatus === 'idle' && (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <path d="M21 9V3H15"></path>
                  <path d="M21 3l-9 9-4-4-7 7"></path>
                </svg>
              )}
              
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
              {verificationStatus === 'idle' ? 'Payment Verification' :
               verificationStatus === 'loading' ? 'Verifying Payment' :
               verificationStatus === 'success' ? 'Payment Successful!' : 'Verification Failed'}
            </h2>
            
            <p className="text-gray-600 text-center mb-8">{message}</p>
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
              </div>
            </motion.div>
          )}
          
          {verificationStatus === 'idle' && (
            <motion.div
              className="flex flex-col space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium transition-all"
                whileHover={{ 
                  backgroundColor: "#7c3aed",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)" 
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyClick}
              >
                <div className="flex items-center justify-center">
                  <span>Verify Payment</span>
                  <div className="ml-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              </motion.button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                Reference: {reference || trxref || 'Not available'}
              </p>
            </motion.div>
          )}
          
          {verificationStatus === 'success' && (
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
          )}
          
          {verificationStatus === 'error' && (
            <motion.div
              className="flex flex-col space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium transition-all"
                whileHover={{ 
                  backgroundColor: "#7c3aed",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)" 
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
              >
                Try Again
              </motion.button>
              
              <motion.button
                className="w-full bg-white text-purple-600 border border-purple-200 py-3 rounded-xl font-medium transition-all"
                whileHover={{ backgroundColor: "#f9f5ff" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoToStore}
              >
                Return to Store
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentVerificationPage;