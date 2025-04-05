import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedBusinessHours from './businesshours';

interface BusinessHoursDay {
  open: string;
  close: string;
  closed: boolean;
}

interface BankDetails {
  bank_name: string;
  account_name: string;
  account_number: string;
}

type FormChangeEvent = 
  | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  | { target: { name: string; value: any } };

interface SettingsStepProps {
  formData: {
    business_hours: Record<string, BusinessHoursDay>;
    bank_details: BankDetails;
    [key: string]: any;
  };
  handleChange: (e: FormChangeEvent) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const SettingsStep: React.FC<SettingsStepProps> = ({
  formData,
  handleChange,
  nextStep,
  prevStep
}) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const availableBanks = [
    "Select Bank",
    "Access Bank",
    "Citibank",
    "Ecobank",
    "Fidelity Bank",
    "First Bank",
    "FCMB",
    "GTBank",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Stanbic IBTC",
    "Standard Chartered",
    "Sterling Bank",
    "UBA",
    "Union Bank",
    "Unity Bank",
    "Wema Bank",
    "Zenith Bank"
  ];
  
  const [showBusinessHours, setShowBusinessHours] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  const handleBusinessHoursChange = (day: string, field: keyof BusinessHoursDay, value: string | boolean) => {
    const updatedHours = { ...formData.business_hours };
    
    if (!updatedHours[day]) {
      updatedHours[day] = { open: '', close: '', closed: false };
    }
    
    updatedHours[day][field] = value as never;
    
    if (field === 'closed' && value === true) {
      updatedHours[day].open = '';
      updatedHours[day].close = '';
    }
    
    handleChange({
      target: {
        name: 'business_hours',
        value: updatedHours
      }
    });
  };
  
  const handleBankDetailsChange = (field: keyof BankDetails, value: string) => {
    handleChange({
      target: {
        name: `bank_details.${field}`,
        value
      }
    } as FormChangeEvent);
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="space-y-6 max-w-xl mx-auto px-4 sm:px-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 
        className="text-2xl font-semibold mb-6 text-gray-800"
        variants={itemVariants}
      >
        Store Settings
      </motion.h2>
      
        <motion.div variants={itemVariants}>
  <EnhancedBusinessHours
    businessHours={formData.business_hours || {}}
      onChange={(updatedHours) => {
        handleChange({
          target: {
            name: 'business_hours',
            value: updatedHours
          }
        });
      }}
    />
  </motion.div>

      
      {/* Bank Details */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-5 border border-gray-100"
        variants={itemVariants}
      >
        <div className="flex items-center mb-4">
          <h3 className="text-base font-medium text-gray-800">Bank Details</h3>
          <div className="relative ml-2">
            <button
              type="button"
              onClick={() => setActiveTooltip(activeTooltip === 'bank' ? null : 'bank')} 
              className="text-gray-400 hover:text-gray-600"
              aria-label="Show tip"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-1.5 2.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm1.5 2.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" />
              </svg>
            </button>
            {activeTooltip === 'bank' && (
              <motion.div 
                className="absolute z-10 w-64 p-3 text-sm bg-gray-800 text-white rounded shadow-lg mt-2 -left-28"
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
              >
                Provide your bank account details where customers will make payments. Ensure the information is accurate to avoid payment issues.
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 bg-gray-800"></div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name
            </label>
            <select
              id="bankName"
              value={formData.bank_details?.bank_name || ''}
              onChange={(e) => handleBankDetailsChange('bank_name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            >
              {availableBanks.map(bank => (
                <option key={bank} value={bank === "Select Bank" ? "" : bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
              Account Name
            </label>
            <input
              type="text"
              id="accountName"
              value={formData.bank_details?.account_name || ''}
              onChange={(e) => handleBankDetailsChange('account_name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter account holder name"
            />
          </div>
          
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              value={formData.bank_details?.account_number || ''}
              onChange={(e) => handleBankDetailsChange('account_number', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter account number"
              maxLength={10}
              pattern="[0-9]*"
            />
            <p className="text-xs text-gray-500 mt-1">Account number should be 10 digits</p>
          </div>
        </div>
      </motion.div>
      
      {/* Navigation Buttons */}
      <motion.div 
        className="flex justify-between pt-4"
        variants={itemVariants}
      >
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-4 py-2 rounded-md text-white bg-purple-700 hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          style={{ backgroundColor: '#8000bb' }}
        >
          Next: Preview
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SettingsStep;