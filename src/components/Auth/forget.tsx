"use client"

import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { BiEnvelope, BiStore, BiArrowBack } from "react-icons/bi";
import { motion } from "framer-motion";
import apiClient from '../../apiClient';

interface InputProps {
  icon: React.ElementType;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
}

const Input = ({ 
  icon: Icon, 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder, 
  label
}: InputProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 w-full h-12 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(""); 
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/forgot-password", { email });
      setSuccess(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.errors || 
                           error.message || 
                           "Failed to send reset email. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const handleBackToLogin = useCallback(() => {
    router.push("/auth/signin");
  }, [router]);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to <span className="font-medium text-gray-900">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Didn't receive the email? Check your spam folder or try again in a few minutes.
            </p>
            
            <button
              onClick={handleBackToLogin}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <BiArrowBack className="h-5 w-5" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 p-12 flex-col justify-center text-white">
          <div className="flex items-center mb-8">
            <BiStore className="h-8 w-8 mr-3" />
            <span className="text-2xl font-bold">Zikor</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Forgot Your Password?</h2>
          <p className="text-purple-200 text-lg">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <div className="mt-8 flex items-center gap-4 bg-white/10 rounded-xl p-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              🔒
            </div>
            <div>
              <div className="text-sm font-semibold">Secure & Fast</div>
              <div className="text-purple-200 text-sm">Your data is protected</div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBackToLogin}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <BiArrowBack className="h-5 w-5 mr-2" />
              Back to Sign In
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">Enter your email to receive reset instructions</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <p className="text-red-800 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              icon={BiEnvelope}
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="your@email.com"
              label="Email Address"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <button 
                onClick={handleBackToLogin}
                className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;