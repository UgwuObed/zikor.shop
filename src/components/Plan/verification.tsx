import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import apiClient from '../../apiClient';

interface VerificationResponse {
  success?: boolean;
  status?: string;
  message?: string;
  subscription?: any;
  redirect_url?: string;
}

const PaymentVerification = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);
  }, []);
  
  useEffect(() => {
    if (!router.isReady || !accessToken) return;
    
    const ref = 
    router.query.reference || 
    router.query.trxref ||
    new URLSearchParams(window.location.search).get('reference') ||
    new URLSearchParams(window.location.search).get('trxref') ||
    localStorage.getItem("payment_reference");

  if (!ref) {
    setStatus("error");
    setMessage("Payment reference not found");
    return;
  }
    
    const verifyPayment = async () => {
      try {
        const response = await apiClient.get<VerificationResponse>(`/payment/verify/${ref}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        console.log("Payment verification response:", response.data);
        
        // Check if the response indicates success
        // Look for either success: true OR status: "success"
        if (
          response.data.success === true || 
          response.data.status === "success" ||
          (response.data.message && response.data.message.toLowerCase().includes("success"))
        ) {
          setStatus("success");
          setMessage(response.data.message || "Payment successful! Setting up your store...");
          
          // Clear payment reference
          localStorage.removeItem("payment_reference");
          
          // Get redirect URL from response or use default
          const redirectTo = response.data.redirect_url || "/store/storefront";
          
          // Redirect after 3 seconds
          setTimeout(() => {
            router.push(redirectTo);
          }, 3000);
        } else {
          setStatus("error");
          setMessage(response.data.message || "Payment verification failed. Please contact support.");
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        
        // Check if the error response contains success information
        const errorData = error.response?.data as VerificationResponse | undefined;
        
        if (
          errorData?.success === true || 
          (errorData?.message && errorData.message.toLowerCase().includes("success"))
        ) {
          setStatus("success");
          setMessage(errorData.message || "Payment successful!");
          
          // Clear payment reference
          localStorage.removeItem("payment_reference");
          
          // Get redirect URL from response or use default
          const redirectTo = errorData.redirect_url || "/store/storefront";
          
          // Redirect after 3 seconds
          setTimeout(() => {
            router.push(redirectTo);
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            errorData?.message || 
            error.response?.data?.error || 
            "An error occurred during payment verification. Please contact support."
          );
        }
      }
    };
    
    verifyPayment();
  }, [router.isReady, accessToken, router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-gray-100 flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-6">
              <motion.div
                className="h-16 w-16 border-4 border-purple-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </>
        )}
        
        {status === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center"
              >
                <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="flex justify-center">
              <motion.div
                className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                />
              </motion.div>
            </div>
          </>
        )}
        
        {status === "error" && (
          <>
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center"
              >
                <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium"
                onClick={() => router.push("/plan/payment")}
              >
                Return to Plans
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium"
                onClick={() => window.location.href = "mailto:support@zikor.shop"}
              >
                Contact Support
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentVerification;