"use client"

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  discount_price: string;
  main_price: string;
  image_urls: string[];
}

interface NotificationProps {
  product: Product | null;
  isVisible: boolean;
  themeColor: string;
  onViewCart: () => void;
}

const CartNotification: React.FC<NotificationProps> = ({
  product,
  isVisible,
  themeColor,
  onViewCart,
}) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 w-full max-w-xs"
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">Added to cart</p>
                  <p className="mt-1 text-sm text-green-500">Success</p>
                </div>
              </div>

              <div className="mt-4 flex items-center border-t border-gray-200 pt-4">
                <div className="flex-shrink-0">
                  {product.image_urls && product.image_urls.length > 0 ? (
                    <img
                      className="h-10 w-10 rounded object-cover"
                      src={product.image_urls[0]}
                      alt={product.name}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </div>

                <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
              <p className="text-sm text-gray-500">
                ₦{Number(product.discount_price || product.main_price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </p>
            </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={onViewCart}
                  className="w-full flex justify-center items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartNotification;