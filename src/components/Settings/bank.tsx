import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { BiTrash } from 'react-icons/bi';
import { CheckCircle, CreditCard, Clock } from 'lucide-react';
import SettingsHeader from './header';
import MessageAlert from './alert';
// import apiClient from '../../apiClient';

// Mock API client - replace with your actual apiClient import
interface Storefront {
    business_name: string;
}

interface BankDetails {
    bank_name: string;
    account_number: string;
    account_name: string;
    is_verified: boolean;
    has_complete_details: boolean;
    last_updated: string;
}

interface GetResponse {
    data: {
        success: boolean;
        storefront?: Storefront;
        bank_details?: BankDetails;
    };
}

interface DeleteResponse {
    data: {
        success: boolean;
    };
}

type Headers = {
    headers: Record<string, string>;
};

const apiClient: {
    get: (url: string, headers: Headers) => Promise<GetResponse>;
    delete: (url: string, headers: Headers) => Promise<DeleteResponse>;
} = {
    get: (url, headers) => 
        new Promise<GetResponse>(resolve => 
            setTimeout(() => resolve({ 
                data: { 
                    success: true, 
                    storefront: { business_name: 'TechStore Pro' },
                    bank_details: {
                        bank_name: 'First Bank of Nigeria',
                        account_number: '1234567890',
                        account_name: 'TECHSTORE PRO LIMITED',
                        is_verified: true,
                        has_complete_details: true,
                        last_updated: '2024-01-15T10:30:00Z'
                    }
                }
            }), 1000)
        ),
    delete: (url, headers) => 
        new Promise<DeleteResponse>(resolve => 
            setTimeout(() => resolve({ data: { success: true } }), 1000)
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

const BankDetailsSettings = () => {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('Your Business');
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
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
        
        if (response.data.bank_details && response.data.bank_details.has_complete_details) {
          setBankDetails(response.data.bank_details);
        }
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      setErrorMessage('Failed to load bank details');
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

  const handleEditBank = () => {
    // Navigate to bank details form
    router.push('/settings/bank-details-form');
  };

  const handleDeleteBank = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiClient.delete('/user/bank-details', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.data.success) {
        setBankDetails(null);
        setSuccessMessage('Bank details removed successfully!');
        setIsConfirmingDelete(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting bank details:', error);
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
        setErrorMessage('Failed to remove bank details');
      }
      setIsConfirmingDelete(false);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

interface FormatAccountNumber {
    (number: string): string;
}

const formatAccountNumber: FormatAccountNumber = (number) => {
    if (!number) return '';
    const parts: string[] = [];
    for (let i = 0; i < number.length; i += 3) {
        parts.push(number.substring(i, i + 3));
    }
    return parts.join(' ');
};

interface FormatLastUpdated {
    (dateString: string): string;
}

const formatLastUpdated: FormatLastUpdated = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-gray-50 py-4 px-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="animate-pulse space-y-6">
                <div className="text-center">
                  <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded md:col-span-2"></div>
                    </div>
                  </div>
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
        title="Bank Details Settings"
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
              <motion.div variants={itemVariants} className="text-center pb-2">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-purple-700" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Bank Details</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Manage your bank account details for receiving payments
                </p>
              </motion.div>

              {/* Current Bank Details */}
              {bankDetails ? (
                <motion.div variants={itemVariants} className="bg-gray-50 border border-gray-100 rounded-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <h3 className="font-semibold text-gray-800 text-lg">Current Bank Account</h3>
                        {bankDetails.is_verified && (
                          <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-xs font-medium text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                          <p className="font-medium text-gray-800">{bankDetails.bank_name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Account Number</p>
                          <p className="font-medium text-gray-800 font-mono">
                            {formatAccountNumber(bankDetails.account_number)}
                          </p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500 mb-1">Account Name</p>
                          <p className="font-medium text-gray-800">{bankDetails.account_name}</p>
                        </div>
                      </div>
                      
                      <p className="flex items-center text-xs text-gray-500 mt-4">
                        <Clock className="w-3 h-3 mr-1" />
                        Last updated: {formatLastUpdated(bankDetails.last_updated)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-0 lg:space-y-2">
                      <button
                        onClick={handleEditBank}
                        className="text-sm px-4 py-2 border border-purple-200 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-medium"
                      >
                        Change Bank Details
                      </button>
                      <button
                        onClick={() => setIsConfirmingDelete(true)}
                        disabled={isLoading}
                        className="text-sm px-4 py-2 border border-red-200 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 font-medium"
                      >
                        <span className="flex items-center justify-center">
                          {isLoading ? (
                            <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <BiTrash className="w-4 h-4 mr-1" />
                          )}
                          <span>Remove</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} className="text-center py-12">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Bank Details Added</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Add your bank account details to start receiving payments from your customers
                  </p>
                  <button
                    onClick={handleEditBank}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow"
                  >
                    Add Bank Details
                  </button>
                </motion.div>
              )}

              {/* Information Box */}
              <motion.div variants={itemVariants} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Important Information</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Bank details are required to receive payments from customers</li>
                  <li>• All bank accounts are verified before payments can be processed</li>
                  <li>• You can change your bank details at any time</li>
                  <li>• Contact support if you have issues with bank verification</li>
                </ul>
              </motion.div>

              {/* Delete Confirmation Modal */}
              {isConfirmingDelete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
                  >
                    <div className="text-center">
                      <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <BiTrash className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Bank Details?</h3>
                      <p className="text-gray-600 mb-6">
                        Are you sure you want to remove your bank account details? This action cannot be undone and you won't be able to receive payments until you add new bank details.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
                        <button 
                          onClick={() => setIsConfirmingDelete(false)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleDeleteBank}
                          disabled={isLoading}
                          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 font-medium"
                        >
                          {isLoading ? 'Deleting...' : 'Delete Bank Details'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
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

export default BankDetailsSettings;