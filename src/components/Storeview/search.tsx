"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"

interface Product {
  id: number
  name: string
  discount_price: string
  main_price: string
  category: {
    name: string
  }
  image_urls: string[]
}

interface ProductSearchProps {
  products: Product[]
  onSelectProduct: (productId: number) => void
  themeColor: string
}

const ProductSearch: React.FC<ProductSearchProps> = ({ products, onSelectProduct, themeColor }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([])
      return
    }

    const lowercasedSearch = searchTerm.toLowerCase()
    const filtered = products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(lowercasedSearch) ||
          product.category.name.toLowerCase().includes(lowercasedSearch),
      )
      .slice(0, 5)

    setFilteredProducts(filtered)
  }, [searchTerm, products])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
  }

  const handleSelectProduct = (productId: number) => {
    onSelectProduct(productId)
    setSearchTerm("")
    setIsOpen(false)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setIsOpen(false)
  }

  return (
    <div className="relative w-full mb-4 sm:mb-6" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search products..."
          className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
          style={
            {
              "--tw-ring-color": `${themeColor}40`,
            } as React.CSSProperties
          }
          onFocus={() => setIsOpen(true)}
        />
        <Search size={16} className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown - adjust for mobile */}
      <AnimatePresence>
        {isOpen && filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 sm:max-h-80 overflow-y-auto"
          >
            <div className="py-1 sm:py-2">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ backgroundColor: `${themeColor}10` }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer flex items-center"
                  onClick={() => handleSelectProduct(product.id)}
                >
                  {product.image_urls && product.image_urls.length > 0 ? (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={product.image_urls[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-gray-400">No img</span>
                    </div>
                  )}

                  <div className="ml-2 sm:ml-3 flex-1">
                    <div className="font-medium text-xs sm:text-sm">{product.name}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{product.category.name}</span>
                      <span className="text-xs sm:text-sm font-medium" style={{ color: themeColor }}>
                        ₦{product.discount_price || product.main_price}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export default ProductSearch