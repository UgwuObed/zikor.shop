"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import useCart from "../../hooks/useCart" 
import { getSubdomain } from "../../../utils/subdomain"
import apiClient from '../../apiClient'
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

interface StorefrontResponse {
  storefront: StorefrontData
  products: Product[]
}

const StorefrontPage = () => {
  const router = useRouter()
  const { slug: routerSlug } = router.query

  // Storefront data state
  const [storefrontData, setStorefrontData] = useState<StorefrontResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [effectiveSlug, setEffectiveSlug] = useState<string | null>(null)
  
  // Product display state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  
  // Use the updated cart hook to manage cart state and operations
  const {
    cartItems,
    cartCount,
    loading: cartLoading,
    error: cartError,
    buyerInfo,
    buyerInfoSaved,
    showCart,
    showNotification,
    notificationProduct,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    saveBuyerInfo,
    checkout,
    setShowCart,
    setShowNotification
  } = useCart();

  // Determine the storefront slug from router or subdomain
  useEffect(() => {
    console.log('Store page loaded with slug:', routerSlug)
    if (routerSlug && typeof routerSlug === 'string') {
      setEffectiveSlug(routerSlug)
      return
    }
    
    if (typeof window !== 'undefined') {
      const subdomainSlug = getSubdomain(window.location.hostname)
      if (subdomainSlug && subdomainSlug !== 'www') {
        setEffectiveSlug(subdomainSlug)
      }
    }
  }, [routerSlug])

  // Fetch storefront data
  useEffect(() => {
    if (!effectiveSlug) return
    
    async function fetchStorefront() {
      try {
        setLoading(true)
        const response = await apiClient.get(`/store/${effectiveSlug}`)

        if (!response.data) {
          throw new Error('Failed to load storefront')
        }

        setStorefrontData(response.data)

        if (response.data.products.length > 0) {
          const prices = response.data.products.map((p: { discount_price: any }) => Number(p.discount_price))
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

  // Get theme color from storefront data
  const themeColor = storefrontData?.storefront.color_theme || "#6366f1"

  // Extract unique categories from products
  const categories = storefrontData?.products
    ? Array.from(
        new Set(storefrontData.products.map((p) => p.category.name))
      ).map((name, index) => ({
        id: index,
        name: name,
      }))
    : []

  // Filter products based on selected category and price range
  const filteredProducts = storefrontData?.products
    ? storefrontData.products.filter((product) => {
        if (selectedCategory && product.category.name !== selectedCategory) {
          return false
        }

        const price = Number(product.discount_price)
        if (price < priceRange[0] || price > priceRange[1]) {
          return false
        }

        return true
      })
    : []

  // Handle product click to show details modal
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  const handleAddToCart = (productId: number, quantity = 1) => {
    const product = storefrontData?.products.find(p => p.id === productId)
    if (product) {
      addToCart(productId, quantity, product)
    }
  }
  

  interface BuyerInfo {
    name: string
    email: string
    phone: string
    address?: string 
  }

  const handleSaveBuyerInfo = async (info: BuyerInfo) => {
    try {
      await saveBuyerInfo(info)
    } catch (error) {
      console.error('Failed to save buyer info:', error)
    }
  }

  // Handle checkout completion
  const handleCheckout = async (buyerInfo: BuyerInfo) => {
    try {
      await checkout(buyerInfo)
      
      // After successful checkout, redirect to a success page
      router.push('/checkout/success')
    } catch (error) {
      console.error('Checkout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-dashed rounded-full animate-spin mx-auto mb-4"
            style={{ borderTopColor: themeColor }}
          ></div>
          <p className="text-gray-500">Loading storefront...</p>
        </div>
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

      <StorefrontHeader
        storefront={storefront}
        cartCount={cartCount}
        themeColor={themeColor}
        onCartClick={() => setShowCart(true)}
      />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 min-h-screen">
        {/* Mobile filters toggle */}
        <div className="lg:hidden mb-4 flex justify-between items-center">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center text-sm font-medium px-3 py-2 rounded-lg"
            style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
          >
            {mobileFilterOpen ? "Close Filters" : "Show Filters"}
          </button>

          <div className="text-sm text-gray-500">{filteredProducts.length} products</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Filters sidebar */}
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

          {/* Main content */}
          <div className="flex-1">
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

            {/* Products grid */}
            <div className="mb-8 sm:mb-12">
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
                      onAddToCart={handleAddToCart}
                      isActive={false}
                      onClick={() => handleProductClick(product)}
                      themeColor={themeColor}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Shopping Cart Drawer */}
      <ShoppingCart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        products={products}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        onSaveBuyerInfo={handleSaveBuyerInfo}
        themeColor={themeColor}
        initialBuyerInfo={buyerInfo}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
        themeColor={themeColor}
      />

      {/* Cart Notification */}
      {notificationProduct && (
        <CartNotification
          product={notificationProduct}
          isVisible={showNotification}
          themeColor={themeColor}
          onViewCart={() => setShowCart(true)}
        />
      )}

      <StorefrontFooter storefront={storefront} themeColor={themeColor} />
    </div>
  )
}

export default StorefrontPage