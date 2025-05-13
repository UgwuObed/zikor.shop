import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShippingLocation {
  name: string;
  state: string;
  baseFee: number;
  additionalFee: number;
}

interface ShippingFeesProps {
  shippingFees?: ShippingLocation[];
  onChange: (fees: ShippingLocation[]) => void;
}

const nigeriaStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

const lagosLocations = [
  'Lagos Mainland', 'Lagos Island', 'Ikeja', 'Victoria Island', 
  'Lekki', 'Ikorodu', 'Epe', 'Badagry'
];

const ShippingFees: React.FC<ShippingFeesProps> = ({ 
  shippingFees = [], 
  onChange 
}) => {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [showFees, setShowFees] = useState(true);
  const [locationFilter, setLocationFilter] = useState<'all' | 'lagos'>('all');

  const sortedLocations = useMemo(() => {
    const locations = locationFilter === 'lagos' 
      ? lagosLocations.map(loc => ({
          name: loc,
          state: 'Lagos',
          baseFee: 0,
          additionalFee: 0
        }))
      : nigeriaStates.map(state => ({
          name: state,
          state,
          baseFee: 0,
          additionalFee: 0
        }));

    // Merge existing fees with default locations
    return locations.map(loc => {
      const existingFee = shippingFees.find(
        fee => fee.name === loc.name && fee.state === loc.state
      );
      return existingFee ? { ...loc, ...existingFee } : loc;
    });
  }, [shippingFees, locationFilter]);

  const handleLocationClick = (locationName: string) => {
    setActiveLocation(activeLocation === locationName ? null : locationName);
  };

  const updateLocationFee = (locationName: string, field: keyof ShippingLocation, value: number) => {
    const updatedFees = sortedLocations.map(loc => 
      loc.name === locationName 
        ? { ...loc, [field]: value }
        : loc
    );

    onChange(updatedFees);
  };

  const copyFeesToAllLocations = (baseFee: number, additionalFee: number) => {
    const updatedFees = sortedLocations.map(loc => ({
      ...loc,
      baseFee,
      additionalFee
    }));

    onChange(updatedFees);
  };

  return (
    <div className="rounded-lg bg-white shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center">
          <div className="text-purple-700 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z" />
              <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V9.75h-3v-1.875c0-.621.504-1.125 1.125-1.125z" />
              <path d="M16.125 13.5H1.875A1.875 1.875 0 010 11.625V9.75h18v1.875c0 1.035-.84 1.875-1.875 1.875z" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-gray-800">Shipping & Delivery Fees</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowFees(!showFees)}
          className={`flex items-center px-3 py-1 rounded-full text-sm ${showFees ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"} transition-colors`}
        >
          {showFees ? "Hide" : "Show"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 ml-1 transition-transform ${showFees ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 15.79a.75.75 0 01-.02-1.06l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 11-1.08 1.04L10 11.832 6.29 15.77a.75.75 0 01-1.06.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {showFees && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5">
              {/* Location Filter */}
              <div className="mb-6 flex justify-center space-x-4">
                <button
                  onClick={() => setLocationFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    locationFilter === 'all' 
                      ? 'bg-purple-700 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All States
                </button>
                <button
                  onClick={() => setLocationFilter('lagos')}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    locationFilter === 'lagos' 
                      ? 'bg-purple-700 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Lagos Locations
                </button>
              </div>

              {/* Quick Copy Template */}
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Copy Fees</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => copyFeesToAllLocations(1000, 500)}
                    className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                  >
                    Standard (₦1000 + ₦500)
                  </button>
                  <button
                    onClick={() => copyFeesToAllLocations(1500, 750)}
                    className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                  >
                    Premium (₦1500 + ₦750)
                  </button>
                </div>
              </div>

              {/* Locations Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-6">
                {sortedLocations.map((location) => {
                  const isActive = activeLocation === location.name;
                  return (
                    <button
                      key={location.name}
                      onClick={() => handleLocationClick(location.name)}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-purple-700 text-white ring-2 ring-purple-300"
                          : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                      }`}
                    >
                      <span className="text-xs font-medium">{location.name}</span>
                      {!isActive && (
                        <span className="text-xs mt-1 text-purple-600">
                          ₦{location.baseFee}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Location Editor */}
              <AnimatePresence>
                {activeLocation && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-50 rounded-lg p-4 mb-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-800">
                        {activeLocation} Shipping Fees
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveLocation(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label 
                          htmlFor="baseFee" 
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          Base Delivery Fee (₦)
                        </label>
                        <input
                          type="number"
                          id="baseFee"
                          value={
                            sortedLocations.find(loc => loc.name === activeLocation)?.baseFee || 0
                          }
                          onChange={(e) => 
                            updateLocationFee(
                              activeLocation, 
                              'baseFee', 
                              Number(e.target.value)
                            )
                          }
                          min="0"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter base fee"
                        />
                      </div>

                      <div>
                        <label 
                          htmlFor="additionalFee" 
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          Additional Fee per kg (₦)
                        </label>
                        <input
                          type="number"
                          id="additionalFee"
                          value={
                            sortedLocations.find(loc => loc.name === activeLocation)?.additionalFee || 0
                          }
                          onChange={(e) => 
                            updateLocationFee(
                              activeLocation, 
                              'additionalFee', 
                              Number(e.target.value)
                            )
                          }
                          min="0"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter additional fee"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Summary View */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 px-4 py-3">
                  <h4 className="text-sm font-medium text-gray-700">Shipping Fees Summary</h4>
                </div>
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {sortedLocations.map((location) => (
                    <div 
                      key={location.name} 
                      className="flex justify-between px-4 py-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">
                          {location.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {location.state}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-700">
                          Base: ₦{location.baseFee}
                        </span>
                        <span className="text-xs text-gray-500 block">
                          Additional: ₦{location.additionalFee}/kg
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShippingFees;