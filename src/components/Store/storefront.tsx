import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from '@react-spring/web';
import apiClient from '../../apiClient';
import BasicInfoStep from '../Storefront/basic';
import AppearanceStep from '../Storefront/appearance';
import ContactInfoStep from '../Storefront/contact';
import SettingsStep from '../Storefront/settings';
import PreviewStep from '../Storefront/preview';
import { CheckCircle, AlertTriangle } from "lucide-react";



interface FormData {
  business_name: string;
  slug: string;
  category: string;
  logo: File | null;
  logoPreview: string | null;
  banner: File | null;
  bannerPreview: string | null;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  color_theme: string;
  address: string;
  business_hours: Record<string, {
    open: string;
    close: string;
    closed: boolean;
  }>;
  bank_details: {
    bank_name: string;
    account_name: string;
    account_number: string;
  };
  social_links: {
    facebook: string;
    instagram: string;
    twitter: string;
    website: string;
  };
}


const steps = ['Basic Info', 'Appearance', 'Contact', 'Settings', 'Preview'];

const StorefrontSetup = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasExistingStorefront, setHasExistingStorefront] = useState(false);
  const [stepTransition, setStepTransition] = useState<'next' | 'prev'>('next');
  // const progressBarRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    business_name: '',
    slug: '',
    category: '',
    logo: null,
    logoPreview: null,
    banner: null,
    bannerPreview: null,
    tagline: '',
    description: '',
    email: '',
    phone: '',
    social_links: {
      facebook: '',
      instagram: '',
      twitter: '',
      website: ''
    },
    color_theme: 'default',
    address: '',
    business_hours: {
      Monday: { open: '09:00', close: '17:00', closed: false },
      Tuesday: { open: '09:00', close: '17:00', closed: false },
      Wednesday: { open: '09:00', close: '17:00', closed: false },
      Thursday: { open: '09:00', close: '17:00', closed: false },
      Friday: { open: '09:00', close: '17:00', closed: false },
      Saturday: { open: '', close: '', closed: true },
      Sunday: { open: '', close: '', closed: true }
    },
    bank_details: {
      bank_name: '',
      account_name: '',
      account_number: ''
    }
  });

 
  const progressProps = useSpring({
    width: `${(currentStep-1) * 25}%`,
    config: { tension: 120, friction: 14 }
  });

  const alertAnimation = useSpring({
    opacity: error || success ? 1 : 0,
    transform: error || success ? 'translateY(0)' : 'translateY(-20px)',
    config: { tension: 170, friction: 26 }
  });

  type FormChangeEvent = 
    | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    | { target: { name: string; value: any } };

    const handleChange = (e: FormChangeEvent) => {
      const { name, value } = e.target;
      
      if (name.startsWith('social_links.')) {
        const [_, field] = name.split('.');
        setFormData(prev => ({
          ...prev,
          social_links: {
            ...prev.social_links,
            [field]: value
          }
        }));
      } else if (name.startsWith('bank_details.')) {
        const [_, field] = name.split('.');
        setFormData(prev => ({
          ...prev,
          bank_details: {
            ...prev.bank_details,
            [field]: value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0],
        [`${name}Preview`]: URL.createObjectURL(files[0])
      }));
    }
  };

  const checkSlugAvailability = async (slug: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await apiClient.post('/storefront/check-slug', 
        { slug }, 
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      return response.data.is_available;
    } catch (err) {
      console.error('Error checking slug availability:', err);
      return false;
    }
  };

  const generateSlug = (businessName: string) => {
    return businessName.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleBusinessNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      business_name: value
    }));
    
    if (!formData.slug || formData.slug === generateSlug(formData.business_name)) {
      const slug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/login');
        return;
      }
  
      const checkResponse = await apiClient.get('/storefront', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      const hasStorefront = checkResponse.data.has_storefront;
      setHasExistingStorefront(hasStorefront);
  
      const formDataObj = new FormData();
      formDataObj.append('business_name', formData.business_name);
      formDataObj.append('slug', formData.slug);
      formDataObj.append('category', formData.category);
      formDataObj.append('tagline', formData.tagline);
      formDataObj.append('description', formData.description);
      formDataObj.append('email', formData.email);
      formDataObj.append('phone', formData.phone);
      
      formDataObj.append('social_links', JSON.stringify(formData.social_links));
      formDataObj.append('bank_details', JSON.stringify(formData.bank_details));
      formDataObj.append('business_hours', JSON.stringify(formData.business_hours));
      
      formDataObj.append('color_theme', formData.color_theme);
      formDataObj.append('address', formData.address);
      
      if (formData.logo instanceof File) {
        formDataObj.append('logo', formData.logo);
      }
      
      if (formData.banner instanceof File) {
        formDataObj.append('banner', formData.banner);
      }
  
      const config = {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      };
  
      const endpoint = '/storefront';
      let response;
  
      if (hasStorefront) {
        response = await apiClient.put(endpoint, formDataObj, config);
      } else {
        response = await apiClient.post(endpoint, formDataObj, config);
      }
  
      if (response.data?.success === true) {
        console.log('Operation successful, triggering confetti');
        setSuccess(true);
        setTimeout(() => router.push('/product/add'), 3000);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err: any) {
      console.error('Error saving storefront:', err);
      
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      }
      
      let errorMessage = 'An error occurred while saving your storefront';
      
      if (err.response) {
        if (err.response.data?.errors) {
          errorMessage = Object.values(err.response.data.errors)
            .flat()
            .join('\n');
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        errorMessage = err.message || 'Failed to save storefront. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStepTransition('next');
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStepTransition('prev');
    setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ 
            opacity: 0, 
            x: stepTransition === 'next' ? 50 : -50 
          }}
          animate={{ 
            opacity: 1, 
            x: 0 
          }}
          exit={{ 
            opacity: 0, 
            x: stepTransition === 'next' ? -50 : 50 
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          {(() => {
            switch (currentStep) {
              case 1:
                return (
                  <BasicInfoStep 
                    formData={formData} 
                    handleChange={handleChange}
                    handleBusinessNameChange={handleBusinessNameChange}
                    handleFileChange={handleFileChange}
                    checkSlugAvailability={checkSlugAvailability}
                    nextStep={nextStep}
                  />
                );
              case 2:
                return (
                  <AppearanceStep 
                    formData={formData} 
                    handleChange={handleChange}
                    handleFileChange={handleFileChange}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                );
              case 3:
                return (
                  <ContactInfoStep 
                    formData={formData} 
                    handleChange={handleChange}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                );
              case 4:
                return (
                  <SettingsStep 
                    formData={formData} 
                    handleChange={handleChange}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                );
              case 5:
                return (
                  <PreviewStep 
                    formData={formData}
                    prevStep={prevStep}
                    handleSubmit={handleSubmit}
                    loading={loading}
                  />
                );
              default:
                return null;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

 
  useEffect(() => {
    if (success) {
      import('canvas-confetti').then((confetti) => {
        const duration = 2000;
        const end = Date.now() + duration;

        const colors = ['#1E40AF', '#8000bb', '#93C5FD'];

        (function frame() {
          confetti.default({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.5 },
            colors: colors
          });
          
          confetti.default({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.5 },
            colors: colors
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      });
    }
  }, [success]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#8000bb] to-[#8000bb] text-transparent bg-clip-text">
        {hasExistingStorefront ? 'Update Your Storefront' : 'Create Your Storefront'}
      </h1>
        
      <AnimatePresence>
  {/* Error Modal */}
  {error && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="bg-red-500 p-4 flex items-center">
          <AlertTriangle className="h-6 w-6 text-white mr-2" />
          <h3 className="text-lg font-medium text-white">Error</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700">{error}</p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}

  {/* Success Modal */}
  {success && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="bg-green-500 p-4 flex items-center">
          <CheckCircle className="h-6 w-6 text-white mr-2" />
          <h3 className="text-lg font-medium text-white">Success!</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700">
            Your storefront has been {hasExistingStorefront ? 'updated' : 'created'} successfully!
          </p>
          <div className="mt-4 flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Redirecting in 3 seconds...</span>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                setSuccess(false);
                router.push('/product/add');
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Go Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
        
        {renderStep()}
    </div>
  );
};

export default StorefrontSetup;