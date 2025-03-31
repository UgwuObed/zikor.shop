// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { 
  BiUser, BiEnvelope, BiLock, BiStore, 
  BiPhone, BiMap, BiCheck, BiArrowBack, 
  BiChevronRight, BiBuilding, BiIdCard , BiShow, BiHide
} from "react-icons/bi";
import { motion } from "framer-motion";
import Image from "next/image";

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
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

 
  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", 
    "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", 
    "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", 
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", 
    "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", 
    "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateSignup = () => {
    return (
      formData.first_name &&
      formData.last_name &&
      formData.email &&
      formData.password &&
      formData.password === formData.password_confirmation
    );
  };

  const validateBusinessSetup = () => {
    return (
      formData.business_name &&
      formData.phone &&
      formData.state &&
      formData.city &&
      formData.is_cac_registered !== ""
    );
  };

  const handleSignup = () => {
    if (validateSignup()) {
      setStep("business-setup");
    } else {
      setErrorMessage("Please fill all required fields and ensure passwords match");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleBack = () => {
    setStep("signup");
  };

  const handleSubmit = async () => {
    if (!validateBusinessSetup()) {
      setErrorMessage("Please fill all required fields");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("/api/register", formData);
      localStorage.setItem("accessToken", response.data.token);
      router.push("/account");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.errors || "An error occurred");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-purple-100 opacity-10 transform rotate-12 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-200 opacity-10 transform -rotate-12 translate-y-1/4"></div>
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-4xl mx-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left side - Branding/Illustration */}
          <div className="hidden md:block w-full md:w-1/2 bg-gradient-to-br from-purple-700 to-purple-900 p-8 text-white">
            <div className="flex items-center mb-6">
              <BiStore className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">Zikor</span>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col justify-center h-full"
            >
              <h3 className="text-3xl font-bold mb-4">Start Selling Online Today</h3>
              <p className="text-purple-200 mb-8">
                Join thousands of Nigerian businesses growing with our platform
              </p>
              
              <div className="relative h-64">
                <Image
                  src="/images/ecommerce-illustration.png"
                  alt="Ecommerce illustration"
                  layout="fill"
                  objectFit="contain"
                  className="transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-purple-500 border-2 border-white"></div>
                  ))}
                </div>
                <p className="text-purple-200 text-sm">
                  <span className="font-bold">5,000+</span> Nigerian businesses onboarded
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full"
                initial={{ width: step === "signup" ? "33%" : "100%" }}
                animate={{ width: step === "signup" ? "33%" : "100%" }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Form header */}
            <div className="mb-8">
              <motion.h2 
                className="text-2xl md:text-3xl font-bold text-gray-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {step === "signup" ? "Create Your Account" : "Business Details"}
              </motion.h2>
              <motion.p 
                className="text-gray-500 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {step === "signup" 
                  ? "Join the future of selling" 
                  : "Let's set up your business profile"}
              </motion.p>
            </div>

            {/* Loading overlay */}
            <Transition show={isLoading} as={Fragment}>
              <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto"
                onClose={() => {}}
              >
                <div className="min-h-screen text-center">
                  <div className="fixed inset-0 bg-black opacity-30" />
                  <div className="inline-block align-middle bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all p-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto"
                    ></motion.div>
                    <motion.p 
                      className="mt-4 text-purple-800 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Creating your account...
                    </motion.p>
                  </div>
                </div>
              </Dialog>
            </Transition>

            {/* Error message */}
            <Transition
              show={!!errorMessage}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <motion.div 
                className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
              >
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </motion.div>
            </Transition>

            {/* Step 1: Signup Form */}
            <Transition
              show={step === "signup"}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <motion.div 
                className="space-y-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  variants={itemVariants}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-2.5"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-2.5"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BiEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-2.5"
                      placeholder="your@email.com"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-2.5"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <BiHide className="h-5 w-5" />
                    ) : (
                      <BiShow className="h-5 w-5" />
                    )}
                  </button>
                </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-2.5"
                      placeholder="••••••••••••"
                    />
                    <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <BiHide className="h-5 w-5" />
                    ) : (
                      <BiShow className="h-5 w-5" />
                    )}
                  </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <button
                    onClick={handleSignup}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center group"
                  >
                    Continue to Business Details
                    <BiChevronRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </motion.div>

                <motion.div 
                  className="text-center text-sm text-gray-500 mt-4"
                  variants={itemVariants}
                >
                  Already have an account?{" "}
                  <a 
                    href="/auth/signin" 
                    className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
                  >
                    Log in
                  </a>
                </motion.div>
              </motion.div>
            </Transition>

            {/* Step 2: Business Setup */}
            <Transition
              show={step === "business-setup"}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <motion.div 
                className="space-y-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BiStore className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-2.5"
                      placeholder="Your Business Name"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-2.5"
                      placeholder="08012345678"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BiMap className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-2.5"
                      disabled
                    />
                  </div>
                </motion.div>

                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5" variants={itemVariants}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-2.5 px-3"
                    >
                      <option value="">Select State</option>
                      {nigerianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-2.5 px-3"
                      placeholder="Your City"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Is your business registered with CAC?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.label 
                      className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        formData.is_cac_registered === "true" 
                          ? "border-purple-600 bg-purple-50" 
                          : "border-gray-300 hover:border-purple-400"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name="is_cac_registered"
                        value="true"
                        checked={formData.is_cac_registered === "true"}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                      />
                      <div className="flex items-center">
                        <BiIdCard className="h-5 w-5 mr-2" />
                        <span>Yes, registered</span>
                      </div>
                    </motion.label>
                    <motion.label 
                      className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        formData.is_cac_registered === "false" 
                          ? "border-purple-600 bg-purple-50" 
                          : "border-gray-300 hover:border-purple-400"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name="is_cac_registered"
                        value="false"
                        checked={formData.is_cac_registered === "false"}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                      />
                      <div className="flex items-center">
                        <BiBuilding className="h-5 w-5 mr-2" />
                        <span>Not yet</span>
                      </div>
                    </motion.label>
                  </div>
                </motion.div>

                <motion.div className="flex space-x-4 pt-2" variants={itemVariants}>
                  <motion.button
                    onClick={handleBack}
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <BiArrowBack className="w-5 h-5 mr-2" />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center group"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Complete Registration
                    <BiCheck className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:scale-125" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </Transition>
          </div>
        </motion.div>

        {/* Mobile footer */}
        <div className="md:hidden text-center text-sm text-gray-500 mt-6">
          <p>By signing up, you agree to our <a href="#" className="text-purple-600">Terms</a> and <a href="#" className="text-purple-600">Privacy Policy</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;