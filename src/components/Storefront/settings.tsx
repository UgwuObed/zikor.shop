import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedBusinessHours from './businesshours';
import ShippingFees from './shipping';

interface BusinessHoursDay {
  open: string;
  close: string;
  closed: boolean;
}

interface ShippingLocation {
  name: string;
  state: string;
  baseFee: number;
  additionalFee: number;
}



type FormChangeEvent = 
  | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  | { target: { name: string; value: any } };

interface SettingsStepProps {
  formData: {
    business_hours: Record<string, BusinessHoursDay>;
    shipping_fees?: ShippingLocation[];
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


      {/* Shipping Fees Component */}
      <motion.div variants={itemVariants}>
        <ShippingFees
          shippingFees={formData.shipping_fees || []}
          onChange={(updatedFees) => {
            handleChange({
              target: {
                name: 'shipping_fees',
                value: updatedFees
              }
            });
          }}
        />
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