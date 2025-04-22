"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCartIcon as CartIcon, Plus, Minus, CreditCard, Trash2, ArrowLeft, X, ShoppingBag } from "lucide-react"

interface Product {
  id: number
  name: string
  main_price: string
  discount_price: string
  quantity: number
  image_urls: string[]
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
  themeColor: string
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  isOpen,
  onClose,
  cartItems,
  products,
  onUpdateQuantity,
  onRemoveItem,
  themeColor,
}) => {
  const [productsInCart, setProductsInCart] = useState<(Product & { cartQuantity: number })[]>([])
  const [isRemoving, setIsRemoving] = useState<number | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

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
  }, [cartItems, products])

  const subtotal = productsInCart.reduce(
    (total, item) => total + Number(item.discount_price || item.main_price) * item.cartQuantity,
    0,
  )

  const shipping = subtotal > 0 ? 5 : 0
  const total = subtotal + shipping

  const formatPrice = (price: number) => `₦${price.toFixed(2)}`

  const handleRemoveItem = (productId: number) => {
    setIsRemoving(productId)
    // Add a small delay to allow the animation to play
    setTimeout(() => {
      onRemoveItem(productId)
      setIsRemoving(null)
    }, 300)
  }

  const handleCheckout = () => {
    setCheckoutLoading(true)
    // Simulate checkout process
    setTimeout(() => {
      setCheckoutLoading(false)
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with improved animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Cart Panel with improved animation */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 h-full w-full max-w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col"
            style={{ borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px" }}
          >
            {/* Header with improved styling */}
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
                  <h2 className="font-bold text-xl text-gray-900">Your Cart</h2>
                  <p className="text-sm text-gray-500">
                    {cartItems.length > 0
                      ? `${cartItems.reduce((sum, item) => sum + item.quantity, 0)} items`
                      : "No items yet"}
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

            {/* Cart Content with improved styling */}
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
                <div className="space-y-5">
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
                            {/* Product Image with improved styling */}
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

                            {/* Product Info with improved styling */}
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium text-gray-900 line-clamp-2 pr-2">{product.name}</h3>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleRemoveItem(product.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full bg-white shadow-sm border border-gray-100"
                                  style={{ opacity: 1 }} // Always visible
                                >
                                  <Trash2 size={14} />
                                </motion.button>
                              </div>

                              <div className="flex items-center mt-2">
                                <span className="font-semibold text-lg" style={{ color: themeColor }}>
                                  ₦{product.discount_price || product.main_price}
                                </span>
                                {Number(product.main_price) > Number(product.discount_price || 0) && (
                                  <span className="text-xs text-gray-400 line-through ml-2">₦{product.main_price}</span>
                                )}
                              </div>

                              {/* Quantity Controls with improved styling */}
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
              )}
            </div>

            {/* Cart Summary with improved styling */}
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full py-4 rounded-full font-medium text-white flex items-center justify-center shadow-lg"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                  }}
                >
                  {checkoutLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <CreditCard size={20} className="mr-2" />
                  )}
                  {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
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
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ShoppingCart