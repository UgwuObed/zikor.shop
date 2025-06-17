"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import {
  X,
  ShoppingBag,
  CreditCard,
  Truck,
  Check,
  Info,
  Lock,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Package,
} from "lucide-react"
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

interface CheckoutDrawerProps {
  isOpen: boolean
  onClose: () => void
  themeColor: string
  buyerInfo: BuyerInfo
  cartItems: CartItem[]
  products: Product[]
  shippingFees: ShippingFee[]
  onUpdateBuyerInfo: (info: BuyerInfo) => void
  onCheckout: (buyerInfo: BuyerInfo) => Promise<void>
  onCancel: () => void 
}

const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  isOpen,
  onClose,
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
  const [isExpanded, setIsExpanded] = useState(false)
  const [dragY, setDragY] = useState(0)

  const subtotal = cartItems.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id)
    if (!product) return total
    return total + Number.parseFloat(product.discount_price || product.main_price) * item.quantity
  }, 0)

  const shippingFee = updatedBuyerInfo.shippingFee || 0
  const total = subtotal + shippingFee

  const handleDrag = useCallback((event: any, info: PanInfo) => {
    if (info.offset.y > 0) {
      setDragY(info.offset.y)
    }
  }, [])

  const handleDragEnd = useCallback(
    (event: any, info: PanInfo) => {
      if (info.offset.y > 100 || info.velocity.y > 500) {
        onClose()
      } else {
        setDragY(0)
      }
    },
    [onClose],
  )

  const handleUpdateBuyerInfo = (info: BuyerInfo) => {
    setUpdatedBuyerInfo(info)
    onUpdateBuyerInfo(info)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const completeInfo = {
        ...updatedBuyerInfo,
        address: updatedBuyerInfo.address || (updatedBuyerInfo.deliveryMethod === "pickup" ? "Pickup" : ""),
        deliveryMethod: updatedBuyerInfo.deliveryMethod || "delivery",
        deliveryLocation: updatedBuyerInfo.deliveryLocation || undefined,
        deliveryNotes: updatedBuyerInfo.deliveryNotes || "",
        shippingFee: updatedBuyerInfo.shippingFee || 0,
      }
      await onCheckout(completeInfo)
    } catch (err) {
      console.error("Checkout error:", err) 
      setError(err instanceof Error ? err.message : "An error occurred during checkout")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case "details":
        return "Customer Information"
      case "delivery":
        return "Delivery Details"
      case "payment":
        return "Payment & Review"
      default:
        return "Checkout"
    }
  }

  const getStepIcon = () => {
    switch (step) {
      case "details":
        return <User size={20} />
      case "delivery":
        return <Truck size={20} />
      case "payment":
        return <CreditCard size={20} />
      default:
        return <ShoppingBag size={20} />
    }
  }

  const drawerVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  const expandedVariants = {
    collapsed: {
      height: "70vh",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    expanded: {
      height: "95vh",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  }

  const desktopModalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  }

  const desktopExpandedVariants = {
    collapsed: {
      maxHeight: "85vh",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    expanded: {
      maxHeight: "95vh",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
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
          />
        )
      case "payment":
        return (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="p-5 rounded-2xl shadow-sm bg-white border" style={{ borderColor: `${themeColor}20` }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: themeColor }}>
                <Package size={18} className="mr-2" />
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

            {/* Customer Information Summary */}
            <div className="p-5 rounded-2xl shadow-sm bg-white border" style={{ borderColor: `${themeColor}20` }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: themeColor }}>
                <User size={18} className="mr-2" />
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
            <div className="p-5 rounded-2xl shadow-sm bg-white border" style={{ borderColor: `${themeColor}20` }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: themeColor }}>
                <CreditCard size={18} className="mr-2" />
                Payment Method
              </h3>

              <div className="space-y-3">
                {/* Paystack Option */}
                <div
                  className="p-4 border-2 rounded-lg flex items-center cursor-pointer transition-all"
                  style={{
                    borderColor: themeColor,
                    backgroundColor: `${themeColor}05`,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full mr-3 flex items-center justify-center"
                    style={{ backgroundColor: themeColor }}
                  >
                    <Check size={12} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Pay securely with Paystack</p>
                    <p className="text-xs text-gray-500">Safe and secure online payment</p>
                  </div>
                  <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center ml-2">
                    <Lock size={16} className="text-gray-500" />
                  </div>
                </div>

                {/* Pay on Delivery Option */}
                <div
                  className="p-4 border-2 rounded-lg flex items-center cursor-pointer transition-all hover:bg-gray-50"
                  style={{ borderColor: `${themeColor}30` }}
                >
                  <div className="w-5 h-5 rounded-full border-2 mr-3" style={{ borderColor: themeColor }}></div>
                  <div className="flex-1">
                    <p className="font-medium">Pay on Delivery</p>
                    <p className="text-xs text-gray-500">Pay with cash when your order is delivered</p>
                  </div>
                </div>

                {/* Payaza Option - Coming Soon */}
                <div
                  className="p-4 border-2 rounded-lg flex items-center bg-gray-50 opacity-70 relative"
                  style={{ borderColor: "transparent" }}
                >
                  <div className="w-5 h-5 rounded-full border-2 mr-3" style={{ borderColor: "gray" }}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-400">Pay with Payaza</p>
                    <p className="text-xs text-gray-400">Alternative payment option</p>
                  </div>
                  <div className="absolute right-3 top-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600 font-medium">
                      Coming soon
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center">
                <Info size={14} className="text-gray-400 mr-2" />
                <p className="text-xs text-gray-500">All transactions are secure and encrypted</p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-5 rounded-2xl shadow-sm bg-white border"
              style={{ borderColor: `${themeColor}20` }}
            >
              <div className="flex items-center mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: `${themeColor}15` }}
                >
                  <Info size={18} style={{ color: themeColor }} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: themeColor }}>
                  Customer Information
                </h3>
              </div>

              <div className="space-y-5">
                <div className="group">
                  <label className="block text-sm text-gray-700 mb-2 font-medium group-focus-within:text-gray-900 transition-colors">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={updatedBuyerInfo.name}
                    onChange={(e) => handleUpdateBuyerInfo({ ...updatedBuyerInfo, name: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all"
                    style={
                      {
                        borderColor: `${themeColor}30`,
                        "--tw-ring-color": themeColor,
                      } as React.CSSProperties
                    }
                    placeholder="Enter your full name"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 pl-1">Please enter your full name</p>
                </div>

                <div className="group">
                  <label className="block text-sm text-gray-700 mb-2 font-medium group-focus-within:text-gray-900 transition-colors">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={updatedBuyerInfo.email}
                    onChange={(e) => handleUpdateBuyerInfo({ ...updatedBuyerInfo, email: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all"
                    style={
                      {
                        borderColor: `${themeColor}30`,
                        "--tw-ring-color": themeColor,
                      } as React.CSSProperties
                    }
                    placeholder="Enter your email address"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 pl-1">We'll send your order confirmation to this email</p>
                </div>

                <div className="group">
                  <label className="block text-sm text-gray-700 mb-2 font-medium group-focus-within:text-gray-900 transition-colors">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={updatedBuyerInfo.phone}
                    onChange={(e) => handleUpdateBuyerInfo({ ...updatedBuyerInfo, phone: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all"
                    style={
                      {
                        borderColor: `${themeColor}30`,
                        "--tw-ring-color": themeColor,
                      } as React.CSSProperties
                    }
                    placeholder="Enter your phone number"
                    required
                  />
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
          </div>
        )
    }
  }

  const canGoNext = () => {
    switch (step) {
      case "details":
        return updatedBuyerInfo.name && updatedBuyerInfo.email && updatedBuyerInfo.phone
      case "delivery":
        if (updatedBuyerInfo.deliveryMethod === "delivery") {
          return updatedBuyerInfo.deliveryLocation && updatedBuyerInfo.address
        }
        return true 
      case "payment":
        return true
      default:
        return false
    }
  }

  const renderStepNavigation = () => {
    const canGoNext = () => {
      switch (step) {
        case "details":
          return updatedBuyerInfo.name && updatedBuyerInfo.email && updatedBuyerInfo.phone
        case "delivery":
          // Match original validation - ensure delivery method is set and if delivery, location and address are set
          if (updatedBuyerInfo.deliveryMethod === "delivery") {
            return updatedBuyerInfo.deliveryLocation && updatedBuyerInfo.address
          }
          return updatedBuyerInfo.deliveryMethod === "pickup"
        case "payment":
          return true
        default:
          return false
      }
    }

    const handleNext = () => {
      switch (step) {
        case "details":
          setStep("delivery")
          break
        case "delivery":
          setStep("payment")
          break
        case "payment":
          handleSubmit()
          break
      }
    }

    const handleBack = () => {
      switch (step) {
        case "delivery":
          setStep("details")
          break
        case "payment":
          setStep("delivery")
          break
        default:
          if (onCancel) {
            onCancel()
          } else {
            onClose()
          }
          break
      }
    }

    return (
      <div className="flex gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
          className="flex-1 py-3 rounded-full font-medium border flex items-center justify-center"
          style={{
            backgroundColor: "white",
            color: themeColor,
            borderColor: `${themeColor}30`,
          }}
        >
          <ChevronLeft size={18} className="mr-1" />
          {step === "details" ? "Cancel" : "Back"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={!canGoNext() || isSubmitting}
          className="flex-1 py-3 rounded-full font-medium text-white flex items-center justify-center shadow-md"
          style={{
            backgroundImage: `linear-gradient(135deg, ${themeColor}, ${adjustColorLightness(themeColor, 0.8)})`,
            opacity: !canGoNext() || isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : step === "payment" ? (
            "Complete Order"
          ) : (
            <>
              Continue
              <ChevronRight size={18} className="ml-1" />
            </>
          )}
        </motion.button>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Mobile Drawer */}
          <div className="md:hidden">
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl shadow-2xl flex flex-col"
              style={{
                transform: `translateY(${dragY}px)`,
              }}
            >
              <motion.div
                variants={expandedVariants}
                animate={isExpanded ? "expanded" : "collapsed"}
                className="flex flex-col overflow-hidden"
              >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                {/* Mobile Header */}
                <div className="flex justify-between items-center px-6 pb-4 border-b border-gray-100">
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-center space-x-2 flex-1 justify-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${themeColor}15` }}
                    >
                      {getStepIcon()}
                    </div>
                    <h2 className="font-semibold text-lg">{getStepTitle()}</h2>
                  </div>

                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                          step === "details" ? "" : "bg-gray-100"
                        }`}
                        style={{
                          backgroundColor: step === "details" ? themeColor : undefined,
                        }}
                      >
                        {step !== "details" ? (
                          <Check size={16} className="text-gray-500" />
                        ) : (
                          <User size={16} className="text-white" />
                        )}
                      </div>
                      <div
                        className={`text-xs ${step === "details" ? "font-medium" : "text-gray-500"}`}
                        style={{ color: step === "details" ? themeColor : undefined }}
                      >
                        Details
                      </div>
                    </div>
                    <div
                      className="flex-1 h-1 mx-2"
                      style={{
                        backgroundColor: step !== "details" ? themeColor : `${themeColor}20`,
                      }}
                    ></div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                          step === "delivery" ? "" : "bg-gray-100"
                        }`}
                        style={{
                          backgroundColor: step === "delivery" ? themeColor : undefined,
                        }}
                      >
                        {step === "payment" ? (
                          <Check size={16} className="text-gray-500" />
                        ) : step === "delivery" ? (
                          <Truck size={16} className="text-white" />
                        ) : (
                          <Truck size={16} className="text-gray-500" />
                        )}
                      </div>
                      <div
                        className={`text-xs ${step === "delivery" ? "font-medium" : "text-gray-500"}`}
                        style={{ color: step === "delivery" ? themeColor : undefined }}
                      >
                        Delivery
                      </div>
                    </div>
                    <div
                      className="flex-1 h-1 mx-2"
                      style={{
                        backgroundColor: step === "payment" ? themeColor : `${themeColor}20`,
                      }}
                    ></div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                          step === "payment" ? "" : "bg-gray-100"
                        }`}
                        style={{
                          backgroundColor: step === "payment" ? themeColor : undefined,
                        }}
                      >
                        <CreditCard size={16} className={step === "payment" ? "text-white" : "text-gray-500"} />
                      </div>
                      <div
                        className={`text-xs ${step === "payment" ? "font-medium" : "text-gray-500"}`}
                        style={{ color: step === "payment" ? themeColor : undefined }}
                      >
                        Payment
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Content - Scrollable */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4">{renderStepContent()}</div>

                {/* Action buttons */}
                <div className="p-6 border-t border-gray-100 bg-white">{renderStepNavigation()}</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Desktop Modal */}
          <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-4">
            <motion.div
              variants={desktopModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl"
            >
              <motion.div
                variants={desktopExpandedVariants}
                animate={isExpanded ? "expanded" : "collapsed"}
                className="flex flex-col overflow-hidden"
              >
                {/* Desktop Header */}
                <div className="flex justify-between items-center p-6 lg:p-8 border-b border-gray-100 bg-white/95 backdrop-blur-md">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${themeColor}15` }}
                    >
                      {getStepIcon()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{getStepTitle()}</h2>
                      <p className="text-sm text-gray-500">
                        Step {step === "details" ? 1 : step === "delivery" ? 2 : 3} of 3
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>

                    <button
                      onClick={onClose}
                      className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Progress Steps - Desktop */}
                <div className="px-6 lg:px-8 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center justify-between max-w-md mx-auto">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          step === "details" ? "" : "bg-gray-100"
                        }`}
                        style={{
                          backgroundColor: step === "details" ? themeColor : undefined,
                        }}
                      >
                        {step !== "details" ? (
                          <Check size={18} className="text-gray-500" />
                        ) : (
                          <User size={18} className="text-white" />
                        )}
                      </div>
                      <div
                        className={`text-sm ${step === "details" ? "font-medium" : "text-gray-500"}`}
                        style={{ color: step === "details" ? themeColor : undefined }}
                      >
                        Customer Details
                      </div>
                    </div>
                    <div
                      className="flex-1 h-1 mx-4"
                      style={{
                        backgroundColor: step !== "details" ? themeColor : `${themeColor}20`,
                      }}
                    ></div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          step === "delivery" ? "" : "bg-gray-100"
                        }`}
                        style={{
                          backgroundColor: step === "delivery" ? themeColor : undefined,
                        }}
                      >
                        {step === "payment" ? (
                          <Check size={18} className="text-gray-500" />
                        ) : step === "delivery" ? (
                          <Truck size={18} className="text-white" />
                        ) : (
                          <Truck size={18} className="text-gray-500" />
                        )}
                      </div>
                      <div
                        className={`text-sm ${step === "delivery" ? "font-medium" : "text-gray-500"}`}
                        style={{ color: step === "delivery" ? themeColor : undefined }}
                      >
                        Delivery Options
                      </div>
                    </div>
                    <div
                      className="flex-1 h-1 mx-4"
                      style={{
                        backgroundColor: step === "payment" ? themeColor : `${themeColor}20`,
                      }}
                    ></div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          step === "payment" ? "" : "bg-gray-100"
                        }`}
                        style={{
                          backgroundColor: step === "payment" ? themeColor : undefined,
                        }}
                      >
                        <CreditCard size={18} className={step === "payment" ? "text-white" : "text-gray-500"} />
                      </div>
                      <div
                        className={`text-sm ${step === "payment" ? "font-medium" : "text-gray-500"}`}
                        style={{ color: step === "payment" ? themeColor : undefined }}
                      >
                        Payment & Review
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Content - Scrollable */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-6 lg:p-8">{renderStepContent()}</div>

                {/* Desktop Action buttons */}
                <div className="p-6 lg:p-8 border-t border-gray-100 bg-white">{renderStepNavigation()}</div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
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


const customStyles = `
/* Enhanced scrollbar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth transitions and animations */
* {
  scroll-behavior: smooth;
}

/* Enhanced focus styles for accessibility */
button:focus-visible {
  outline: 3px solid #6366f1;
  outline-offset: 2px;
}

/* Enhanced backdrop blur for better browser compatibility */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Improve touch responsiveness */
  button {
    touch-action: manipulation;
  }
}

/* Desktop optimizations */
@media (min-width: 769px) {
  /* Smooth transitions for larger screens */
  .transition-all {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
`

if (typeof document !== "undefined" && !document.getElementById("checkout-drawer-styles")) {
  const styleElement = document.createElement("style")
  styleElement.id = "checkout-drawer-styles"
  styleElement.textContent = customStyles
  document.head.appendChild(styleElement)
}

export default CheckoutDrawer
