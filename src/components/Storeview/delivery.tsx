"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Truck, MapPin, Clock, Home, Package, Edit, Info, AlertCircle, ShoppingBag } from "lucide-react"

interface ShippingFee {
  id: number
  storefront_id: number
  name: string
  state: string
  baseFee: string
  additionalFee: string
  created_at?: string
  updated_at?: string
}

interface DeliveryDetailsProps {
  themeColor: string
  shippingFees: ShippingFee[]
  buyerInfo: {
    name: string
    email: string
    phone: string
    address?: string
    deliveryMethod?: "pickup" | "delivery"
    deliveryLocation?: ShippingFee
    deliveryNotes?: string
  }
  cartItems: Array<{ id: number; quantity: number }>
  onUpdateBuyerInfo: (info: any) => void
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({
  themeColor,
  shippingFees,
  buyerInfo,
  cartItems,
  onUpdateBuyerInfo,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(buyerInfo.deliveryMethod || "delivery")
  const [selectedLocation, setSelectedLocation] = useState<ShippingFee | null>(buyerInfo.deliveryLocation || null)
  const [address, setAddress] = useState(buyerInfo.address || "")
  const [notes, setNotes] = useState(buyerInfo.deliveryNotes || "")
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressEdited, setAddressEdited] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [totalShippingFee, setTotalShippingFee] = useState<number>(0)

  const groupedShippingFees = shippingFees.reduce<Record<string, ShippingFee[]>>((acc, fee) => {
    if (!acc[fee.state]) {
      acc[fee.state] = []
    }
    acc[fee.state].push(fee)
    return acc
  }, {})

  useEffect(() => {
    if (shippingFees.length > 0 && !selectedLocation) {
      setSelectedLocation(shippingFees[0])
    }
  }, [shippingFees, selectedLocation])

  useEffect(() => {
    if (buyerInfo.deliveryMethod) {
      setDeliveryMethod(buyerInfo.deliveryMethod)
    }
    if (buyerInfo.deliveryLocation) {
      setSelectedLocation(buyerInfo.deliveryLocation)
    }
    if (buyerInfo.address) {
      setAddress(buyerInfo.address)
    }
    if (buyerInfo.deliveryNotes) {
      setNotes(buyerInfo.deliveryNotes)
    }
  }, [buyerInfo])

  useEffect(() => {
    if (deliveryMethod === "pickup" || !selectedLocation) {
      setTotalShippingFee(0)
      return
    }

    let fee = Number.parseFloat(selectedLocation.baseFee)

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    if (totalQuantity > 10) {
      const additionalItems = totalQuantity - 10
      fee += additionalItems * Number.parseFloat(selectedLocation.additionalFee)
    }

    setTotalShippingFee(fee)
  }, [deliveryMethod, selectedLocation, cartItems])

  // Auto-update buyer info when delivery method changes
  useEffect(() => {
    onUpdateBuyerInfo({
      ...buyerInfo,
      deliveryMethod,
      deliveryLocation: deliveryMethod === "pickup" ? null : selectedLocation,
      address: deliveryMethod === "pickup" ? "Pickup" : address,
      deliveryNotes: notes,
      shippingFee: totalShippingFee,
    })
  }, [deliveryMethod])

  // Auto-update buyer info when selected location changes
  useEffect(() => {
    if (deliveryMethod === "delivery") {
      onUpdateBuyerInfo({
        ...buyerInfo,
        deliveryMethod,
        deliveryLocation: selectedLocation,
        address,
        deliveryNotes: notes,
        shippingFee: totalShippingFee,
      })
    }
  }, [selectedLocation, totalShippingFee])

  // Auto-update buyer info when address changes
  useEffect(() => {
    if (deliveryMethod === "delivery" && address) {
      onUpdateBuyerInfo({
        ...buyerInfo,
        deliveryMethod,
        deliveryLocation: selectedLocation,
        address,
        deliveryNotes: notes,
        shippingFee: totalShippingFee,
      })
    }
  }, [address])

  // Auto-update buyer info when notes change
  useEffect(() => {
    onUpdateBuyerInfo({
      ...buyerInfo,
      deliveryMethod,
      deliveryLocation: deliveryMethod === "pickup" ? null : selectedLocation,
      address: deliveryMethod === "pickup" ? "Pickup" : address,
      deliveryNotes: notes,
      shippingFee: totalShippingFee,
    })
  }, [notes])

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value)
    setAddressEdited(true)
  }

  const handleLocationSelect = (fee: ShippingFee) => {
    setSelectedLocation(fee)
  }

  const saveAddress = () => {
    setShowAddressModal(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-lg"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle size={16} className="text-red-500 sm:hidden" />
              <AlertCircle size={18} className="text-red-500 hidden sm:block" />
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm bg-white border"
        style={{ borderColor: `${themeColor}20` }}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center" style={{ color: themeColor }}>
          <Truck size={16} className="mr-1.5 sm:mr-2 sm:hidden" />
          <Truck size={18} className="mr-2 hidden sm:block" />
          Delivery Method
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center border-2 transition-all h-24 sm:h-28`}
            style={{
              borderColor: deliveryMethod === "delivery" ? themeColor : "#e5e7eb",
              backgroundColor: deliveryMethod === "delivery" ? `${themeColor}10` : "white",
            }}
            onClick={() => setDeliveryMethod("delivery")}
          >
            <Truck
              size={28}
              className="mb-2"
              style={{ color: deliveryMethod === "delivery" ? themeColor : "#6b7280" }}
            />
            <span
              className="font-medium text-sm"
              style={{ color: deliveryMethod === "delivery" ? themeColor : "#374151" }}
            >
              Delivery
            </span>
            <span className="text-xs text-gray-500 mt-1">Ship to your address</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center border-2 transition-all h-24 sm:h-28`}
            style={{
              borderColor: deliveryMethod === "pickup" ? themeColor : "#e5e7eb",
              backgroundColor: deliveryMethod === "pickup" ? `${themeColor}10` : "white",
            }}
            onClick={() => setDeliveryMethod("pickup")}
          >
            <Package
              size={28}
              className="mb-2"
              style={{ color: deliveryMethod === "pickup" ? themeColor : "#6b7280" }}
            />
            <span
              className="font-medium text-sm"
              style={{ color: deliveryMethod === "pickup" ? themeColor : "#374151" }}
            >
              Store Pickup
            </span>
            <span className="text-xs text-gray-500 mt-1">Free, collect yourself</span>
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {deliveryMethod === "delivery" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm bg-white border mb-4 sm:mb-5"
              style={{ borderColor: `${themeColor}20` }}
            >
              <h3
                className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: themeColor }}
              >
                <MapPin size={16} className="mr-1.5 sm:mr-2 sm:hidden" />
                <MapPin size={18} className="mr-2 hidden sm:block" />
                Delivery Location
              </h3>

              {shippingFees.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {Object.entries(groupedShippingFees).map(([state, fees]) => (
                    <div key={state} className="mb-3 sm:mb-4">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">{state}</h4>
                      <div className="relative">
                        <select
                          className="w-full appearance-none bg-white border-2 rounded-lg p-2.5 sm:p-3 pr-8 sm:pr-10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                          style={
                            {
                              borderColor: `${themeColor}30`,
                              "--tw-ring-color": themeColor,
                            } as React.CSSProperties
                          }
                          value={selectedLocation?.id.toString() || ""}
                          onChange={(e) => {
                            const selectedFee = fees.find((fee) => fee.id.toString() === e.target.value)
                            if (selectedFee) handleLocationSelect(selectedFee)
                          }}
                        >
                          <option value="" disabled>
                            Select a location
                          </option>
                          {fees.map((fee) => (
                            <option key={fee.id} value={fee.id.toString()}>
                              {fee.name} - ₦{Number.parseFloat(fee.baseFee).toLocaleString()}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 sm:px-3">
                          <svg
                            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>

                      {selectedLocation && selectedLocation.state === state && (
                        <div
                          className="mt-2 sm:mt-3 p-2 sm:p-3 rounded-lg text-xs sm:text-sm bg-gray-50"
                          style={{ borderLeft: `3px solid ${themeColor}` }}
                        >
                          <div className="flex justify-between">
                            <span className="text-gray-600">Base fee:</span>
                            <span className="font-medium">
                              ₦{Number.parseFloat(selectedLocation.baseFee).toLocaleString()}
                            </span>
                          </div>

                          {Number.parseFloat(selectedLocation.additionalFee) > 0 &&
                            cartItems.reduce((sum, item) => sum + item.quantity, 0) > 10 && (
                              <div className="text-xs sm:text-sm mt-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Additional items fee:</span>
                                  <span className="font-medium">
                                    ₦
                                    {(
                                      Number.parseFloat(selectedLocation.additionalFee) *
                                      (cartItems.reduce((sum, item) => sum + item.quantity, 0) - 10)
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  ({cartItems.reduce((sum, item) => sum + item.quantity, 0) - 10} items × ₦
                                  {Number.parseFloat(selectedLocation.additionalFee).toLocaleString()})
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-500">No delivery locations available</p>
                </div>
              )}

              {/* Show calculated shipping fee */}
              {selectedLocation && (
                <div
                  className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-gray-50 border"
                  style={{ borderColor: `${themeColor}20` }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div className="flex items-center">
                      <ShoppingBag size={14} className="mr-1.5 sm:mr-2 text-gray-500 sm:hidden" />
                      <ShoppingBag size={16} className="mr-2 text-gray-500 hidden sm:block" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Truck size={14} className="mr-1.5 sm:mr-2 text-gray-500 sm:hidden" />
                      <Truck size={16} className="mr-2 text-gray-500 hidden sm:block" />
                      <span className="text-xs sm:text-sm font-medium" style={{ color: themeColor }}>
                        Shipping Fee: ₦{totalShippingFee.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Delivery summary */}
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                    <p>
                      Delivery to{" "}
                      <span className="font-medium">
                        {selectedLocation.name}, {selectedLocation.state}
                      </span>
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0) > 10 && (
                        <span>
                          {" "}
                          with additional fees for {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm bg-white border mb-4 sm:mb-5"
              style={{ borderColor: `${themeColor}20` }}
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold flex items-center" style={{ color: themeColor }}>
                  <Home size={16} className="mr-1.5 sm:mr-2 sm:hidden" />
                  <Home size={18} className="mr-2 hidden sm:block" />
                  Delivery Address
                </h3>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddressModal(true)}
                  className="text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center"
                  style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                >
                  <Edit size={12} className="mr-0.5 sm:mr-1 sm:hidden" />
                  <Edit size={14} className="mr-1 hidden sm:block" />
                  Edit
                </motion.button>
              </div>

              {address ? (
                <div
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border"
                  style={{ borderColor: `${themeColor}20` }}
                >
                  <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-line">{address}</p>
                </div>
              ) : (
                <div
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border text-center cursor-pointer"
                  style={{ borderColor: `${themeColor}20` }}
                  onClick={() => setShowAddressModal(true)}
                >
                  <p className="text-xs sm:text-sm text-gray-500">Please add your delivery address</p>
                </div>
              )}
            </div>

            <div
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm bg-white border mb-4 sm:mb-5"
              style={{ borderColor: `${themeColor}20` }}
            >
              <h3
                className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: themeColor }}
              >
                <Info size={16} className="mr-1.5 sm:mr-2 sm:hidden" />
                <Info size={18} className="mr-2 hidden sm:block" />
                Delivery Notes (Optional)
              </h3>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions for delivery (landmarks, gate code, etc.)"
                className="w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                style={
                  {
                    borderColor: `${themeColor}30`,
                    "--tw-ring-color": themeColor,
                  } as React.CSSProperties
                }
              />
            </div>
          </motion.div>
        )}

        {deliveryMethod === "pickup" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm bg-white border mb-4 sm:mb-5"
            style={{ borderColor: `${themeColor}20` }}
          >
            <h3
              className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center"
              style={{ color: themeColor }}
            >
              <Clock size={16} className="mr-1.5 sm:mr-2 sm:hidden" />
              <Clock size={18} className="mr-2 hidden sm:block" />
              Pickup Information
            </h3>

            <div
              className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl mb-3 sm:mb-4 border"
              style={{ borderColor: `${themeColor}20` }}
            >
              <h4 className="font-medium text-xs sm:text-sm text-gray-800 mb-1.5 sm:mb-2">Pickup Location</h4>
              <p className="text-xs text-gray-600">
                You'll need to pick up your order directly from our store location. Our team will contact you when your
                order is ready.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-xs sm:text-sm text-gray-800 mb-1.5 sm:mb-2">
                Notes for Pickup (Optional)
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions for pickup"
                className="w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                style={
                  {
                    borderColor: `${themeColor}30`,
                    "--tw-ring-color": themeColor,
                  } as React.CSSProperties
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-md w-full overflow-hidden mx-3"
            >
              <div className="p-4 sm:p-5 border-b" style={{ borderColor: `${themeColor}20` }}>
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: themeColor }}>
                  Delivery Address
                </h3>
              </div>
              <div className="p-4 sm:p-5">
                <textarea
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Enter your full delivery address including street, building number, city, etc."
                  className="w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all min-h-[120px] sm:min-h-[150px] text-xs sm:text-sm"
                  style={
                    {
                      borderColor: `${themeColor}30`,
                      "--tw-ring-color": themeColor,
                    } as React.CSSProperties
                  }
                />
                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-2 sm:py-2.5 rounded-full font-medium border text-xs sm:text-sm"
                    style={{
                      backgroundColor: "white",
                      color: "#6b7280",
                      borderColor: "#e5e7eb",
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveAddress}
                    className="flex-1 py-2 sm:py-2.5 rounded-full font-medium text-white text-xs sm:text-sm"
                    style={{ backgroundColor: themeColor }}
                  >
                    Save Address
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function adjustColorLightness(hex: string, factor: number): string {
  try {
    let r = Number.parseInt(hex.slice(1, 3), 16)
    let g = Number.parseInt(hex.slice(3, 5), 16)
    let b = Number.parseInt(hex.slice(5, 7), 16)

    r = Math.min(255, Math.round(r * factor))
    g = Math.min(255, Math.round(g * factor))
    b = Math.min(255, Math.round(b * factor))

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  } catch (e) {
    return hex
  }
}

export default DeliveryDetails
