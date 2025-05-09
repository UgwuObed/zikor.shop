"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  X, 
  CheckCircle2, 
  Circle, 
  Tag, 
  Package, 
  Wallet, 
  Search,
  SlidersHorizontal,
  Check
} from "lucide-react"

interface Category {
  id: number
  name: string
}

interface FilterOptions {
  categories: number[]
  priceRange: {
    min: number
    max: number
  }
  inStock: boolean
  search?: string
}

interface ProductFilterProps {
  categories: Category[]
  minPrice: number
  maxPrice: number
  onFilterChange: (filters: FilterOptions) => void
  themeColor: string
  mobileView?: boolean
  initialFilters?: Partial<FilterOptions>
  totalProducts?: number
}

const ProductFilter = ({
  categories,
  minPrice,
  maxPrice,
  onFilterChange,
  themeColor,
  mobileView = false,
  initialFilters,
  totalProducts = 0
}: ProductFilterProps) => {
  // State management
  const [isOpen, setIsOpen] = useState(!mobileView)
  const [selectedCategories, setSelectedCategories] = useState<number[]>(initialFilters?.categories || [])
  const [priceRange, setPriceRange] = useState({ 
    min: initialFilters?.priceRange?.min || minPrice, 
    max: initialFilters?.priceRange?.max || maxPrice 
  })
  const [inStockOnly, setInStockOnly] = useState(initialFilters?.inStock || false)
  const [rangeMin, setRangeMin] = useState(initialFilters?.priceRange?.min || minPrice)
  const [rangeMax, setRangeMax] = useState(initialFilters?.priceRange?.max || maxPrice)
  const [searchTerm, setSearchTerm] = useState(initialFilters?.search || "")
  const [isDraggingMin, setIsDraggingMin] = useState(false)
  const [isDraggingMax, setIsDraggingMax] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Refs
  const minThumbRef = useRef<HTMLDivElement>(null)
  const maxThumbRef = useRef<HTMLDivElement>(null)
  const sliderTrackRef = useRef<HTMLDivElement>(null)
  
  // Track mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768 && !mobileView) {
        setIsOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileView])

  // Apply filters when they change
  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      priceRange: {
        min: priceRange.min,
        max: priceRange.max,
      },
      inStock: inStockOnly,
      search: searchTerm
    })
  }, [selectedCategories, priceRange, inStockOnly, searchTerm, onFilterChange])

  // Handle slider drag events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderTrackRef.current) return
      
      const trackRect = sliderTrackRef.current.getBoundingClientRect()
      const trackWidth = trackRect.width
      const offsetX = e.clientX - trackRect.left
      
      // Calculate percentage within track bounds (0-100)
      let percentage = Math.max(0, Math.min(100, (offsetX / trackWidth) * 100))
      
      // Convert percentage to price value
      const priceValue = Math.round(minPrice + ((maxPrice - minPrice) * percentage) / 100)
      
      if (isDraggingMin) {
        // Ensure min doesn't exceed max
        if (priceValue <= priceRange.max) {
          setRangeMin(priceValue)
          setPriceRange(prev => ({ ...prev, min: priceValue }))
        }
      } else if (isDraggingMax) {
        // Ensure max doesn't go below min
        if (priceValue >= priceRange.min) {
          setRangeMax(priceValue)
          setPriceRange(prev => ({ ...prev, max: priceValue }))
        }
      }
    }
    
    const handleMouseUp = () => {
      setIsDraggingMin(false)
      setIsDraggingMax(false)
    }
    
    if (isDraggingMin || isDraggingMax) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingMin, isDraggingMax, minPrice, maxPrice, priceRange])

  // Toggle category selection
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Handle direct price input
  const handlePriceRangeChange = (type: "min" | "max", value: string) => {
    const numValue = Number(value)
    if (isNaN(numValue)) return

    if (type === "min") {
      setRangeMin(numValue)
      if (numValue <= priceRange.max) {
        setPriceRange({ ...priceRange, min: numValue })
      }
    } else {
      setRangeMax(numValue)
      if (numValue >= priceRange.min) {
        setPriceRange({ ...priceRange, max: numValue })
      }
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange({ min: minPrice, max: maxPrice })
    setRangeMin(minPrice)
    setRangeMax(maxPrice)
    setInStockOnly(false)
    setSearchTerm("")
  }

  // Format price for display
  const formatPrice = (price: number) => `₦${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  
  // Calculate active filter count
  const activeFilterCount = 
    selectedCategories.length +
    (inStockOnly ? 1 : 0) +
    (priceRange.min > minPrice || priceRange.max < maxPrice ? 1 : 0) +
    (searchTerm ? 1 : 0)
    
  // Section toggle handler
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }
  
  // Check if a section is active (for desktop view)
  const isSectionActive = (section: string) => {
    // On desktop, all sections are active if not specifically collapsed
    if (!isMobile) return true
    // On mobile, only show the selected section
    return activeSection === section
  }
  
  // Min-max price range percentages for slider
  const minPercentage = ((priceRange.min - minPrice) / (maxPrice - minPrice)) * 100
  const maxPercentage = ((priceRange.max - minPrice) / (maxPrice - minPrice)) * 100
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
      {/* Filter Header */}
      <div
        className={`px-4 py-3 flex justify-between items-center transition-colors duration-200 border-b ${
          isOpen ? "bg-gray-50 dark:bg-gray-800/50" : ""
        }`}
        style={{ borderColor: isOpen ? `${themeColor}20` : "transparent" }}
      >
        <div className="flex items-center">
          <SlidersHorizontal size={18} className="mr-2 text-gray-500 dark:text-gray-400" />
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Filters</h3>
          
          {activeFilterCount > 0 && (
            <div 
              className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: themeColor }}
            >
              {activeFilterCount}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Reset button - show only when filters are applied */}
          {activeFilterCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetFilters}
              className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <X size={14} className="mr-1" />
              <span>Reset</span>
            </motion.button>
          )}
          
          {/* Toggle button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label={isOpen ? "Collapse filters" : "Expand filters"}
          >
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Filter Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 py-2">
              {/* Search input */}
              <div className="mb-4 relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-900 transition-all"
                    style={{ 
                      outline: `2px solid ${themeColor}40`,
                      borderColor: themeColor
                    }}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search size={16} />
                  </div>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            
              {/* Product count */}
              {totalProducts > 0 && (
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {activeFilterCount > 0 ? (
                    <span>Showing {totalProducts} filtered products</span>
                  ) : (
                    <span>{totalProducts} products available</span>
                  )}
                </div>
              )}
              
              {/* Mobile accordion layout */}
              {isMobile && (
                <div className="space-y-2 mb-4">
                  {/* Categories Section */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('categories')}
                      className="w-full px-3 py-2.5 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 text-left"
                    >
                      <div className="flex items-center">
                        <Tag size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Categories</span>
                        {selectedCategories.length > 0 && (
                          <span 
                            className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full text-white"
                            style={{ backgroundColor: themeColor }}
                          >
                            {selectedCategories.length}
                          </span>
                        )}
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`text-gray-500 dark:text-gray-400 transition-transform ${
                          activeSection === 'categories' ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {activeSection === 'categories' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 py-2 space-y-2 max-h-60 overflow-y-auto">
                            {categories.map((category) => (
                              <div key={category.id} className="flex items-center">
                                <button
                                  onClick={() => toggleCategory(category.id)}
                                  className="flex items-center w-full py-1.5 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                  {selectedCategories.includes(category.id) ? (
                                    <CheckCircle2 
                                      size={16} 
                                      className="mr-2 flex-shrink-0" 
                                      style={{ color: themeColor }} 
                                    />
                                  ) : (
                                    <Circle size={16} className="mr-2 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                                  )}
                                  <span className={`text-sm ${
                                    selectedCategories.includes(category.id) 
                                      ? 'text-gray-900 dark:text-white font-medium' 
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {category.name}
                                  </span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Price Range Section */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('price')}
                      className="w-full px-3 py-2.5 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 text-left"
                    >
                      <div className="flex items-center">
                        <Wallet size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Price Range</span>
                        {(priceRange.min > minPrice || priceRange.max < maxPrice) && (
                          <span 
                            className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full text-white"
                            style={{ backgroundColor: themeColor }}
                          >
                            1
                          </span>
                        )}
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`text-gray-500 dark:text-gray-400 transition-transform ${
                          activeSection === 'price' ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {activeSection === 'price' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 py-3">
                            {renderPriceRangeContent()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Availability Section */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('availability')}
                      className="w-full px-3 py-2.5 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 text-left"
                    >
                      <div className="flex items-center">
                        <Package size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Availability</span>
                        {inStockOnly && (
                          <span 
                            className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full text-white"
                            style={{ backgroundColor: themeColor }}
                          >
                            1
                          </span>
                        )}
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`text-gray-500 dark:text-gray-400 transition-transform ${
                          activeSection === 'availability' ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {activeSection === 'availability' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 py-3">
                            {renderAvailabilityContent()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
              
              {/* Desktop layout */}
              {!isMobile && (
                <div className="space-y-6">
                  {/* Categories */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
                        <Tag size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                        Categories
                      </h4>
                      {selectedCategories.length > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedCategories([])}
                          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          Clear
                        </motion.button>
                      )}
                    </div>
                    
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {categories.map((category) => (
                        <motion.button
                          key={category.id}
                          whileHover={{ x: 2 }}
                          onClick={() => toggleCategory(category.id)}
                          className={`flex items-center w-full py-1.5 px-2 rounded-md ${
                            selectedCategories.includes(category.id)
                              ? 'bg-gray-50 dark:bg-gray-800/50'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                          } transition-colors`}
                        >
                          {selectedCategories.includes(category.id) ? (
                            <CheckCircle2 size={16} className="mr-2" style={{ color: themeColor }} />
                          ) : (
                            <Circle size={16} className="mr-2 text-gray-400 dark:text-gray-600" />
                          )}
                          <span className={`text-sm ${
                            selectedCategories.includes(category.id) 
                              ? 'text-gray-900 dark:text-white font-medium' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {category.name}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
                        <Wallet size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                        Price Range
                      </h4>
                      {(priceRange.min > minPrice || priceRange.max < maxPrice) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setPriceRange({ min: minPrice, max: maxPrice })
                            setRangeMin(minPrice)
                            setRangeMax(maxPrice)
                          }}
                          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          Reset
                        </motion.button>
                      )}
                    </div>
                    
                    {renderPriceRangeContent()}
                  </div>

                  {/* Availability */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center mb-3">
                      <Package size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                      Availability
                    </h4>
                    
                    {renderAvailabilityContent()}
                  </div>
                </div>
              )}
              
              {/* Applied filters summary */}
              {activeFilterCount > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Applied Filters</h4>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetFilters}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    >
                      Clear All
                    </motion.button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {/* Render category filters */}
                    {selectedCategories.map(categoryId => {
                      const category = categories.find(c => c.id === categoryId)
                      if (!category) return null
                      
                      return (
                        <motion.div
                          key={`filter-cat-${categoryId}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-xs"
                        >
                          <span className="text-gray-700 dark:text-gray-300 mr-1">{category.name}</span>
                          <button
                            onClick={() => toggleCategory(categoryId)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      )
                    })}
                    
                    {/* Price range filter */}
                    {(priceRange.min > minPrice || priceRange.max < maxPrice) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-xs"
                      >
                        <span className="text-gray-700 dark:text-gray-300 mr-1">
                          {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                        </span>
                        <button
                          onClick={() => {
                            setPriceRange({ min: minPrice, max: maxPrice })
                            setRangeMin(minPrice)
                            setRangeMax(maxPrice)
                          }}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )}
                    
                    {/* In stock filter */}
                    {inStockOnly && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-xs"
                      >
                        <span className="text-gray-700 dark:text-gray-300 mr-1">In Stock Only</span>
                        <button
                          onClick={() => setInStockOnly(false)}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )}
                    
                    {/* Search term filter */}
                    {searchTerm && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-xs"
                      >
                        <span className="text-gray-700 dark:text-gray-300 mr-1">
                          Search: {searchTerm.length > 15 ? searchTerm.substring(0, 15) + '...' : searchTerm}
                        </span>
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
  
  function renderPriceRangeContent() {
    return (
      <>
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Min</label>
            <input
              type="number"
              value={rangeMin}
              onChange={(e) => handlePriceRangeChange("min", e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ outlineColor: themeColor }}
              min={minPrice}
              max={maxPrice}
            />
          </div>
          <div className="text-gray-400 dark:text-gray-500">—</div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Max</label>
            <input
              type="number"
              value={rangeMax}
              onChange={(e) => handlePriceRangeChange("max", e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ outlineColor: themeColor }}
              min={minPrice}
              max={maxPrice}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatPrice(minPrice)}</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>
          
          {/* Custom range slider */}
          <div 
            ref={sliderTrackRef}
            className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-1 cursor-pointer"
            onClick={(e) => {
              if (!sliderTrackRef.current) return
              
              const trackRect = sliderTrackRef.current.getBoundingClientRect()
              const trackWidth = trackRect.width
              const offsetX = e.clientX - trackRect.left
              
            
              let percentage = Math.max(0, Math.min(100, (offsetX / trackWidth) * 100))
              
              const priceValue = Math.round(minPrice + ((maxPrice - minPrice) * percentage) / 100)
              
              const minDistance = Math.abs(priceValue - priceRange.min)
              const maxDistance = Math.abs(priceValue - priceRange.max)
              
              if (minDistance <= maxDistance) {
                setRangeMin(priceValue)
                setPriceRange(prev => ({ ...prev, min: priceValue }))
              } else {
                setRangeMax(priceValue)
                setPriceRange(prev => ({ ...prev, max: priceValue }))
              }
            }}
          >
            {/* Active track */}
            <div
              className="absolute h-full rounded-full"
              style={{
                left: `${minPercentage}%`,
                right: `${100 - maxPercentage}%`,
                backgroundColor: themeColor,
              }}
            />
            
            {/* Min thumb */}
            <motion.div
              ref={minThumbRef}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="absolute w-4 h-4 rounded-full bg-white dark:bg-gray-200 shadow-md cursor-grab active:cursor-grabbing"
              style={{
                left: `${minPercentage}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: `2px solid ${themeColor}`,
                touchAction: 'none'
              }}
              onMouseDown={() => setIsDraggingMin(true)}
              onTouchStart={() => setIsDraggingMin(true)}
            />
            
            {/* Max thumb */}
            <motion.div
              ref={maxThumbRef}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="absolute w-4 h-4 rounded-full bg-white dark:bg-gray-200 shadow-md cursor-grab active:cursor-grabbing"
              style={{
                left: `${maxPercentage}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: `2px solid ${themeColor}`,
                touchAction: 'none'
              }}
              onMouseDown={() => setIsDraggingMax(true)}
              onTouchStart={() => setIsDraggingMax(true)}
            />
          </div>
          
          {/* Current selected range display */}
          <div className="text-center text-xs font-medium" style={{ color: themeColor }}>
            {formatPrice(priceRange.min)} — {formatPrice(priceRange.max)}
          </div>
        </div>
      </>
    )
  }
  

  function renderAvailabilityContent() {
    return (
      <button
        onClick={() => setInStockOnly(!inStockOnly)}
        className={`flex items-center w-full py-2 px-3 rounded-md transition-colors ${
          inStockOnly 
            ? 'bg-gray-50 dark:bg-gray-800/50' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
        }`}
      >
        <div className="relative w-5 h-5 mr-3 flex-shrink-0">
          <motion.div
            initial={false}
            animate={{
              backgroundColor: inStockOnly ? themeColor : 'transparent',
              borderColor: inStockOnly ? themeColor : '#d1d5db'
            }}
            className={`absolute inset-0 rounded border-2 dark:border-gray-600`}
          />
          {inStockOnly && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute inset-0 flex items-center justify-center text-white"
            >
              <Check size={14} />
            </motion.div>
          )}
        </div>
        <span className={`text-sm ${
          inStockOnly 
            ? 'text-gray-900 dark:text-white font-medium' 
            : 'text-gray-700 dark:text-gray-300'
        }`}>
          In Stock Only
        </span>
      </button>
    )
  }
}



export default ProductFilter