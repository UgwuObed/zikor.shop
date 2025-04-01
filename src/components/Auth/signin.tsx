// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BiEnvelope, BiLock, BiStore, BiChevronRight, BiShow, BiHide } from "react-icons/bi";
import { motion } from "framer-motion";
import apiClient from '../../apiClient';



const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = apiClient.post("/login", formData);
      localStorage.setItem("accessToken", (await response).data.token);
      router.push("/dashboard");
    } catch (error: any) {
    
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           "An error occurred during registration";
      
      
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
                                  .flat()
                                  .join('\n');
        setErrorMessage(errorMessages);
      } else {
        setErrorMessage(errorMessage);
      }
      
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
              <h3 className="text-3xl font-bold mb-4">Welcome Back!</h3>
              <p className="text-purple-200 mb-8">
                Manage your online store and grow your business
              </p>
              
              <div className="relative h-64">
              <img 
                src="/images/ecommerce-illustration.png" 
                alt="Ecommerce Illustration"
                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"
              />
              </div>
              
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-purple-500 border-2 border-white"></div>
                  ))}
                </div>
                <p className="text-purple-200 text-sm">
                  Join <span className="font-bold">5,000+</span> Nigerian businesses
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            {/* Form header */}
            <div className="mb-8">
              <motion.h2 
                className="text-2xl md:text-3xl font-bold text-gray-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Sign In to Your Account
              </motion.h2>
              <motion.p 
                className="text-gray-500 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Manage your business and track your sales
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
                      Signing you in...
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

            <motion.form 
              className="space-y-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
            >
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
                <div className="flex justify-end mt-1">
                  <a 
                    href="/forgot-password" 
                    className="text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Signing In..."
                  ) : (
                    <>
                      Sign In
                      <BiChevronRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </motion.div>

              <motion.div 
                className="text-center text-sm text-gray-500 mt-4"
                variants={itemVariants}
              >
                Don't have an account?{" "}
                <a 
                  href="/auth/signup" 
                  className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
                >
                  Sign up
                </a>
              </motion.div>

              <motion.div 
                className="relative my-6"
                variants={itemVariants}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={itemVariants}
              >
                <motion.button
                  type="button"
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.786-1.664-4.153-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.668-0.069-1.325-0.189-1.971h-9.811z" />
                  </svg>
                  Google
                </motion.button>
                <motion.button
                  type="button"
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-0.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                  Facebook
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>

        {/* Mobile footer */}
        <div className="md:hidden text-center text-sm text-gray-500 mt-6">
          <p>By signing in, you agree to our <a href="#" className="text-purple-600">Terms</a> and <a href="#" className="text-purple-600">Privacy Policy</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signin;