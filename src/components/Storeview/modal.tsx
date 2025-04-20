"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Heart, ChevronLeft, ChevronRight, Check, Info } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  main_price: string
  discount_price: string
  quantity: number
  image_urls: string[]
  category: {
    name: string
  }
  rating?: number
  features?: string[]
  specifications?: Record<string, string>
  is_featured?: boolean
  is_new?: boolean
}

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onAddToCart: (productId: number, quantity: number) => void
  themeColor: string
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  themeColor,
}) => {
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<"description" | "specifications">("description")
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (product) {
      setQuantity(1)
      setCurrentImageIndex(0)
      setActiveTab("description")
    }
  }, [product])

  if (!product) return null

  const hasDiscount = product.discount_price && Number(product.main_price) > Number(product.discount_price)
  const discountPercentage = hasDiscount
    ? Math.round(((Number(product.main_price) - Number(product.discount_price)) / Number(product.main_price)) * 100)
    : 0

  const isInStock = product.quantity > 0
  const hasMultipleImages = product.image_urls && product.image_urls.length > 1

  const handleIncrement = () => {
    if (quantity < product.quantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity)
    onClose()
  }

  const nextImage = () => {
    if (!product.image_urls || product.image_urls.length <= 1) return
    setCurrentImageIndex((prev) => (prev + 1) % product.image_urls.length)
  }

  const prevImage = () => {
    if (!product.image_urls || product.image_urls.length <= 1) return
    setCurrentImageIndex((prev) => (prev === 0 ? product.image_urls.length - 1 : prev - 1))
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full bg-white bg-opacity-70 z-10 hover:bg-opacity-100"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Product Images */}
                <div className="relative">
                  {/* Main Image */}
                  <div className="bg-gray-100 rounded-lg h-64 sm:h-80 overflow-hidden mb-4">
                    {product.image_urls && product.image_urls.length > 0 ? (
                      <img
                        src={product.image_urls[currentImageIndex] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}

                    {/* Navigation Arrows */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}

                    {/* Product Tags */}
                    <div className="absolute top-2 left-2 flex space-x-2">
                      {hasDiscount && (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: "#e53e3e" }}
                        >
                          {discountPercentage}% OFF
                        </span>
                      )}

                      {product.is_new && (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: themeColor }}
                        >
                          NEW
                        </span>
                      )}

                      {!isInStock && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-500 text-white">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Images */}
                  {hasMultipleImages && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {product.image_urls.map((imageUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                            currentImageIndex === index ? "border-blue-500" : "border-transparent"
                          }`}
                          style={{
                            borderColor: currentImageIndex === index ? themeColor : "transparent",
                          }}
                        >
                          <img
                            src={imageUrl || "/placeholder.svg"}
                            alt={`${product.name} - image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                    <button
                      onClick={toggleFavorite}
                      className="p-2 rounded-full hover:bg-gray-100"
                      style={{ color: isFavorite ? "red" : "gray" }}
                    >
                      <Heart size={20} fill={isFavorite ? "red" : "none"} />
                    </button>
                  </div>

                  {/* Category */}
                  <div className="text-sm text-gray-500 mt-1 mb-3">
                    Category: <span className="font-medium">{product.category.name}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-4">
                    <span className="text-2xl font-bold" style={{ color: themeColor }}>
                      ₦{product.discount_price || product.main_price}
                    </span>
                    {hasDiscount && <span className="text-gray-500 line-through ml-2">₦{product.main_price}</span>}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center mb-6">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isInStock ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-sm">
                      {isInStock ? `In Stock (${product.quantity} available)` : "Out of Stock"}
                    </span>
                  </div>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Key Features</h3>
                      <ul className="space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check size={16} className="mr-2 mt-0.5 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Quantity and Add to Cart */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={handleDecrement}
                        className="px-3 py-1 text-gray-500 hover:text-gray-700"
                        disabled={quantity <= 1 || !isInStock}
                      >
                        -
                      </button>
                      <span className="w-10 text-center">{quantity}</span>
                      <button
                        onClick={handleIncrement}
                        className="px-3 py-1 text-gray-500 hover:text-gray-700"
                        disabled={quantity >= product.quantity || !isInStock}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!isInStock}
                      className="flex-1 py-2 px-4 rounded font-medium flex items-center justify-center"
                      style={{
                        backgroundColor: isInStock ? themeColor : "gray",
                        color: "white",
                        opacity: isInStock ? 1 : 0.7,
                        cursor: isInStock ? "pointer" : "not-allowed",
                      }}
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Details Tabs */}
              <div className="border-t">
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`py-3 px-6 font-medium text-sm ${
                      activeTab === "description" ? "border-b-2" : "text-gray-500"
                    }`}
                    style={{
                      borderColor: activeTab === "description" ? themeColor : "transparent",
                    }}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("specifications")}
                    className={`py-3 px-6 font-medium text-sm ${
                      activeTab === "specifications" ? "border-b-2" : "text-gray-500"
                    }`}
                    style={{
                      borderColor: activeTab === "specifications" ? themeColor : "transparent",
                    }}
                  >
                    Specifications
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === "description" && (
                    <div className="prose max-w-none">
                      <p>{product.description}</p>
                    </div>
                  )}

                  {activeTab === "specifications" && (
                    <div>
                      {product.specifications && Object.keys(product.specifications).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between border-b pb-2">
                              <span className="font-medium">{key}</span>
                              <span className="text-gray-600">{value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-6 text-center text-gray-500">
                          <div>
                            <Info size={24} className="mx-auto mb-2" />
                            <p>No specifications available for this product.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProductDetailModal