"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCartIcon as CartIcon, Plus, Minus, CreditCard, Trash2, 
         ArrowLeft, X, ShoppingBag, Save, Check, Info } from "lucide-react"

interface Product {
  id: number
  name: string
  main_price: string
  discount_price: string
  quantity: number
  image_urls: string[]
}

interface BuyerInfo {
  name: string
  email: string
  phone: string
}

interface CartItem {
  id: number
  quantity: number
}

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  products: Product[]
  onUpdateQuantity: (productId: number, newQuantity: number) => void
  onRemoveItem: (productId: number) => void
  onCheckout: (buyerInfo: BuyerInfo) => Promise<void>
  onSaveBuyerInfo?: (buyerInfo: BuyerInfo) => Promise<void>
  themeColor: string
  initialBuyerInfo?: BuyerInfo
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
  initialBuyerInfo
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
  
  // Set buyer info from props if provided
  useEffect(() => {
    if (initialBuyerInfo && initialBuyerInfo.name) {
      setBuyerInfo(initialBuyerInfo);
      setBuyerInfoSaved(true);
    }
  }, [initialBuyerInfo]);

  // Map cart items to products
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
    
    // If cart becomes empty, reset to cart view
    if (itemsWithDetails.length === 0) {
      setCheckoutStep('cart')
    }
    // Auto proceed to buyer info if cart has items and user hasn't filled info yet and isn't in another checkout step
    else if (itemsWithDetails.length > 0 && checkoutStep === 'cart' && 
             !buyerInfoSaved && !buyerInfo.name && !buyerInfo.email && !buyerInfo.phone) {
      // Wait 2 seconds before showing the form to give user time to view cart
      const timer = setTimeout(() => {
        setCheckoutStep('buyer-info');
        setInfoMessage("Fill in your details to save with your cart. You can continue shopping afterward.");
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [cartItems, products, buyerInfo, checkoutStep, buyerInfoSaved])

  // Calculate cart totals
  const subtotal = productsInCart.reduce(
    (total, item) => total + Number(item.discount_price || item.main_price) * item.cartQuantity,
    0,
  )
  const shipping = subtotal > 0 ? 5 : 0
  const total = subtotal + shipping

  const formatPrice = (price: number) => 
    `₦${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`

  const handleRemoveItem = (productId: number) => {
    setIsRemoving(productId)
    setTimeout(() => {
      onRemoveItem(productId)
      setIsRemoving(null)
    }, 300)
  }

  const handleProceedToCheckout = () => {
    // If buyer info is already saved, go directly to confirmation
    if (buyerInfoSaved && buyerInfo.name && buyerInfo.email && buyerInfo.phone) {
      setCheckoutStep('confirm')
    } else {
      setCheckoutStep('buyer-info')
      setInfoMessage("Please confirm your details before proceeding to checkout.")
    }
  }

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
      setInfoMessage("Your information has been saved! You can continue shopping or proceed to checkout.");
      
      // Go back to cart view after saving info
      setCheckoutStep('cart');
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
      // Reset the view after successful checkout
      setCheckoutStep('cart')
      setInfoMessage(null)
    } catch (error) {
      console.error('Checkout failed:', error)
      setInfoMessage("Checkout failed. Please try again.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Determine what content to show based on checkout step
  const renderCheckoutContent = () => {
    switch (checkoutStep) {
      case 'buyer-info':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Your Information</h3>
            
            {infoMessage && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Info size={18} className="text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">{infoMessage}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={buyerInfo.name}
                  onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  value={buyerInfo.email}
                  onChange={(e) => setBuyerInfo({...buyerInfo, email: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={buyerInfo.phone}
                  onChange={(e) => setBuyerInfo({...buyerInfo, phone: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          </div>
        );
      
      case 'confirm':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium mb-2">Your Information</h4>
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Name:</span> {buyerInfo.name}</p>
                <p><span className="font-medium">Email:</span> {buyerInfo.email}</p>
                <p><span className="font-medium">Phone:</span> {buyerInfo.phone}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium mb-2">Items ({productsInCart.length})</h4>
              <div className="max-h-40 overflow-y-auto pr-2">
                {productsInCart.map(product => (
                  <div key={product.id} className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-md overflow-hidden mr-2">
                        {product.image_urls && product.image_urls.length > 0 ? (
                          <img 
                            src={product.image_urls[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-gray-400">No img</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm">{product.name} × {product.cartQuantity}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(Number(product.discount_price || product.main_price) * product.cartQuantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-5">
            {buyerInfoSaved && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check size={18} className="text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Your information is saved. Continue shopping or proceed to checkout when ready.</p>
                  </div>
                </div>
              </div>
            )}
            
            {infoMessage && !buyerInfoSaved && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info size={18} className="text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">{infoMessage}</p>
                  </div>
                </div>
              </div>
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
                          <h3 className="font-medium text-gray-900 line-clamp-2 pr-2">{product.name}</h3>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveItem(product.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full bg-white shadow-sm border border-gray-100"
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>

                        <div className="flex items-center mt-2">
                          <span className="font-semibold text-lg" style={{ color: themeColor }}>
                            ₦{Number(product.discount_price || product.main_price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </span>
                          {Number(product.main_price) > Number(product.discount_price || 0) && (
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
                              onClick={() => onUpdateQuantity(product.id, Math.max(1, product.cartQuantity - 1))}
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
                              onClick={() => onUpdateQuantity(product.id, product.cartQuantity + 1)}
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
          </div>
        );
    }
  };

  // Render bottom action buttons based on checkout step
  const renderActionButtons = () => {
    switch (checkoutStep) {
      case 'buyer-info':
        return (
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveBuyerInfo}
              disabled={savingInfo || !buyerInfo.name || !buyerInfo.email || !buyerInfo.phone}
              className="w-full py-3 rounded-full font-medium text-white flex items-center justify-center"
              style={{ 
                backgroundColor: (!buyerInfo.name || !buyerInfo.email || !buyerInfo.phone) 
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
                className="flex-1 py-3 rounded-full font-medium border"
                style={{
                  backgroundColor: "white",
                  color: themeColor,
                  borderColor: `${themeColor}30`
                }}
              >
                Back to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyerInfoNext}
                disabled={!buyerInfo.name || !buyerInfo.email || !buyerInfo.phone}
                className="flex-1 py-3 rounded-full font-medium text-white"
                style={{ 
                  backgroundColor: (!buyerInfo.name || !buyerInfo.email || !buyerInfo.phone) 
                    ? '#CCCCCC'
                    : themeColor 
                }}
              >
                Review Order
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
              className="flex-1 py-3 rounded-full font-medium border"
              style={{
                backgroundColor: "white",
                color: themeColor,
                borderColor: `${themeColor}30`
              }}
            >
              Edit Info
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCompleteCheckout}
              disabled={checkoutLoading}
              className="flex-1 py-3 rounded-full font-medium text-white"
              style={{ backgroundColor: themeColor }}
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
                "Complete Order"
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
              onClick={handleProceedToCheckout}
              className="w-full py-4 rounded-full font-medium text-white flex items-center justify-center shadow-lg"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
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

  // Get the title based on the checkout step
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
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 h-full w-full max-w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col"
            style={{ borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px" }}
          >
            <div
              className="px-6 py-5 flex justify-between items-center"
              style={{ 
                borderBottom: `1px solid ${themeColor}15`,
                background: `linear-gradient(to right, ${themeColor}05, ${themeColor}15)` 
              }}
            >
              <div className="flex items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-md"
                  style={{ backgroundColor: themeColor }}
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
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
                style={{ backgroundColor: `${themeColor}15` }}
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {productsInCart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-28 h-28 rounded-full flex items-center justify-center mb-6 shadow-lg"
                    style={{ backgroundColor: `${themeColor}15` }}
                  >
                    <ShoppingBag size={42} style={{ color: themeColor }} />
                  </motion.div>
                  <h3 className="text-gray-800 font-semibold text-xl">Your cart is empty</h3>
                  <p className="text-gray-500 mt-3 max-w-xs">
                    Looks like you haven't added any products to your cart yet.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="mt-8 px-8 py-3.5 rounded-full text-sm font-medium shadow-md"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                      color: "white",
                    }}
                  >
                    Discover Products
                  </motion.button>
                </div>
              ) : (
                renderCheckoutContent()
              )}
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
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  </div>
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
        </>
      )}
    </AnimatePresence>
  )
}

export default ShoppingCart