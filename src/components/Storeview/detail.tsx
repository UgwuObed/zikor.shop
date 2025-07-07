"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingCart, 
  Heart, 
  Share, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Truck,
  RefreshCcw,
  Shield,
  Palette,
  Ruler
} from "lucide-react"

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
    colors?: string[]
    sizes?: string[]
    features?: string[]
  }
  onAddToCart: (productId: number, quantity: number, selectedColor?: string, selectedSize?: string) => void
  themeColor: string
}

const ProductDetailView = ({ 
  product, 
  onAddToCart, 
  themeColor = "#6366f1" 
}: ProductDetailViewProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showZoom, setShowZoom] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [selectionError, setSelectionError] = useState<string>("")
  const placeholderImage = "/api/placeholder/400/400"
  
  
  useEffect(() => {
    if (product.colors && product.colors.length === 1) {
      setSelectedColor(product.colors[0])
    }
    if (product.sizes && product.sizes.length === 1) {
      setSelectedSize(product.sizes[0])
    }
  }, [product.colors, product.sizes])
  
  const discountPercentage = product.discount_price && Number(product.main_price) > Number(product.discount_price)
    ? Math.round((1 - Number(product.discount_price) / Number(product.main_price)) * 100)
    : 0

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.quantity) {
      setQuantity(value)
    }
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    setSelectionError("")
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setSelectionError("")
  }

  const validateSelections = () => {
    const errors = []
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      errors.push("Please select a color")
    }
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      errors.push("Please select a size")
    }
    
    if (errors.length > 0) {
      setSelectionError(errors.join(" and "))
      return false
    }
    
    setSelectionError("")
    return true
  }

  const handleAddToCart = () => {
    if (!validateSelections()) {
      return
    }
    
    setIsAddingToCart(true)
    onAddToCart(product.id, quantity, selectedColor || undefined, selectedSize || undefined)
    
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 1000)
  }

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showZoom) return
    
    const container = e.currentTarget
    const rect = container.getBoundingClientRect()
    

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }

 
  const features = product.features || [
    "Free shipping for orders over ₦10,000",
    "30-day money-back guarantee",
    "Secure payment processing"
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image Section */}
          <div className="relative bg-gray-50">
            {/* Main image container */}
            <div 
              className="relative h-96 md:h-[500px] overflow-hidden cursor-zoom-in"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleImageMouseMove}
            >
              {product.image_urls.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={product.image_urls[activeImageIndex] || placeholderImage}
                        alt={product.name}
                        fill
                        quality={90}
                        priority={activeImageIndex === 0}
                        style={{ 
                          objectFit: "contain",
                          transition: "transform 0.2s ease-out",
                          transform: showZoom ? "scale(1.5)" : "scale(1)",
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` 
                        }}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Image
                    src={placeholderImage}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="max-h-full rounded-md"
                  />
                </div>
              )}

              {/* Discount badge */}
              {discountPercentage > 0 && (
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-bold"
                  style={{ backgroundColor: themeColor }}
                >
                  Save {discountPercentage}%
                </div>
              )}
            </div>

            {/* Navigation controls */}
            {product.image_urls.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveImageIndex(prev => 
                    prev === 0 ? product.image_urls.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md z-10 text-gray-800"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveImageIndex(prev => 
                    prev === product.image_urls.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md z-10 text-gray-800"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </>
            )}

            {/* Thumbnail Gallery */}
            {product.image_urls.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="flex space-x-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
                  {product.image_urls.map((url, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImageIndex(idx)}
                      className="relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-200"
                      aria-label={`View image ${idx + 1}`}
                    >
                      <Image
                        src={url || placeholderImage}
                        alt={`${product.name} - image ${idx + 1}`}
                        fill
                        style={{
                          objectFit: "cover",
                          borderColor: idx === activeImageIndex ? themeColor : "transparent"
                        }}
                        className={`rounded-lg border-2 transition-all ${
                          idx === activeImageIndex 
                            ? "border-opacity-100 shadow-md" 
                            : "border-transparent opacity-70"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-8 flex flex-col h-full">
            {/* Top section */}
            <div className="flex justify-between items-start">
              <div>
                <span
                  className="text-sm font-medium px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    color: themeColor,
                  }}
                >
                  {product.category.name}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800">
                  {product.name}
                </h1>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart size={20} className="text-gray-500" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Share product"
                >
                  <Share size={20} className="text-gray-500" />
                </motion.button>
              </div>
            </div>

            {/* Price and ratings */}
            <div className="mt-4 flex items-baseline">
              <span 
                className="text-3xl font-bold" 
                style={{ color: themeColor }}
              >
                ₦{Number(product.discount_price || product.main_price).toLocaleString(undefined, {
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2
                })}
              </span>
              {Number(product.discount_price || 0) < Number(product.main_price) && product.discount_price && (
                <span className="ml-3 text-base line-through text-gray-500">
                  ₦{Number(product.main_price).toLocaleString(undefined, {
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2
                  })}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < 4 ? themeColor : "none"}
                    stroke={i < 4 ? themeColor : "currentColor"}
                    className={i < 4 ? "" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">
                4.0 <span className="text-gray-400">(24 reviews)</span>
              </span>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center mb-3">
                  <Palette size={18} className="mr-2 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Color
                    {selectedColor && (
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        - {selectedColor}
                      </span>
                    )}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleColorSelect(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-opacity-100 shadow-md text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      style={{
                        backgroundColor: selectedColor === color ? themeColor : 'white',
                        borderColor: selectedColor === color ? themeColor : undefined
                      }}
                    >
                      {color}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center mb-3">
                  <Ruler size={18} className="mr-2 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Size
                    {selectedSize && (
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        - {selectedSize}
                      </span>
                    )}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 min-w-[3rem] ${
                        selectedSize === size
                          ? 'border-opacity-100 shadow-md text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      style={{
                        backgroundColor: selectedSize === size ? themeColor : 'white',
                        borderColor: selectedSize === size ? themeColor : undefined
                      }}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mt-6">
              <ul className="space-y-2">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <Check size={16} className="mr-2 flex-shrink-0" style={{ color: themeColor }} />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <div className="mt-6 flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                product.quantity > 10 
                  ? "bg-green-500" 
                  : product.quantity > 0 
                    ? "bg-yellow-500" 
                    : "bg-red-500"
              }`}></div>
              <span className={`text-sm font-medium ${
                product.quantity > 10 
                  ? "text-green-600" 
                  : product.quantity > 0 
                    ? "text-yellow-600" 
                    : "text-red-600"
              }`}>
                {product.quantity > 10 
                  ? "In Stock" 
                  : product.quantity > 0 
                    ? `Low Stock (${product.quantity} left)` 
                    : "Out of Stock"}
              </span>
            </div>

            {/* Selection Error */}
            {selectionError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">{selectionError}</p>
              </div>
            )}

            {/* Shopping controls */}
            <div className="mt-auto pt-6">
              {product.quantity > 0 && (
                <div className="flex flex-col gap-4">
                  {/* Quantity */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                    <div className="flex items-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-l-lg border flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 text-gray-600"
                      >
                        -
                      </motion.button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(Number(e.target.value) || 1)}
                        min="1"
                        max={product.quantity}
                        className="w-16 h-10 text-center border-t border-b focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-opacity-50"
                        style={{ outlineColor: themeColor }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.quantity}
                        className="w-10 h-10 rounded-r-lg border flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 text-gray-600"
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={product.quantity <= 0 || isAddingToCart}
                    className="w-full h-12 rounded-lg font-medium text-white flex items-center justify-center space-x-2 transition-all relative overflow-hidden"
                    style={{
                      backgroundColor: product.quantity > 0 ? themeColor : "gray",
                      opacity: product.quantity > 0 && !isAddingToCart ? 1 : 0.7,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {isAddingToCart ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Adding...</span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="add"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center space-x-2"
                        >
                          <ShoppingCart size={18} />
                          <span>Add to Cart</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Shipping and returns */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Truck size={18} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Free shipping on orders over ₦10,000</span>
                </div>
                <div className="flex items-center">
                  <RefreshCcw size={18} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">30-day return policy</span>
                </div>
                <div className="flex items-center">
                  <Shield size={18} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductDetailView