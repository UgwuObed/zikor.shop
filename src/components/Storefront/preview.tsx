import React from 'react';
import { motion } from 'framer-motion';
import { 
  BiArrowToLeft, 
  BiTime, 
  BiMap, 
  BiPhone, 
  BiEnvelope, 
  BiLink, 
  BiLogoFacebook, 
  BiLogoInstagram, 
  BiLogoTwitter,
  BiCheckCircle,
  BiXCircle
} from 'react-icons/bi';

interface BusinessHoursDay {
  open: string;
  close: string;
  closed: boolean;
}

interface PreviewStepProps {
  formData: {
    business_name: string;
    slug: string;
    category: string;
    logoPreview: string | null;
    bannerPreview: string | null;
    tagline: string;
    description: string;
    email: string;
    phone: string;
    social_links: {
      facebook: string;
      instagram: string;
      twitter: string;
      website: string;
    };
    color_theme: string;
    business_hours: Record<string, BusinessHoursDay>;
    address: string;
    bank_details: {
      bank_name: string;
      account_name: string;
      account_number: string;
    };
  };
  prevStep: () => void;
  handleSubmit: () => void;
  loading: boolean;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  formData,
  prevStep,
  handleSubmit,
  loading
}) => {
  
  const theme = {
    primary: 'bg-purple-600',
    secondary: 'bg-purple-700',
    accent: 'bg-purple-100',
    text: 'text-purple-600',
    hover: 'hover:text-purple-800',
    button: 'bg-purple-600 hover:bg-purple-700',
    light: 'bg-purple-50'
  };

  const formatBusinessHours = () => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return daysOfWeek.map(day => {
      const dayData = formData.business_hours[day];
      if (!dayData) return { day, hours: 'Not specified', closed: false };
      
      if (dayData.closed) {
        return { day, hours: 'Closed', closed: true };
      } else if (dayData.open && dayData.close) {
        return { 
          day, 
          hours: `${formatTime(dayData.open)} - ${formatTime(dayData.close)}`, 
          closed: false 
        };
      }
      return { day, hours: 'Not specified', closed: false };
    });
  };
  
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const isBusinessOpen = () => {
    const currentDay = getCurrentDay();
    const dayData = formData.business_hours[currentDay];
    if (!dayData || dayData.closed) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMinute] = dayData.open.split(':').map(Number);
    const [closeHour, closeMinute] = dayData.close.split(':').map(Number);
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Preview Header */}
      <div className="bg-purple-600 px-4 py-3 text-white flex justify-between items-center">
        <h1 className="text-lg font-medium">Store Preview</h1>
        <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
          Preview Mode
        </div>
      </div>

      {/* Store Banner */}
      <div className="relative h-40 sm:h-48 w-full">
        {formData.bannerPreview ? (
          <img 
            src={formData.bannerPreview} 
            alt="Store banner" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center">
            <span className="text-white text-xl font-medium">{formData.business_name || 'Your Business'}</span>
          </div>
        )}
      </div>

      {/* Store Info */}
      <div className="px-4 sm:px-6 pt-4 pb-2 -mt-12 relative z-10">
        <div className="flex items-start">
          {formData.logoPreview ? (
            <img 
              src={formData.logoPreview} 
              alt="Store logo" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg bg-white"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg bg-purple-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {formData.business_name ? formData.business_name.charAt(0) : 'B'}
              </span>
            </div>
          )}
          <div className="ml-4 mt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{formData.business_name || 'Your Business'}</h2>
            {formData.tagline && (
              <p className="text-purple-600 font-medium">{formData.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="px-4 sm:hidden border-b sticky top-0 bg-white z-20">
        <div className="flex overflow-x-auto py-2 space-x-4">
          <a href="#" className="whitespace-nowrap text-purple-600 font-medium">Home</a>
          <a href="#" className="whitespace-nowrap text-gray-600">Products</a>
          <a href="#" className="whitespace-nowrap text-gray-600">About</a>
          <a href="#" className="whitespace-nowrap text-gray-600">Contact</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-4">
        {/* Description */}
        {formData.description ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p className="text-gray-600">{formData.description}</p>
          </div>
        ) : (
          <div className="mb-6 space-y-2">
            <h3 className="text-lg font-semibold">About Us</h3>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            <div className="h-4 bg-gray-100 rounded w-4/6"></div>
          </div>
        )}

        {/* Featured Products */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Featured Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <motion.div 
                key={item}
                whileHover={{ y: -3 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
              >
                <div className="h-32 sm:h-40 bg-gray-100 animate-pulse"></div>
                <div className="p-2 sm:p-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="h-5 bg-gray-300 rounded animate-pulse w-1/3 mt-2"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Contact Info */}
          <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
            <h4 className="font-semibold text-lg mb-3 flex items-center">
              <BiMap className="mr-2 text-purple-600" />
              Contact
            </h4>
            <ul className="space-y-3">
              {formData.email && (
                <li className="flex items-start text-gray-700">
                  <BiEnvelope className="mt-0.5 mr-2 text-gray-500" />
                  {formData.email}
                </li>
              )}
              {formData.phone && (
                <li className="flex items-center text-gray-700">
                  <BiPhone className="mr-2 text-gray-500" />
                  {formData.phone}
                </li>
              )}
              {formData.address && (
                <li className="flex items-start text-gray-700">
                  <BiMap className="mt-0.5 mr-2 text-gray-500" />
                  <span>{formData.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Business Hours */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-purple-600 px-4 py-3 text-white flex justify-between items-center">
              <h4 className="font-medium flex items-center">
                <BiTime className="mr-2" />
                Business Hours
              </h4>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${isBusinessOpen() ? 'bg-green-400' : 'bg-red-400'} mr-2`}></div>
                <span className="text-sm">{isBusinessOpen() ? 'Open Now' : 'Closed Now'}</span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {formatBusinessHours().map((item, index) => (
                <div 
                  key={index}
                  className={`flex justify-between items-center p-3 ${getCurrentDay() === item.day ? 'bg-purple-50' : 'bg-white'}`}
                >
                  <div className="flex items-center">
                    {item.closed ? (
                      <BiXCircle className="text-red-500 mr-2" />
                    ) : (
                      <BiCheckCircle className="text-green-500 mr-2" />
                    )}
                    <span className={getCurrentDay() === item.day ? 'font-medium text-purple-600' : 'text-gray-700'}>
                      {item.day}
                    </span>
                  </div>
                  <span className={item.closed ? 'text-red-500' : 'text-gray-600'}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-3 flex items-center">
            <BiLink className="mr-2 text-purple-600" />
            Connect With Us
          </h4>
          <div className="flex flex-wrap gap-3">
            {formData.social_links.facebook && (
              <a 
                href={formData.social_links.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <BiLogoFacebook className="w-5 h-5 mr-2" />
                Facebook
              </a>
            )}
            {formData.social_links.instagram && (
              <a 
                href={formData.social_links.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
              >
                <BiLogoInstagram className="w-5 h-5 mr-2" />
                Instagram
              </a>
            )}
            {formData.social_links.twitter && (
              <a 
                href={formData.social_links.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-500 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <BiLogoTwitter className="w-5 h-5 mr-2" />
                Twitter
              </a>
            )}
            {formData.social_links.website && (
              <a 
                href={formData.social_links.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <BiLink className="w-5 h-5 mr-2" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 px-4 py-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} {formData.business_name || 'Your Business'} | All rights reserved
      </div>

      {/* Action Buttons (Fixed on mobile) */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex justify-between sm:relative sm:bg-transparent sm:border-0 sm:px-6 sm:py-6">
        <button
          type="button"
          onClick={prevStep}
          disabled={loading}
          className="flex items-center px-4 py-2 sm:px-5 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <BiArrowToLeft className="mr-1.5" />
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Complete Setup
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PreviewStep;