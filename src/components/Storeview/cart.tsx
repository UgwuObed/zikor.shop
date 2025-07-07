"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingCartIcon as CartIcon, Plus, Minus, CreditCard, Trash2, 
  ArrowLeft, X, ShoppingBag, Save, Check, Info, ArrowRight, Lock
} from "lucide-react"
import CheckoutFlow from "./checkout"

interface Product {
  id: number
  name: string
  main_price: string
  discount_price: string
  quantity: number
  image_urls: string[]
  selectedColor?: string
  selectedSize?: string
}

interface BuyerInfo {
  name: string
  email: string
  phone: string
}

interface ShippingFee {
  id: number;
  storefront_id: number;
  name: string;
  state: string;
  baseFee: string;
  additionalFee: string;
  created_at?: string;
  updated_at?: string;
}

interface CartItem {
  id: number
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  products: Product[]
  onUpdateQuantity: (productId: number, newQuantity: number,  selectedColor?: string, selectedSize?: string) => void
  onRemoveItem: (productId: number) => void
  onCheckout: (buyerInfo: BuyerInfo) => Promise<void>
  onSaveBuyerInfo?: (buyerInfo: BuyerInfo) => Promise<void>
  themeColor: string
  initialBuyerInfo?: BuyerInfo
  shippingFees: ShippingFee[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  isOpen,
  onClose,
  cartItems,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onSaveBuyerInfo,
  themeColor,
  initialBuyerInfo,
  shippingFees,
}) => {
  const [productsInCart, setProductsInCart] = useState<(Product & { cartQuantity: number })[]>([])
  const [isRemoving, setIsRemoving] = useState<number | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [savingInfo, setSavingInfo] = useState(false)
  const [buyerInfoSaved, setBuyerInfoSaved] = useState(false)
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>(initialBuyerInfo || {
    name: '',
    email: '',
    phone: ''
  })
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'buyer-info' | 'confirm'>('cart')
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isExiting, setIsExiting] = useState(false)
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showCheckoutFlow, setShowCheckoutFlow] = useState(false);

  

  useEffect(() => {
    if (initialBuyerInfo && initialBuyerInfo.name) {
      setBuyerInfo(initialBuyerInfo);
      setBuyerInfoSaved(true);
    }
  }, [initialBuyerInfo]);

  useEffect(() => {
    const itemsWithDetails = cartItems
      .map((item) => {
        const productDetails = products.find((p) => p.id === item.id)
        if (!productDetails) return null

        return {
          ...productDetails,
          cartQuantity: item.quantity,
        }
      })
      .filter(Boolean) as (Product & { cartQuantity: number })[]

    setProductsInCart(itemsWithDetails)
    
    if (itemsWithDetails.length === 0) {
      setCheckoutStep('cart')
    }
    else if (itemsWithDetails.length > 0 && checkoutStep === 'cart' && 
             !buyerInfoSaved && !buyerInfo.name && !buyerInfo.email && !buyerInfo.phone) {
      const timer = setTimeout(() => {
        setCheckoutStep('buyer-info');
        setInfoMessage("Fill in your details to save with your cart. You can continue shopping afterward.");
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [cartItems, products, buyerInfo, checkoutStep, buyerInfoSaved])

  const subtotal = productsInCart.reduce(
    (total, item) => total + Number(item.discount_price || item.main_price) * item.cartQuantity,
    0,
  )
  const total = subtotal 

  const formatPrice = (price: number) => 
    `₦${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`

  const handleRemoveItem = (productId: number) => {
    setIsRemoving(productId)
    setTimeout(() => {
      onRemoveItem(productId)
      setIsRemoving(null)
    }, 300)
  }

  const handleStartCheckout = () => {
    if (productsInCart.length === 0) return;
    
    setShowCheckoutFlow(true);
  };

  const handleProceedToCheckout = () => {
    if (productsInCart.length === 0) return;
    
    if (buyerInfoSaved && buyerInfo.name && buyerInfo.email && buyerInfo.phone) {
      setShowCheckoutFlow(true);
      // setShowCart(false); 
    } else {
      setCheckoutStep('buyer-info');
      setInfoMessage("Please confirm your details before proceeding to checkout.");
    }
  };
  


  const handleBackToCart = () => {
    setCheckoutStep('cart')
    setInfoMessage(null)
  }
  
  const handleSaveBuyerInfo = async () => {
    if (!buyerInfo.name || !buyerInfo.email || !buyerInfo.phone) {
      return;
    }
    
    setSavingInfo(true);
    
    try {
      if (onSaveBuyerInfo) {
        await onSaveBuyerInfo(buyerInfo);
      }
      
      setBuyerInfoSaved(true);
      setShowSavedMessage(true);
      
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 5000);
      
      setTimeout(() => {
        setCheckoutStep('cart');
      }, 1500);
    } catch (error) {
      console.error('Failed to save buyer info:', error);
      setInfoMessage("There was a problem saving your information. Please try again.");
    } finally {
      setSavingInfo(false);
    }
  };
  
  const handleBuyerInfoNext = () => {
    if (buyerInfo.name && buyerInfo.email && buyerInfo.phone) {
      setCheckoutStep('confirm')
      setInfoMessage(null)
    }
  }

  const handleCompleteCheckout = async () => {
    setCheckoutLoading(true)
    try {
      await onCheckout(buyerInfo)
      setCheckoutStep('cart')
      setInfoMessage(null)
    } catch (error) {
      console.error('Checkout failed:', error)
      setInfoMessage("Checkout failed. Please try again.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      onClose()
    }, 300)
  }

  const isBuyerInfoValid = buyerInfo.name && buyerInfo.email && buyerInfo.phone;

  const renderCheckoutContent = () => {
    switch (checkoutStep) {
      case 'buyer-info':
        return (
          <div className="space-y-4">
            <div className="checkout-steps mb-6">
              <div className="flex items-center justify-between">
                <div className="step-item flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 bg-gray-100">
                    <CartIcon size={16} className="text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-500">Cart</div>
                </div>
                <div className="step-line flex-1 h-1 mx-2" style={{ backgroundColor: `${themeColor}20` }}></div>
                <div className="step-item flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: themeColor }}>
                    <motion.div
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                    >
                      <Info size={16} className="text-white" />
                    </motion.div>
                  </div>
                  <div className="text-xs font-medium" style={{ color: themeColor }}>Details</div>
                </div>
                <div className="step-line flex-1 h-1 mx-2" style={{ backgroundColor: `${themeColor}20` }}></div>
                <div className="step-item flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 bg-gray-100">
                    <CreditCard size={16} className="text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-500">Confirm</div>
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-5 rounded-2xl shadow-md bg-white border"
              style={{ borderColor: `${themeColor}20` }}
            >
              <h3 className="text-sm font-semibold mb-5 flex items-center gap-1" style={{ color: themeColor }}>
                <Info size={18} /> 
                Your Information is required to save your cart
              </h3>
              
              {showSavedMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-lg"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check size={18} className="text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Your information has been saved successfully!</p>
                  </div>
                </div>
              </motion.div>
            )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 font-medium">Full Name *</label>
                  <input
                    type="text"
                    value={buyerInfo.name}
                    onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ 
                      borderColor: `${themeColor}30`,
                      '--tw-ring-color': themeColor 
                    } as React.CSSProperties}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 font-medium">Email *</label>
                  <input
                    type="email"
                    value={buyerInfo.email}
                    onChange={(e) => setBuyerInfo({...buyerInfo, email: e.target.value})}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ 
                      borderColor: `${themeColor}30`,
                      '--tw-ring-color': themeColor 
                    } as React.CSSProperties}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    value={buyerInfo.phone}
                    onChange={(e) => setBuyerInfo({...buyerInfo, phone: e.target.value})}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ 
                      borderColor: `${themeColor}30`,
                      '--tw-ring-color': themeColor 
                    } as React.CSSProperties}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
            </motion.div>
          </div>
        );
      
      case 'confirm':
        return (
          <div className="space-y-5">
            <div className="checkout-steps mb-6">
              <div className="flex items-center justify-between">
                <div className="step-item flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 bg-gray-100">
                    <CartIcon size={16} className="text-gray-500" />
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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: themeColor }}>
                    <motion.div
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                    >
                      <CreditCard size={16} className="text-white" />
                    </motion.div>
                  </div>
                  <div className="text-xs font-medium" style={{ color: themeColor }}>Confirm</div>
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-5 rounded-2xl shadow-md bg-white border mb-4"
              style={{ borderColor: `${themeColor}20` }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                <Lock size={18} />
                Order Summary
              </h3>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="font-medium mb-3 text-gray-700">Your Information</h4>
                <div className="text-sm space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium w-16 text-gray-600">Name:</span> 
                    <span className="text-gray-800">{buyerInfo.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-16 text-gray-600">Email:</span> 
                    <span className="text-gray-800">{buyerInfo.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-16 text-gray-600">Phone:</span> 
                    <span className="text-gray-800">{buyerInfo.phone}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-5 rounded-2xl shadow-md bg-white border"
              style={{ borderColor: `${themeColor}20` }}
            >
              <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-700">
                <ShoppingBag size={18} className="text-gray-600" />
                Order Items ({productsInCart.length})
              </h4>
              <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                {productsInCart.map(product => (
                  <div key={product.id} className="flex items-center justify-between py-3 border-b" style={{ borderColor: `${themeColor}15` }}>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 shadow-sm border" style={{ borderColor: `${themeColor}20` }}>
                        {product.image_urls && product.image_urls.length > 0 ? (
                          <img 
                            src={product.image_urls[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-xs text-gray-400">No img</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium line-clamp-1">{product.name}</div>
                        <div className="text-xs text-gray-500">Qty: {product.cartQuantity}</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium" style={{ color: themeColor }}>
                      {formatPrice(Number(product.discount_price || product.main_price) * product.cartQuantity)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-5">
       
            {infoMessage && !buyerInfoSaved && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-lg"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info size={18} className="text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">{infoMessage}</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <AnimatePresence>
              {productsInCart.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: isRemoving === product.id ? 0 : 1, 
                    y: isRemoving === product.id ? -20 : 0,
                    height: isRemoving === product.id ? 0 : "auto"
                  }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="group"
                >
                  <div 
                    className="p-4 rounded-2xl transition-all border shadow-sm hover:shadow-md"
                    style={{ 
                      backgroundColor: `${themeColor}05`,
                      borderColor: `${themeColor}15` 
                    }}
                  >
                    <div className="flex">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-white overflow-hidden flex-shrink-0 border shadow-sm" style={{ borderColor: `${themeColor}20` }}>
                        {product.image_urls && product.image_urls.length > 0 ? (
                          <img
                            src={product.image_urls[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-gray-400">No image</span>
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex-1">
  <div className="flex justify-between">
    <div className="pr-2">
      <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
      
      {/* Show selected color and size */}
      <div className="flex flex-wrap gap-2 mt-1">
        {product.selectedColor && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            Color: {product.selectedColor}
          </span>
        )}
        {product.selectedSize && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            Size: {product.selectedSize}
          </span>
        )}
      </div>
    </div>
    
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: "#FEE2E2" }}
      whileTap={{ scale: 0.9 }}
      onClick={() => handleRemoveItem(product.id)}
      className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full bg-white shadow-sm border border-gray-100"
    >
      <Trash2 size={14} />
    </motion.button>
  </div>

  {/* Price and quantity controls remain the same */}
  <div className="flex items-center mt-2">
    <span className="font-semibold text-lg" style={{ color: themeColor }}>
      ₦{Number(product.discount_price || product.main_price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
    </span>

    {product.discount_price && Number(product.main_price) > Number(product.discount_price) && (
      <span className="text-xs text-gray-400 line-through ml-2">
        ₦{Number(product.main_price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
      </span>
    )}
  </div>
  
  <div className="flex items-center justify-between mt-3">
    <div className="flex items-center border rounded-full bg-white overflow-hidden shadow-sm" style={{ borderColor: `${themeColor}30` }}>
      <motion.button
        whileHover={{ backgroundColor: `${themeColor}10` }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onUpdateQuantity(
          product.id, 
          Math.max(1, product.cartQuantity - 1),
          product.selectedColor,
          product.selectedSize
        )}
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        disabled={product.cartQuantity <= 1}
        style={{ color: product.cartQuantity <= 1 ? 'gray' : themeColor }}
      >
        <Minus size={14} />
      </motion.button>
      <span className="w-8 text-center text-sm font-medium">{product.cartQuantity}</span>
      <motion.button
        whileHover={{ backgroundColor: `${themeColor}10` }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onUpdateQuantity(
          product.id, 
          product.cartQuantity + 1,
          product.selectedColor,
          product.selectedSize
        )}
        className="w-8 h-8 flex items-center justify-center transition-colors"
        disabled={product.cartQuantity >= product.quantity}
        style={{ color: product.cartQuantity >= product.quantity ? 'gray' : themeColor }}
      >
        <Plus size={14} />
      </motion.button>
    </div>

    <div className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm" style={{ borderLeft: `3px solid ${themeColor}` }}>
      {formatPrice(
        Number(product.discount_price || product.main_price) * product.cartQuantity,
      )}
    </div>
  </div>
</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Empty Cart State */}
            {productsInCart.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-10"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotateY: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="w-32 h-32 rounded-full flex items-center justify-center mb-6 relative"
                  style={{ backgroundColor: `${themeColor}10` }}
                >
                  <div className="absolute inset-0 rounded-full" style={{ 
                    border: `3px dashed ${themeColor}30`,
                    animation: 'spin 15s linear infinite'
                  }} />
                  <ShoppingBag size={48} style={{ color: themeColor }} />
                </motion.div>
                <h3 className="text-gray-800 font-semibold text-xl mb-3">Your cart is empty</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-6">
                  Looks like you haven't added any products to your cart yet. Browse our products and find something you like!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-8 py-3.5 rounded-full text-sm font-medium shadow-md flex items-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${themeColor}, ${adjustColorLightness(themeColor, 0.8)})`,
                    color: "white",
                  }}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Discover Products
                </motion.button>
              </motion.div>
            )}
          </div>
        );
    }
  };

  const renderActionButtons = () => {
    switch (checkoutStep) {
      case 'buyer-info':
        return (
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveBuyerInfo}
              disabled={savingInfo || !isBuyerInfoValid}
              className="w-full py-3 rounded-full font-medium text-white flex items-center justify-center shadow-md"
              style={{ 
                backgroundColor: (!isBuyerInfoValid) 
                  ? '#CCCCCC'
                  : themeColor 
              }}
            >
              {savingInfo ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save & Continue Shopping
                </>
              )}
            </motion.button>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBackToCart}
                className="flex-1 py-3 rounded-full font-medium border flex items-center justify-center"
                style={{
                  backgroundColor: "white",
                  color: themeColor,
                  borderColor: `${themeColor}30`
                }}
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyerInfoNext}
                disabled={!isBuyerInfoValid}
                className="flex-1 py-3 rounded-full font-medium text-white flex items-center justify-center shadow-md"
                style={{ 
                  backgroundColor: (!isBuyerInfoValid) 
                    ? '#CCCCCC'
                    : themeColor 
                }}
              >
                Review Order
                <ArrowRight size={18} className="ml-2" />
              </motion.button>
            </div>
          </div>
        );
      
      case 'confirm':
        return (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCheckoutStep('buyer-info')}
              className="flex-1 py-3 rounded-full font-medium border flex items-center justify-center"
              style={{
                backgroundColor: "white",
                color: themeColor,
                borderColor: `${themeColor}30`
              }}
            >
              <ArrowLeft size={18} className="mr-2" />
              Edit Info
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCompleteCheckout}
              disabled={checkoutLoading}
              className="flex-1 py-3 rounded-full font-medium text-white flex items-center justify-center shadow-md"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${themeColor}, ${adjustColorLightness(themeColor, 0.8)})` 
              }}
            >
              {checkoutLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  Complete Order
                  <Lock size={16} className="ml-2" />
                </>
              )}
            </motion.button>
          </div>
        );
      
      default:
        return (
          <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStartCheckout}
        disabled={productsInCart.length === 0}
        className="w-full py-4 rounded-full font-medium text-white flex items-center justify-center shadow-lg"
        style={{ 
          backgroundImage: productsInCart.length === 0 
            ? 'linear-gradient(135deg, #cccccc, #aaaaaa)'
            : `linear-gradient(135deg, ${themeColor}, ${adjustColorLightness(themeColor, 0.8)})`,
        }}
      >
        <CreditCard size={20} className="mr-2" />
        Proceed to Checkout
      </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full mt-3 py-3 rounded-full font-medium flex items-center justify-center transition-colors border"
              style={{
                backgroundColor: "white",
                color: themeColor,
                borderColor: `${themeColor}30`
              }}
            >
              <ArrowLeft size={18} className="mr-2" />
              Continue Shopping
            </motion.button>
          </>
        );
    }
  };

  const getHeaderTitle = () => {
    switch (checkoutStep) {
      case 'buyer-info':
        return "Customer Information";
      case 'confirm':
        return "Review & Confirm Order";
      default:
        return "Your Cart";
    }
  };

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-black z-40"
            onClick={handleClose}
          />
        {showCheckoutFlow ? (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="fixed inset-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
          >
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <CheckoutFlow
              themeColor={themeColor}
              buyerInfo={buyerInfo}
              cartItems={cartItems}
              products={products}
              shippingFees={shippingFees}
              onUpdateBuyerInfo={(updatedInfo) => {
                setBuyerInfo(updatedInfo);
                if (onSaveBuyerInfo) onSaveBuyerInfo(updatedInfo);
              }}
              onCheckout={onCheckout}
              onCancel={() => {
                setShowCheckoutFlow(false);
                // setShowCart(true); // Show cart again when canceling checkout
              }}
            />
          </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col sm:rounded-l-[24px]"
          >
            <div
              className="px-6 py-5 flex justify-between items-center"
              style={{ 
                borderBottom: `1px solid ${themeColor}15`,
                background: `linear-gradient(135deg, ${themeColor}05, ${themeColor}15)` 
              }}
            >
              <div className="flex items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-md"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${themeColor}, ${adjustColorLightness(themeColor, 0.8)})` 
                  }}
                >
                  <CartIcon size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-gray-900">
                    {getHeaderTitle()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {checkoutStep === 'cart' && (cartItems.length > 0
                      ? `${cartItems.reduce((sum, item) => sum + item.quantity, 0)} items`
                      : "No items yet")}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: `${themeColor}25` }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
                style={{ backgroundColor: `${themeColor}15` }}
              >
                <X size={20} className="text-gray-600" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {renderCheckoutContent()}
            </div>

            {productsInCart.length > 0 && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="p-6 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
                style={{ 
                  background: `linear-gradient(to bottom, white, ${themeColor}05)`,
                  borderTop: `1px solid ${themeColor}15`
                }}
              >
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  </div> */}
                  <div
                    className="pt-4 mt-2 flex justify-between font-bold text-xl"
                    style={{ borderTop: `1px dashed ${themeColor}30` }}
                  >
                    <span>Total</span>
                    <span style={{ color: themeColor }}>{formatPrice(total)}</span>
                  </div>
                </div>

                {renderActionButtons()}
              </motion.div>
            )}
          </motion.div>
        )}
        </>
      )}
    </AnimatePresence>
  )
}

export default ShoppingCart

