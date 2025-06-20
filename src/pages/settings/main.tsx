import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Truck, 
  Palette, 
  Clock, 
  CreditCard,
  ArrowRight,
  Settings as SettingsIcon
} from 'lucide-react';
import SettingsHeader from "../../components/Settings/header";
import "../../app/globals.css";

const settingsItems = [
  {
    id: 'business-info',
    title: 'Business Information',
    description: 'Update your business name, contact details, and description',
    icon: Building,
    href: '/settings/business',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'shipping-fees',
    title: 'Shipping Fees',
    description: 'Configure delivery fees for different locations',
    icon: Truck,
    href: '/settings/shipping',
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 'branding',
    title: 'Visual Branding',
    description: 'Upload logo, banner, and set your brand colors',
    icon: Palette,
    href: '/settings/branding',
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'business-hours',
    title: 'Business Hours',
    description: 'Set your store operating hours for each day',
    icon: Clock,
    href: '/settings/hours',
    color: 'bg-orange-100 text-orange-700'
  },
  {
    id: 'bank-details',
    title: 'Bank Details',
    description: 'Manage bank account for receiving payments',
    icon: CreditCard,
    href: '/settings/bank',
    color: 'bg-pink-100 text-pink-700'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
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

export default function SettingsIndexPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('Your Business');

  useEffect(() => {
  
    const fetchBusinessName = async () => {
      try {
       
        setBusinessName('TechStore Pro'); 
      } catch (error) {
        console.error('Error fetching business name:', error);
      }
    };

    fetchBusinessName();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/auth/signin');
  };

  const handleBack = () => {
    router.push('/dashboard/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-gray-50 py-4 px-4 md:py-8">
      <SettingsHeader 
        businessName={businessName}
        title="Settings & Configuration"
        onBack={handleBack}
        onLogout={handleLogout}
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
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center pb-6">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <SettingsIcon className="w-8 h-8 text-purple-700" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Storefront Settings
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Customize and configure your online store to match your business needs
                </p>
              </motion.div>

              {/* Settings Grid */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {settingsItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => router.push(item.href)}
                      className="group p-6 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200 text-left"
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className={`rounded-lg w-10 h-10 flex items-center justify-center ${item.color} mr-3`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {item.description}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Help Section */}
              <motion.div 
                variants={itemVariants}
                className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8"
              >
                <h3 className="font-semibold text-blue-800 mb-3">Need Help?</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Having trouble configuring your settings? Our support team is here to help you get your storefront set up perfectly.
                </p>
                <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Support
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}