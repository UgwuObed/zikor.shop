import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { BiUpload, BiSave, BiArrowBack } from 'react-icons/bi';
import { Palette, Camera, Image, CheckCircle, AlertTriangle } from 'lucide-react';
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
      className={`border rounded-xl p-4 ${config.classes} shadow-sm backdrop-blur-sm mb-6`}
    >
      <div className="flex items-start gap-3">
        <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
};


const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
};

const BrandingSettings = () => {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('Your Business');
  const [storefrontSlug, setStorefrontSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    logo: '',
    banner: '',
    color_theme: '#7C3AED'
  });

  const colorPresets = [
    '#7C3AED', '#DC2626', '#059669', '#D97706', '#2563EB', '#7C2D12', '#BE185D', '#0891B2'
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
        const storefront = response.data.storefront;
        const businessName = storefront?.business_name || 'Your Business';
        
        setBusinessName(businessName);
        setFormData({
          logo: storefront?.logo || '',
          banner: storefront?.banner || '',
          color_theme: storefront?.color_theme || '#7C3AED'
        });
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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Logo file size must be less than 2MB');
        setTimeout(() => setErrorMessage(''), 5000);
        return;
      }

   
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file');
        setTimeout(() => setErrorMessage(''), 5000);
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          setFormData(prev => ({ ...prev, logo: e.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
     
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Banner file size must be less than 5MB');
        setTimeout(() => setErrorMessage(''), 5000);
        return;
      }

    
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file');
        setTimeout(() => setErrorMessage(''), 5000);
        return;
      }

      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          setFormData(prev => ({ ...prev, banner: e.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color_theme: color }));
  };

 const handleSave = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    router.push('/auth/signin');
    return;
  }

  setIsLoading(true);
  setErrorMessage(''); 

  try {
    const uploadData = new FormData();
    
    if (logoFile) {
      uploadData.append('logo', logoFile);
    }
    
    if (bannerFile) {
      uploadData.append('banner', bannerFile);
    }
    
    uploadData.append('color_theme', formData.color_theme);
    uploadData.append('_method', 'PUT'); 

    const response = await apiClient.post('/storefront', uploadData, {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      setSuccessMessage(response.data.message || 'Branding updated successfully!');
      setLogoFile(null);
      setBannerFile(null);
      
      if (response.data.storefront) {
        setFormData(prev => ({
          ...prev,
          logo: response.data.storefront.logo || prev.logo,
          banner: response.data.storefront.banner || prev.banner,
          color_theme: response.data.storefront.color_theme || prev.color_theme
        }));
      }
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      throw new Error(response.data.message || 'Failed to update branding');
    }
  } catch (error: any) {
    if (error?.response) {
      setErrorMessage(error.response.data.message || 'An error occurred while updating branding');
    } else if (error?.request) {
      setErrorMessage('Network error. Please check your connection and try again.');
    } else {
      setErrorMessage(error.message || 'An unexpected error occurred');
    }
    setTimeout(() => setErrorMessage(''), 5000);
  } finally {
    setIsLoading(false); 
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
                </div>
                <div className="space-y-6">
                  <div className="h-32 bg-slate-200 rounded-lg"></div>
                  <div className="h-48 bg-slate-200 rounded-lg"></div>
                  <div className="h-16 bg-slate-200 rounded-lg"></div>
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
          title="Visual Branding Settings"
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
                <motion.div variants={itemVariants} className="flex items-center">
                  <motion.div 
                    className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mr-4 lg:mr-6 shadow-lg"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Palette className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 lg:mb-2">
                      Visual Branding
                    </h2>
                    <p className="text-slate-600 text-sm lg:text-lg font-medium">Customize your storefront's visual appearance</p>
                  </div>
                </motion.div>

                {/* Logo Section */}
                <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 lg:p-6 shadow-lg">
                  <h3 className="text-lg lg:text-xl font-bold text-slate-800 flex items-center mb-4 lg:mb-6">
                    <Camera className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-purple-600" />
                    Store Logo
                  </h3>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden bg-slate-50/90 flex items-center justify-center relative group hover:border-purple-400 transition-colors">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-8 h-8 lg:w-10 lg:h-10 text-slate-400" />
                      )}
                      {formData.logo && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Change Logo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <motion.div 
                          className="cursor-pointer inline-flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-sm lg:text-base"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <BiUpload className="w-4 h-4 lg:w-5 lg:h-5" />
                          {formData.logo ? 'Change Logo' : 'Upload Logo'}
                        </motion.div>
                      </label>
                      <div className="text-sm text-slate-600 space-y-1 bg-slate-50/90 rounded-xl p-3 lg:p-4">
                        <p className="font-medium text-slate-700 mb-2">Requirements:</p>
                        <p>• Recommended: 200x200px square image</p>
                        <p>• Formats: PNG, JPG, or JPEG</p>
                        <p>• Maximum file size: 2MB</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Banner Section */}
                <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 lg:p-6 shadow-lg">
                  <h3 className="text-lg lg:text-xl font-bold text-slate-800 flex items-center mb-4 lg:mb-6">
                    <Image className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-purple-600" />
                    Store Banner
                  </h3>
                  <div className="space-y-4 lg:space-y-6">
                    <div className="w-full h-48 lg:h-56 border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden bg-slate-50/90 flex items-center justify-center relative group hover:border-purple-400 transition-colors">
                      {formData.banner ? (
                        <img src={formData.banner} alt="Banner preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Image className="w-12 h-12 lg:w-16 lg:h-16 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-500 font-medium">No banner uploaded</p>
                        </div>
                      )}
                      {formData.banner && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <span className="text-white font-medium">Change Banner</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                        <motion.div 
                          className="cursor-pointer inline-flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-sm lg:text-base"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <BiUpload className="w-4 h-4 lg:w-5 lg:h-5" />
                          {formData.banner ? 'Change Banner' : 'Upload Banner'}
                        </motion.div>
                      </label>
                      <div className="text-sm text-slate-600 bg-slate-50/90 rounded-xl p-3">
                        <p className="font-medium">Recommended: 1200x400px • Max 5MB • PNG/JPG</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Color Theme Section */}
                <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 lg:p-6 shadow-lg">
                  <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-4 lg:mb-6">Brand Color Theme</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div 
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl border-2 border-slate-200 shadow-lg"
                        style={{ backgroundColor: formData.color_theme }}
                      ></div>
                      <div className="flex-1">
                        <input
                          type="color"
                          value={formData.color_theme}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="w-20 lg:w-24 h-10 lg:h-12 rounded-xl border border-slate-300 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                        />
                        <p className="text-sm lg:text-base text-slate-600 mt-2 font-medium">
                          Current color: <span className="font-bold">{formData.color_theme}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm lg:text-base font-bold text-slate-700 mb-3">Quick Color Presets:</p>
                      <div className="flex gap-2 lg:gap-3 flex-wrap">
                        {colorPresets.map(color => (
                          <motion.button
                            key={color}
                            onClick={() => handleColorChange(color)}
                            className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-lg ${
                              formData.color_theme === color ? 'border-slate-800 shadow-lg scale-110' : 'border-slate-200 hover:border-slate-400'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                            whileHover={{ scale: formData.color_theme === color ? 1.1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/50 rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                      <h4 className="font-bold text-blue-800 mb-3 text-base lg:text-lg">Color Theme Usage</h4>
                      <ul className="text-sm lg:text-base text-blue-700 space-y-2 font-medium">
                        <li>• Used for buttons, links, and accent elements</li>
                        <li>• Applied to your storefront navigation and highlights</li>
                        <li>• Helps maintain consistent brand identity</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Save Button */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BrandingSettings;