import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiCheckCircle, BiXCircle, BiImageAdd, BiX, BiStore, BiLink, BiCategory, BiText } from 'react-icons/bi';

interface BasicInfoStepProps {
  formData: {
    business_name: string;
    slug: string;
    category: string;
    logo: File | null;
    logoPreview: string | null;
    tagline: string;
    [key: string]: any;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBusinessNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checkSlugAvailability: (slug: string) => Promise<boolean>;
  nextStep: () => void;
  businessInfoFromStorage?: string | null;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ 
  formData, 
  handleChange, 
  handleBusinessNameChange,
  handleFileChange,
  checkSlugAvailability,
  nextStep,
  businessInfoFromStorage = null
}) => {
  const [slugAvailable, setSlugAvailable] = useState<boolean>(true);
  const [checkingSlug, setCheckingSlug] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [slugDebounceTimeout, setSlugDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (businessInfoFromStorage && formData.business_name === '') {
      handleChange({
        target: {
          name: 'business_name',
          value: businessInfoFromStorage
        }
      } as React.ChangeEvent<HTMLInputElement>);

      const defaultSlug = businessInfoFromStorage
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      
      handleChange({
        target: {
          name: 'slug',
          value: defaultSlug
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [businessInfoFromStorage]);


  useEffect(() => {
    setFormValid(
      formData.business_name.trim() !== '' && 
      formData.slug.trim() !== '' && 
      slugAvailable
    );
  }, [formData.business_name, formData.slug, slugAvailable]);
  

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value;
    handleChange(e);
    
    if (slugDebounceTimeout) {
      clearTimeout(slugDebounceTimeout);
    }
    
    if (slug.trim() !== '') {
      setCheckingSlug(true);
      const timeout = setTimeout(async () => {
        const isAvailable = await checkSlugAvailability(slug);
        setSlugAvailable(isAvailable);
        setCheckingSlug(false);
      }, 500);
      setSlugDebounceTimeout(timeout);
    }
  };


  const handleBusinessNameWithSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleBusinessNameChange(e);
    
    if (formData.slug.trim() === '') {
      const suggestedSlug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      
      handleChange({
        target: {
          name: 'slug',
          value: suggestedSlug
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleRemoveLogo = () => {
    handleChange({
        target: {
            name: 'logo',
            value: null
        }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    
    handleChange({
        target: {
            name: 'logoPreview',
            value: null
        }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="w-full bg-purple-600 h-2"></div>
      
      <div className="p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-bold text-gray-800"
          >
            Let's Set Up Your Store
          </motion.h2>

          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="space-y-5"
          >
            {/* Business Name */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiStore className="w-5 h-5 mr-1 text-purple-600" />
                Business Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleBusinessNameWithSlug}
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Your Business Name"
                required
              />
            </motion.div>
            
            {/* Storefront URL */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiLink className="w-5 h-5 mr-1 text-purple-600" />
                Storefront URL <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  className={`flex-1 min-w-0 block w-full px-4 py-2 rounded-l-lg border transition-all duration-200 ${
                    !formData.slug ? 'border-purple-300' : 
                    checkingSlug ? 'border-yellow-300 bg-yellow-50' : 
                    slugAvailable ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                  } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                  placeholder="store-name"
                  required
                />
                 <span className="inline-flex items-center px-5 py-3 rounded-r-lg border border-0-r border-purple-300 bg-purple-50 text-purple-600 text-sm">
                  /zikor.shop
                </span>
              </div>
              {formData.slug && !checkingSlug && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-2 text-sm flex items-center ${slugAvailable ? 'text-green-600' : 'text-red-600'}`}
                >
                  {slugAvailable ? (
                    <>
                      <BiCheckCircle className="w-4 h-4 mr-1" />
                      This URL is available!
                    </>
                  ) : (
                    <>
                      <BiXCircle className="w-4 h-4 mr-1" />
                      This URL is already taken. Please choose another.
                    </>
                  )}
                </motion.p>
              )}
              {checkingSlug && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-yellow-600 flex items-center"
                >
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking availability...
                </motion.p>
              )}
            </motion.div>
            
            {/* Business Category */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiCategory className="w-5 h-5 mr-1 text-purple-600" />
                Business Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
              >
                <option value="">Select a category</option>
                <option value="fashion">Fashion & Apparel</option>
                <option value="electronics">Electronics</option>
                <option value="home">Home & Furniture</option>
                <option value="beauty">Beauty & Personal Care</option>
                <option value="food">Food & Beverages</option>
                <option value="health">Health & Wellness</option>
                <option value="art">Art & Crafts</option>
                <option value="services">Services</option>
                <option value="other">Other</option>
              </select>
            </motion.div>
            
            {/* Logo Upload */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiImageAdd className="w-5 h-5 mr-1 text-purple-600" />
                Logo
              </label>
              <div className="mt-2">
                {formData.logoPreview ? (
                  <div className="relative inline-block group">
                    <img 
                      src={formData.logoPreview} 
                      alt="Logo preview" 
                      className="w-24 h-24 object-contain border rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors duration-200"
                    >
                      <BiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors duration-200">
                    <input 
                      type="file" 
                      name="logo" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                    <BiImageAdd className="w-10 h-10 text-purple-400" />
                    <span className="mt-2 text-sm text-center text-gray-500">Upload Logo</span>
                  </label>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">Recommended size: 400x400 pixels. Max 2MB.</p>
            </motion.div>
            
            {/* Store Tagline */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiText className="w-5 h-5 mr-1 text-purple-600" />
                Store Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="A short catchphrase for your store"
                maxLength={120}
              />
              <div className="flex justify-end">
                <p className="mt-2 text-sm text-gray-500">
                  {formData.tagline.length}/120 characters
                </p>
              </div>
            </motion.div>
            
            {/* Navigation Buttons */}
            <motion.div variants={itemVariants} className="pt-4">
              <button
                type="button"
                onClick={nextStep}
                disabled={!formValid}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                  formValid 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next: Appearance
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Info card in desktop view */}
      <div className="hidden md:block p-6 bg-purple-50 border-t border-purple-100">
        <h3 className="text-sm font-medium text-purple-700 mb-2">Tips for setting up your store:</h3>
        <ul className="space-y-2">
          <li className="text-sm text-purple-600 flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Choose a business name that's memorable and reflects your brand
          </li>
          <li className="text-sm text-purple-600 flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Your store URL should be short, simple, and easy to remember
          </li>
          <li className="text-sm text-purple-600 flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            A high-quality logo helps customers recognize your brand
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BasicInfoStep;