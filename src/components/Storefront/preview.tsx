import React from 'react';

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
    bankDetails: {
      bank_name: '',
      account_name: '',
      account_number: ''
    },
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
 
  const formatBusinessHours = () => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours: string[] = [];
    
    daysOfWeek.forEach(day => {
      const dayData = formData.business_hours[day];
      if (!dayData) return;
      
      if (dayData.closed) {
        hours.push(`${day}: Closed`);
      } else if (dayData.open && dayData.close) {
        hours.push(`${day}: ${formatTime(dayData.open)} - ${formatTime(dayData.close)}`);
      }
    });
    
    return hours.length > 0 ? hours : ['Not specified'];
  };
  
  const formatTime = (time: string) => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };
  


  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Preview Your Storefront</h2>
      
      <div className="border rounded-lg overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-40 bg-gray-200 relative">
          {formData.bannerPreview ? (
            <img 
              src={formData.bannerPreview} 
              alt="Store banner" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-lg font-medium">{formData.business_name}</span>
            </div>
          )}
        </div>
        
        {/* Store Info */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            {formData.logoPreview && (
              <img 
                src={formData.logoPreview} 
                alt="Store logo" 
                className="w-16 h-16 rounded-full border-2 border-white shadow-md mr-4 -mt-12"
              />
            )}
            <div>
              <h3 className="text-xl font-bold">{formData.business_name}</h3>
              {formData.tagline && (
                <p className="text-gray-600">{formData.tagline}</p>
              )}
            </div>
          </div>
          
          {/* Description */}
          {formData.description && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">About Us</h4>
              <p className="text-gray-700">{formData.description}</p>
            </div>
          )}
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div>
              <h4 className="font-medium mb-2">Contact Information</h4>
              <ul className="space-y-1">
                {formData.email && <li className="text-gray-700">Email: {formData.email}</li>}
                {formData.phone && <li className="text-gray-700">Phone: {formData.phone}</li>}
                {formData.address && <li className="text-gray-700">Address: {formData.address}</li>}
              </ul>
            </div>
            
            {/* Business Hours */}
            <div>
              <h4 className="font-medium mb-2">Business Hours</h4>
              <ul className="space-y-1">
                {formatBusinessHours().map((hour, index) => (
                  <li key={index} className="text-gray-700">{hour}</li>
                ))}
              </ul>
            </div>
            
            
            {/* Social Links */}
            <div>
              <h4 className="font-medium mb-2">Connect With Us</h4>
              <div className="flex space-x-4">
                {formData.social_links.facebook && (
                  <a href={formData.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    Facebook
                  </a>
                )}
                {formData.social_links.instagram && (
                  <a href={formData.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                    Instagram
                  </a>
                )}
                {formData.social_links.twitter && (
                  <a href={formData.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                    Twitter
                  </a>
                )}
                {formData.social_links.website && (
                  <a href={formData.social_links.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Complete Setup'
          )}
        </button>
      </div>
    </div>
  );
};

export default PreviewStep;