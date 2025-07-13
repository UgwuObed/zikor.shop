"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  X,
  Tag,
  Award,
  Package,
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

interface ProductImageViewerProps {
  product: Product
  currentImageIndex: number
  setCurrentImageIndex: (index: number) => void
  themeColor: string
  isMobile: boolean
}

const ProductImageViewer = ({
  product,
  currentImageIndex,
  setCurrentImageIndex,
  themeColor,
  isMobile,
}: ProductImageViewerProps) => {
  const [isFullscreenImage, setIsFullscreenImage] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  const hasDiscount = product.discount_price && Number(product.main_price) > Number(product.discount_price)
  const discountPercentage = hasDiscount
    ? Math.round(((Number(product.main_price) - Number(product.discount_price)) / Number(product.main_price)) * 100)
    : 0

  const isInStock = product.quantity > 0
  const hasMultipleImages = product.image_urls && product.image_urls.length > 1

  const nextImage = () => {
    if (!product.image_urls || product.image_urls.length <= 1) return
    setCurrentImageIndex((currentImageIndex + 1) % product.image_urls.length)
  }

  const prevImage = () => {
    if (!product.image_urls || product.image_urls.length <= 1) return
    setCurrentImageIndex(currentImageIndex === 0 ? product.image_urls.length - 1 : currentImageIndex - 1)
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

  if (isMobile) {
    return (
      <>
        {/* Hidden canvas for watermark processing */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Mobile Product Image */}
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
    )
  }

  // Desktop version
  return (
    <>
      {/* Hidden canvas for watermark processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="p-6 lg:p-8 flex flex-col">
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
  )
}

export default ProductImageViewer