"use client"

import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Dialog } from "@headlessui/react";
import apiClient from '../../apiClient';
import { 
  BiUser, BiEnvelope, BiLock, BiStore, 
  BiPhone, BiMap, BiArrowBack, 
  BiChevronRight, BiShow, BiHide,
  BiCheck, BiShield
} from "react-icons/bi";
import { FiZap, FiTarget } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", 
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", 
  "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", 
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", 
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", 
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

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

const Input = ({ icon: Icon, type = "text", name, value, onChange, placeholder, label, showPasswordToggle, showPassword, onTogglePassword }: InputProps) => (
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

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  label: string;
}

const Select = ({ name, value, onChange, options, label }: SelectProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full h-12 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors px-3"
    >
      <option value="">Select {label}</option>
      {options.map((option: string) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("signup");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    business_name: "",
    phone: "",
    country: "Nigeria", 
    state: "",
    city: "",
    is_cac_registered: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const validateStep1 = () => {
    return formData.first_name && formData.last_name && formData.email && 
           formData.password && formData.password === formData.password_confirmation;
  };

  const validateStep2 = () => {
    return formData.business_name && formData.phone && formData.state && 
           formData.city && formData.is_cac_registered !== "";
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep("business-setup");
      setError("");
    } else {
      setError("Please fill all fields and ensure passwords match");
    }
  };

  const handleBack = () => setStep("signup");

  const handleSubmit = async () => {
    if (!validateStep2()) {
      setError("Please fill all required fields");
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    try {
      const payload = {
        ...formData,
        is_cac_registered: formData.is_cac_registered === "true"
      };
  
      const response = await apiClient.post("/register", payload);
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("businessName", formData.business_name);
      localStorage.setItem("userEmail", formData.email);
      
      setShowSuccess(true);
      setTimeout(() => router.push("/plan/payment"), 2000);
      
    } catch (error: any) {
      console.log("Full error object:", error.response?.data);
      
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        
        if (errorData.data) {
          const errorMessages = Object.entries(errorData.data)
            .map(([field, message]) => {
              const fieldName = field.replace(/_/g, ' ');
              return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${message}`;
            })
            .join('\n');
          setError(errorMessages);
        } 
        else if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, messages]) => {
              const fieldName = field.replace(/_/g, ' ');
              const messageText = Array.isArray(messages) ? messages.join(' ') : messages;
              return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${messageText}`;
            })
            .join('\n');
          setError(errorMessages);
        } 
        
        else {
          setError(errorData.message || "Please correct the validation errors");
        }
      } else {
        setError(error.response?.data?.message || error.message || "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <Dialog as="div" className="fixed inset-0 z-50" open={showSuccess} onClose={() => {}}>
            <div className="fixed inset-0 bg-black/50" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div 
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BiCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Zikor! 🎉</h3>
                <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 p-12 flex-col justify-center text-white">
          <div className="flex items-center mb-8">
            <BiStore className="h-8 w-8 mr-3" />
            <span className="text-2xl font-bold">Zikor</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Transform Your Business Into Success</h2>
          <p className="text-purple-200 mb-8 text-lg">
            Join over 10,000+ Nigerian entrepreneurs who have revolutionized their businesses.
          </p>
          
          <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                  👤
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm font-semibold">10,000+ businesses</div>
              <div className="text-purple-200 text-sm">⭐⭐⭐⭐⭐ 4.9/5</div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Step {step === "signup" ? "1" : "2"} of 2</span>
              <span className="text-sm text-gray-500">{step === "signup" ? "Account" : "Business"}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div 
                className={`h-2 bg-purple-600 rounded-full transition-all duration-300 ${
                  step === "signup" ? "w-1/2" : "w-full"
                }`}
              />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {step === "signup" ? "Create Account" : "Business Details"}
            </h2>
            <p className="text-gray-600">
              {step === "signup" ? "Start your journey today" : "Tell us about your business"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm whitespace-pre-line">{error}</p>
            </div>
          )}

          {/* Forms */}
          <AnimatePresence mode="wait">
            {step === "signup" && (
              <motion.div 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    icon={BiUser}
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    label="First Name"
                  />
                  <Input
                    icon={BiUser}
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    label="Last Name"
                  />
                </div>

                <Input
                  icon={BiEnvelope}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  label="Email"
                />

                <Input
                  icon={BiLock}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  label="Password"
                  showPasswordToggle={true}
                  showPassword={showPassword}
                  onTogglePassword={togglePassword}
                />

                <Input
                  icon={BiLock}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  label="Confirm Password"
                  showPasswordToggle={true}
                  showPassword={showPassword}
                  onTogglePassword={togglePassword}
                />

                <button
                  onClick={handleNext}
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Continue <BiChevronRight className="w-5 h-5" />
                </button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <a href="/auth/signin" className="text-purple-600 hover:underline">Sign in</a>
                </p>
              </motion.div>
            )}

            {step === "business-setup" && (
              <motion.div 
                key="business"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Input
                  icon={BiStore}
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="Your Business Name"
                  label="Business Name"
                />

                <Input
                  icon={BiPhone}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08012345678"
                  label="Phone Number"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    options={NIGERIAN_STATES}
                    label="State"
                  />
                  <Input
                    icon={BiMap}
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your City"
                    label="City"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">CAC Registration</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.is_cac_registered === "true" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input
                        type="radio"
                        name="is_cac_registered"
                        value="true"
                        checked={formData.is_cac_registered === "true"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <BiShield className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                        <span className="text-sm font-medium">Yes</span>
                      </div>
                    </label>
                    <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.is_cac_registered === "false" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input
                        type="radio"
                        name="is_cac_registered"
                        value="false"
                        checked={formData.is_cac_registered === "false"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <FiTarget className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                        <span className="text-sm font-medium">No</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <BiArrowBack className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiZap className="w-4 h-4" /> Create Account
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Signup;