import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { BiEdit, BiSave, BiPlus, BiTrash, BiArrowBack } from 'react-icons/bi';
import { Truck, AlertTriangle, CheckCircle, Info, MapPin, Package } from 'lucide-react';
import apiClient from '../../apiClient';

interface SettingsHeaderProps {
  businessName: string;
  title: string;
  onBack: () => void;
}

const SettingsHeader = ({ businessName, title, onBack }: SettingsHeaderProps) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 bg-white/95 backdrop-blur-xl rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
  >
    <button 
      onClick={onBack} 
      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 sm:mb-0 transition-colors group"
    >
      <BiArrowBack className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Back to Settings
    </button>
    <div className="text-center flex-1">
      <h1 className="text-xl lg:text-2xl font-bold text-slate-800">{title}</h1>
      <p className="text-sm lg:text-base text-slate-600">{businessName}</p>
    </div>
    <div className="w-0 sm:w-24 lg:w-32"></div>
  </motion.div>
);

interface MessageAlertProps {
  type: 'success' | 'error' | 'warning';
  message: string;
}

const MessageAlert = ({ type, message }: MessageAlertProps) => {
  if (!message) return null;

  const alertConfig = {
    success: {
      classes: "bg-emerald-50/90 border-emerald-200 text-emerald-800",
      icon: CheckCircle
    },
    error: {
      classes: "bg-red-50/90 border-red-200 text-red-800",
      icon: AlertTriangle
    },
    warning: {
      classes: "bg-amber-50/90 border-amber-200 text-amber-800",
      icon: AlertTriangle
    },
  };

  const config = alertConfig[type];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`border rounded-xl p-4 ${config.classes} shadow-sm backdrop-blur-sm`}
    >
      <div className="flex items-start gap-3">
        <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
};

interface ShippingFee {
  id?: number;
  name: string;
  state: string;
  baseFee: number | string;
  additionalFee: number | string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

const ShippingFeesSettings = () => {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('Your Business');
  const [storefrontSlug, setStorefrontSlug] = useState('');
  const [shippingFees, setShippingFees] = useState<ShippingFee[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Abuja'
  ];

  useEffect(() => {
    fetchStorefrontData();
  }, []);

  const fetchStorefrontData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await apiClient.get('/storefront', {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.data.has_storefront && response.data.storefront) {
        setStorefrontSlug(response.data.storefront.slug);
        await fetchStorefrontProfile(response.data.storefront.slug);
      } else {
        setErrorMessage(response.data.message || 'Failed to load storefront data');
        setIsFetching(false);
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setErrorMessage('Request timed out. Please check your connection and try again.');
      } else if (error?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        router.push('/auth/signin');
      } else if (error?.response) {
        setErrorMessage(error.response.data.message || 'Failed to load storefront data');
      } else if (error?.request) {
        setErrorMessage('Network error. Please check your connection.');
      } else {
        setErrorMessage('An unexpected error occurred');
      }
      
      setIsFetching(false);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const fetchStorefrontProfile = async (slug: string) => {
    try {
      setIsFetching(true);
      setErrorMessage('');
      
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await apiClient.get(`/storefront/${slug}/profile`, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        const businessName = response.data.storefront?.business_name || 'Your Business';
        const shippingFees = response.data.shipping_fees || [];
        
        setBusinessName(businessName);
        setShippingFees(shippingFees);
      } else {
        setErrorMessage(response.data.message || 'Failed to load storefront profile');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Failed to load storefront profile');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsFetching(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const addShippingFee = () => {
    const newFee: ShippingFee = {
      name: '',
      state: '',
      baseFee: '' as any,
      additionalFee: '' as any
    };
    setShippingFees([newFee, ...shippingFees]);
  };

  const removeShippingFee = (index: number) => {
    setShippingFees(shippingFees.filter((_, i) => i !== index));
  };

  const updateShippingFee = (index: number, field: keyof ShippingFee, value: string | number) => {
    setShippingFees(shippingFees.map((fee, i) => 
      i === index ? { ...fee, [field]: value } : fee
    ));
  };

  const validateShippingFees = () => {
    const errors: string[] = [];
    
    shippingFees.forEach((fee, index) => {
      if (!fee.name.trim()) {
        errors.push(`Location ${index + 1}: Name is required`);
      }
      if (!fee.state) {
        errors.push(`Location ${index + 1}: State is required`);
      }
      const baseFeeNum = typeof fee.baseFee === 'string' ? parseInt(fee.baseFee) || 0 : fee.baseFee;
      const additionalFeeNum = typeof fee.additionalFee === 'string' ? parseInt(fee.additionalFee) || 0 : fee.additionalFee;
      
      if (baseFeeNum < 0) {
        errors.push(`Location ${index + 1}: Base fee cannot be negative`);
      }
      if (additionalFeeNum < 0) {
        errors.push(`Location ${index + 1}: Additional fee cannot be negative`);
      }
    });

    return errors;
  };

  const handleSave = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

    const validationErrors = validateShippingFees();
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors[0]);
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const feesToSave = shippingFees.map(fee => ({
        name: fee.name,
        state: fee.state,
        baseFee: typeof fee.baseFee === 'string' ? parseInt(fee.baseFee) || 0 : fee.baseFee,
        additionalFee: typeof fee.additionalFee === 'string' ? parseInt(fee.additionalFee) || 0 : fee.additionalFee
      }));

      const response = await apiClient.patch('/shipping/update', {
        shipping_fees: feesToSave
      }, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message || 'Shipping fees updated successfully!');
        setIsEditing(false);
        
        if (response.data.shipping_fees) {
          setShippingFees(response.data.shipping_fees);
        }
        
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error(response.data.message || 'Failed to update shipping fees');
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        router.push('/auth/signin');
        return;
      }

      if (error?.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.errors) {
          const validationMessages = Object.values(errorData.errors).flat();
          setErrorMessage(validationMessages.join(', '));
        } else {
          setErrorMessage(errorData.message || 'Failed to update shipping fees');
        }
      } else {
        setErrorMessage(error.message || 'Failed to update shipping fees');
      }
      
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage('');
    if (storefrontSlug) {
      fetchStorefrontProfile(storefrontSlug);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-4 px-4 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="p-4 lg:p-8">
              <div className="animate-pulse space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-slate-200 rounded-full w-12 h-12 mr-4"></div>
                    <div>
                      <div className="h-6 bg-slate-200 rounded w-48 mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded w-20"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-slate-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(j => (
                          <div key={j}>
                            <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                            <div className="h-10 bg-slate-200 rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-xl"
        />
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 py-4 px-4 lg:py-12 lg:px-8">
        <SettingsHeader 
          businessName={businessName}
          title="Shipping Fees Settings"
          onBack={handleBack}
        />

        <main className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="p-4 lg:p-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 lg:space-y-8"
              >
                {/* Messages */}
                <AnimatePresence>
                  <MessageAlert type="success" message={successMessage} />
                  <MessageAlert type="error" message={errorMessage} />
                </AnimatePresence>

                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-0">
                  <div className="flex items-center">
                    <motion.div 
                      className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mr-4 lg:mr-6 shadow-lg"
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Truck className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 lg:mb-2">
                        Shipping Fees
                      </h2>
                      <p className="text-slate-600 text-sm lg:text-lg font-medium">Configure delivery fees for different locations</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {isEditing && (
                      <motion.button
                        onClick={addShippingFee}
                        className="flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-sm lg:text-base"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <BiPlus className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="hidden sm:inline">Add Location</span>
                        <span className="sm:hidden">Add</span>
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                      className="flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-sm lg:text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <BiEdit className="w-4 h-4 lg:w-5 lg:h-5" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Shipping Fees List */}
                <motion.div variants={itemVariants} className="space-y-4 lg:space-y-6">
                  <AnimatePresence>
                    {shippingFees.map((fee, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                        whileHover={{ y: -2 }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                          {/* Location Name */}
                          <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              <MapPin className="w-4 h-4 inline mr-1 text-purple-600" />
                              Location Name *
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={fee.name}
                                onChange={(e) => updateShippingFee(index, 'name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-sm text-sm lg:text-base hover:border-slate-400"
                                placeholder="e.g., Lagos Mainland"
                              />
                            ) : (
                              <div className="px-4 py-3 bg-slate-50/90 backdrop-blur-sm rounded-xl border border-slate-200 group-hover:border-slate-300 transition-colors">
                                <p className="font-semibold text-slate-800 text-sm lg:text-base">{fee.name || 'No name set'}</p>
                              </div>
                            )}
                          </div>

                          {/* State */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              State *
                            </label>
                            {isEditing ? (
                              <select
                                value={fee.state}
                                onChange={(e) => updateShippingFee(index, 'state', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-sm text-sm lg:text-base hover:border-slate-400"
                              >
                                <option value="">Select State</option>
                                {nigerianStates.map(state => (
                                  <option key={state} value={state}>{state}</option>
                                ))}
                              </select>
                            ) : (
                              <div className="px-4 py-3 bg-slate-50/90 backdrop-blur-sm rounded-xl border border-slate-200 group-hover:border-slate-300 transition-colors">
                                <p className="font-semibold text-slate-800 text-sm lg:text-base">{fee.state || 'No state set'}</p>
                              </div>
                            )}
                          </div>

                          {/* Base Fee */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Base Fee (₦) *
                            </label>
                            {isEditing ? (
                              <input
                                type="number"
                                value={fee.baseFee === '' ? '' : fee.baseFee}
                                onChange={(e) => updateShippingFee(index, 'baseFee', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-sm text-sm lg:text-base hover:border-slate-400"
                                min="0"
                                placeholder="0"
                              />
                            ) : (
                              <div className="px-4 py-3 bg-slate-50/90 backdrop-blur-sm rounded-xl border border-slate-200 group-hover:border-slate-300 transition-colors">
                                <p className="font-bold text-slate-800 text-sm lg:text-base">₦{(typeof fee.baseFee === 'string' ? parseInt(fee.baseFee) || 0 : fee.baseFee).toLocaleString()}</p>
                              </div>
                            )}
                          </div>

                          {/* Additional Fee */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Additional Fee (₦)
                              <span className="text-xs text-slate-500 block font-normal">For orders &gt; 10 items</span>
                            </label>
                            <div className="flex gap-3">
                              {isEditing ? (
                                <>
                                  <input
                                    type="number"
                                    value={fee.additionalFee === '' ? '' : fee.additionalFee}
                                    onChange={(e) => updateShippingFee(index, 'additionalFee', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                                    className="flex-1 px-3 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-sm text-sm lg:text-base hover:border-slate-400 max-w-[120px] lg:max-w-[140px]"
                                    min="0"
                                    placeholder="0"
                                  />
                                  <motion.button
                                    onClick={() => removeShippingFee(index)}
                                    className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 border border-red-200 hover:border-red-300 bg-white/90"
                                    title="Remove location"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <BiTrash className="w-4 h-4 lg:w-5 lg:h-5" />
                                  </motion.button>
                                </>
                              ) : (
                                <div className="px-4 py-3 bg-slate-50/90 backdrop-blur-sm rounded-xl border border-slate-200 group-hover:border-slate-300 transition-colors flex-1">
                                  <p className="font-bold text-slate-800 text-sm lg:text-base">₦{(typeof fee.additionalFee === 'string' ? parseInt(fee.additionalFee) || 0 : fee.additionalFee).toLocaleString()}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {shippingFees.length === 0 && (
                    <motion.div 
                      variants={itemVariants}
                      className="text-center py-12 lg:py-16 bg-gradient-to-br from-slate-50/90 to-slate-100/90 backdrop-blur-sm rounded-2xl border border-slate-200/50"
                    >
                      <motion.div 
                        className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center mx-auto mb-6 shadow-lg"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Package className="w-10 h-10 lg:w-12 lg:h-12 text-purple-600" />
                      </motion.div>
                      <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-3">No shipping locations configured</h3>
                      <p className="text-slate-600 mb-8 max-w-md mx-auto text-base lg:text-lg leading-relaxed px-4">
                        Add shipping locations to configure delivery fees for your customers
                      </p>
                      <motion.button
                        onClick={() => {
                          setIsEditing(true);
                          addShippingFee();
                        }}
                        className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl text-sm lg:text-base"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add Your First Location
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>

                {/* Info Box */}
                <AnimatePresence>
                  {isEditing && shippingFees.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gradient-to-r from-purple-50/90 to-indigo-50/90 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-4 lg:p-6"
                    >
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-purple-800 mb-3 text-base lg:text-lg">Shipping Fee Information</h3>
                          <ul className="text-purple-700 space-y-2 font-medium text-sm lg:text-base">
                            <li>• <strong>Base Fee:</strong> Charged for every order to this location</li>
                            <li>• <strong>Additional Fee:</strong> Extra charge applied only when an order has more than 10 items</li>
                            <li>• All required fields must be completed before saving</li>
                            <li>• Changes will apply to new orders immediately after saving</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Save Button */}
                <AnimatePresence>
                  {isEditing && shippingFees.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-center lg:justify-end pt-4 lg:pt-6"
                    >
                      <motion.button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm lg:text-base w-full sm:w-auto justify-center"
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <BiSave className="w-5 h-5" />
                            Save All Changes
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShippingFeesSettings;