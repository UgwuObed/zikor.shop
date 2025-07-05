"use client"

import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { BiEnvelope, BiLock, BiStore, BiShow, BiHide } from "react-icons/bi";
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
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const Input = ({ 
  icon: Icon, 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder, 
  label, 
  showPasswordToggle, 
  showPassword, 
  onTogglePassword 
}: InputProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
        name={name}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 w-full h-12 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
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
  </div>
);

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/login", formData);
      localStorage.setItem("accessToken", response.data.token);
      router.push("/dashboard/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           "Invalid email or password";
      
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
                                  .flat()
                                  .join(', ');
        setError(errorMessages);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 p-12 flex-col justify-center text-white">
          <div className="flex items-center mb-8">
            <BiStore className="h-8 w-8 mr-3" />
            <span className="text-2xl font-bold">Zikor</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-purple-200 text-lg">
            Continue managing your online store and growing your business with powerful tools.
          </p>
          
          <div className="mt-8 flex items-center gap-4 bg-white/10 rounded-xl p-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                  👤
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm font-semibold">Trusted by thousands</div>
              <div className="text-purple-200 text-sm">⭐⭐⭐⭐⭐ 4.9/5</div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Access your business dashboard</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              icon={BiEnvelope}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              label="Email Address"
            />

            <Input
              icon={BiLock}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              label="Password"
              showPasswordToggle={true}
              showPassword={showPassword}
              onTogglePassword={togglePassword}
            />

            <div className="flex justify-end">
              <a 
                href="/auth/forget" 
                className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/auth/signup" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;