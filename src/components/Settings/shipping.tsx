import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { BiEdit, BiSave, BiPlus, BiTrash } from 'react-icons/bi';
import { Truck } from 'lucide-react';
import SettingsHeader from './header';
import MessageAlert from './alert';
// import apiClient from '../../apiClient';


interface ShippingFee {
    id: number;
    name: string;
    state: string;
    baseFee: number;
    additionalFee: number;
}

interface StorefrontResponse {
    success: boolean;
    storefront?: {
        business_name: string;
    };
    shipping_fees?: ShippingFee[];
}

interface ApiClient {
    patch: (
        url: string,
        data: any,
        headers?: any
    ) => Promise<{ data: { success: boolean } }>;
    get: (
        url: string,
        headers?: any
    ) => Promise<{ data: StorefrontResponse }>;
}

const apiClient: ApiClient = {
    patch: (url, data, headers) =>
        new Promise(resolve =>
            setTimeout(() => resolve({ data: { success: true } }), 1000)
        ),
    get: (url, headers) =>
        new Promise(resolve =>
            setTimeout(() => resolve({
                data: {
                    success: true,
                    storefront: { business_name: 'TechStore Pro' },
                    shipping_fees: [
                        { id: 1, name: 'Lagos Mainland', state: 'Lagos', baseFee: 1500, additionalFee: 500 },
                        { id: 2, name: 'Lagos Island', state: 'Lagos', baseFee: 2000, additionalFee: 700 },
                        { id: 3, name: 'Abuja FCT', state: 'Abuja', baseFee: 2500, additionalFee: 800 }
                    ]
                }
            }), 1000)
        )
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

const ShippingFeesSettings = () => {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('Your Business');
  const [shippingFees, setShippingFees] = useState<ShippingFee[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Abuja'
  ];

  useEffect(() => {
    fetchShippingData();
  }, []);

  const fetchShippingData = async () => {
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

      if (response.data.success) {
        setBusinessName(response.data.storefront?.business_name || 'Your Business');
        setShippingFees(response.data.shipping_fees || []);
      }
    } catch (error) {
      console.error('Error fetching shipping data:', error);
      setErrorMessage('Failed to load shipping fees');
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

  const addShippingFee = () => {
    const newFee = {
      id: Date.now(),
      name: '',
      state: '',
      baseFee: 0,
      additionalFee: 0
    };
    setShippingFees([...shippingFees, newFee]);
  };

  const removeShippingFee = (id: number) => {
    setShippingFees(shippingFees.filter(fee => fee.id !== id));
  };

  const updateShippingFee = (id: number, field: string, value: string | number) => {
    setShippingFees(shippingFees.map(fee => 
      fee.id === id ? { ...fee, [field]: value } : fee
    ));
  };

  const handleSave = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }


    const invalidFees = shippingFees.filter(fee => 
      !fee.name.trim() || !fee.state || fee.baseFee < 0 || fee.additionalFee < 0
    );

    if (invalidFees.length > 0) {
      setErrorMessage('Please fill in all required fields for shipping fees');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiClient.patch('/shipping/update', {
        shipping_fees: shippingFees
      }, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.data.success) {
        setSuccessMessage('Shipping fees updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating shipping fees:', error);
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
        setErrorMessage('Failed to update shipping fees');
      }
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage('');
    // Reset to original data
    fetchShippingData();
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
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(j => (
                          <div key={j}>
                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="h-10 bg-gray-200 rounded w-full"></div>
                          </div>
                        ))}
                      </div>
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
        businessName={businessName}
        title="Shipping Fees Settings"
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
              <motion.div variants={itemVariants} className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <Truck className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Shipping Fees</h2>
                    <p className="text-gray-600">Configure delivery fees for different locations</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing && (
                    <button
                      onClick={addShippingFee}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <BiPlus className="w-4 h-4" />
                      Add Location
                    </button>
                  )}
                  <button
                    onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <BiEdit className="w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </motion.div>

              {/* Shipping Fees List */}
              <motion.div variants={itemVariants} className="space-y-4">
                {shippingFees.map((fee) => (
                  <div key={fee.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      {/* Location Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location Name *
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={fee.name}
                            onChange={(e) => updateShippingFee(fee.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., Lagos Mainland"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg border">
                            <p className="font-medium">{fee.name}</p>
                          </div>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        {isEditing ? (
                          <select
                            value={fee.state}
                            onChange={(e) => updateShippingFee(fee.id, 'state', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Select State</option>
                            {nigerianStates.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg border">
                            <p>{fee.state}</p>
                          </div>
                        )}
                      </div>

                      {/* Base Fee */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Base Fee (₦) *
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={fee.baseFee}
                            onChange={(e) => updateShippingFee(fee.id, 'baseFee', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            min="0"
                            placeholder="0"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg border">
                            <p className="font-medium">₦{fee.baseFee.toLocaleString()}</p>
                          </div>
                        )}
                      </div>

                      {/* Additional Fee */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Fee (₦) *
                        </label>
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <input
                                type="number"
                                value={fee.additionalFee}
                                onChange={(e) => updateShippingFee(fee.id, 'additionalFee', parseInt(e.target.value) || 0)}
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                min="0"
                                placeholder="0"
                              />
                              <button
                                onClick={() => removeShippingFee(fee.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Remove location"
                              >
                                <BiTrash className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="px-3 py-2 bg-gray-50 rounded-lg border flex-1">
                              <p className="font-medium">₦{fee.additionalFee.toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {shippingFees.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Truck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No shipping locations configured</h3>
                    <p className="text-gray-600 mb-6">Add shipping locations to configure delivery fees for your customers</p>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        addShippingFee();
                      }}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                    >
                      Add Your First Location
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Info Box */}
              {isEditing && shippingFees.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <h3 className="font-medium text-blue-800 mb-2">Shipping Fee Information</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>Base Fee:</strong> Charged for the first item in an order</li>
                    <li>• <strong>Additional Fee:</strong> Charged for each additional item in the same order</li>
                    <li>• All fields are required when adding a shipping location</li>
                  </ul>
                </motion.div>
              )}

              {/* Save Button */}
              {isEditing && shippingFees.length > 0 && (
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

              <MessageAlert type="success" message={successMessage} />
              <MessageAlert type="error" message={errorMessage} />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShippingFeesSettings;