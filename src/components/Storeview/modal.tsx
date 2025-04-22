"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Heart, ChevronLeft, ChevronRight, Check, Info, Tag, Star, ZoomIn, ZoomOut, Download } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "features">("description")
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isFullscreenImage, setIsFullscreenImage] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (product) {
      setQuantity(1)
      setCurrentImageIndex(0)
      setActiveTab("description")
      setIsAddedToCart(false)
      setIsFullscreenImage(false)
      setIsZoomed(false)
    }
  }, [product])

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreenImage) {
          setIsFullscreenImage(false)
          setIsZoomed(false)
        } else if (isOpen) {
          onClose()
        }
      }
    }
    
    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isOpen, onClose, isFullscreenImage])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextImage()
    }

    if (touchStart - touchEnd < -50) {
      prevImage()
    }
  }

  const downloadImageWithWatermark = async () => {
    if (!product?.image_urls || !product.image_urls[currentImageIndex]) return
    
    try {
      const imageUrl = product.image_urls[currentImageIndex]
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const img = new Image()
      
      img.onload = () => {
        if (!canvasRef.current) return
        
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0, img.width, img.height)
        
        ctx.font = 'bold 48px Arial'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        const text = 'zikor.shop'
        const x = img.width / 2
        const y = img.height / 2
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
        ctx.shadowBlur = 10
        ctx.fillText(text, x, y)
        
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        
        canvas.toBlob((blob) => {
          if (!blob) return
          
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `zikor-${product.name.replace(/\s+/g, '-').toLowerCase()}-${currentImageIndex + 1}.jpg`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }, 'image/jpeg', 0.9)
      }
      
      img.src = URL.createObjectURL(blob)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  if (!product) return null

  const hasDiscount = product.discount_price && Number(product.main_price) > Number(product.discount_price)
  const discountPercentage = hasDiscount
    ? Math.round(((Number(product.main_price) - Number(product.discount_price)) / Number(product.main_price)) * 100)
    : 0

  const isInStock = product.quantity > 0
  const hasMultipleImages = product.image_urls && product.image_urls.length > 1
  const hasFeatures = product.features && product.features.length > 0
  const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0

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
    if (!isInStock) return
    
    setIsAddedToCart(true)
    
    setTimeout(() => {
      onAddToCart(product.id, quantity)
      onClose()
    }, 800)
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

  const openFullscreenImage = () => {
    setIsFullscreenImage(true)
  }

  const closeFullscreenImage = () => {
    setIsFullscreenImage(false)
    setIsZoomed(false)
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  const availableTabs = [
    { id: "description", label: "Description", available: true },
    { id: "specifications", label: "Specifications", available: hasSpecs },
    { id: "features", label: "Features", available: hasFeatures }
  ].filter(tab => tab.available);

  return (
    <>
      {/* Hidden canvas for watermark processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Backdrop with blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md z-10 hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </motion.button>

              <div className="overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
                  {/* Product Images Section */}
                  <div className="relative">
                    {/* Main Image  */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 rounded-xl h-64 sm:h-80 md:h-96 overflow-hidden mb-4 flex items-center justify-center relative group cursor-pointer"
                        onClick={openFullscreenImage}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      >
                        {product.image_urls && product.image_urls.length > 0 ? (
                          <>
                            <img
                              ref={imageRef}
                              src={product.image_urls[currentImageIndex] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                            {/* Zoom icon overlay on hover */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="bg-white rounded-full p-3 shadow-lg">
                                <ZoomIn size={20} className="text-gray-700" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400">No image available</span>
                          </div>
                        )}

                        {/* Product Tags */}
                        <div className="absolute top-4 left-4 flex flex-col space-y-2">
                          {hasDiscount && (
                            <motion.span
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="text-xs font-medium px-3 py-1.5 rounded-full text-white flex items-center shadow-sm"
                              style={{ backgroundColor: "#e53e3e" }}
                            >
                              <Tag size={12} className="mr-1.5" />
                              {discountPercentage}% OFF
                            </motion.span>
                          )}

                          {product.is_new && (
                            <motion.span
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="text-xs font-medium px-3 py-1.5 rounded-full text-white shadow-sm"
                              style={{ backgroundColor: themeColor }}
                            >
                              NEW
                            </motion.span>
                          )}

                          {product.is_featured && (
                            <motion.span
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="text-xs font-medium px-3 py-1.5 rounded-full bg-amber-500 text-white shadow-sm"
                            >
                              FEATURED
                            </motion.span>
                          )}
                        </div>

                        {/* Out of stock overlay */}
                        {!isInStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex flex-col items-center justify-center">
                            <span className="text-white font-medium px-4 py-2 bg-gray-800 bg-opacity-75 rounded-md">
                              OUT OF STOCK
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows - improved design */}
                    {hasMultipleImages && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-3 hover:bg-gray-100 transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={20} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-3 hover:bg-gray-100 transition-colors"
                          aria-label="Next image"
                        >
                          <ChevronRight size={20} />
                        </motion.button>
                      </>
                    )}

                    {/* Thumbnail Images  */}
                    {hasMultipleImages && (
                      <div className="flex space-x-3 overflow-x-auto pb-3 px-1 custom-scrollbar">
                        {product.image_urls.map((imageUrl, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                              currentImageIndex === index ? `ring-2 ring-[${themeColor}] shadow-md` : "opacity-75 hover:opacity-100"
                            }`}
                            style={{
                              outlineColor: currentImageIndex === index ? themeColor : "transparent",
                              transform: currentImageIndex === index ? "scale(1.05)" : "scale(1)"
                            }}
                          >
                            <img
                              src={imageUrl || "/placeholder.svg"}
                              alt={`${product.name} - image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info Section */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      {/* Category Badge */}
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                        {product.category.name}
                      </span>

                      {/* Favorite Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleFavorite}
                        className={`p-2.5 rounded-full transition-colors ${isFavorite ? 'bg-red-50' : 'hover:bg-gray-100'}`}
                        style={{ color: isFavorite ? "#e53e3e" : "gray" }}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart 
                          size={20} 
                          fill={isFavorite ? "#e53e3e" : "none"} 
                          className={isFavorite ? "animate-heartbeat" : ""}
                        />
                      </motion.button>
                    </div>

                    {/* Product Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h2>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= product.rating! ? "text-amber-400" : "text-gray-200"}
                              fill={star <= product.rating! ? "currentColor" : "none"}
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">{product.rating.toFixed(1)}</span>
                      </div>
                    )}

                    {/* Price Section */}
                    <div className="flex items-center mb-5">
                      <span className="text-3xl font-bold" style={{ color: hasDiscount ? "#e53e3e" : themeColor }}>
                        ₦{product.discount_price || product.main_price}
                      </span>
                      {hasDiscount && (
                        <>
                          <span className="text-gray-500 line-through text-lg ml-3">₦{product.main_price}</span>
                          <span className="ml-3 text-sm font-medium text-red-600">Save {discountPercentage}%</span>
                        </>
                      )}
                    </div>

                    {/* Stock Status - Redesigned */}
                    <div className="flex items-center mb-6 p-3 rounded-lg bg-gray-50">
                      <div 
                        className={`w-3 h-3 rounded-full mr-3 ${isInStock ? "bg-green-500" : "bg-red-500"}`} 
                        style={{ boxShadow: `0 0 0 2px ${isInStock ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}` }}
                      />
                      <span className="text-sm font-medium">
                        {isInStock 
                          ? <>{product.quantity > 10 
                              ? "In Stock" 
                              : `Only ${product.quantity} left`}</>
                          : "Out of Stock"}
                      </span>
                    </div>

                    {/* Quantity Selector and Add to Cart */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                      <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={handleDecrement}
                          className="px-4 py-2.5 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                          disabled={quantity <= 1 || !isInStock}
                        >
                          <span className="font-bold">−</span>
                        </motion.button>
                        <div className="w-12 text-center py-2.5 font-medium">{quantity}</div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={handleIncrement}
                          className="px-4 py-2.5 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                          disabled={quantity >= product.quantity || !isInStock}
                        >
                          <span className="font-bold">+</span>
                        </motion.button>
                      </div>

                      <motion.button
                        whileHover={isInStock ? { scale: 1.02 } : {}}
                        whileTap={isInStock ? { scale: 0.98 } : {}}
                        onClick={handleAddToCart}
                        disabled={!isInStock || isAddedToCart}
                        className="flex-1 py-3 px-6 rounded-lg font-medium text-white flex items-center justify-center shadow-sm transition-all"
                        style={{
                          backgroundColor: isAddedToCart ? "#22c55e" : isInStock ? themeColor : "gray",
                          opacity: isInStock && !isAddedToCart ? 1 : 0.7,
                          cursor: isInStock && !isAddedToCart ? "pointer" : "not-allowed",
                        }}
                      >
                        {isAddedToCart ? (
                          <>
                            <Check size={18} className="mr-2 animate-bounce" />
                            Added to Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={18} className="mr-2" />
                            Add to Cart
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Product Details Tabs */}
                <div className="border-t">
                  <div className="flex border-b overflow-x-auto custom-scrollbar">
                    {availableTabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-6 font-medium text-sm whitespace-nowrap transition-colors ${
                          activeTab === tab.id ? "border-b-2" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                        style={{
                          borderColor: activeTab === tab.id ? themeColor : "transparent",
                          color: activeTab === tab.id ? themeColor : undefined,
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-6 sm:p-8">
                    <AnimatePresence mode="wait">
                      {activeTab === "description" && (
                        <motion.div
                          key="description"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="prose max-w-none"
                        >
                          <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </motion.div>
                      )}

                      {activeTab === "specifications" && (
                        <motion.div
                          key="specifications"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {hasSpecs ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                              {Object.entries(product.specifications!).map(([key, value], index) => (
                                <motion.div
                                  key={key}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex justify-between border-b pb-2"
                                >
                                  <span className="font-medium text-sm text-gray-800">{key}</span>
                                  <span className="text-sm text-gray-600">{value}</span>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center p-12 text-center text-gray-500">
                              <div>
                                <Info size={32} className="mx-auto mb-3 opacity-60" />
                                <p>No specifications available for this product.</p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === "features" && (
                        <motion.div
                          key="features"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ul className="space-y-3">
                            {product.features?.map((feature, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.08 }}
                                className="flex items-start"
                              >
                                <div 
                                  className="rounded-full p-1 mr-3 mt-0.5 flex-shrink-0"
                                  style={{ backgroundColor: `${themeColor}15` }}
                                >
                                  <Check size={14} style={{ color: themeColor }} />
                                </div>
                                <span className="text-gray-700">{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Fullscreen Image Modal */}
            <AnimatePresence>
              {isFullscreenImage && product.image_urls && product.image_urls.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center"
                  onClick={closeFullscreenImage}
                >
                  {/* Fullscreen Container */}
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Image */}
                    <div 
                      className={`relative max-w-full max-h-full transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <img
                        src={product.image_urls[currentImageIndex]}
                        alt={product.name}
                        className="max-w-full max-h-[85vh] object-contain"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleZoom();
                        }}
                      />
                    </div>

                    {/* Close Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeFullscreenImage}
                      className="absolute top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                      aria-label="Close fullscreen image"
                    >
                      <X size={24} />
                    </motion.button>

                    {/* Zoom Toggle Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleZoom}
                      className="absolute bottom-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                      aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                    >
                      {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
                    </motion.button>

                    {/* Download Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImageWithWatermark();
                      }}
                      className="absolute bottom-4 left-4 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                      aria-label="Download image"
                    >
                      <Download size={24} />
                    </motion.button>

                    {/* Image Navigation */}
                    {hasMultipleImages && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1, x: -3 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white rounded-full p-4 hover:bg-white/30 transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1, x: 3 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white rounded-full p-4 hover:bg-white/30 transition-colors"
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} />
                        </motion.button>
                      </>
                    )}

                    {/* Image Counter */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {product.image_urls.length}
                      </div>
                    )}

                    {/* Thumbnails at bottom */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 overflow-x-auto pb-2 px-1 max-w-full">
                        {product.image_urls.map((imageUrl, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                              setIsZoomed(false);
                            }}
                            className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 transition-all duration-200 border-2 ${
                              currentImageIndex === index ? 'border-white opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={imageUrl}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductDetailModal