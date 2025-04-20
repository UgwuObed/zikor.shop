"use client"

import type React from "react"

import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"

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

// Update the StorefrontHeader component to be more responsive
// Adjust the banner and logo for mobile

const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({ storefront, cartCount, themeColor, onCartClick }) => {
  return (
    <header className="relative">
      {/* Banner - adjust height for mobile */}
      <div className="w-full h-32 sm:h-40 md:h-48 lg:h-64 bg-gray-200 relative overflow-hidden">
        {storefront.banner ? (
          <Image
            src={storefront.banner || "/placeholder.svg"}
            alt={`${storefront.business_name} banner`}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(to right, ${adjustColorLightness(themeColor, 0.9)}, ${themeColor})`,
            }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{storefront.business_name}</h1>
          </div>
        )}
      </div>

      {/* Store Info Bar - adjust for mobile */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto px-3 sm:px-4 relative"
      >
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 -mt-10 sm:-mt-12 flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Logo - smaller on mobile */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-white shadow flex-shrink-0 bg-white">
              {storefront.logo ? (
                <Image
                  src={storefront.logo || "/placeholder.svg"}
                  alt={storefront.business_name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  <span className="text-xl sm:text-2xl font-bold text-white">{storefront.business_name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Store Info - adjust text size for mobile */}
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{storefront.business_name}</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{storefront.tagline}</p>
              <div className="mt-1 sm:mt-2 flex items-center">
                <span
                  className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    color: adjustColorLightness(themeColor, 0.7),
                  }}
                >
                  {storefront.category}
                </span>
              </div>
            </div>
          </div>

          {/* Cart Icon - adjust for mobile */}
          <motion.div whileHover={{ scale: 1.05 }} className="mt-2 sm:mt-0">
            <button
              onClick={onCartClick}
              className="relative p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart size={20} style={{ color: themeColor }} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full text-xs text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </header>
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