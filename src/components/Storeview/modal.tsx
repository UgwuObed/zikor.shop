"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import {
  X,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
  Tag,
  Star,
  ZoomIn,
  ZoomOut,
  Download,
  Share,
  Minus,
  Plus,
  Package,
  Truck,
  Shield,
  Award,
  Clock,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

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
  brand?: string
  reviews_count?: number
}

interface EnhancedProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onAddToCart: (productId: number, quantity: number) => void
  themeColor: string
}

const EnhancedProductModal: React.FC<EnhancedProductModalProps> = ({
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
  const [isExpanded, setIsExpanded] = useState(false)
  const [dragY, setDragY] = useState(0)
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
      setIsExpanded(false)
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

    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleEscKey)
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose, isFullscreenImage])

  const handleDrag = useCallback((event: any, info: PanInfo) => {
    if (info.offset.y > 0) {
      setDragY(info.offset.y)
    }
  }, [])

  const handleDragEnd = useCallback(
    (event: any, info: PanInfo) => {
      if (info.offset.y > 100 || info.velocity.y > 500) {
        onClose()
      } else {
        setDragY(0)
      }
    },
    [onClose],
  )

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
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0, img.width, img.height)

        ctx.font = "bold 48px Arial"
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        const text = "zikor.shop"
        const x = img.width / 2
        const y = img.height / 2

        ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
        ctx.shadowBlur = 10
        ctx.fillText(text, x, y)

        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0

        canvas.toBlob(
          (blob) => {
            if (!blob) return

            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `zikor-${product.name.replace(/\s+/g, "-").toLowerCase()}-${currentImageIndex + 1}.jpg`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          },
          "image/jpeg",
          0.9,
        )
      }

      img.src = URL.createObjectURL(blob)
    } catch (error) {
      console.error("Error downloading image:", error)
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
      setTimeout(() => {
        onClose()
      }, 500)
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    }
  }

  const availableTabs = [
    { id: "description", label: "Description", available: true },
    { id: "specifications", label: "Specifications", available: hasSpecs },
    { id: "features", label: "Features", available: hasFeatures },
  ].filter((tab) => tab.available)

  const drawerVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  const expandedVariants = {
    collapsed: {
      height: "60vh",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    expanded: {
      height: "90vh",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  }

  const desktopModalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  }

  const desktopExpandedVariants = {
    collapsed: {
      maxHeight: "80vh",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    expanded: {
      maxHeight: "95vh",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  }

  return (
    <>
      {/* Hidden canvas for watermark processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onClose}
            />

            {/* Mobile Drawer */}
            <div className="md:hidden">
              <motion.div
                variants={drawerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl shadow-2xl flex flex-col"
                style={{
                  transform: `translateY(${dragY}px)`,
                }}
              >
                <motion.div
                  variants={expandedVariants}
                  animate={isExpanded ? "expanded" : "collapsed"}
                  className="flex flex-col overflow-hidden"
                >
                  {/* Drag Handle */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                  </div>

                  {/* Mobile Header */}
                  <div className="flex justify-between items-center px-6 pb-4">
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <X size={20} />
                    </button>

                    <h2 className="font-semibold text-lg text-center flex-1 mx-4">Product Details</h2>

                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                  </div>

                  {/* Mobile Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {/* Product Image */}
                    <div className="px-6 mb-4">
                      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
                        <img
                          src={product.image_urls[currentImageIndex] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-contain cursor-pointer"
                          onClick={openFullscreenImage}
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        />

                        {/* Image navigation dots */}
                        {hasMultipleImages && (
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <div className="flex space-x-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full">
                              {product.image_urls.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentImageIndex(idx)}
                                  className="w-2 h-2 rounded-full transition-all"
                                  style={{
                                    backgroundColor: currentImageIndex === idx ? themeColor : "#CBD5E1",
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Product tags */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {hasDiscount && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500 text-white">
                              {discountPercentage}% OFF
                            </span>
                          )}
                          {product.is_new && (
                            <span
                              className="text-xs font-medium px-2 py-1 rounded-full text-white"
                              style={{ backgroundColor: themeColor }}
                            >
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="px-6 space-y-4">
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

                      {/* Stock status */}
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isInStock ? "bg-green-500" : "bg-red-500"}`} />
                        <span className="text-sm text-gray-600">{isInStock ? "In Stock" : "Out of Stock"}</span>
                      </div>

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
                  </div>

                  {/* Action buttons */}
                  <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="flex space-x-3">
                      <button
                        onClick={toggleFavorite}
                        className={`p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors ${
                          isFavorite ? "bg-red-50 text-red-500" : ""
                        }`}
                      >
                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <Share size={20} />
                      </button>
                      <button
                        onClick={handleAddToCart}
                        disabled={!isInStock || isAddedToCart}
                        className="flex-1 py-3 px-6 rounded-xl text-white font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                        style={{ backgroundColor: isAddedToCart ? "#22c55e" : themeColor }}
                      >
                        {isAddedToCart ? (
                          <>
                            <Check size={20} />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={20} />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Desktop Modal - Enhanced with Expandable and Scrollable */}
            <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-4">
              <motion.div
                variants={desktopModalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-7xl"
              >
                <motion.div
                  variants={desktopExpandedVariants}
                  animate={isExpanded ? "expanded" : "collapsed"}
                  className="flex flex-col overflow-hidden"
                >
                  {/* Desktop Header */}
                  <div className="flex justify-between items-center p-6 lg:p-8 border-b border-gray-100 bg-white/95 backdrop-blur-md">
                    <div className="flex items-center space-x-4">
                      <span
                        className="text-sm font-medium px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: themeColor }}
                      >
                        {product.category.name}
                      </span>
                      {product.brand && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Award size={14} className="mr-1" />
                            {product.brand}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                      </button>

                      <button
                        onClick={handleShare}
                        className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Share size={18} />
                      </button>

                      <button
                        onClick={toggleFavorite}
                        className={`p-3 rounded-xl transition-colors ${
                          isFavorite ? "bg-red-50 text-red-500" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                      </button>

                      <button
                        onClick={onClose}
                        className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Desktop Content Grid - Scrollable */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-1 xl:grid-cols-5 min-h-full">
                      {/* Left Column - Images */}
                      <div className="xl:col-span-3 p-6 lg:p-8 flex flex-col">
                        {/* Main Image Container */}
                        <div className="flex-1 flex flex-col">
                          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex-1 overflow-hidden group cursor-pointer mb-6 min-h-[400px]">
                            <img
                              src={product.image_urls[currentImageIndex] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                              onClick={openFullscreenImage}
                            />

                            {/* Zoom overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="bg-white rounded-full p-4 shadow-lg">
                                <ZoomIn size={24} className="text-gray-700" />
                              </div>
                            </div>

                            {/* Product tags */}
                            <div className="absolute top-6 left-6 flex flex-col space-y-3">
                              {hasDiscount && (
                                <span
                                  className="text-sm font-medium px-4 py-2 rounded-full text-white flex items-center shadow-lg backdrop-blur-sm"
                                  style={{ backgroundColor: "#e53e3e" }}
                                >
                                  <Tag size={14} className="mr-2" />
                                  {discountPercentage}% OFF
                                </span>
                              )}

                              {product.is_new && (
                                <span
                                  className="text-sm font-medium px-4 py-2 rounded-full text-white shadow-lg backdrop-blur-sm"
                                  style={{ backgroundColor: themeColor }}
                                >
                                  NEW
                                </span>
                              )}

                              {product.is_featured && (
                                <span className="text-sm font-medium px-4 py-2 rounded-full bg-amber-500 text-white shadow-lg backdrop-blur-sm flex items-center">
                                  <Award size={14} className="mr-2" />
                                  FEATURED
                                </span>
                              )}
                            </div>

                            {/* Navigation arrows */}
                            {hasMultipleImages && (
                              <>
                                <button
                                  onClick={prevImage}
                                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-xl rounded-full p-4 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <ChevronLeft size={20} />
                                </button>

                                <button
                                  onClick={nextImage}
                                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-xl rounded-full p-4 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <ChevronRight size={20} />
                                </button>
                              </>
                            )}

                            {/* Image counter */}
                            {hasMultipleImages && (
                              <div className="absolute bottom-6 right-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                                {currentImageIndex + 1} / {product.image_urls.length}
                              </div>
                            )}

                            {/* Out of stock overlay */}
                            {!isInStock && (
                              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                <div className="bg-gray-900/90 text-white px-8 py-4 rounded-2xl font-medium">
                                  OUT OF STOCK
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Thumbnail Images */}
                          {hasMultipleImages && (
                            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                              {product.image_urls.map((imageUrl, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentImageIndex(index)}
                                  className={`w-24 h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                                    currentImageIndex === index
                                      ? "ring-2 shadow-xl scale-105"
                                      : "opacity-70 hover:opacity-100"
                                  }`}
                                  style={
                                    {
                                      "--tw-ring-color": currentImageIndex === index ? themeColor : "transparent",
                                    } as React.CSSProperties
                                  }
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
                      </div>

                      {/* Right Column - Product Info - Scrollable */}
                      <div className="xl:col-span-2 bg-gray-50 p-6 lg:p-8 flex flex-col overflow-y-auto scrollbar-hide">
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

                          {/* Product Details Tabs - Only show if expanded */}
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
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Fullscreen Image Modal */}
            <AnimatePresence>
              {isFullscreenImage && product.image_urls && product.image_urls.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm flex items-center justify-center"
                  onClick={closeFullscreenImage}
                >
                  <div
                    className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Fullscreen Image */}
                    <div
                      className={`relative max-w-full max-h-full transition-transform duration-500 ${
                        isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                      }`}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <img
                        src={product.image_urls[currentImageIndex] || "/placeholder.svg"}
                        alt={product.name}
                        className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleZoom()
                        }}
                      />
                    </div>

                    {/* Fullscreen Controls */}
                    <div className="absolute top-6 right-6 flex space-x-3">
                      <button
                        onClick={toggleZoom}
                        className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                      >
                        {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadImageWithWatermark()
                        }}
                        className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                      >
                        <Download size={24} />
                      </button>

                      <button
                        onClick={closeFullscreenImage}
                        className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    {/* Fullscreen Navigation */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            prevImage()
                          }}
                          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full p-5 hover:bg-white/30 transition-colors"
                        >
                          <ChevronLeft size={28} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            nextImage()
                          }}
                          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full p-5 hover:bg-white/30 transition-colors"
                        >
                          <ChevronRight size={28} />
                        </button>

                        {/* Image counter */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-6 py-3 rounded-full text-base font-medium backdrop-blur-md">
                          {currentImageIndex + 1} / {product.image_urls.length}
                        </div>

                        {/* Thumbnails */}
                        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 overflow-x-auto pb-2 px-1 max-w-full">
                          {product.image_urls.map((imageUrl, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation()
                                setCurrentImageIndex(index)
                                setIsZoomed(false)
                              }}
                              className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 border-2 ${
                                currentImageIndex === index
                                  ? "border-white opacity-100 scale-110"
                                  : "border-transparent opacity-60 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={imageUrl || "/placeholder.svg"}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Enhanced custom styles
const customStyles = `
/* Enhanced scrollbar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth transitions and animations */
* {
  scroll-behavior: smooth;
}

/* Enhanced animations */
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-heartbeat {
  animation: heartbeat 0.6s ease-in-out;
}

.animate-slide-in-up {
  animation: slideInUp 0.4s ease-out;
}

.animate-fade-in-scale {
  animation: fadeInScale 0.3s ease-out;
}

/* Enhanced focus styles for accessibility */
button:focus-visible {
  outline: 3px solid #6366f1;
  outline-offset: 2px;
}

/* Enhanced backdrop blur for better browser compatibility */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Improve touch responsiveness */
  button {
    touch-action: manipulation;
  }
}

/* Desktop optimizations */
@media (min-width: 769px) {
  /* Enhanced hover effects */
  .group:hover .group-hover\\:opacity-100 {
    opacity: 1;
  }
  
  .group:hover .group-hover\\:scale-100 {
    transform: scale(1);
  }
  
  .group:hover .group-hover\\:scale-105 {
    transform: scale(1.05);
  }
  
  /* Smooth transitions for larger screens */
  .transition-all {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Enhanced glass morphism effects */
.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Enhanced shadow effects */
.shadow-premium {
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

/* Enhanced button states */
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
`

// Enhanced style injection with error handling and cleanup
if (typeof document !== "undefined" && !document.getElementById("enhanced-product-modal-styles")) {
  const styleElement = document.createElement("style")
  styleElement.id = "enhanced-product-modal-styles"
  styleElement.textContent = customStyles
  document.head.appendChild(styleElement)
}

export default EnhancedProductModal
