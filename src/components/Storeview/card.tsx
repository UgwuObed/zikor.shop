"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ShoppingCart, ChevronRight, Tag, Star, Eye, Check, AlertCircle } from "lucide-react"
import Image from "next/image"

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
  onQuickView?: (productId: number) => void
  themeColor: string
}

const ProductCard = ({ 
  product, 
  isActive, 
  onClick, 
  onAddToCart, 
  onQuickView,
  themeColor = "#6366f1" 
}: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  // Calculate the discount percentage if available
  const discountPercentage =
    product.main_price && product.discount_price
      ? Math.round(((Number(product.main_price) - Number(product.discount_price)) / Number(product.main_price)) * 100)
      : 0

  const hasDiscount = discountPercentage > 0
  const isInStock = (product.quantity ?? 0) > 0
  const isLowStock = isInStock && (product.quantity ?? 0) <= 5
  const hasMultipleImages = product.image_urls && product.image_urls.length > 1
  const placeholderImage = "/api/placeholder/400/400"

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!product.image_urls || product.image_urls.length <= 1) return
    setCurrentImageIndex((prev) => (prev + 1) % product.image_urls!.length)
  }

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!product.image_urls || product.image_urls.length <= 1) return
    setCurrentImageIndex((prev) => (prev === 0 ? product.image_urls!.length - 1 : prev - 1))
  }

  // Set up auto-rotate for images when hovering
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isHovered && hasMultipleImages) {
      timer = setTimeout(() => {
        nextImage()
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [isHovered, currentImageIndex, hasMultipleImages])

  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return `${text.substring(0, maxLength)}...`
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAddingToCart(true)
    
    // Simulate API call
    setTimeout(() => {
      onAddToCart(product.id)
      setAddingToCart(false)
      setIsAddedToCart(true)
      
      // Reset added status after delay
      setTimeout(() => setIsAddedToCart(false), 1500)
    }, 600)
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onQuickView) onQuickView(product.id)
  }

  // Card animation variants
  const cardVariants = {
    normal: { y: 0 },
    hover: { 
      y: -8,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      } 
    }
  }
  
  // Action button variants
  const actionButtonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: custom * 0.1,
        duration: 0.3
      }
    })
  }

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden h-full flex flex-col relative group"
      style={{
        boxShadow: isHovered 
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" 
          : "0 2px 10px -2px rgba(0, 0, 0, 0.05)"
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={cardVariants}
      initial="normal"
      whileHover="hover"
      animate={isHovered ? "hover" : "normal"}
    >
      {/* Highlight border when active */}
      {isActive && (
        <motion.div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ 
            boxShadow: `0 0 0 2px ${themeColor}`,
            zIndex: 2
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
      
      {/* Product Image Section */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
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
              <div className="relative w-full h-full">
                <Image
                  src={product.image_urls[currentImageIndex] || placeholderImage}
                  alt={product.name || "Product image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain transition-transform duration-500"
                  style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
                  priority={false}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Image Navigation Arrows - conditionally showing on hover */}
        {hasMultipleImages && isHovered && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md z-10"
              aria-label="Previous image"
            >
              <ChevronRight size={16} className="transform rotate-180" />
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md z-10"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </motion.button>
          </>
        )}

        {/* Image Pagination Dots */}
        {hasMultipleImages && (
          <div className={`absolute bottom-3 left-0 right-0 flex justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}>
            <div className="flex space-x-1.5 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              {product.image_urls!.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(idx)
                  }}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: currentImageIndex === idx ? themeColor : "#CBD5E1",
                    transform: currentImageIndex === idx ? "scale(1.2)" : "scale(1)",
                  }}
                  whileHover={{ scale: 1.3 }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions - Show on hover, staggered animation */}
        <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}>
          <motion.button
            onClick={toggleFavorite}
            whileTap={{ scale: 0.9 }}
            variants={actionButtonVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            custom={0}
            className={`p-2 rounded-full shadow-sm backdrop-blur-sm ${
              isFavorite ? "bg-red-50" : "bg-white/90"
            }`}
            style={{ 
              color: isFavorite ? "#e53e3e" : "#64748B"
            }}
            aria-label="Add to favorites"
          >
            <Heart 
              size={18} 
              fill={isFavorite ? "#e53e3e" : "none"} 
              className={isFavorite ? "animate-heartbeat" : ""}
            />
          </motion.button>
          
          {onQuickView && (
            <motion.button
              onClick={handleQuickView}
              whileTap={{ scale: 0.9 }}
              variants={actionButtonVariants}
              initial="hidden"
              animate={isHovered ? "visible" : "hidden"}
              custom={1}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-gray-600 hover:text-gray-800"
              aria-label="Quick view"
            >
              <Eye size={18} />
            </motion.button>
          )}
        </div>

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
          
          {isLowStock && (
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-600 text-white flex items-center shadow-sm"
            >
              <AlertCircle size={10} className="mr-1" />
              LOW STOCK
            </motion.span>
          )}
        </div>
        
        {/* Out of stock overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white font-medium text-sm px-3 py-1.5 bg-gray-900/80 rounded-md">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category - small subtle text */}
        {product.category?.name && (
          <span className="text-xs text-gray-500 mb-1">
            {product.category.name}
          </span>
        )}
        
        {/* Product Name */}
        <h3 className="font-medium text-gray-900 leading-tight mb-1.5 hover:text-gray-700 transition-colors">
          {truncateText(product.name, 40)}
        </h3>

        {/* Rating Stars */}
        {product.rating !== undefined && (
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

        {/* Pricing and Add to Cart */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-base text-gray-900">
              ₦{Number(product.discount_price || product.main_price || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2
              })}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-500 line-through">
                ₦{Number(product.main_price || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2
                })}
              </span>
            )}
          </div>
          
          {/* Add to Cart Button with states */}
          <AnimatePresence mode="wait">
            {addingToCart ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-9 h-9 flex items-center justify-center"
              >
                <div className="w-5 h-5 border-2 rounded-full border-gray-300 border-t-transparent animate-spin" />
              </motion.div>
            ) : (
              <motion.button
                key="button"
                onClick={handleAddToCart}
                disabled={!isInStock}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  !isInStock 
                    ? "bg-gray-100 cursor-not-allowed" 
                    : isAddedToCart 
                      ? "bg-green-100" 
                      : ""
                }`}
                style={{ 
                  backgroundColor: isInStock && !isAddedToCart ? `${themeColor}15` : undefined,
                  color: isInStock ? isAddedToCart ? "#16a34a" : themeColor : "#9CA3AF"
                }}
                aria-label="Add to cart"
              >
                {isAddedToCart ? (
                  <Check 
                    size={18} 
                    className="animate-check"
                  />
                ) : (
                  <ShoppingCart size={18} />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Add to Cart button that shows on hover - for desktop */}
      {isInStock && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pointer-events-none hidden md:block"
          style={{ 
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(100%)",
            transition: "opacity 0.3s ease, transform 0.3s ease"
          }}
        >
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart(e)
            }}
            disabled={!isInStock || addingToCart}
            className={`w-full py-2.5 rounded-lg font-medium text-white flex items-center justify-center space-x-2 pointer-events-auto ${
              addingToCart ? "opacity-70" : ""
            }`}
            style={{ 
              backgroundColor: themeColor
            }}
            variants={actionButtonVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            custom={2}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {addingToCart ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </div>
            ) : isAddedToCart ? (
              <div className="flex items-center space-x-2">
                <Check size={16} />
                <span>Added to Cart</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </div>
            )}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

const customStyles = `
@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(1); }
  75% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes check {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-heartbeat {
  animation: heartbeat 0.6s ease-in-out;
}

.animate-check {
  animation: check 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

export default ProductCard