"use client"

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { BiLock, BiStore, BiShow, BiHide, BiArrowBack } from "react-icons/bi";
import { motion } from "framer-motion";
import apiClient from '../../apiClient';

interface InputProps {
  icon: React.ElementType;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  error?: string;
}

const Input = ({ 
  icon: Icon, 
  name, 
  value, 
  onChange, 
  placeholder, 
  label, 
  showPasswordToggle, 
  showPassword, 
  onTogglePassword,
  error 
}: InputProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type={showPasswordToggle ? (showPassword ? "text" : "password") : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`pl-10 pr-4 w-full h-12 rounded-lg border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'} focus:ring-1 outline-none transition-colors`}
        placeholder={placeholder}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <BiHide className="h-5 w-5" /> : <BiShow className="h-5 w-5" />}
        </button>
      )}
    </div>
    {error && (
      <p className="text-red-600 text-sm">{error}</p>
    )}
  </div>
);

const ResetPassword = () => {
  const [formData, setFormData] = useState({ 
    password: "", 
    password_confirmation: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  
  useEffect(() => {
    if (router.isReady) {
      const { token: urlToken, email: urlEmail } = router.query;
      if (urlToken && urlEmail) {
        setToken(urlToken as string);
        setEmail(urlEmail as string);
      } else {
        
        router.push("/auth/forgot-password");
      }
    }
  }, [router.isReady, router.query, router]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
    setError("");
  }, [fieldErrors]);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/[a-z]/.test(password)) errors.push("a lowercase letter");
    if (!/[A-Z]/.test(password)) errors.push("an uppercase letter");
    if (!/[0-9]/.test(password)) errors.push("a number");
    if (!/[^a-zA-Z0-9_]/.test(password)) errors.push("a special character");
    
    return errors.length > 0 ? `Password must contain ${errors.join(", ")}` : "";
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newFieldErrors: {[key: string]: string} = {};
    
  
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newFieldErrors.password = passwordError;
    }
    
  
    if (formData.password !== formData.password_confirmation) {
      newFieldErrors.password_confirmation = "Passwords do not match";
    }
    
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await apiClient.post("/reset-password", {
        email,
        token,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });
      
      setSuccess(true);
      
      
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Failed to reset password. Please try again.";
      
      if (error.response?.data?.errors) {
       
        const backendErrors = error.response.data.errors;
        const newErrors: {[key: string]: string} = {};
        
        Object.keys(backendErrors).forEach(field => {
          newErrors[field] = Array.isArray(backendErrors[field]) 
            ? backendErrors[field][0] 
            : backendErrors[field];
        });
        
        setFieldErrors(newErrors);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, email, token, router]);

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
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Redirecting to sign in page in 3 seconds...
            </p>
            
            <button
              onClick={handleBackToLogin}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Sign In Now
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
          
          <h2 className="text-3xl font-bold mb-4">Create New Password</h2>
          <p className="text-purple-200 text-lg">
            Choose a strong password to keep your Zikor account secure and continue growing your business.
          </p>
          
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-purple-200 text-sm">
              <span className="w-2 h-2 bg-purple-300 rounded-full"></span>
              At least 8 characters long
            </div>
            <div className="flex items-center gap-3 text-purple-200 text-sm">
              <span className="w-2 h-2 bg-purple-300 rounded-full"></span>
              Contains uppercase & lowercase letters
            </div>
            <div className="flex items-center gap-3 text-purple-200 text-sm">
              <span className="w-2 h-2 bg-purple-300 rounded-full"></span>
              Includes numbers and special characters
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
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
            <p className="text-gray-600">
              Enter your new password for <span className="font-medium">{email}</span>
            </p>
          </div>

          {/* General Error */}
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
              icon={BiLock}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              label="New Password"
              showPasswordToggle={true}
              showPassword={showPassword}
              onTogglePassword={togglePassword}
              error={fieldErrors.password}
            />

            <Input
              icon={BiLock}
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm new password"
              label="Confirm Password"
              showPasswordToggle={true}
              showPassword={showConfirmPassword}
              onTogglePassword={toggleConfirmPassword}
              error={fieldErrors.password_confirmation}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
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

export default ResetPassword;