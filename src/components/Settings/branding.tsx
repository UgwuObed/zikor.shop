import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { BiUpload, BiSave } from 'react-icons/bi';
import { Palette, Camera, Image } from 'lucide-react';
import SettingsHeader from './header';
import MessageAlert from './alert';
// import apiClient from '../../apiClient';

// Mock API client - replace with your actual apiClient import
interface Storefront {
    business_name: string;
    logo: string;
    banner: string;
    color_theme: string;
}

interface ApiResponse<T> {
    data: {
        success: boolean;
        storefront?: T;
        message?: string;
    };
}

interface ApiClient {
    patch: (
        url: string,
        data: FormData,
        headers: Record<string, any>
    ) => Promise<ApiResponse<null>>;
    get: (
        url: string,
        headers: Record<string, any>
    ) => Promise<ApiResponse<Storefront>>;
}

const apiClient: ApiClient = {
    patch: (
        url: string,
        data: FormData,
        headers: Record<string, any>
    ): Promise<ApiResponse<null>> =>
        new Promise(resolve =>
            setTimeout(() => resolve({ data: { success: true } }), 1000)
        ),
    get: (
        url: string,
        headers: Record<string, any>
    ): Promise<ApiResponse<Storefront>> =>
        new Promise(resolve =>
            setTimeout(
                () =>
                    resolve({
                        data: {
                            success: true,
                            storefront: {
                                business_name: 'TechStore Pro',
                                logo:
                                    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center',
                                banner:
                                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop&crop=center',
                                color_theme: '#7C3AED',
                            },
                        },
                    }),
                1000
            )
        ),
};

// Animation variants
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
    fetchBrandingData();
  }, []);

  const fetchBrandingData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

    try {
      setIsFetching(true);
      const response = await apiClient.get('/storefront', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.data.success && response.data.storefront) {
        const { storefront } = response.data;
        setBusinessName(storefront.business_name || 'Your Business');
        setFormData({
          logo: storefront.logo || '',
          banner: storefront.banner || '',
          color_theme: storefront.color_theme || '#7C3AED'
        });
      }
    } catch (error) {
      console.error('Error fetching branding data:', error);
      setErrorMessage('Failed to load branding settings');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsFetching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/auth/signin');
  };

  const handleBack = () => {
    router.back();
  };

interface LogoUploadEvent extends React.ChangeEvent<HTMLInputElement> {}

const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
    if (file) {
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setErrorMessage('Logo file size must be less than 2MB');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

   
        if (!file.type.startsWith('image/')) {
            setErrorMessage('Please select a valid image file');
            setTimeout(() => setErrorMessage(''), 3000);
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

interface BannerUploadEvent extends React.ChangeEvent<HTMLInputElement> {}

const handleBannerUpload = (event: BannerUploadEvent) => {
    const file: File | undefined = event.target.files?.[0];
    if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('Banner file size must be less than 5MB');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrorMessage('Please select a valid image file');
            setTimeout(() => setErrorMessage(''), 3000);
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

interface HandleColorChange {
    (color: string): void;
}

const handleColorChange: HandleColorChange = (color) => {
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
      // Create FormData for file uploads
      const uploadData = new FormData();
      
      if (logoFile) {
        uploadData.append('logo', logoFile);
      }
      
      if (bannerFile) {
        uploadData.append('banner', bannerFile);
      }
      
      uploadData.append('color_theme', formData.color_theme);

      const response = await apiClient.patch('/storefront', uploadData, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccessMessage('Branding updated successfully!');
        setLogoFile(null);
        setBannerFile(null);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating branding:', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object' &&
        (error as any).response !== null &&
        'data' in (error as any).response &&
        typeof (error as any).response.data === 'object' &&
        (error as any).response.data !== null &&
        'message' in (error as any).response.data
      ) {
        setErrorMessage((error as any).response.data.message);
      } else {
        setErrorMessage('Failed to update branding');
      }
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
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
                </div>
                <div className="space-y-6">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
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
        businessName={businessName}
        title="Visual Branding Settings"
        onBack={handleBack}
      />

      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Header */}
              <motion.div variants={itemVariants} className="flex items-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <Palette className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Visual Branding</h2>
                  <p className="text-gray-600">Customize your storefront's visual appearance</p>
                </div>
              </motion.div>

              {/* Logo Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Store Logo
                </h3>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative group">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                    {formData.logo && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-sm">Change Logo</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <div className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200">
                        <BiUpload className="w-4 h-4" />
                        {formData.logo ? 'Change Logo' : 'Upload Logo'}
                      </div>
                    </label>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>• Recommended: 200x200px square image</p>
                      <p>• Formats: PNG, JPG, or JPEG</p>
                      <p>• Maximum file size: 2MB</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Banner Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Image className="w-5 h-5 mr-2" />
                  Store Banner
                </h3>
                <div className="space-y-4">
                  <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative group">
                    {formData.banner ? (
                      <img src={formData.banner} alt="Banner preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No banner uploaded</p>
                      </div>
                    )}
                    {formData.banner && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white">Change Banner</span>
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
                      <div className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200">
                        <BiUpload className="w-4 h-4" />
                        {formData.banner ? 'Change Banner' : 'Upload Banner'}
                      </div>
                    </label>
                    <div className="text-sm text-gray-500">
                      <p>Recommended: 1200x400px • Max 5MB • PNG/JPG</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Color Theme Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Brand Color Theme</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-lg border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: formData.color_theme }}
                    ></div>
                    <div className="flex-1">
                      <input
                        type="color"
                        value={formData.color_theme}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-20 h-10 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Current color: {formData.color_theme}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Quick Color Presets:</p>
                    <div className="flex gap-2 flex-wrap">
                      {colorPresets.map(color => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                            formData.color_theme === color ? 'border-gray-800 shadow-lg' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Color Theme Usage</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
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
                className="flex justify-end pt-4 border-t border-gray-200"
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

              <MessageAlert type="success" message={successMessage} />
              <MessageAlert type="error" message={errorMessage} />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrandingSettings;