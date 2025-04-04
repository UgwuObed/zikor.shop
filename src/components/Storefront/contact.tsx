import React from 'react';
import { motion } from 'framer-motion';
import { BiMessageDetail, BiPhone, BiMap, BiLink, BiArrowToLeft, BiLogoFacebook, BiLogoInstagram, BiLogoTwitter } from 'react-icons/bi';

interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  website: string;
}

interface ContactInfoStepProps {
  formData: {
    email: string;
    phone: string;
    address: string;
    social_links: SocialLinks;
    [key: string]: any;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
  formData,
  handleChange,
  nextStep,
  prevStep
}) => {
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
            Contact Information
          </motion.h2>

          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="space-y-5"
          >
            {/* Email */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiMessageDetail className="w-5 h-5 mr-1 text-purple-600" />
                Contact Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="contact@yourbusiness.com"
              />
            </motion.div>
            
            {/* Phone */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiPhone className="w-5 h-5 mr-1 text-purple-600" />
                Contact Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="+2349067890124"
              />
            </motion.div>
            
            {/* Address */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiMap className="w-5 h-5 mr-1 text-purple-600" />
                Business Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Your physical business location (if applicable)"
              ></textarea>
            </motion.div>
            
            {/* Social Media Links */}
            <motion.div variants={itemVariants} className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BiLink className="w-5 h-5 mr-1 text-purple-600" />
                Social Media & Website Links
              </label>
              
              {/* Facebook */}
              <div className="mb-3">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-4 py-3 rounded-l-lg border border-r-0 border-purple-300 bg-purple-50 text-purple-600">
                    <BiLogoFacebook className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name="social_links.facebook"
                    value={formData.social_links.facebook}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-r-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="https://facebook.com/yourbusiness"
                  />
                </div>
              </div>
              
              {/* Instagram */}
              <div className="mb-3">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-4 py-3 rounded-l-lg border border-r-0 border-purple-300 bg-purple-50 text-purple-600">
                    <BiLogoInstagram className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name="social_links.instagram"
                    value={formData.social_links.instagram}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-r-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="https://instagram.com/yourbusiness"
                  />
                </div>
              </div>
              
              {/* Twitter */}
              <div className="mb-3">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-4 py-3 rounded-l-lg border border-r-0 border-purple-300 bg-purple-50 text-purple-600">
                    <BiLogoTwitter className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name="social_links.twitter"
                    value={formData.social_links.twitter}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-r-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="https://twitter.com/yourbusiness"
                  />
                </div>
              </div>
              
              {/* Website */}
              <div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-4 py-3 rounded-l-lg border border-r-0 border-purple-300 bg-purple-50 text-purple-600">
                    <BiLink className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name="social_links.website"
                    value={formData.social_links.website}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-r-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="https://zikor-business.com"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Navigation Buttons */}
            <motion.div variants={itemVariants} className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <BiArrowToLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Next: Settings
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Info card in desktop view */}
      <div className="hidden md:block p-6 bg-purple-50 border-t border-purple-100">
        <h3 className="text-sm font-medium text-purple-700 mb-2">Contact Tips:</h3>
        <ul className="space-y-2">
          <li className="text-sm text-purple-600 flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Use a professional email address that customers can trust
          </li>
          <li className="text-sm text-purple-600 flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Include country code for international customers
          </li>
          <li className="text-sm text-purple-600 flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Social links help customers connect with your brand
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactInfoStep;