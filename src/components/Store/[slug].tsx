"use client"

import type React from "react"
import { useRouter } from "next/router"
import { useState, useEffect, useMemo } from "react"
import Head from "next/head"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { getSubdomain } from "../../../utils/subdomain"

import StorefrontHeader from "../Storeview/header"
import ProductCard from "../Storeview/card"
import ShoppingCart from "../Storeview/cart"
import ProductFilter from "../Storeview/filter"
import ProductSearch from "../Storeview/search"
import ProductDetailModal from "../Storeview/modal"
import StorefrontFooter from "../Storeview/footer"
import CartNotification from "../Storeview/notification"




interface StorefrontData {
  id: number
  business_name: string
  slug: string
  category: string
  logo: string | null
  banner: string | null
  tagline: string
  description: string
  email: string
  phone: string
  social_links: string[]
  color_theme: string
  business_hours: { [key: string]: string }
  address: string
}

interface Product {
  id: number
  name: string
  main_price: string
  discount_price: string
  quantity: number
  description: string
  category_id: number
  image: string
  image_urls: string[]
  category: {
    id: number
    name: string
  }
}

interface Category {
  id: string | number
  name: string
}

interface StorefrontResponse {
  storefront: StorefrontData
  products: Product[]
}

const  StorefrontPage = () => {
  const router = useRouter()
  const { slug: routerSlug } = router.query

  const [storefrontData, setStorefrontData] = useState<StorefrontResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<{ id: number; quantity: number }[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState<Product | null>(null);
  const [effectiveSlug, setEffectiveSlug] = useState<string | null>(null)


  useEffect(() => {

    console.log('Store page loaded with slug:', routerSlug)
    // If we have a slug from the router, use it
    if (routerSlug && typeof routerSlug === 'string') {
      setEffectiveSlug(routerSlug)
      return
    }
    
    // Otherwise check for a subdomain
    if (typeof window !== 'undefined') {
      const subdomainSlug = getSubdomain(window.location.hostname)
      if (subdomainSlug && subdomainSlug !== 'www') {
        setEffectiveSlug(subdomainSlug)
      }
    }
  }, [routerSlug])

useEffect(() => {
    if (!effectiveSlug) return
    
    async function fetchStorefront() {
      try {
        setLoading(true)
        const response = await fetch(`/api/storefronts/${effectiveSlug}`)

        if (!response.ok) {
          throw new Error(`Failed to load storefront: ${response.statusText}`)
        }

        const data = await response.json()
        setStorefrontData(data)

        if (data.products.length > 0) {
          const prices = data.products.map((p: { discount_price: any }) => Number(p.discount_price))
          setPriceRange([Math.min(...prices), Math.max(...prices)])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchStorefront()
  }, [effectiveSlug])

  const themeColor = useMemo(() => {
    if (!storefrontData) return "#6366f1"
    return storefrontData.storefront.color_theme || "#6366f1"
  }, [storefrontData])

  const categories = useMemo(() => {
    if (!storefrontData) return []
    const uniqueCategories = Array.from(new Set(storefrontData.products.map((p) => p.category.name))).map(
      (name, index) => ({
        id: index,
        name: name,
      }),
    )
    return uniqueCategories
  }, [storefrontData])

  const filteredProducts = useMemo(() => {
    if (!storefrontData) return []

    return storefrontData.products.filter((product) => {
      if (selectedCategory && product.category.name !== selectedCategory) {
        return false
      }

      const price = Number(product.discount_price)
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      return true
    })
  }, [storefrontData, selectedCategory, priceRange])

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  const addToCart = (productId: number, quantity = 1) => {
    if (!storefrontData) return;
    
    const product = storefrontData.products.find(p => p.id === productId);
    const existingItemIndex = cartItems.findIndex((item) => item.id === productId);
  
    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, { id: productId, quantity }]);
    }
  
    if (product) {
      setNotificationProduct(product);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
    
    setShowCart(false); 
  }

  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(cartItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== productId))
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div
            className="w-16 h-16 border-4 border-dashed rounded-full animate-spin mx-auto mb-4"
            style={{ borderTopColor: themeColor }}
          ></div>
          {/* <h2 className="text-xl font-medium text-gray-600">Loading storefront...</h2> */}
        </motion.div>
      </div>
    )
  }

  if (error || !storefrontData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the storefront you're looking for."}</p>
        </div>
      </div>
    )
  }

  const { storefront, products } = storefrontData

  return (
    <div style={{ "--primary-color": themeColor } as React.CSSProperties}>
      <Head>
        <title>{storefront.business_name} | Shop Online</title>
        <meta name="description" content={storefront.tagline || `Shop online at ${storefront.business_name}`} />
      </Head>

      {/* Header with fixed cart */}
      <StorefrontHeader
        storefront={storefront}
        cartCount={cartCount}
        themeColor={themeColor}
        onCartClick={() => setShowCart(true)}
      />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 min-h-screen">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 flex justify-between items-center">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center text-sm font-medium px-3 py-2 rounded-lg"
            style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
          >
            {mobileFilterOpen ? <X size={18} className="mr-1" /> : <Menu size={18} className="mr-1" />}
            {mobileFilterOpen ? "Close Filters" : "Show Filters"}
          </button>

          <div className="text-sm text-gray-500">{filteredProducts.length} products</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar Filters - hidden on mobile unless toggled */}
          <div className={`${mobileFilterOpen ? "block" : "hidden"} lg:block lg:w-64 flex-shrink-0`}>
            <ProductFilter
              categories={categories}
              minPrice={priceRange[0]}
              maxPrice={priceRange[1]}
              onFilterChange={(filters) => {
                if (filters.categories.length > 0) {
                  const categoryName = categories.find((c) => c.id === filters.categories[0])?.name || null
                  setSelectedCategory(categoryName)
                } else {
                  setSelectedCategory(null)
                }
                setPriceRange([filters.priceRange.min, filters.priceRange.max])
              }}
              themeColor={themeColor}
              mobileView={true}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <ProductSearch
              products={products}
              onSelectProduct={(id) => {
                const product = products.find((p) => p.id === id)
                if (product) {
                  handleProductClick(product)
                }
              }}
              themeColor={themeColor}
            />

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 sm:mb-12"
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: themeColor }}>
                  {selectedCategory || "All Products"}
                </h2>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 text-center">
                  <h3 className="text-lg sm:text-xl font-medium text-gray-500">
                    No products found matching your criteria
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setPriceRange([0, 100000])
                    }}
                    className="mt-4 px-4 py-2 rounded text-sm font-medium"
                    style={{
                      backgroundColor: `${themeColor}15`,
                      color: themeColor,
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      isActive={false}
                      onClick={() => handleProductClick(product)}
                      themeColor={themeColor}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Shopping Cart Sidebar */}
      <ShoppingCart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        products={products}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeFromCart}
        themeColor={themeColor}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={selectedProduct}
        onAddToCart={addToCart}
        themeColor={themeColor}
      />

      {/* Notification for adding to cart */}
      {notificationProduct && (
        <CartNotification
          product={notificationProduct}
          isVisible={showNotification}
          themeColor={themeColor}
          onViewCart={() => setShowCart(true)}
        />
      )}

      {/* Footer */}
      <StorefrontFooter storefront={storefront} themeColor={themeColor} />
    </div>
  )
}

export default StorefrontPage