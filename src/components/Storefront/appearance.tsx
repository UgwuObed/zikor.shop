import React from 'react';
import { motion } from 'framer-motion';
import { BiImage, BiPalette, BiEdit, BiArrowToLeft, BiCheckCircle, BiImageAdd, BiX } from 'react-icons/bi';

interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
}

interface AppearanceStepProps {
  formData: {
    banner: File | null;
    bannerPreview: string | null;
    color_theme: string;
    description: string;
    [key: string]: any;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const AppearanceStep: React.FC<AppearanceStepProps> = ({
  formData,
  handleChange,
  handleFileChange,
  nextStep,
  prevStep
}) => {
  const colorThemes: ColorTheme[] = [
    { id: 'default', name: 'Default', primary: '#8000bb', secondary: '#a266cc' },
    { id: 'emerald', name: 'Emerald', primary: '#10B981', secondary: '#047857' },
    { id: 'amber', name: 'Amber', primary: '#F59E0B', secondary: '#B45309' },
    { id: 'rose', name: 'Rose', primary: '#F43F5E', secondary: '#BE123C' },
    { id: 'violet', name: 'Violet', primary: '#8B5CF6', secondary: '#6D28D9' },
    { id: 'slate', name: 'Slate', primary: '#64748B', secondary: '#334155' },
  ];

  const handleRemoveBanner = () => {
    handleChange({
      target: { name: 'banner', value: null }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    
    handleChange({
      target: { name: 'bannerPreview', value: null }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const handleThemeSelect = (themeId: string) => {
    handleChange({
      target: { name: 'color_theme', value: themeId }
    });
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
            Customize Your Store's Look
          </motion.h2>

          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="space-y-5"
          >
            {/* Banner Upload */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiImage className="w-5 h-5 mr-1 text-purple-600" />
                Banner/Cover Image
              </label>
              <div className="mt-2">
                {formData.bannerPreview ? (
                  <div className="relative group">
                    <img 
                      src={formData.bannerPreview} 
                      alt="Banner preview" 
                      className="w-full h-48 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveBanner}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors duration-200"
                    >
                      <BiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors duration-200">
                    <input 
                      type="file" 
                      name="banner" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                    <BiImageAdd className="w-10 h-10 text-purple-400" />
                    <span className="mt-2 text-sm text-center text-gray-500">Upload Banner Image</span>
                  </label>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">Recommended size: 1200x300 pixels. Max 2MB.</p>
            </motion.div>
            
            {/* Color Theme Selection */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiPalette className="w-5 h-5 mr-1 text-purple-600" />
                Color Theme
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {colorThemes.map(theme => (
                  <motion.div
                    key={theme.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      onClick={() => handleThemeSelect(theme.id)}
                      className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.color_theme === theme.id 
                          ? 'border-purple-500 ring-2 ring-purple-200' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-full h-10 rounded-t-md" style={{ backgroundColor: theme.primary }}></div>
                        <div className="w-full h-3 rounded-b-md" style={{ backgroundColor: theme.secondary }}></div>
                        <div className="flex items-center mt-2">
                          <span className="text-sm font-medium text-gray-700">{theme.name}</span>
                          {formData.color_theme === theme.id && (
                            <BiCheckCircle className="ml-1 text-green-500 w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Store Description */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiEdit className="w-5 h-5 mr-1 text-purple-600" />
                Store Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Tell customers about your business, your products, and what makes you special..."
              ></textarea>
            </motion.div>
            
            {/* Navigation Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row md:justify-between gap-3 pt-4"
            >
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <BiArrowToLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Next: Contact Info
              </button>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
      
      {/* Info card in desktop view */}
      <div className="hidden md:block p-6 bg-purple-50 border-t border-purple-100">
        <h3 className="text-sm font-medium text-purple-700 mb-2">Design Tips:</h3>
        <ul className="space-y-2">
          <li className="text-sm text-purple-600 flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Choose a banner image that represents your brand and products
          </li>
          <li className="text-sm text-purple-600 flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Select a color theme that matches your brand identity
          </li>
          <li className="text-sm text-purple-600 flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Your description should highlight what makes your store unique
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AppearanceStep;