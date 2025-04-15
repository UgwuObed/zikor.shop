import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

import StorefrontHeader from '../Storeview/header';
import ProductCard from '../Storeview/card';
import ShoppingCart from '../Storeview/cart';
import ProductFilter from '../Storeview/filter';
import ProductSearch from '../Storeview/search';

interface StorefrontData {
  id: number;
  business_name: string;
  slug: string;
  category: string;
  logo: string | null;
  banner: string | null;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  social_links: string[];
  color_theme: string;
  business_hours: { [key: string]: string };
  address: string;
}

interface Product {
  id: number;
  name: string;
  main_price: string;
  discount_price: string;
  quantity: number;
  description: string;
  category_id: number;
  image: string;
  image_urls: string[];
  category: {
    id: number;
    name: string;
  };
}

interface Category {
  id: string | number;
  name: string;
}

interface StorefrontResponse {
  storefront: StorefrontData;
  products: Product[];
}

export default function StorefrontPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [storefrontData, setStorefrontData] = useState<StorefrontResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<{id: number, quantity: number}[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  useEffect(() => {
    if (!slug) return;

    async function fetchStorefront() {
      try {
        setLoading(true);
        const response = await fetch(`/api/storefronts/${slug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load storefront: ${response.statusText}`);
        }
        
        const data = await response.json();
        setStorefrontData(data);
        
        if (data.products.length > 0) {
          const prices = data.products.map((p: { discount_price: any; }) => Number(p.discount_price));
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchStorefront();
  }, [slug]);

  const themeColor = useMemo(() => {
    if (!storefrontData) return '#6366f1';
    return storefrontData.storefront.color_theme || '#6366f1';
  }, [storefrontData]);

  const categories = useMemo(() => {
    if (!storefrontData) return [];
    const uniqueCategories = Array.from(
      new Set(storefrontData.products.map(p => p.category.name))
    ).map((name, index) => ({
      id: index,
      name: name
    }));
    return uniqueCategories;
  }, [storefrontData]);

  const filteredProducts = useMemo(() => {
    if (!storefrontData) return [];
    
    return storefrontData.products.filter(product => {
      if (selectedCategory && product.category.name !== selectedCategory) {
        return false;
      }
      
      const price = Number(product.discount_price);
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }
      
      return true;
    });
  }, [storefrontData, selectedCategory, priceRange]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const addToCart = (productId: number) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, { id: productId, quantity: 1 }]);
    }
  };

  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin mx-auto mb-4" 
               style={{ borderTopColor: themeColor }}></div>
          <h2 className="text-xl font-medium text-gray-600">Loading storefront...</h2>
        </motion.div>
      </div>
    );
  }

  if (error || !storefrontData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the storefront you're looking for."}</p>
          {/* <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return Home
          </button> */}
        </div>
      </div>
    );
  }

  const { storefront, products } = storefrontData;
  
  return (
    <div style={{ '--primary-color': themeColor } as React.CSSProperties}>
      <Head>
        <title>{storefront.business_name} | Shop Online</title>
        <meta name="description" content={storefront.tagline || `Shop online at ${storefront.business_name}`} />
      </Head>

      {/* Header */}
      <StorefrontHeader 
        storefront={storefront} 
        cartCount={cartCount}
        themeColor={themeColor}
        onCartClick={() => setShowCart(true)}
      />

      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
          <ProductFilter
              categories={categories}
              minPrice={priceRange[0]}
              maxPrice={priceRange[1]}
              onFilterChange={(filters) => {
                if (filters.categories.length > 0) {
                  const categoryName = categories.find(c => c.id === filters.categories[0])?.name || null;
                  setSelectedCategory(categoryName);
                } else {
                  setSelectedCategory(null);
                }
                setPriceRange([filters.priceRange.min, filters.priceRange.max]);
              }}
              themeColor={themeColor}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section */}
            {storefront.banner && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 rounded-lg overflow-hidden"
              >
                <img 
                  src={storefront.banner} 
                  alt={storefront.business_name}
                  className="w-full h-auto max-h-96 object-cover"
                />
              </motion.div>
            )}

            {/* Products Grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: themeColor }}>
                  {selectedCategory  }
                  {/* <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredProducts.length} products)
                  </span> */}
                </h2>
                <ProductSearch 
                  products={products}
                  onSelectProduct={(id) => {
                    const index = products.findIndex(p => p.id === id);
                    if (index >= 0) {
                      router.push(`#product-${id}`);
                    }
                  }}
                  themeColor={themeColor}
                />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-500">
                    No products found matching your criteria
                  </h3>
                  <button 
                    onClick={() => {
                      setSelectedCategory(null);
                      setPriceRange([0, 100000]);
                    }}
                    className="mt-4 px-4 py-2 rounded text-sm font-medium"
                    style={{ 
                      backgroundColor: `${themeColor}15`, 
                      color: themeColor 
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isActive={false} 
                onClick={() => {}}
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

      {/* Footer with Business Information */}
      <footer className="bg-gray-100 border-t mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Store Info */}
            <div>
              <h3 className="text-lg font-bold mb-4">{storefront.business_name}</h3>
              <p className="text-gray-600">{storefront.description}</p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <div className="space-y-3">
                {storefront.phone && (
                  <div className="flex items-center">
                    <Phone size={16} className="mr-3 text-gray-500" />
                    <span className="text-gray-600">{storefront.phone}</span>
                  </div>
                )}
                
                {storefront.email && (
                  <div className="flex items-center">
                    <Mail size={16} className="mr-3 text-gray-500" />
                    <span className="text-gray-600">{storefront.email}</span>
                  </div>
                )}
                
                {storefront.address && (
                  <div className="flex items-start">
                    <MapPin size={16} className="mr-3 mt-0.5 text-gray-500" />
                    <span className="text-gray-600">{storefront.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-lg font-bold mb-4">Business Hours</h3>
              {storefront.business_hours && Object.keys(storefront.business_hours).length > 0 ? (
                <ul className="space-y-2">
                  {Object.entries(storefront.business_hours).map(([day, hours]) => (
                    <li key={day} className="flex justify-between">
                      <span className="capitalize text-gray-600">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Not specified</p>
              )}
            </div>
          </div>

          {/* Social Links */}
          {storefront.social_links && storefront.social_links.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {storefront.social_links.includes('instagram') && (
                  <a href="#" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <Instagram size={20} style={{ color: themeColor }} />
                  </a>
                )}
                {storefront.social_links.includes('facebook') && (
                  <a href="#" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <Facebook size={20} style={{ color: themeColor }} />
                  </a>
                )}
                {storefront.social_links.includes('twitter') && (
                  <a href="#" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <Twitter size={20} style={{ color: themeColor }} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Powered by Zikor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}