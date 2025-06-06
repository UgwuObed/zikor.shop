"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { GetServerSideProps } from 'next'
import Head from "next/head"
import useCart from "../../hooks/useCart" 
import { getSubdomain } from "../../../lib/subdomain"
import apiClient from '../../apiClient'
import StorefrontHeader from "../../components/Storeview/header"
import ProductCard from "../../components/Storeview/card"
import ShoppingCart from "../../components/Storeview/cart"
import ProductFilter from "../../components/Storeview/filter"
import ProductSearch from "../../components/Storeview/search"
import ProductDetailModal from "../../components/Storeview/modal"
import StorefrontFooter from "../../components/Storeview/footer"
import CartNotification from "../../components/Storeview/notification"

// Keep all your existing interfaces
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

interface ShippingFee {
  id: number;
  storefront_id: number;
  name: string;
  state: string;
  baseFee: string;
  additionalFee: string;
  created_at?: string;
  updated_at?: string;
}

interface StorePageProps {
  slug: string;
}

const StorefrontPage: React.FC<StorePageProps> = ({ slug }) => {
  const router = useRouter()
  const [storefrontData, setStorefrontData] = useState<StorefrontResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [shippingFees, setShippingFees] = useState<ShippingFee[]>([]);

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

  // Simplified slug handling - we get it from props now
  useEffect(() => {
    console.log('=== STORE PAGE LOADED ===')
    console.log('Slug from props:', slug)
    
    if (!slug) {
      setError('No store slug provided')
      setLoading(false)
      return
    }
  }, [slug])

  // Fetch shipping fees
  useEffect(() => {
    if (!slug) return;
    
    async function fetchShippingFees() {
      try {
        const response = await apiClient.get(`/store/${slug}/shipping-fees`);
        
        if (response.data && response.data.shipping_fees) {
          setShippingFees(response.data.shipping_fees);
        }
      } catch (err) {
        console.error("Failed to load shipping fees:", err);
      }
    }
    
    fetchShippingFees();
  }, [slug]);

  // Fetch storefront data
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('Store not found');
      return;
    }
    
    async function fetchStorefront() {
      try {
        console.log('Fetching storefront data for slug:', slug);
        setLoading(true);
        const response = await apiClient.get(`/store/${slug}`);
        if (!response.data) {
          throw new Error("Failed to load storefront");
        }
        console.log('Storefront data loaded successfully');
        setStorefrontData(response.data);
      } catch (err) {
        console.error('Error fetching storefront:', err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    fetchStorefront();
  }, [slug]);

  const themeColor = storefrontData?.storefront.color_theme || "#6366f1"

  const categories = storefrontData?.products
    ? Array.from(
        new Set(storefrontData.products.map((p) => p.category.name))
      ).map((name, index) => ({
        id: index,
        name: name,
      }))
    : []

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

  const handleCheckout = async (buyerInfo: BuyerInfo) => {
    try {
      await checkout(buyerInfo)
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
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    )
  }

  if (error || !storefrontData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Store Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the store you're looking for."}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Homepage
          </button>
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        shippingFees={shippingFees}
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

// Server-side props to get the slug and validate it
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!
  const { req } = context
  
  console.log('=== STORE PAGE SERVER SIDE PROPS ===')
  console.log('URL slug from params:', slug)
  console.log('Host header:', req.headers.host)
  
  // Validate that we have a slug
  if (!slug || typeof slug !== 'string') {
    console.log('Invalid slug, returning 404')
    return {
      notFound: true,
    }
  }
  
  // Optional: validate subdomain matches slug for extra security
  const subdomainFromHeaders = getSubdomain(req)
  console.log('Subdomain from headers:', subdomainFromHeaders)
  console.log('Slug from URL:', slug)
  
  // You can add validation here if needed
  // if (subdomainFromHeaders && subdomainFromHeaders !== slug) {
  //   console.log('Subdomain mismatch, redirecting')
  //   return {
  //     redirect: {
  //       destination: `/store/${subdomainFromHeaders}`,
  //       permanent: false,
  //     }
  //   }
  // }
  
  return {
    props: {
      slug: slug,
    },
  }
}

export default StorefrontPage