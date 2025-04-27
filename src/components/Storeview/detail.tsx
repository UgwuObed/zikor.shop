"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Heart, Share, Star, ChevronLeft, ChevronRight } from "lucide-react"

interface ProductDetailViewProps {
  product: {
    id: number
    name: string
    main_price: string
    discount_price: string
    quantity: number
    description: string
    category: {
      id: number
      name: string
    }
    image_urls: string[]
  }
  onAddToCart: (productId: number) => void
  themeColor: string
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onAddToCart, themeColor = "#6366f1" }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const placeholderImage = "https://via.placeholder.com/400x400?text=No+Image"

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.quantity) {
      setQuantity(value)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Product Image Carousel */}
        <div className="relative h-80 md:h-96 bg-gray-100">
          {product.image_urls.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.image_urls[activeImageIndex] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Image Navigation */}
              {product.image_urls.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev === 0 ? product.image_urls.length - 1 : prev - 1))
                    }
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white shadow-md z-10"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev === product.image_urls.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white shadow-md z-10"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Thumbnail Previews */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 px-4">
                    <div className="flex space-x-2 p-2 bg-white/70 rounded-lg overflow-x-auto">
                      {product.image_urls.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-12 h-12 rounded border-2 overflow-hidden flex-shrink-0 transition-all duration-200 ${
                            idx === activeImageIndex ? "opacity-100 border-opacity-100" : "opacity-70 border-opacity-0"
                          }`}
                          style={{ borderColor: idx === activeImageIndex ? themeColor : "transparent" }}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`${product.name} - image ${idx + 1}`}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Image
                src={placeholderImage || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="max-h-full"
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <span
                className="text-sm font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${themeColor}15`,
                  color: themeColor,
                }}
              >
                {product.category.name}
              </span>
              <h3 className="text-2xl font-bold mt-2">{product.name}</h3>
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Heart size={20} className="text-gray-500" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Share size={20} className="text-gray-500" />
              </motion.button>
            </div>
          </div>

          <div className="mt-4 flex items-baseline">
          <span className="text-2xl font-bold" style={{ color: themeColor }}>
              ₦{Number(product.discount_price || product.main_price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
            {Number(product.discount_price || 0) < Number(product.main_price) && product.discount_price && (
              <span className="ml-2 text-sm line-through text-gray-500">
                ₦{Number(product.main_price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < 4 ? themeColor : "none"}
                  stroke={i < 4 ? themeColor : "currentColor"}
                  className="text-gray-300"
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">4.0 (24 reviews)</span>
          </div>

          <p className="mt-4 text-gray-600">{product.description || "No description available."}</p>

          <div className="mt-4 text-sm">
            <span className={`${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.quantity > 0 ? `In Stock (${product.quantity} available)` : "Out of Stock"}
            </span>
          </div>

          {/* Quantity Selector */}
          {product.quantity > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-1 border rounded-l-md hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  min="1"
                  max={product.quantity}
                  className="w-16 text-center py-1 border-t border-b focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.quantity}
                  className="px-3 py-1 border rounded-r-md hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToCart(product.id)}
            disabled={product.quantity <= 0}
            className="mt-6 w-full py-3 rounded-lg font-medium text-white flex items-center justify-center space-x-2 transition-all"
            style={{
              backgroundColor: product.quantity > 0 ? themeColor : "gray",
              opacity: product.quantity > 0 ? 1 : 0.5,
            }}
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductDetailView