"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ShoppingCart,
  Heart,
  ChevronUp,
  ChevronDown,
  Share,
  Award,
} from "lucide-react"
import ProductImageViewer from "./Product/viewer"
import ProductDetails from "./Product/details"

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

interface EnhancedProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onAddToCart: (productId: number, quantity: number, selectedColor?: string, selectedSize?: string) => void
  themeColor: string
}

const ProductModal = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  themeColor,
}: EnhancedProductModalProps) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "features">("description")
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [selectionError, setSelectionError] = useState<string>("")
  
  const productDetailsRef = useRef<{ handleAddToCart: () => void }>(null)

  useEffect(() => {
    if (product) {
      setQuantity(1)
      setSelectedColor("")
      setSelectedSize("")
      setCurrentImageIndex(0)
      setActiveTab("description")
      setIsAddedToCart(false)
      setIsExpanded(false)
      setSelectionError("")
    
      if (Array.isArray(product.colors) && product.colors.length === 1) {
        setSelectedColor(product.colors[0])
      }
      if (Array.isArray(product.sizes) && product.sizes.length === 1) {
        setSelectedSize(product.sizes[0])
      }
    }
  }, [product])

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
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
  }, [isOpen, onClose])

  const handleDrag = useCallback((event: any, info: any) => {
    if (info.offset.y > 0) {
      setDragY(info.offset.y)
    }
  }, [])

  const handleDragEnd = useCallback(
    (event: any, info: any) => {
      if (info.offset.y > 100 || info.velocity.y > 500) {
        onClose()
      } else {
        setDragY(0)
      }
    },
    [onClose],
  )

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || "",
          text: product?.description || "",
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    }
  }

  if (!product) return null

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
                  <ProductImageViewer
                    product={product}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                    themeColor={themeColor}
                    isMobile={true}
                  />

                  <ProductDetails
                    ref={productDetailsRef}
                    product={product}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    selectionError={selectionError}
                    setSelectionError={setSelectionError}
                    isAddedToCart={isAddedToCart}
                    setIsAddedToCart={setIsAddedToCart}
                    onAddToCart={onAddToCart}
                    themeColor={themeColor}
                    isExpanded={isExpanded}
                    isMobile={true}
                  />
                </div>

                {/* Mobile Action buttons */}
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
                      onClick={() => productDetailsRef.current?.handleAddToCart()}
                      disabled={product.quantity === 0 || isAddedToCart}
                      className="flex-1 py-3 px-6 rounded-xl text-white font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                      style={{ backgroundColor: isAddedToCart ? "#22c55e" : themeColor }}
                    >
                      <ShoppingCart size={20} />
                      <span>{isAddedToCart ? "Added to Cart" : "Add to Cart"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Desktop Modal */}
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

                {/* Desktop Scrollable */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  <div className="grid grid-cols-1 xl:grid-cols-5 min-h-full">
                    {/* Left Column - Images */}
                    <div className="xl:col-span-3">
                      <ProductImageViewer
                        product={product}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={setCurrentImageIndex}
                        themeColor={themeColor}
                        isMobile={false}
                      />
                    </div>

                    {/* Right Column - Details */}
                    <div className="xl:col-span-2">
                      <ProductDetails
                        ref={productDetailsRef}
                        product={product}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        selectionError={selectionError}
                        setSelectionError={setSelectionError}
                        isAddedToCart={isAddedToCart}
                        setIsAddedToCart={setIsAddedToCart}
                        onAddToCart={onAddToCart}
                        themeColor={themeColor}
                        isExpanded={isExpanded}
                        isMobile={false}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

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

if (typeof document !== "undefined" && !document.getElementById("enhanced-product-modal-styles")) {
  const styleElement = document.createElement("style")
  styleElement.id = "enhanced-product-modal-styles"
  styleElement.textContent = customStyles
  document.head.appendChild(styleElement)
}

export default ProductModal