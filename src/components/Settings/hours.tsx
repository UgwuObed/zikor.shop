import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { BiEdit, BiSave } from 'react-icons/bi';
import { Clock } from 'lucide-react';
import SettingsHeader from './header';
import MessageAlert from './alert';
import apiClient from '../../apiClient';

interface BusinessHour {
    open: string;
    close: string;
    closed: boolean;
}

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

const BusinessHoursSettings = () => {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('Your Business');
  const [storefrontSlug, setStorefrontSlug] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [businessHours, setBusinessHours] = useState({
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '12:00', close: '15:00', closed: true }
  });

  type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

  const daysOfWeek: { key: DayKey; label: string }[] = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    fetchStorefrontData();
  }, []);

  const fetchStorefrontData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await apiClient.get('/storefront', {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.data.has_storefront && response.data.storefront) {
        setStorefrontSlug(response.data.storefront.slug);
        await fetchStorefrontProfile(response.data.storefront.slug);
      } else {
        setErrorMessage(response.data.message || 'Failed to load storefront data');
        setIsFetching(false);
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setErrorMessage('Request timed out. Please check your connection and try again.');
      } else if (error?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        router.push('/auth/signin');
      } else if (error?.response) {
        setErrorMessage(error.response.data.message || 'Failed to load storefront data');
      } else if (error?.request) {
        setErrorMessage('Network error. Please check your connection.');
      } else {
        setErrorMessage('An unexpected error occurred');
      }
      
      setIsFetching(false);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const fetchStorefrontProfile = async (slug: string) => {
    try {
      setIsFetching(true);
      setErrorMessage('');
      
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await apiClient.get(`/storefront/${slug}/profile`, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        const businessName = response.data.storefront?.business_name || 'Your Business';
        const businessHours = response.data.storefront?.business_hours;
        
        setBusinessName(businessName);
        
        if (businessHours) {
          setBusinessHours({
            monday: businessHours.monday || { open: '09:00', close: '18:00', closed: false },
            tuesday: businessHours.tuesday || { open: '09:00', close: '18:00', closed: false },
            wednesday: businessHours.wednesday || { open: '09:00', close: '18:00', closed: false },
            thursday: businessHours.thursday || { open: '09:00', close: '18:00', closed: false },
            friday: businessHours.friday || { open: '09:00', close: '18:00', closed: false },
            saturday: businessHours.saturday || { open: '10:00', close: '16:00', closed: false },
            sunday: businessHours.sunday || { open: '12:00', close: '15:00', closed: true }
          });
        }
      } else {
        setErrorMessage(response.data.message || 'Failed to load storefront profile');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Failed to load storefront profile');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsFetching(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  interface UpdateHoursFn {
      (day: keyof typeof businessHours, field: keyof BusinessHour, value: string | boolean): void;
  }

  const updateHours: UpdateHoursFn = (day, field, value) => {
      setBusinessHours(prev => ({
          ...prev,
          [day]: { ...prev[day], [field]: value }
      }));
  };

  const setStandardHours = () => {
    const standardHours = { open: '09:00', close: '17:00', closed: false };
    const weekend = { open: '10:00', close: '16:00', closed: false };
    setBusinessHours({
      monday: standardHours,
      tuesday: standardHours,
      wednesday: standardHours,
      thursday: standardHours,
      friday: standardHours,
      saturday: weekend,
      sunday: { ...weekend, closed: true }
    });
  };

  const setAllDaysOpen = () => {
    const allOpen = { open: '09:00', close: '18:00', closed: false };
    setBusinessHours(Object.keys(businessHours).reduce((acc, day) => ({
      ...acc, [day]: allOpen
    }), {} as typeof businessHours));
  };

  const handleSave = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

 
    const invalidDays = Object.entries(businessHours).filter(([day, hours]) => {
      if (!hours.closed && (!hours.open || !hours.close)) {
        return true;
      }
      if (!hours.closed && hours.open >= hours.close) {
        return true;
      }
      return false;
    });

    if (invalidDays.length > 0) {
      setErrorMessage('Please ensure all open days have valid opening and closing times');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiClient.put('/storefront', {
        business_hours: businessHours
      }, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message || 'Business hours updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error(response.data.message || 'Failed to update business hours');
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        router.push('/auth/signin');
        return;
      }

      if (error?.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.errors) {
          const validationMessages = Object.values(errorData.errors).flat();
          setErrorMessage(validationMessages.join(', '));
        } else {
          setErrorMessage(errorData.message || 'Failed to update business hours');
        }
      } else {
        setErrorMessage(error.message || 'Failed to update business hours');
      }
      
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage('');
    if (storefrontSlug) {
      fetchStorefrontProfile(storefrontSlug);
    }
  };

  interface FormatTimeFn {
      (time: string): string;
  }

  const formatTime: FormatTimeFn = (time) => {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      const hourNum = parseInt(hours, 10);
      const hour12 = hourNum % 12 || 12;
      const ampm = hourNum < 12 ? 'AM' : 'PM';
      return `${hour12}:${minutes} ${ampm}`;
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-4 px-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="animate-pulse space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-slate-200 rounded-full w-12 h-12 mr-4"></div>
                    <div>
                      <div className="h-6 bg-slate-200 rounded w-48 mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded w-20"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="h-4 bg-slate-200 rounded w-20"></div>
                      <div className="h-4 bg-slate-200 rounded w-40"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-4 px-4 md:py-8">
      <SettingsHeader 
        businessName={businessName}
        title="Business Hours Settings"
        onBack={handleBack}
      />

      <main className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
          <div className="p-6 md:p-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Messages */}
              <MessageAlert type="success" message={successMessage} />
              <MessageAlert type="error" message={errorMessage} />

              {/* Header */}
              <motion.div variants={itemVariants} className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl w-12 h-12 flex items-center justify-center mr-4 shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Business Hours</h2>
                    <p className="text-slate-600">Set your store's operating hours for each day</p>
                  </div>
                </div>
                <button
                  onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  <BiEdit className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </motion.div>

              {/* Business Hours Grid */}
              <motion.div variants={itemVariants} className="space-y-3">
                {daysOfWeek.map(({ key, label }) => (
                  <div key={key} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl gap-4 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center min-w-[100px]">
                      <span className="font-semibold text-slate-800 text-lg">{label}</span>
                    </div>
                    
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={businessHours[key].closed}
                            onChange={(e) => updateHours(key, 'closed', e.target.checked)}
                            className="mr-2 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-slate-600 font-medium">Closed</span>
                        </label>
                        
                        {!businessHours[key].closed && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={businessHours[key].open}
                                onChange={(e) => updateHours(key, 'open', e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white/90 backdrop-blur-sm hover:border-slate-400 transition-all duration-200"
                              />
                              <span className="text-slate-500 text-sm font-medium">to</span>
                              <input
                                type="time"
                                value={businessHours[key].close}
                                onChange={(e) => updateHours(key, 'close', e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white/90 backdrop-blur-sm hover:border-slate-400 transition-all duration-200"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-600">
                        {businessHours[key].closed ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                            Closed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                            {formatTime(businessHours[key].open)} - {formatTime(businessHours[key].close)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>

              {/* Quick Actions */}
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6"
                >
                  <h3 className="font-bold text-blue-800 mb-3 text-lg">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={setStandardHours}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      Set Standard Hours (9-5 weekdays)
                    </button>
                    <button
                      onClick={setAllDaysOpen}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      Open All Days (9-6)
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 mt-3 font-medium">
                    Use these presets to quickly configure common business hour patterns, then customize as needed.
                  </p>
                </motion.div>
              )}

              {/* Save Button */}
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end pt-4 border-t border-slate-200"
                >
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessHoursSettings;