"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Check } from "lucide-react"

interface Product {
  name: string
  image_urls?: string[]
  discount_price?: string
  main_price: string
}

interface CartNotificationProps {
  product: Product
  isVisible: boolean
  themeColor: string
  onViewCart: () => void
}

const CartNotification: React.FC<CartNotificationProps> = ({
  product,
  isVisible,
  themeColor,
  onViewCart
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-50 max-w-xs w-full"
        >
          <div 
            className="rounded-xl overflow-hidden shadow-xl border"
            style={{ borderColor: `${themeColor}30` }}
          >
            <div 
              className="w-full py-2 px-4 flex items-center justify-between text-white"
              style={{ backgroundColor: themeColor }}
            >
              <div className="flex items-center">
                <Check size={16} className="mr-1" />
                <span className="font-medium text-sm">Added to cart</span>
              </div>
              <button
                onClick={onViewCart}
                className="text-xs underline font-medium"
              >
                View Cart
              </button>
            </div>
            
            <div className="bg-white p-3 flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3 flex-shrink-0">
                {product.image_urls && product.image_urls.length > 0 ? (
                  <img
                    src={product.image_urls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ShoppingBag size={18} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                <div className="flex items-center mt-1">
                  <span 
                    className="text-sm font-semibold" 
                    style={{ color: themeColor }}
                  >
                    ₦{Number(product.discount_price || product.main_price).toLocaleString()}
                  </span>
                  
                  {Number(product.main_price) > Number(product.discount_price || 0) && (
                    <span className="text-xs text-gray-400 line-through ml-2">
                      ₦{Number(product.main_price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CartNotification