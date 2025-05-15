"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, CreditCard, Truck, Check, Info, Lock } from "lucide-react"
import DeliveryDetails from "./delivery"

interface ShippingFee {
  id: number
  storefront_id: number
  name: string
  state: string
  baseFee: string
  additionalFee: string
}

interface BuyerInfo {
  name: string
  email: string
  phone: string
  address?: string
  deliveryMethod?: "pickup" | "delivery"
  deliveryLocation?: ShippingFee
  deliveryNotes?: string
  shippingFee?: number
}

interface CartItem {
  id: number
  quantity: number
}

interface Product {
  id: number
  name: string
  main_price: string
  discount_price: string
  quantity: number
  image_urls: string[]
}

interface CheckoutFlowProps {
  themeColor: string
  buyerInfo: BuyerInfo
  cartItems: CartItem[]
  products: Product[]
  shippingFees: ShippingFee[]
  onUpdateBuyerInfo: (info: BuyerInfo) => void
  onCheckout: (buyerInfo: BuyerInfo) => Promise<void>
  onCancel: () => void
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  themeColor,
  buyerInfo,
  cartItems,
  products,
  shippingFees,
  onUpdateBuyerInfo,
  onCheckout,
  onCancel,
}) => {
  const [step, setStep] = useState<"details" | "delivery" | "payment">("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatedBuyerInfo, setUpdatedBuyerInfo] = useState<BuyerInfo>(buyerInfo)

  // Calculate order summary
  const subtotal = cartItems.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id)
    if (!product) return total
    return total + Number.parseFloat(product.discount_price || product.main_price) * item.quantity
  }, 0)

  const shippingFee = updatedBuyerInfo.shippingFee || 0
  const total = subtotal + shippingFee

  const handleUpdateBuyerInfo = (info: BuyerInfo) => {
    setUpdatedBuyerInfo(info)
    onUpdateBuyerInfo(info)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)
      await onCheckout(updatedBuyerInfo)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during checkout")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case "delivery":
        return (
          <DeliveryDetails
            themeColor={themeColor}
            shippingFees={shippingFees}
            buyerInfo={updatedBuyerInfo}
            cartItems={cartItems}
            onUpdateBuyerInfo={handleUpdateBuyerInfo}
            onNext={() => setStep("payment")}
            onBack={() => setStep("details")}
          />
        )
      case "payment":
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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 bg-gray-100">
                    <Check size={16} className="text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-500">Delivery</div>
                </div>
                <div className="step-line flex-1 h-1 mx-2" style={{ backgroundColor: themeColor }}></div>
                <div className="step-item flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                    style={{ backgroundColor: themeColor }}
                  >
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                      <CreditCard size={16} className="text-white" />
                    </motion.div>
                  </div>
                  <div className="text-xs font-medium" style={{ color: themeColor }}>
                    Payment
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-5 rounded-2xl shadow-md bg-white border mb-5" style={{ borderColor: `${themeColor}20` }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
                Order Summary
              </h3>

              <div className="space-y-3">
                {cartItems.map((item) => {
                  const product = products.find((p) => p.id === item.id)
                  if (!product) return null

                  return (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-3">
                          {product.image_urls && product.image_urls.length > 0 ? (
                            <img
                              src={product.image_urls[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium" style={{ color: themeColor }}>
                        ₦
                        {(
                          Number.parseFloat(product.discount_price || product.main_price) * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₦{shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100 mt-3">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg" style={{ color: themeColor }}>
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="p-5 rounded-2xl shadow-md bg-white border mb-5" style={{ borderColor: `${themeColor}20` }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
                Customer Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Contact Details</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">{updatedBuyerInfo.name}</p>
                    <p className="text-sm">{updatedBuyerInfo.email}</p>
                    <p className="text-sm">{updatedBuyerInfo.phone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Delivery Details</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">
                      {updatedBuyerInfo.deliveryMethod === "pickup" ? "Store Pickup" : "Delivery"}
                    </p>
                    {updatedBuyerInfo.deliveryMethod === "delivery" && (
                      <>
                        <p className="text-sm mt-1">
                          {updatedBuyerInfo.deliveryLocation?.name}, {updatedBuyerInfo.deliveryLocation?.state}
                        </p>
                        <p className="text-sm mt-1">{updatedBuyerInfo.address}</p>
                      </>
                    )}
                    {updatedBuyerInfo.deliveryNotes && (
                      <p className="text-sm mt-2 text-gray-500">Note: {updatedBuyerInfo.deliveryNotes}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="p-5 rounded-2xl shadow-md bg-white border mb-5" style={{ borderColor: `${themeColor}20` }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
                Payment Method
              </h3>

              <div className="space-y-3">
                <div
                  className="p-3 border-2 rounded-lg flex items-center"
                  style={{ borderColor: themeColor, backgroundColor: `${themeColor}05` }}
                >
                  <div
                    className="w-5 h-5 rounded-full mr-3 flex items-center justify-center"
                    style={{ backgroundColor: themeColor }}
                  >
                    <Check size={12} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Pay on Delivery</p>
                    <p className="text-xs text-gray-500">Pay with cash when your order is delivered</p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep("delivery")}
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
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-full font-medium text-white flex items-center justify-center shadow-md"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${themeColor}, ${adjustColorLightness(themeColor, 0.8)})`,
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Complete Order"
                )}
              </motion.button>
            </div>
          </div>
        )
      default: // details
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
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                    style={{ backgroundColor: themeColor }}
                  >
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                      <ShoppingBag size={16} className="text-white" />
                    </motion.div>
                  </div>
                  <div className="text-xs font-medium" style={{ color: themeColor }}>
                    Details
                  </div>
                </div>
                <div className="step-line flex-1 h-1 mx-2" style={{ backgroundColor: `${themeColor}20` }}></div>
                <div className="step-item flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 bg-gray-100">
                    <Truck size={16} className="text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-500">Delivery</div>
                </div>
                <div className="step-line flex-1 h-1 mx-2" style={{ backgroundColor: `${themeColor}20` }}></div>
                <div className="step-item flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 bg-gray-100">
                    <CreditCard size={16} className="text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-500">Payment</div>
                </div>
              </div>
            </div>

            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-5 sm:p-6 md:p-8 rounded-2xl shadow-md bg-white border mb-5 sm:mb-8"
            style={{ borderColor: `${themeColor}20` }}
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" 
                style={{ backgroundColor: `${themeColor}15` }}>
                <Info size={18} style={{ color: themeColor }} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold" style={{ color: themeColor }}>
                Customer Information
              </h3>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <div className="group">
                <label className="block text-sm sm:text-base text-gray-700 mb-2 font-medium group-focus-within:text-gray-900 transition-colors">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={updatedBuyerInfo.name}
                    onChange={(e) => handleUpdateBuyerInfo({ ...updatedBuyerInfo, name: e.target.value })}
                    className="w-full p-3 sm:p-4 border-2 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all text-base sm:text-lg"
                    style={{
                      borderColor: `${themeColor}30`,
                      "--tw-ring-color": themeColor,
                    } as React.CSSProperties}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 pl-1">Please enter your full name</p>
              </div>
              
              <div className="group">
                <label className="block text-sm sm:text-base text-gray-700 mb-2 font-medium group-focus-within:text-gray-900 transition-colors">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={updatedBuyerInfo.email}
                    onChange={(e) => handleUpdateBuyerInfo({ ...updatedBuyerInfo, email: e.target.value })}
                    className="w-full p-3 sm:p-4 border-2 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all text-base sm:text-lg"
                    style={{
                      borderColor: `${themeColor}30`,
                      "--tw-ring-color": themeColor,
                    } as React.CSSProperties}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 pl-1">We'll send your order confirmation to this email</p>
              </div>
              
              <div className="group">
                <label className="block text-sm sm:text-base text-gray-700 mb-2 font-medium group-focus-within:text-gray-900 transition-colors">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={updatedBuyerInfo.phone}
                    onChange={(e) => handleUpdateBuyerInfo({ ...updatedBuyerInfo, phone: e.target.value })}
                    className="w-full p-3 sm:p-4 border-2 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all text-base sm:text-lg"
                    style={{
                      borderColor: `${themeColor}30`,
                      "--tw-ring-color": themeColor,
                    } as React.CSSProperties}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 pl-1">For delivery updates and notifications</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t" style={{ borderColor: `${themeColor}15` }}>
              <div className="flex items-center text-sm text-gray-600">
                <Lock size={14} className="mr-2" />
                <span>Your information is secure and will only be used for this order</span>
              </div>
            </div>
          </motion.div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="flex-1 py-3 rounded-full font-medium border flex items-center justify-center"
                style={{
                  backgroundColor: "white",
                  color: themeColor,
                  borderColor: `${themeColor}30`,
                }}
              >
                Back to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (updatedBuyerInfo.name && updatedBuyerInfo.email && updatedBuyerInfo.phone) {
                    setStep("delivery")
                  }
                }}
                disabled={!updatedBuyerInfo.name || !updatedBuyerInfo.email || !updatedBuyerInfo.phone}
                className="flex-1 py-3 rounded-full font-medium text-white flex items-center justify-center shadow-md"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${themeColor}, ${adjustColorLightness(themeColor, 0.8)})`,
                  opacity: !updatedBuyerInfo.name || !updatedBuyerInfo.email || !updatedBuyerInfo.phone ? 0.7 : 1,
                }}
              >
                Continue
              </motion.button>
            </div>
          </div>
        )
    }
  }
  return <div className="max-w-3xl mx-auto px-4 py-6">{renderStepContent()}</div>
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

export default CheckoutFlow
