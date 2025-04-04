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

interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  website: string;
}

interface BusinessHoursDay {
  open: string;
  close: string;
  closed: boolean;
}

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
  social_links: SocialLinks;
  color_theme: string;
  business_hours: Record<string, BusinessHoursDay>;
  address: string;
  bankDetails: {
    bank_name: '',
    account_name: '',
    account_number: ''
  },
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
    business_hours: {},
    address: '',
    bankDetails: {
      bank_name: '',
      account_name: '',
      account_number: ''
    },
  });

  // Progress bar animation
  const progressProps = useSpring({
    width: `${(currentStep-1) * 25}%`,
    config: { tension: 120, friction: 14 }
  });

  // Alert animations
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
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
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
      
      const submissionData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'social_links' || key === 'business_hours' || key === 'bank_details') {
          submissionData.append(key, JSON.stringify(value));
        } else if (key !== 'logo' && key !== 'banner' && key !== 'logoPreview' && key !== 'bannerPreview' && value !== null) {
          submissionData.append(key, String(value));
        }
      });
      
    
      if (formData.logo instanceof File) {
        submissionData.append('logo', formData.logo);
      }
      if (formData.banner instanceof File) {
        submissionData.append('banner', formData.banner);
      }
      
      const config = {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      
      const endpoint = '/storefront';
      // const method = hasExistingStorefront ? 'put' : 'post';
      
      // await apiClient[method](endpoint, submissionData, config);
      
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch (err: any) {
      console.error('Error saving storefront:', err);
      let errorMessage = 'An error occurred while saving your storefront';
      
      if (err.response) {
        if (err.response.data?.errors) {
          errorMessage = Object.values(err.response.data.errors)
            .flat()
            .join('\n');
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
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

        const colors = ['#1E40AF', '#3B82F6', '#93C5FD'];

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

        
        {/* <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className={`text-sm text-center w-1/5 relative ${
                  currentStep > index + 1 ? 'text-green-600 font-medium' : 
                  currentStep === index + 1 ? 'text-blue-600 font-bold' : 
                  'text-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="relative z-10">{step}</span>
                {currentStep === index + 1 && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    layoutId="stepUnderline"
                  />
                )}
              </motion.div>
            ))}
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
              <animated.div 
                ref={progressBarRef}
                style={progressProps}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              ></animated.div>
            </div>
          </div>
        </div> */}
        
        <AnimatePresence>
          {(error || success) && (
            <animated.div style={alertAnimation}>
              {error && (
                <motion.div 
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
                  <p>{error}</p>
                </motion.div>
              )}
              
              {success && (
                <motion.div 
                  className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 flex items-start"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" />
                  <p>Your storefront has been {hasExistingStorefront ? 'updated' : 'created'} successfully! Redirecting to dashboard...</p>
                </motion.div>
              )}
            </animated.div>
          )}
        </AnimatePresence>
        
        {renderStep()}
    </div>
  );
};

export default StorefrontSetup;