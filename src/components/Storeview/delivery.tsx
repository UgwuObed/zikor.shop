"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Truck, MapPin, Clock, Home, Package, Edit, Info, Check, AlertCircle, ShoppingBag } from "lucide-react"

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
  onNext: () => void
  onBack: () => void
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({
  themeColor,
  shippingFees,
  buyerInfo,
  cartItems,
  onUpdateBuyerInfo,
  onNext,
  onBack,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(buyerInfo.deliveryMethod || "delivery")
  const [selectedLocation, setSelectedLocation] = useState<ShippingFee | null>(buyerInfo.deliveryLocation || null)
  const [address, setAddress] = useState(buyerInfo.address || "")
  const [notes, setNotes] = useState(buyerInfo.deliveryNotes || "")
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressEdited, setAddressEdited] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [totalShippingFee, setTotalShippingFee] = useState<number>(0)

  // Group shipping fees by state for better organization
  const groupedShippingFees = shippingFees.reduce<Record<string, ShippingFee[]>>((acc, fee) => {
    if (!acc[fee.state]) {
      acc[fee.state] = []
    }
    acc[fee.state].push(fee)
    return acc
  }, {})

  useEffect(() => {
    // Auto-select first shipping option if available and none is selected
    if (shippingFees.length > 0 && !selectedLocation) {
      setSelectedLocation(shippingFees[0])
    }
  }, [shippingFees, selectedLocation])

  // Update local state when buyerInfo changes from parent
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

  // Calculate shipping fee including additional fees based on quantity
  useEffect(() => {
    if (deliveryMethod === "pickup" || !selectedLocation) {
      setTotalShippingFee(0)
      return
    }

    // Calculate base fee
    let fee = Number.parseFloat(selectedLocation.baseFee)

    // Calculate additional fee based on total quantity
    // Assuming additional fee applies per item after the first item
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    if (totalQuantity > 1) {
      const additionalItems = totalQuantity - 1
      fee += additionalItems * Number.parseFloat(selectedLocation.additionalFee)
    }

    setTotalShippingFee(fee)
  }, [deliveryMethod, selectedLocation, cartItems])

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value)
    setAddressEdited(true)
  }

  const handleLocationSelect = (fee: ShippingFee) => {
    setSelectedLocation(fee)
  }

  const handleSubmit = () => {
    if (deliveryMethod === "delivery" && !selectedLocation) {
      setErrorMessage("Please select a delivery location")
      return
    }

    if (deliveryMethod === "delivery" && !address.trim()) {
      setErrorMessage("Please enter your delivery address")
      return
    }

    // Update buyer info with delivery details
    onUpdateBuyerInfo({
      ...buyerInfo,
      address: deliveryMethod === "delivery" ? address : "Pickup",
      deliveryMethod,
      deliveryLocation: selectedLocation,
      deliveryNotes: notes,
      shippingFee: totalShippingFee,
    })

    onNext()
  }

  const saveAddress = () => {
    setShowAddressModal(false)
  }

  return (
    <div className="space-y-5">
      <div className="checkout-steps mb-6">
        <div className="flex items-center justify-between">
          <div className="step-item flex flex-col items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 bg-gray-100">
              <Check size={16} className="text-gray-500" />
            </div>
            <div className="text-xs text-gray-500">Cart</div>
          </div>
          <div className="step-line flex-1 h-1 mx-2" style={{ backgroundColor: themeColor }}></div>
          <div className="step-item flex flex-col items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 bg-gray-100">
              <Check size={16} className="text-gray-500" />
            </div>
            <div className="text-xs text-gray-500">Details</div>
          </div>
          <div className="step-line flex-1 h-1 mx-2" style={{ backgroundColor: themeColor }}></div>
          <div className="step-item flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
              style={{ backgroundColor: themeColor }}
            >
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <Truck size={16} className="text-white" />
              </motion.div>
            </div>
            <div className="text-xs font-medium" style={{ color: themeColor }}>
              Delivery
            </div>
          </div>
          <div className="step-line flex-1 h-1 mx-2" style={{ backgroundColor: `${themeColor}20` }}></div>
          <div className="step-item flex flex-col items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 bg-gray-100">
              <Check size={16} className="text-gray-500" />
            </div>
            <div className="text-xs text-gray-500">Confirm</div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-lg"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle size={18} className="text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-5 rounded-2xl shadow-md bg-white border mb-5"
        style={{ borderColor: `${themeColor}20` }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
          Delivery Method
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-xl flex flex-col items-center justify-center border-2 transition-all h-28`}
            style={{
              borderColor: deliveryMethod === "delivery" ? themeColor : "#e5e7eb",
              backgroundColor: deliveryMethod === "delivery" ? `${themeColor}10` : "white",
            }}
            onClick={() => setDeliveryMethod("delivery")}
          >
            <Truck
              size={32}
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
            className={`p-4 rounded-xl flex flex-col items-center justify-center border-2 transition-all h-28`}
            style={{
              borderColor: deliveryMethod === "pickup" ? themeColor : "#e5e7eb",
              backgroundColor: deliveryMethod === "pickup" ? `${themeColor}10` : "white",
            }}
            onClick={() => setDeliveryMethod("pickup")}
          >
            <Package
              size={32}
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
            <div className="p-5 rounded-2xl shadow-md bg-white border mb-5" style={{ borderColor: `${themeColor}20` }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
                <div className="flex items-center">
                  <MapPin size={18} className="mr-2" />
                  Delivery Location
                </div>
              </h3>

              {shippingFees.length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(groupedShippingFees).map(([state, fees]) => (
                    <div key={state} className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{state}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {fees.map((fee) => (
                          <motion.button
                            key={`${fee.name}-${fee.state}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-3 rounded-xl border-2 transition-all text-left`}
                            style={{
                              borderColor: selectedLocation?.id === fee.id ? themeColor : "#e5e7eb",
                              backgroundColor: selectedLocation?.id === fee.id ? `${themeColor}10` : "white",
                            }}
                            onClick={() => handleLocationSelect(fee)}
                          >
                            <div className="flex justify-between items-start">
                              <span
                                className="font-medium text-sm"
                                style={{
                                  color: selectedLocation?.id === fee.id ? themeColor : "#374151",
                                }}
                              >
                                {fee.name}
                              </span>
                              <div
                                className="bg-white px-2 py-1 rounded-full text-xs font-bold shadow-sm"
                                style={{
                                  color: themeColor,
                                  borderLeft: `2px solid ${themeColor}`,
                                }}
                              >
                                ₦{Number.parseFloat(fee.baseFee).toLocaleString()}
                              </div>
                            </div>
                            {Number.parseFloat(fee.additionalFee) > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                + ₦{Number.parseFloat(fee.additionalFee).toLocaleString()}/additional item
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No delivery locations available</p>
                </div>
              )}

              {/* Show calculated shipping fee */}
              {selectedLocation && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50 border" style={{ borderColor: `${themeColor}20` }}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ShoppingBag size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Truck size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm font-medium" style={{ color: themeColor }}>
                        Shipping Fee: ₦{totalShippingFee.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl shadow-md bg-white border mb-5" style={{ borderColor: `${themeColor}20` }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold" style={{ color: themeColor }}>
                  <div className="flex items-center">
                    <Home size={18} className="mr-2" />
                    Delivery Address
                  </div>
                </h3>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddressModal(true)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full flex items-center"
                  style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                >
                  <Edit size={14} className="mr-1" />
                  Edit
                </motion.button>
              </div>

              {address ? (
                <div className="bg-gray-50 rounded-xl p-4 border" style={{ borderColor: `${themeColor}20` }}>
                  <p className="text-gray-800 whitespace-pre-line">{address}</p>
                </div>
              ) : (
                <div
                  className="bg-gray-50 rounded-xl p-4 border text-center cursor-pointer"
                  style={{ borderColor: `${themeColor}20` }}
                  onClick={() => setShowAddressModal(true)}
                >
                  <p className="text-gray-500">Please add your delivery address</p>
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl shadow-md bg-white border mb-5" style={{ borderColor: `${themeColor}20` }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
                <div className="flex items-center">
                  <Info size={18} className="mr-2" />
                  Delivery Notes (Optional)
                </div>
              </h3>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions for delivery (landmarks, gate code, etc.)"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all min-h-[100px]"
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
            className="p-5 rounded-2xl shadow-md bg-white border mb-5"
            style={{ borderColor: `${themeColor}20` }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
              <div className="flex items-center">
                <Clock size={18} className="mr-2" />
                Pickup Information
              </div>
            </h3>

            <div className="bg-gray-50 p-4 rounded-xl mb-4 border" style={{ borderColor: `${themeColor}20` }}>
              <h4 className="font-medium text-gray-800 mb-2">Pickup Location</h4>
              <p className="text-gray-600">
                You'll need to pick up your order directly from our store location. Our team will contact you when your
                order is ready.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Notes for Pickup (Optional)</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions for pickup"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all min-h-[100px]"
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

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex-1 py-3 rounded-full font-medium border flex items-center justify-center"
          style={{
            backgroundColor: "white",
            color: themeColor,
            borderColor: `${themeColor}30`,
          }}
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="flex-1 py-3 rounded-full font-medium text-white flex items-center justify-center shadow-md"
          style={{
            backgroundImage: `linear-gradient(135deg, ${themeColor}, ${adjustColorLightness(themeColor, 0.8)})`,
          }}
        >
          Continue
        </motion.button>
      </div>

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
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-5 border-b" style={{ borderColor: `${themeColor}20` }}>
                <h3 className="text-lg font-semibold" style={{ color: themeColor }}>
                  Delivery Address
                </h3>
              </div>
              <div className="p-5">
                <textarea
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Enter your full delivery address including street, building number, city, etc."
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all min-h-[150px]"
                  style={
                    {
                      borderColor: `${themeColor}30`,
                      "--tw-ring-color": themeColor,
                    } as React.CSSProperties
                  }
                />
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-2.5 rounded-full font-medium border"
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
                    className="flex-1 py-2.5 rounded-full font-medium text-white"
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
