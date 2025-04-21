"use client"

import type React from "react"

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Search, Tag, Package, Award, Zap, Star } from "lucide-react"

interface StorefrontHeaderProps {
  storefront: {
    business_name: string
    tagline: string
    category: string
    logo: string | null
    banner: string | null
  }
  cartCount: number
  themeColor: string
  onCartClick: () => void
}

const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({ storefront, cartCount, themeColor, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)


  // Mock categories with icons - these could be fetched from actual data
  const categories = [
    { name: "Featured", icon: Star },
    { name: "New", icon: Zap },
    { name: "Trending", icon: Award },
    { name: "Collections", icon: Package },
  ]

  // Track scroll position for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header className="relative z-20">
        {/* Banner with parallax effect - keeping the original */}
        <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-gray-200 relative overflow-hidden">
          {storefront.banner ? (
            <div
              className="absolute inset-0 transform scale-110"
              style={{
                backgroundImage: `url(${storefront.banner})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.85)",
                transform: isScrolled ? "scale(1.15) translateY(-5%)" : "scale(1.1)",
                transition: "transform 0.5s ease-out",
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(135deg, ${adjustColorLightness(themeColor, 0.7)}, ${themeColor}, ${adjustColorLightness(themeColor, 0.8)})`,
                backgroundSize: "200% 200%",
                animation: "gradientAnimation 15s ease infinite",
              }}
            >
              <style jsx global>{`
                @keyframes gradientAnimation {
                  0% { background-position: 0% 50% }
                  50% { background-position: 100% 50% }
                  100% { background-position: 0% 50% }
                }
                @keyframes pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                }
              `}</style>
            </div>
          )}

          {/* Banner content overlay - enhanced but keeping it simple */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg"
              style={{ 
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                letterSpacing: "-0.02em" 
              }}
            >
              {storefront.business_name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-sm sm:text-base md:text-lg text-white mt-2 max-w-2xl drop-shadow-md"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            >
              {storefront.tagline}
            </motion.p>
          </div>

          {/* Fancier wave overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 w-full h-16 text-white"
              fill="currentColor"
            >
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
            </svg>
          </div>
        </div>

        {/* Enhanced Store Info Bar with glossy effect and sticky behavior */}
        <div
          className={`w-full transition-all duration-300 ${isScrolled ? "sticky top-0 z-50" : ""} backdrop-blur-sm`}
          style={{
            background: isScrolled ? 
              `rgba(255, 255, 255, 0.95)` : 
              `linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%)`
          }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              {/* Logo and Store Name - fancy glass effect */}
              <div className="flex items-center space-x-3">
                <div
                  className={`
                    ${isScrolled ? "w-10 h-10" : "w-16 h-16 -mt-8"} 
                    rounded-full overflow-hidden border-2 border-white flex-shrink-0 
                    transition-all duration-300 backdrop-blur shadow-lg
                  `}
                  style={{
                    boxShadow: `0 8px 32px -8px ${themeColor}40`,
                    borderColor: `${themeColor}20`
                  }}
                >
                  {storefront.logo ? (
                    <Image
                      src={storefront.logo || "/placeholder.svg"}
                      alt={storefront.business_name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center bg-gradient-to-br"
                      style={{ 
                        backgroundImage: `linear-gradient(135deg, ${adjustColorLightness(themeColor, 1.2)}, ${themeColor})` 
                      }}
                    >
                      <span
                        className={`${isScrolled ? "text-lg" : "text-xl"} font-bold text-white transition-all duration-300`}
                      >
                        {storefront.business_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Store name*/}
                <div>
                  <motion.h2
                    className={`${isScrolled ? "text-lg" : "text-xl"} font-bold text-gray-800 hidden sm:block transition-all duration-300`}
                    animate={{ 
                      scale: isScrolled ? 0.95 : 1,
                      originX: 0
                    }}
                    transition={{ type: "tween", duration: 0.2 }}
                  >
                    {storefront.business_name}
                  </motion.h2>
                  {isScrolled && <span className="text-xs text-gray-500 hidden sm:block">{storefront.category}</span>}
                </div>
              </div>


              {/* Enhanced Cart Button with animations */}
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="relative"
              >
                <button
                  onClick={onCartClick}
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors relative group"
                  aria-label="Shopping cart"
                  style={{
                    background: `linear-gradient(45deg, ${themeColor}10, ${themeColor}20)`,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <ShoppingCart size={20} style={{ color: themeColor }} className="group-hover:text-gray-900 transition-colors" />
                  </motion.div>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold text-white shadow-md"
                      style={{ backgroundColor: themeColor }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Category Tags with Icons - enhancing the existing category tag */}
        {!isScrolled && (
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5"
                style={{
                  backgroundColor: `${themeColor}15`,
                  color: themeColor,
                  boxShadow: `0 2px 8px ${themeColor}20`,
                }}
              >
                <Tag size={12} />
                {storefront.category}
              </span>
              
              {/* Adding fancy category tags with icons */}
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.span
                    key={category.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer hover:shadow-md transition-all"
                    style={{
                      backgroundColor: `${themeColor}10`,
                      color: '#666',
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: `${themeColor}15`,
                      color: themeColor
                    }}
                  >
                    <Icon size={12} />
                    {category.name}
                  </motion.span>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Floating Cart Button  */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={onCartClick}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${adjustColorLightness(themeColor, 1.1)}, ${themeColor})`,
            boxShadow: `0 4px 20px ${themeColor}60` 
          }}
          whileHover={{ scale: 1.1, boxShadow: `0 5px 25px ${themeColor}80` }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart size={22} className="text-white" />
          {cartCount > 0 && (
            <motion.span
              key={cartCount}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white bg-red-500 border-2 border-white"
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>
      </motion.div>
    </>
  )
}

function adjustColorLightness(hex: string, factor: number): string {
  try {
    let r = Number.parseInt(hex.slice(1, 3), 16)
    let g = Number.parseInt(hex.slice(3, 5), 16)
    let b = Number.parseInt(hex.slice(5, 7), 16)

    r = Math.min(255, Math.round(r * factor))
    g = Math.min(255, Math.round(g * factor))
    b = Math.min(255, Math.round(b * factor))

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  } catch (e) {
    return hex
  }
}

export default StorefrontHeader