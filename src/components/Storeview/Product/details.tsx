"use client"

import React, { useImperativeHandle, forwardRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  Info,
  Star,
  Minus,
  Plus,
  Package,
  Truck,
  Shield,
  Award,
  Clock,
  Palette,
  Ruler,
  ShoppingCart,
} from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  main_price: string
  discount_price: string
  quantity: number
  image_urls: string[]
  colors: string[]
  sizes: string[]
  category: {
    name: string
  }
  rating?: number
  features?: string[]
  specifications?: Record<string, string>
  is_featured?: boolean
  is_new?: boolean
  brand?: string
  reviews_count?: number
}

interface ProductDetailsProps {
  product: Product
  quantity: number
  setQuantity: (quantity: number) => void
  selectedColor: string
  setSelectedColor: (color: string) => void
  selectedSize: string
  setSelectedSize: (size: string) => void
  activeTab: "description" | "specifications" | "features"
  setActiveTab: (tab: "description" | "specifications" | "features") => void
  selectionError: string
  setSelectionError: (error: string) => void
  isAddedToCart: boolean
  setIsAddedToCart: (added: boolean) => void
  onAddToCart: (productId: number, quantity: number, selectedColor?: string, selectedSize?: string) => void
  themeColor: string
  isExpanded: boolean
  isMobile: boolean
}

const ProductDetails = forwardRef<any, ProductDetailsProps>(({
  product,
  quantity,
  setQuantity,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  activeTab,
  setActiveTab,
  selectionError,
  setSelectionError,
  isAddedToCart,
  setIsAddedToCart,
  onAddToCart,
  themeColor,
  isExpanded,
  isMobile,
}, ref) => {

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
    
    if (Array.isArray(product?.colors) && product.colors.length > 0 && !selectedColor) {
      errors.push("Please select a color")
    }
  
    if (Array.isArray(product?.sizes) && product.sizes.length > 0 && !selectedSize) {
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
    if (!isInStock) return
    
    if (!validateSelections()) {
      return
    }

    setIsAddedToCart(true)

    setTimeout(() => {
      onAddToCart(product.id, quantity, selectedColor || undefined, selectedSize || undefined)
    }, 800)
  }

  // Expose handleAddToCart to parent component
  useImperativeHandle(ref, () => ({
    handleAddToCart
  }))

  const hasDiscount = product.discount_price && Number(product.main_price) > Number(product.discount_price)
  const discountPercentage = hasDiscount
    ? Math.round(((Number(product.main_price) - Number(product.discount_price)) / Number(product.main_price)) * 100)
    : 0

  const isInStock = product.quantity > 0
  const hasFeatures = product.features && product.features.length > 0
  const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0
  const hasColors = Array.isArray(product.colors) && product.colors.length > 0
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0

  const handleIncrement = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const availableTabs = [
    { id: "description", label: "Description", available: true },
    { id: "specifications", label: "Specifications", available: hasSpecs },
    { id: "features", label: "Features", available: hasFeatures },
  ].filter((tab) => tab.available)

  if (isMobile) {
    return (
      <div className="px-6 space-y-4" data-product-details ref={ref}>
        {/* Name and category */}
        <div>
          {product.category?.name && (
            <span className="text-sm" style={{ color: themeColor }}>
              {product.category.name}
            </span>
          )}
          <h1 className="text-xl font-bold text-gray-900 mt-1">{product.name}</h1>
          {product.brand && <p className="text-sm text-gray-500 mt-1">by {product.brand}</p>}
        </div>

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= product.rating! ? "text-amber-400" : "text-gray-200"}
                  fill={star <= product.rating! ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews_count || 0} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            ₦{Number(product.discount_price || product.main_price || 0).toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-lg text-gray-500 line-through">
              ₦{Number(product.main_price || 0).toLocaleString()}
            </span>
          )}
        </div>

        {/* Color Selection - Mobile */}
        {hasColors && (
          <div className="space-y-3">
            <div className="flex items-center">
              <Palette size={16} className="mr-2 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-800">
                Color
                {selectedColor && (
                  <span className="ml-2 text-xs font-normal text-gray-600">- {selectedColor}</span>
                )}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(product.colors) && product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`px-3 py-1.5 rounded-lg border-2 transition-all duration-200 text-sm ${
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
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection - Mobile */}
        {hasSizes && (
          <div className="space-y-3">
            <div className="flex items-center">
              <Ruler size={16} className="mr-2 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-800">
                Size
                {selectedSize && (
                  <span className="ml-2 text-xs font-normal text-gray-600">- {selectedSize}</span>
                )}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(product.sizes) && product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-3 py-1.5 rounded-lg border-2 transition-all duration-200 text-sm min-w-[2.5rem] ${
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
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock status */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isInStock ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-sm text-gray-600">{isInStock ? "In Stock" : "Out of Stock"}</span>
        </div>

        {/* Selection Error */}
        {selectionError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600 font-medium">{selectionError}</p>
          </div>
        )}

        {/* Quantity selector */}
        {isInStock && (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDecrement}
                className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Tabs - Only show if expanded */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Tab buttons */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    {hasFeatures && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Key Features:</h3>
                        <ul className="space-y-1">
                          {product.features?.map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <Check
                                size={14}
                                className="mr-2 mt-0.5 flex-shrink-0"
                                style={{ color: themeColor }}
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "specifications" && (
                  <motion.div
                    key="specifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    {hasSpecs ? (
                      Object.entries(product.specifications!).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-600">{key}:</span>
                          <span className="text-gray-900">{value}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Info size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No specifications available</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "features" && (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    {hasFeatures ? (
                      <ul className="space-y-3">
                        {product.features?.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <Check
                              size={14}
                              className="mr-2 mt-0.5 flex-shrink-0"
                              style={{ color: themeColor }}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8">
                        <Check size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No features listed</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Desktop version
  return (
    <div className="bg-gray-50 p-6 lg:p-8 flex flex-col overflow-y-auto scrollbar-hide" data-product-details ref={ref}>
      <div className="space-y-6">
        {/* Product Title */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
            {product.name}
          </h1>
          {product.brand && <p className="text-gray-600 text-lg">by {product.brand}</p>}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-sm">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={star <= product.rating! ? "text-amber-400" : "text-gray-300"}
                  fill={star <= product.rating! ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">{product.rating}</span>
              <span className="text-gray-500 ml-2">({product.reviews_count || 0} reviews)</span>
            </div>
          </div>
        )}

        {/* Price Section */}
        <div className="space-y-3 p-6 bg-white rounded-2xl shadow-sm">
          <div className="flex items-baseline space-x-4">
            <span
              className="text-4xl lg:text-5xl font-bold"
              style={{ color: hasDiscount ? "#e53e3e" : themeColor }}
            >
              ₦{Number(product.discount_price || product.main_price).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-2xl text-gray-500 line-through">
                ₦{Number(product.main_price).toLocaleString()}
              </span>
            )}
          </div>
          {hasDiscount && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-red-600 bg-red-50 px-4 py-2 rounded-full">
                Save ₦{(Number(product.main_price) - Number(product.discount_price)).toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">({discountPercentage}% off)</span>
            </div>
          )}
        </div>

        {/* Color Selection - Desktop */}
        {hasColors && (
          <div className="space-y-4 p-6 bg-white rounded-2xl shadow-sm">
            <div className="flex items-center">
              <Palette size={20} className="mr-3 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Color
                {selectedColor && (
                  <span className="ml-2 text-sm font-normal text-gray-600">- {selectedColor}</span>
                )}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(product.colors) && product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                    selectedColor === color
                      ? 'border-opacity-100 shadow-lg text-white transform scale-105'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: selectedColor === color ? themeColor : 'white',
                    borderColor: selectedColor === color ? themeColor : undefined
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection - Desktop */}
        {hasSizes && (
          <div className="space-y-4 p-6 bg-white rounded-2xl shadow-sm">
            <div className="flex items-center">
              <Ruler size={20} className="mr-3 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Size
                {selectedSize && (
                  <span className="ml-2 text-sm font-normal text-gray-600">- {selectedSize}</span>
                )}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(product.sizes) && product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium min-w-[3.5rem] ${
                    selectedSize === size
                      ? 'border-opacity-100 shadow-lg text-white transform scale-105'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: selectedSize === size ? themeColor : 'white',
                    borderColor: selectedSize === size ? themeColor : undefined
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm">
          <div className="flex items-center space-x-4">
            <div
              className={`w-4 h-4 rounded-full ${isInStock ? "bg-green-500" : "bg-red-500"}`}
              style={{
                boxShadow: `0 0 0 4px ${isInStock ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
              }}
            />
            <div>
              <p className="font-semibold text-gray-900 text-lg">
                {isInStock ? "In Stock" : "Out of Stock"}
              </p>
              {isInStock && (
                <p className="text-sm text-gray-500">
                  {product.quantity > 10 ? "Ready to ship" : `Only ${product.quantity} left`}
                </p>
              )}
            </div>
          </div>
          {isInStock && <Package size={24} className="text-gray-400" />}
        </div>

        {/* Selection Error - Desktop */}
        {selectionError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-medium">{selectionError}</p>
          </div>
        )}

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm">
            <Truck size={20} style={{ color: themeColor }} />
            <div>
              <p className="text-sm font-medium text-gray-900">Fast Delivery</p>
              <p className="text-xs text-gray-500">2-3 business days</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm">
            <Shield size={20} style={{ color: themeColor }} />
            <div>
              <p className="text-sm font-medium text-gray-900">Secure Payment</p>
              <p className="text-xs text-gray-500">SSL encrypted</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm">
            <Clock size={20} style={{ color: themeColor }} />
            <div>
              <p className="text-sm font-medium text-gray-900">Easy Returns</p>
              <p className="text-xs text-gray-500">30 day policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm">
            <Award size={20} style={{ color: themeColor }} />
            <div>
              <p className="text-sm font-medium text-gray-900">Quality Assured</p>
              <p className="text-xs text-gray-500">100% authentic</p>
            </div>
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        {isInStock && (
          <div className="space-y-6">
            <div className="space-y-4 p-6 bg-white rounded-2xl shadow-sm">
              <label className="text-sm font-semibold text-gray-700">Quantity:</label>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-14 h-14 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={20} />
                </button>
                <div className="w-20 h-14 flex items-center justify-center font-bold text-xl">
                  {quantity}
                </div>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.quantity}
                  className="w-14 h-14 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddedToCart}
              className="w-full py-5 rounded-2xl font-bold text-white text-lg flex items-center justify-center space-x-3 shadow-xl transition-all"
              style={{
                backgroundColor: isAddedToCart ? "#22c55e" : themeColor,
                boxShadow: isAddedToCart
                  ? "0 10px 25px rgba(34, 197, 94, 0.3)"
                  : `0 10px 25px ${themeColor}30`,
              }}
            >
              {isAddedToCart ? (
                <>
                  <Check size={24} className="animate-bounce" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={24} />
                  <span>
                    Add to Cart - ₦
                    {(
                      Number(product.discount_price || product.main_price) * quantity
                    ).toLocaleString()}
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Product Details Tabs  */}
        {isExpanded && (
          <div className="space-y-4">
            <div className="flex space-x-1 bg-white rounded-2xl p-1 shadow-sm">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-4 px-6 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? themeColor : "transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[250px] max-h-[400px] overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
                  </motion.div>
                )}

                {activeTab === "specifications" && (
                  <motion.div
                    key="specifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Specifications</h3>
                    {hasSpecs ? (
                      <div className="space-y-4">
                        {Object.entries(product.specifications!).map(([key, value], index) => (
                          <div
                            key={key}
                            className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                          >
                            <span className="font-medium text-gray-700">{key}:</span>
                            <span className="text-gray-600 font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-12">
                        <Info size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No specifications available</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "features" && (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Key Features</h3>
                    {hasFeatures ? (
                      <ul className="space-y-4">
                        {product.features?.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-4">
                            <div
                              className="rounded-full p-2 mt-1 flex-shrink-0"
                              style={{ backgroundColor: `${themeColor}20` }}
                            >
                              <Check size={16} style={{ color: themeColor }} />
                            </div>
                            <span className="text-gray-700 leading-relaxed text-base">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center text-gray-500 py-12">
                        <Check size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No features listed</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

ProductDetails.displayName = "ProductDetails"

export default ProductDetails