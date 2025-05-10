"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingCart, 
  Search, 
  Tag, 
  Package, 
  Award, 
  Zap, 
  Star, 
  ArrowRight,
  Menu,
  X,
  Heart,
  User,
  ChevronDown,
  Bell
} from "lucide-react"

interface StorefrontHeaderProps {
  storefront: {
    business_name: string
    tagline: string
    category: string
    logo: string | null
    banner: string | null
    established?: string
    rating?: number
    verified?: boolean
  }
  cartCount: number
  themeColor: string
  onCartClick: () => void
  onSearch?: (query: string) => void
}

const StorefrontHeader = ({ 
  storefront, 
  cartCount, 
  themeColor, 
  onCartClick,
  onSearch
}: StorefrontHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [bannerOffset, setBannerOffset] = useState(0)
  const bannerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Enhanced categories with icons and descriptions
  const categories = [
    { 
      name: "Featured", 
      icon: Star, 
      description: "Our top picks",
      color: "#FFB800" 
    },
    { 
      name: "New Arrivals", 
      icon: Zap, 
      description: "Just in",
      color: "#2563EB" 
    },
    { 
      name: "Best Sellers", 
      icon: Award, 
      description: "Customer favorites",
      color: "#16A34A" 
    },
    { 
      name: "Collections", 
      icon: Package, 
      description: "Curated sets",
      color: "#9333EA" 
    },
  ]

  // Track scroll position for parallax and sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 80)
      
      // Parallax effect for banner
      if (bannerRef.current) {
        setBannerOffset(scrollPosition * 0.4)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  // Function to focus search input
  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  return (
    <>
      <header className="relative z-20">
        {/* Enhanced Banner with parallax effect */}
        <div 
          ref={bannerRef}
          className="w-full h-40 sm:h-56 md:h-64 lg:h-72 relative overflow-hidden"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 95%, 0 100%)" }}
        >
          {storefront.banner ? (
            <div
              className="absolute inset-0 bg-no-repeat bg-cover bg-center will-change-transform"
              style={{
                backgroundImage: `url(${storefront.banner})`,
                transform: `translateY(${bannerOffset}px) scale(1.1)`,
                filter: "brightness(0.85)",
              }}
            />
          ) : (
            <div
              className="absolute inset-0 bg-gradient-to-r will-change-transform"
              style={{
                backgroundImage: `linear-gradient(135deg, 
                  ${adjustColorLightness(themeColor, 0.7)}, 
                  ${themeColor}, 
                  ${adjustColorLightness(themeColor, 0.8)})`,
                backgroundSize: "200% 200%",
                animation: "gradientAnimation 15s ease infinite",
                transform: `translateY(${bannerOffset * 0.5}px)`,
              }}
            />
          )}

          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Animated particles effect */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <ParticleEffect themeColor={themeColor} />
          </div>

          {/* Enhanced banner content with better typography and layout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex flex-col items-center"
            >
              {/* Logo above the title for larger screens */}
              {storefront.logo && (
                <div className="hidden md:block mb-4 w-20 h-20 rounded-full overflow-hidden border-4 border-white/90 shadow-lg">
                  <Image
                    src={storefront.logo || "/api/placeholder/80/80"}
                    alt={storefront.business_name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              )}
              
              {/* Business name with enhanced text effects */}
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-white leading-tight"
                style={{ 
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  letterSpacing: "-0.01em",
                }}
              >
                {storefront.business_name}
                
                {/* Verified badge if applicable */}
                {storefront.verified && (
                  <sup className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs">
                    <motion.span
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, delay: 1 }}
                    >
                      ✓
                    </motion.span>
                  </sup>
                )}
              </motion.h1>
              
              {/* Tagline with better styling */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="text-sm sm:text-base md:text-lg text-white/90 mt-3 max-w-2xl font-light"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
              >
                {storefront.tagline}
              </motion.p>
              
              {/* Rating stars if available */}
              {storefront.rating && (
                <motion.div 
                  className="flex items-center mt-3 space-x-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < Math.round(storefront.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}
                    />
                  ))}
                  <span className="text-white/90 text-sm ml-1">{storefront.rating?.toFixed(1)}</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Enhanced navigation bar with glass effect that becomes sticky on scroll */}
        <div
          className={`w-full transition-all duration-300 ${isScrolled ? "sticky top-0 shadow-md" : ""}`}
          style={{
            background: `rgba(255, 255, 255, ${isScrolled ? 0.97 : 0.9})`,
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(229, 231, 235, 0.8)",
            transform: isScrolled ? "translateY(0)" : "translateY(0)",
          }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              {/* Logo and store name with smooth transition */}
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={false}
                  animate={{ 
                    width: isScrolled ? 40 : 56,
                    height: isScrolled ? 40 : 56,
                    marginTop: isScrolled ? 0 : -28,
                    y: isScrolled ? 0 : 0,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20 
                  }}
                  className="rounded-full overflow-hidden border-2 flex-shrink-0 shadow-lg relative z-10"
                  style={{
                    borderColor: "white",
                    boxShadow: `0 8px 24px -8px ${themeColor}40`,
                  }}
                >
                  {storefront.logo ? (
                    <Image
                      src={storefront.logo || "/api/placeholder/64/64"}
                      alt={storefront.business_name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center bg-gradient-to-br"
                      style={{ 
                        backgroundImage: `linear-gradient(135deg, 
                          ${adjustColorLightness(themeColor, 1.2)}, 
                          ${themeColor})` 
                      }}
                    >
                      <span className="text-xl font-bold text-white">
                        {storefront.business_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Store name and category with transition */}
                <div className="hidden sm:block">
                  <motion.h2
                    className="font-bold text-gray-800 transition-all duration-300"
                    initial={false}
                    animate={{ 
                      fontSize: isScrolled ? "1.125rem" : "1.375rem",
                      opacity: 1 
                    }}
                  >
                    {storefront.business_name}
                  </motion.h2>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Tag size={12} className="mr-1.5" />
                    <span>{storefront.category}</span>
                    {storefront.established && (
                      <span className="ml-2 text-xs opacity-75">· Est. {storefront.established}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced search bar and navigation for medium+ screens */}
              <div className="hidden md:flex items-center space-x-5">
                {/* Search input with animation */}
                <motion.form 
                  onSubmit={handleSearch}
                  className={`relative transition-all duration-300 ${isSearchFocused ? "w-64" : "w-48"}`}
                  animate={{ width: isSearchFocused ? 280 : 220 }}
                >
                  {/* <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    ref={searchInputRef}
                    className={`w-full py-2 pl-10 pr-4 rounded-full text-sm transition-all bg-gray-100 
                      border-2 border-transparent focus:border-gray-200 focus:bg-white focus:outline-none
                      ${isSearchFocused ? "shadow-md" : ""}`}
                  /> */}
                  <motion.div 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    animate={{ 
                      scale: isSearchFocused ? 1.1 : 1,
                      color: isSearchFocused ? themeColor : "#9CA3AF" 
                    }}
                  >
                  </motion.div>
                </motion.form>
                
                {/* Navigation links */}
                <nav className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Wishlist"
                  >
                    <Heart size={20} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Account"
                  >
                    <User size={20} />
                  </motion.button>
                  
                  {/* Animated cart button */}
                  <motion.button
                    onClick={onCartClick}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-1 px-4 py-2 rounded-full font-medium text-white shadow-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${adjustColorLightness(themeColor, 1.1)}, ${themeColor})`,
                      boxShadow: `0 2px 10px ${themeColor}40`
                    }}
                    aria-label="Shopping cart"
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <ShoppingCart size={16} className="mr-1.5" />
                    </motion.div>
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="ml-1 bg-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                        style={{ color: themeColor }}
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </motion.button>
                </nav>
              </div>

              {/* Mobile navigation */}
              <div className="flex items-center space-x-2 md:hidden">
                {/* Mobile search button
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={focusSearch}
                  className="p-2.5 rounded-full hover:bg-gray-100"
                  aria-label="Search"
                >
                  <Search size={20} className="text-gray-600" />
                </motion.button> */}
                
                {/* Mobile cart button */}
                <motion.button
                  onClick={onCartClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-full relative"
                  style={{
                    background: `linear-gradient(135deg, ${adjustColorLightness(themeColor, 1.1)}, ${themeColor})`, 
                  }}
                  aria-label="Shopping cart"
                >
                  <ShoppingCart size={20} className="text-white" />
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold bg-white shadow-md"
                      style={{ color: themeColor }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>
                
                {/* Mobile menu toggle */}
                <motion.button
                  onClick={toggleMobileMenu}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-full hover:bg-gray-100"
                  aria-label={showMobileMenu ? "Close menu" : "Open menu"}
                >
                  {showMobileMenu ? (
                    <X size={20} className="text-gray-600" />
                  ) : (
                    <Menu size={20} className="text-gray-600" />
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* Mobile search bar */}
            <div className={`pb-3 md:hidden transition-all duration-300 ${isScrolled ? "h-12" : "h-0 overflow-hidden opacity-0"}`}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchInputRef}
                  className="w-full py-2 pl-10 pr-4 rounded-full text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Enhanced Categories Section with smoother animations and better UI */}
        {!isScrolled && (
          <div className="container mx-auto px-4 py-4">
            <div className="relative">
              {/* Category cards with hover effects */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1), duration: 0.4 }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      background: `linear-gradient(135deg, white, ${category.color}10)`,
                    }}
                    className="relative overflow-hidden rounded-xl p-3 border border-gray-100 cursor-pointer group bg-white transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ 
                          background: `${category.color}15`,
                          color: category.color
                        }}
                      >
                        <category.icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 group-hover:text-gray-900">{category.name}</h3>
                        <p className="text-xs text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu (slide-in from right) */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-3/4 max-w-xs bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-gray-800">{storefront.business_name}</h2>
                <motion.button
                  onClick={toggleMobileMenu}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={24} className="text-gray-500" />
                </motion.button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">CATEGORIES</h3>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.name}>
                    <a 
                      href="#" 
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                      onClick={(e) => e.preventDefault()}
                    >
                      <category.icon size={16} className="mr-3" style={{ color: category.color }} />
                      <span>{category.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-3">ACCOUNT</h3>
              <ul className="space-y-1">
                <li>
                  <a 
                    href="#" 
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                    onClick={(e) => e.preventDefault()}
                  >
                    <User size={16} className="mr-3 text-gray-500" />
                    <span>My Account</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart size={16} className="mr-3 text-gray-500" />
                    <span>Wishlist</span>
                  </a>
                </li>
                <li>
                  <button 
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50 w-full"
                    onClick={onCartClick}
                  >
                    <ShoppingCart size={16} className="mr-3 text-gray-500" />
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span 
                        className="ml-auto px-2 py-0.5 rounded-full text-xs text-white"
                        style={{ backgroundColor: themeColor }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

{/* Enhanced floating cart button with outside badge */}
<motion.div
  className="fixed bottom-6 right-6 z-30 md:hidden"
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
>
  <div className="relative">
    <motion.button
      onClick={onCartClick}
      className="w-16 h-16 rounded-full shadow-xl flex items-center justify-center relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${adjustColorLightness(themeColor, 1.1)}, ${themeColor})`,
        boxShadow: `0 10px 25px -5px ${themeColor}60` 
      }}
      whileHover={{ scale: 1.1, boxShadow: `0 15px 30px -10px ${themeColor}80` }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated background ripple effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 2 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              initial={{ scale: 0, x: "50%", y: "50%" }}
              animate={{ 
                scale: 2.5,
                opacity: [0, 0.2, 0],
              }}
              transition={{ 
                duration: 2,
                delay: i * 1, 
                repeat: Infinity,
                repeatDelay: 1
              }}
              style={{
                width: "100%",
                height: "100%",
                top: "-50%",
                left: "-50%",
              }}
            />
          ))}
        </div>
      </div>
      <ShoppingCart size={26} className="text-white" />
    </motion.button>
    
    {/* Badge moved outside the button overflow context */}
    {cartCount > 0 && (
      <div 
        className="absolute -top-3 -right-3 bg-white rounded-full h-7 flex items-center justify-center text-xs font-bold shadow-md z-10"
        style={{ 
          color: themeColor,
          border: `2px solid ${themeColor}`,
          minWidth: '28px',
          padding: cartCount >= 10 ? '0 6px' : '0'
        }}
      >
        {cartCount > 99 ? "99+" : cartCount}
      </div>
    )}
  </div>
</motion.div>
    </>
  )
}

// Particle effect component for banner background
const ParticleEffect = ({ themeColor }: { themeColor: string }) => {
  return (
    <div className="particles">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          initial={{ 
            scale: 0,
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`, 
            opacity: 0
          }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{ 
            duration: 4 + Math.random() * 6,
            delay: i * 0.3, 
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
          style={{
            width: `${5 + Math.random() * 10}px`,
            height: `${5 + Math.random() * 10}px`,
            backgroundColor: i % 3 === 0 ? "white" : themeColor,
            filter: "blur(1px)"
          }}
        />
      ))}
    </div>
  );
};

// Helper function to adjust color lightness
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

// Add global styles
const globalStyles = `
@keyframes gradientAnimation {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes ripple {
  0% { transform: scale(0); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
}
`;


if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}

export default StorefrontHeader