"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ShoppingCart, ChevronRight, Tag, Star } from "lucide-react"

interface Product {
  id: number
  name?: string | null
  description?: string | null
  main_price?: string | null
  discount_price?: string | null
  quantity?: number | null
  image_urls?: string[] | null
  category?: {
    name?: string | null
  }
  rating?: number
  features?: string[]
  is_featured?: boolean
  is_new?: boolean
}

interface ProductCardProps {
  product: Product
  isActive: boolean
  onClick: () => void
  onAddToCart: (productId: number) => void
  themeColor: string
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isActive, onClick, onAddToCart, themeColor }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const discountPercentage =
    product.main_price && product.discount_price
      ? Math.round(((Number(product.main_price) - Number(product.discount_price)) / Number(product.main_price)) * 100)
      : 0

  const hasDiscount = discountPercentage > 0
  const isInStock = (product.quantity ?? 0) > 0
  const hasMultipleImages = product.image_urls && product.image_urls.length > 1

  const nextImage = () => {
    if (!product.image_urls || product.image_urls.length <= 1) return
    setCurrentImageIndex((prev) => (prev + 1) % product.image_urls!.length)
  }

  const prevImage = () => {
    if (!product.image_urls || product.image_urls.length <= 1) return
    setCurrentImageIndex((prev) => (prev === 0 ? product.image_urls!.length - 1 : prev - 1))
  }

  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return `${text.substring(0, maxLength)}...`
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product.id)
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 1500)
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all cursor-pointer h-full flex flex-col ${
        isActive ? "ring-2" : ""
      }`}
      style={{
        outlineColor: isActive ? themeColor : "transparent",
        boxShadow: isHovered ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" : undefined,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 15 } }}
    >
      {/* Product Image Section - Changed to fixed height */}
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        {/* Image with transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {product.image_urls?.[currentImageIndex] ? (
              <img
                src={product.image_urls[currentImageIndex] || "/placeholder.svg"}
                alt={product.name || "Product image"}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Image Navigation - only show on hover */}
        {hasMultipleImages && isHovered && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              aria-label="Previous image"
            >
              <ChevronRight size={16} className="transform rotate-180" />
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </motion.button>
          </>
        )}

        {/* Image Indicators */}
        {hasMultipleImages && product.image_urls && product.image_urls.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <div className="flex space-x-1.5 px-2 py-1 bg-white bg-opacity-70 rounded-full">
              {product.image_urls.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentImageIndex === idx ? "scale-125" : "opacity-70"
                  }`}
                  style={{
                    backgroundColor: currentImageIndex === idx ? themeColor : "#888",
                  }}
                  whileHover={{ scale: 1.3 }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <motion.button
          onClick={toggleFavorite}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm ${
            isFavorite ? "bg-red-50" : "bg-white"
          }`}
          style={{ 
            color: isFavorite ? "#e53e3e" : "#888",
            transition: "all 0.2s ease"
          }}
          aria-label="Add to favorites"
        >
          <Heart 
            size={18} 
            fill={isFavorite ? "#e53e3e" : "none"} 
            className={isFavorite ? "animate-heartbeat" : ""}
          />
        </motion.button>

        {/* Product Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-xs font-medium px-2.5 py-1 rounded-full text-white flex items-center shadow-sm"
              style={{ backgroundColor: "#e53e3e" }}
            >
              <Tag size={10} className="mr-1" />
              {discountPercentage}% OFF
            </motion.span>
          )}

          {product.is_new && (
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="text-xs font-medium px-2.5 py-1 rounded-full text-white shadow-sm"
              style={{ backgroundColor: themeColor }}
            >
              NEW
            </motion.span>
          )}

          {product.is_featured && (
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-sm"
            >
              FEATURED
            </motion.span>
          )}
        </div>
        
        {/* Out of stock overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-medium text-sm px-3 py-1.5 bg-gray-900 bg-opacity-70 rounded-md">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-gray-900 leading-tight mb-1">
          {truncateText(product.name, 40)}
        </h3>

        {product.rating && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={star <= product.rating! ? "text-amber-400" : "text-gray-200"}
                  fill={star <= product.rating! ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1.5">{product.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
          <span className="font-bold text-base text-gray-900">
          ₦{Number(product.discount_price || product.main_price || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-500 line-through">
              ₦{Number(product.main_price || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          )}
          </div>
          <motion.button
            onClick={handleAddToCart}
            disabled={!isInStock}
            whileTap={{ scale: 0.9 }}
            className={`p-2.5 rounded-full transition-all duration-300 ${
              !isInStock 
                ? "bg-gray-100 cursor-not-allowed" 
                : isAddedToCart 
                  ? "bg-green-100" 
                  : ""
            }`}
            style={{ 
              backgroundColor: isInStock && !isAddedToCart ? `${themeColor}20` : undefined,
              color: isInStock ? isAddedToCart ? "#16a34a" : themeColor : "gray" 
            }}
            aria-label="Add to cart"
          >
            <ShoppingCart 
              size={18} 
              className={isAddedToCart ? "animate-bounce" : ""}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
export default ProductCard