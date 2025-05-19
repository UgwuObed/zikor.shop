"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { BiArrowToLeft, BiSearch, BiCheck, BiX, BiLogOut, BiTrash } from 'react-icons/bi';
import { CheckCircle, AlertCircle, Building, ArrowLeft, ChevronDown, Clock } from 'lucide-react';
import apiClient from '../../apiClient';

interface Bank {
  name: string;
  code: string;
  slug: string;
}

interface BankDetails {
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  has_complete_details: boolean;
  is_verified: boolean;
  last_updated: string;
}

const BankDetails = () => {
  const router = useRouter();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [formData, setFormData] = useState({
    bank_name: '',
    bank_code: '',
    account_number: '',
    account_name: '',
  });
  const [verifiedAccountName, setVerifiedAccountName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState('');
  const [businessName, setBusinessName] = useState('Your Business');
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [step, setStep] = useState(1);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBanks();
    fetchBankDetails();
    fetchBusinessInfo();
    
   
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowBankDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showBankDropdown && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showBankDropdown]);

  useEffect(() => {
    const filtered = banks.filter(bank =>
      bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
    );
    setFilteredBanks(filtered.slice(0, 200));
  }, [bankSearchTerm, banks]);

  const fetchBanks = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

    try {
      const response = await apiClient.get('/banks', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setBanks(response.data.banks);
      setFilteredBanks(response.data.banks.slice(0, 100));
    } catch (error) {
      console.error('Error fetching banks:', error);
      setErrorMessage('Failed to fetch banks. Please try again later.');
    }
  };

  const fetchBankDetails = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const response = await apiClient.get('/user/bank-details', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (response.data.success && response.data.bank_details) {
        setBankDetails(response.data.bank_details);
        if (response.data.bank_details.has_complete_details) {
          setFormData({
            bank_name: response.data.bank_details.bank_name || '',
            bank_code: response.data.bank_details.bank_code || '',
            account_number: response.data.bank_details.account_number || '',
            account_name: response.data.bank_details.account_name || '',
          });
          setIsAccountVerified(response.data.bank_details.is_verified);
        }
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
    }
  };

  const fetchBusinessInfo = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const response = await apiClient.get('/business/name', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setBusinessName(response.data.business?.name || 'Your Business');
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/auth/signin');
  };

  const handleBankSelect = (bank: Bank) => {
    setFormData({
      ...formData,
      bank_name: bank.name,
      bank_code: bank.code
    });
    setBankSearchTerm(bank.name);
    setShowBankDropdown(false);
    setIsAccountVerified(false);
    setVerifiedAccountName('');
    

    setTimeout(() => {
      const accountNumInput = document.getElementById('account_number');
      if (accountNumInput) {
        accountNumInput.focus();
      }
    }, 100);
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setFormData({
        ...formData,
        account_number: value
      });
      setIsAccountVerified(false);
      setVerifiedAccountName('');
      setErrorMessage('');
      
      
      if (value.length === 10 && formData.bank_code) {
        verifyAccount();
      }
    }
  };

  const verifyAccount = async () => {
    if (!formData.account_number || !formData.bank_code) {
      setErrorMessage('Please select a bank and enter account number');
      return;
    }

    if (formData.account_number.length !== 10) {
      setErrorMessage('Account number must be 10 digits');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      const response = await apiClient.post('/user/verify', {
        account_number: formData.account_number,
        bank_code: formData.bank_code
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.data.success) {
        setVerifiedAccountName(response.data.account_name);
        setFormData({
          ...formData,
          account_name: response.data.account_name
        });
        setIsAccountVerified(true);
        setSuccessMessage('Account verified successfully!');
    
        setStep(2);
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error verifying account:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Account verification failed');
      } else {
        setErrorMessage('Account verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAccountVerified) {
      setErrorMessage('Please verify your account details first');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await apiClient.patch('/user/bank-details', formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.data.success) {
        setSuccessMessage('Bank details updated successfully!');
        setTimeout(() => {
          router.push('/dashboard/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error updating bank details:', error);
      if (error.response && error.response.data) {
        if (error.response.data.suggested_name) {
          setErrorMessage(`${error.response.data.message}. Did you mean: ${error.response.data.suggested_name}?`);
        } else {
          setErrorMessage(error.response.data.message || 'Failed to update bank details');
        }
      } else {
        setErrorMessage('Failed to update bank details. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBankDetails = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const response = await apiClient.delete('/user/bank-details', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.data.success) {
        setBankDetails(null);
        setFormData({
          bank_name: '',
          bank_code: '',
          account_number: '',
          account_name: '',
        });
        setBankSearchTerm('');
        setIsAccountVerified(false);
        setVerifiedAccountName('');
        setSuccessMessage('Bank details deleted successfully!');
        setIsConfirmingDelete(false);
        
        setStep(1);
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting bank details:', error);
      setErrorMessage('Failed to delete bank details');
      setIsConfirmingDelete(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
  
  const slideVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 12 }
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: { type: "spring", stiffness: 80, damping: 12 }
    }
  };

  const formatAccountNumber = (number: string) => {
    if (!number) return '';
    const parts = [];
    for (let i = 0; i < number.length; i += 3) {
      parts.push(number.substring(i, i + 3));
    }
    return parts.join(' ');
  };
  
  const formatLastUpdated = (dateString: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-gray-50 py-4 px-4 md:py-8">
      {/* Header with Business Name and Logout */}
      <header className="max-w-3xl mx-auto mb-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-3 p-2 rounded-full hover:bg-white text-purple-700 transition-colors duration-200 shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate max-w-[200px] md:max-w-xs">
              {businessName}
            </h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white rounded-full shadow-sm hover:shadow text-gray-700 transition-all duration-200 text-sm md:text-base"
          >
            <BiLogOut className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-5 md:p-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="text-center pb-2">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-purple-700" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Bank Details</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Add your bank account details to receive payments from your customers securely
                </p>
              </motion.div>

              {/* Current Bank Details (if exists) */}
              {bankDetails && bankDetails.has_complete_details && (
                <motion.div variants={itemVariants} className="bg-gray-50 border border-gray-100 rounded-lg p-5 overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-800 text-lg">Current Bank Account</h3>
                        {bankDetails.is_verified && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-xs font-medium text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-3 space-y-1">
                        <p className="flex items-center text-gray-700">
                          <span className="font-medium">Bank:</span>
                          <span className="ml-2">{bankDetails.bank_name}</span>
                        </p>
                        
                        <p className="flex items-center text-gray-700">
                          <span className="font-medium">Account:</span>
                          <span className="ml-2">{formatAccountNumber(bankDetails.account_number)}</span>
                        </p>
                        
                        <p className="flex items-center text-gray-700">
                          <span className="font-medium">Name:</span>
                          <span className="ml-2">{bankDetails.account_name}</span>
                        </p>
                        
                        <p className="flex items-center text-xs text-gray-500 mt-2">
                          <Clock className="w-3 h-3 mr-1" />
                          Last updated: {formatLastUpdated(bankDetails.last_updated)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            bank_name: '',
                            bank_code: '',
                            account_number: '',
                            account_name: '',
                          });
                          setBankSearchTerm('');
                          setIsAccountVerified(false);
                          setVerifiedAccountName('');
                          setStep(1);
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className="text-sm px-3 py-1.5 border border-purple-200 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConfirmingDelete(true)}
                        className="text-sm px-3 py-1.5 border border-red-200 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      >
                        <span className="flex items-center">
                          <BiTrash className="w-4 h-4 mr-1" />
                          <span>Delete</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Delete Confirmation Dialog */}
              <AnimatePresence>
                {isConfirmingDelete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black bg-opacity-50"
                  >
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Delete Bank Details?</h3>
                      <p className="text-gray-600 mb-6">
                        Are you sure you want to delete your bank account details? This cannot be undone.
                      </p>
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => setIsConfirmingDelete(false)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={deleteBankDetails}
                          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add/Update Bank Form */}
              {(!bankDetails || !bankDetails.has_complete_details || step === 1) && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div 
                        key="step1"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-5"
                      >
                        {/* Bank Selection */}
                        <div className="relative" ref={dropdownRef}>
                          <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Select Bank <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Type to search for your bank..."
                              value={bankSearchTerm}
                              onChange={(e) => {
                                setBankSearchTerm(e.target.value);
                                setShowBankDropdown(true);
                              }}
                              onFocus={() => setShowBankDropdown(true)}
                              ref={searchInputRef}
                              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            />
                            <BiSearch className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                            <ChevronDown className={`absolute right-3 top-3.5 w-5 h-5 text-gray-400 transition-transform ${showBankDropdown ? 'rotate-180' : ''}`} />
                          </div>
                          
                          <AnimatePresence>
                            {showBankDropdown && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                              >
                                <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
                                  <div className="text-xs text-gray-500 flex justify-between items-center px-2">
                                    <span>
                                      {filteredBanks.length} {filteredBanks.length === 1 ? 'result' : 'results'}
                                    </span>
                                    {filteredBanks.length > 0 && (
                                      <button 
                                        type="button" 
                                        className="text-purple-600 hover:text-purple-800"
                                        onClick={() => setShowBankDropdown(false)}
                                      >
                                        Close
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {filteredBanks.map((bank) => (
                                  <button
                                    key={bank.code}
                                    type="button"
                                    onClick={() => handleBankSelect(bank)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-purple-50 focus:bg-purple-50 focus:outline-none transition-colors"
                                  >
                                    {bank.name}
                                  </button>
                                ))}
                                {filteredBanks.length === 0 && (
                                  <div className="p-4 text-center text-gray-500">
                                    {bankSearchTerm ? 'No banks found matching your search' : 'Type to search for banks'}
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Account Number */}
                        <div>
                          <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Account Number <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                id="account_number"
                                value={formData.account_number}
                                onChange={handleAccountNumberChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter 10-digit account number"
                                maxLength={10}
                                inputMode="numeric"
                                pattern="[0-9]*"
                              />
                              {formData.account_number && (
                                <span className="absolute right-3 top-3.5 text-xs text-gray-400">
                                  {formData.account_number.length}/10
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={verifyAccount}
                              disabled={isVerifying || formData.account_number.length !== 10 || !formData.bank_code}
                              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center shadow-sm hover:shadow"
                            >
                              {isVerifying ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Verifying...
                                </>
                              ) : (
                                'Verify'
                              )}
                            </button>
                          </div>
                          {formData.account_number && formData.account_number.length < 10 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Please enter all 10 digits of your account number
                            </p>
                          )}
                          {formData.bank_code && formData.account_number.length === 10 && !isAccountVerified && !isVerifying && (
                            <p className="text-xs text-amber-600 mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Click verify to confirm your account details
                            </p>
                          )}
                        </div>

                        {/* Account Name (When Verified) */}
                        <AnimatePresence>
                          {verifiedAccountName && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <label htmlFor="account_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Account Name
                              </label>
                              <div className="flex items-center">
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    id="account_name"
                                    value={verifiedAccountName}
                                    readOnly
                                    className="w-full px-4 py-3 rounded-lg border border-green-300 bg-green-50 text-green-800 font-medium"
                                  />
                                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-600" />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Navigation Buttons */}
                        <div className="pt-4">
                          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                            <button
                              type="button"
                              onClick={() => router.push('/dashboard/dashboard')}
                              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 w-full md:w-auto"
                            >
                              Skip for Now
                            </button>
                            <button
                              type="button"
                              disabled={!isAccountVerified}
                              onClick={() => setStep(2)}
                              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow hover:shadow-md transition-all duration-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center w-full md:w-auto"
                            >
                              Continue
                              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {step === 2 && (
                      <motion.div 
                        key="step2"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                      >
                        {/* Review & Confirm Details */}
                        <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                          <h3 className="font-medium text-purple-800 mb-4">Review Bank Account Details</h3>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bank Name:</span>
                              <span className="font-medium text-gray-800">{formData.bank_name}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account Number:</span>
                              <span className="font-medium text-gray-800">{formatAccountNumber(formData.account_number)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account Name:</span>
                              <span className="font-medium text-gray-800">{verifiedAccountName}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-purple-200 flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <p className="text-sm text-green-700">
                              Account details verified
                            </p>
                          </div>
                        </div>
                        
                        {/* Terms & Privacy Notice */}
                        <div className="text-sm text-gray-600">
                          <p>
                            By saving these details, you confirm this is your bank account and authorize us to send payments to this account.
                          </p>
                        </div>
                        
                        {/* Navigation Buttons */}
                        <div className="pt-4">
                          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 w-full md:w-auto flex items-center justify-center"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                              Back
                            </button>
                            <button
                              type="submit"
                              disabled={!isAccountVerified || isSubmitting}
                              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow hover:shadow-md transition-all duration-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center w-full md:w-auto"
                            >
                              {isSubmitting ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  Save Bank Details
                                  <BiCheck className="w-5 h-5 ml-1" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error Message */}
                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-red-600">{errorMessage}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Success Message */}
                  <AnimatePresence>
                    {successMessage && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg flex items-center"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-green-600">{successMessage}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Help and support footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? Contact our support team</p>
        </div>
      </main>
    </div>
  );
};

export default BankDetails;