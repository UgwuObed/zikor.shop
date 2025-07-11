import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { BiEdit, BiSave } from 'react-icons/bi';
import { Building, Mail, Phone, MapPin } from 'lucide-react';
import SettingsHeader from './header';
import MessageAlert from './alert';
import apiClient from '../../apiClient';

interface Storefront {
    business_name: string;
    tagline: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    slug?: string;
    color_theme?: string;
    logo?: string;
    banner?: string;
}

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

const BusinessInfoSettings = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [storefrontSlug, setStorefrontSlug] = useState('');
  const [formData, setFormData] = useState<Storefront>({
    slug: '',
    business_name: '',
    tagline: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    color_theme: '#7C3AED',
    logo: '',
    banner: ''
  });

  useEffect(() => {
    const controller = new AbortController();
    fetchStorefrontData(controller.signal);

    return () => controller.abort();
  }, []);

 const fetchStorefrontData = async (signal?: AbortSignal) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    router.push('/auth/signin');
    return;
  }

  try {
    setIsFetching(true);
    setErrorMessage('');
    
    const storefrontResponse = await apiClient.get('/storefront', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      signal
    });

   
    if (storefrontResponse.data.has_storefront && storefrontResponse.data.storefront) {
      const slug = storefrontResponse.data.storefront.slug;
      setStorefrontSlug(slug);
      
      const profileResponse = await apiClient.get(`/storefront/${slug}/profile`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        signal
      });

      if (profileResponse.data.success && profileResponse.data.storefront) {
        const { storefront } = profileResponse.data;
        setFormData({
          slug: storefront.slug || '',
          business_name: storefront.business_name || '',
          tagline: storefront.tagline || '',
          description: storefront.description || '',
          email: storefront.email || '',
          phone: storefront.phone || '',
          address: storefront.address || '',
          color_theme: storefront.color_theme || '#7C3AED',
          logo: storefront.logo || '',
          banner: storefront.banner || ''
        });
      }
    }

  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('Error fetching storefront data:', error);
      setErrorMessage(error?.response?.data?.message || 'Failed to load business information');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  } finally {
    setIsFetching(false);
  }
};

  const handleBack = () => {
    router.back();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      const updateData = {
        slug: formData.slug,
        business_name: formData.business_name,
        tagline: formData.tagline,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        color_theme: formData.color_theme
      };

      const response = await apiClient.put('/storefront', updateData, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message || 'Business information updated successfully!');
        setIsEditing(false);
        
     
        if (response.data.storefront) {
          setFormData(prev => ({
            ...prev,
            slug: response.data.storefront.slug || prev.slug,
            business_name: response.data.storefront.business_name || prev.business_name,
            tagline: response.data.storefront.tagline || prev.tagline,
            description: response.data.storefront.description || prev.description,
            email: response.data.storefront.email || prev.email,
            phone: response.data.storefront.phone || prev.phone,
            address: response.data.storefront.address || prev.address,
            color_theme: response.data.storefront.color_theme || prev.color_theme
          }));
        }
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.data.message || 'Failed to update business information');
      }
    } catch (error: any) {
      console.error('Error updating business info:', error);
      if (error?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        router.push('/auth/signin');
        return;
      }
      
      setErrorMessage(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to update business information'
      );
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage('');
    fetchStorefrontData();
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-gray-50 py-4 px-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="animate-pulse space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full w-12 h-12 mr-4"></div>
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i}>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded w-full"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-gray-50 py-4 px-4 md:py-8">
      <SettingsHeader 
        businessName={formData.business_name || 'Your Business'}
        title="Business Information Settings"
        onBack={handleBack}
      />

      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Messages */}
              <AnimatePresence>
                {successMessage && <MessageAlert type="success" message={successMessage} />}
                {errorMessage && <MessageAlert type="error" message={errorMessage} />}
              </AnimatePresence>

              {/* Header */}
              <motion.div variants={itemVariants} className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <Building className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Business Information</h2>
                    <p className="text-gray-600">Manage your business details and contact information</p>
                  </div>
                </div>
                <button
                  onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                >
                  <BiEdit className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </motion.div>

              {/* Form */}
              <motion.div variants={itemVariants} className="space-y-6">

            {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Storefront Slug
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your storefront slug"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                      <p className="font-medium">{formData.slug || 'No slug name set'}</p>
                    </div>
                  )}
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your business name"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                      <p className="font-medium">{formData.business_name || 'No business name set'}</p>
                    </div>
                  )}
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="A catchy tagline for your business"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                      <p>{formData.tagline || 'No tagline set'}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description
                  </label>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Describe your business..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border min-h-[100px]">
                      <p>{formData.description || 'No description provided'}</p>
                    </div>
                  )}
                </div>

                {/* Contact Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="business@example.com"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                        <p>{formData.email || 'No email provided'}</p>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="+234 xxx xxx xxxx"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                        <p>{formData.phone || 'No phone provided'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Business Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your business address..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                      <p>{formData.address || 'No address provided'}</p>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end pt-4"
                  >
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <BiSave className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessInfoSettings;