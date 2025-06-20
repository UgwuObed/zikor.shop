import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { BiEdit, BiSave } from 'react-icons/bi';
import { Clock } from 'lucide-react';
import SettingsHeader from './header';
import MessageAlert from './alert';
// import apiClient from '../../apiClient';

// Mock API client - replace with your actual apiClient import
interface BusinessHour {
    open: string;
    close: string;
    closed: boolean;
}

interface Storefront {
    business_name: string;
    business_hours: Record<string, BusinessHour>;
}

interface ApiResponse<T> {
    data: {
        success: boolean;
        storefront?: Storefront;
    } & T;
}

interface ApiClient {
    patch: (
        url: string,
        data: any,
        headers?: any
    ) => Promise<ApiResponse<{}>>;
    get: (
        url: string,
        headers?: any
    ) => Promise<ApiResponse<{}>>;
}

const apiClient: ApiClient = {
    patch: (url, data, headers) => 
        new Promise<ApiResponse<{}>>(resolve => 
            setTimeout(() => resolve({ data: { success: true } }), 1000)
        ),
    get: (url, headers) => 
        new Promise<ApiResponse<{}>>(resolve => 
            setTimeout(() => resolve({ 
                data: { 
                    success: true, 
                    storefront: {
                        business_name: 'TechStore Pro',
                        business_hours: {
                            monday: { open: '09:00', close: '18:00', closed: false },
                            tuesday: { open: '09:00', close: '18:00', closed: false },
                            wednesday: { open: '09:00', close: '18:00', closed: false },
                            thursday: { open: '09:00', close: '18:00', closed: false },
                            friday: { open: '09:00', close: '18:00', closed: false },
                            saturday: { open: '10:00', close: '16:00', closed: false },
                            sunday: { open: '12:00', close: '15:00', closed: true }
                        }
                    }
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

const BusinessHoursSettings = () => {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('Your Business');
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
    fetchBusinessHours();
  }, []);

  const fetchBusinessHours = async () => {
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

      if (response.data.success && response.data.storefront) {
        const { storefront } = response.data;
        setBusinessName(storefront.business_name || 'Your Business');
        
        if (storefront.business_hours) {
          setBusinessHours({
            monday: storefront.business_hours.monday,
            tuesday: storefront.business_hours.tuesday,
            wednesday: storefront.business_hours.wednesday,
            thursday: storefront.business_hours.thursday,
            friday: storefront.business_hours.friday,
            saturday: storefront.business_hours.saturday,
            sunday: storefront.business_hours.sunday
          });
        }
      }
    } catch (error) {
      console.error('Error fetching business hours:', error);
      setErrorMessage('Failed to load business hours');
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

    // Validate business hours
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
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiClient.patch('/storefront', {
        business_hours: businessHours
      }, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.data.success) {
        setSuccessMessage('Business hours updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating business hours:', error);
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
        setErrorMessage('Failed to update business hours');
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
    fetchBusinessHours();
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
                  {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
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
        title="Business Hours Settings"
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
                    <Clock className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Business Hours</h2>
                    <p className="text-gray-600">Set your store's operating hours for each day</p>
                  </div>
                </div>
                <button
                  onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                >
                  <BiEdit className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </motion.div>

              {/* Business Hours Grid */}
              <motion.div variants={itemVariants} className="space-y-3">
                {daysOfWeek.map(({ key, label }) => (
                  <div key={key} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-200 rounded-lg gap-4">
                    <div className="flex items-center min-w-[100px]">
                      <span className="font-medium text-gray-800 text-lg">{label}</span>
                    </div>
                    
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={businessHours[key].closed}
                            onChange={(e) => updateHours(key, 'closed', e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-600 font-medium">Closed</span>
                        </label>
                        
                        {!businessHours[key].closed && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={businessHours[key].open}
                                onChange={(e) => updateHours(key, 'open', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              />
                              <span className="text-gray-500 text-sm">to</span>
                              <input
                                type="time"
                                value={businessHours[key].close}
                                onChange={(e) => updateHours(key, 'close', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        {businessHours[key].closed ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                            Closed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
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
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <h3 className="font-medium text-blue-800 mb-3">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={setStandardHours}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Set Standard Hours (9-5 weekdays)
                    </button>
                    <button
                      onClick={setAllDaysOpen}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Open All Days (9-6)
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Use these presets to quickly configure common business hour patterns, then customize as needed.
                  </p>
                </motion.div>
              )}

              {/* Save Button */}
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end pt-4 border-t border-gray-200"
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

export default BusinessHoursSettings;