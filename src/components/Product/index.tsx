import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Filter, Download, 
  AlertCircle, Package, TrendingUp, TrendingDown,
  BarChart3, Settings, ShoppingBag, Activity, Target
} from 'lucide-react';
import { useRouter } from 'next/router';

import DashboardLayout from '../../components/Dashboard/index';
import ProductTable from '../../components/Product/table';
import ProductsHeader from './Products/header';
import ProductsGrid from './Products/grid';
import ProductModals from './Products/modal';
import apiClient from '../../apiClient';
import type { Product } from './types';

interface Category {
  id: string;
  name: string;
  productCount?: number;
}

interface ProductMetrics {
  total: number;
  outOfStock: number;
  lowInventory: number;
  totalValue: number;
  averagePrice: number;
  recentlyAdded: number;
  topPerforming: number;
}

interface FilterState {
  priceMin: string;
  priceMax: string;
  stockStatus: string;
  dateAdded: string;
}

const ProductsPage = () => {
  const router = useRouter();
  

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [quickActions, setQuickActions] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    priceMin: '',
    priceMax: '',
    stockStatus: '',
    dateAdded: ''
  });

  const [metrics, setMetrics] = useState<ProductMetrics>({
    total: 0,
    outOfStock: 0,
    lowInventory: 0,
    totalValue: 0,
    averagePrice: 0,
    recentlyAdded: 0,
    topPerforming: 0
  });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

 
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/products', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (data?.products) {
        setProducts(data.products);
        calculateMetrics(data.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProducts = async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  };

  const calculateMetrics = (productList: Product[]) => {
    const total = productList.length;
    const outOfStock = productList.filter(p => p.quantity === 0).length;
    const lowInventory = productList.filter(p => p.quantity > 0 && p.quantity < 5).length;
    const totalValue = productList.reduce((sum, p) => sum + (p.main_price * p.quantity), 0);
    const averagePrice = total > 0 ? totalValue / productList.reduce((sum, p) => sum + p.quantity, 0) : 0;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentlyAdded = productList.filter(p => 
      p.created_at && new Date(p.created_at) > weekAgo
    ).length;

    const topPerforming = productList.filter(p => 
      p.discount_price || p.main_price > averagePrice
    ).length;

    setMetrics({
      total,
      outOfStock,
      lowInventory,
      totalValue,
      averagePrice,
      recentlyAdded,
      topPerforming
    });
  };

  const fetchCategories = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const { data } = await apiClient.get('/categories', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (data?.categories) {
        const categoriesWithCounts = data.categories.map((cat: Category) => ({
          ...cat,
          productCount: products.filter(p => p.category_id?.toString() === cat.id).length
        }));
        
        setCategories([
          { id: 'all', name: 'All Categories', productCount: products.length }, 
          ...categoriesWithCounts
        ]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };


  const handleAddProduct = () => router.push('/product/add');

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Category', 'Price', 'Discount Price', 'Quantity', 'Total Value', 'Created At'].join(','),
      ...filteredProducts.map(product => [
        `"${product.name}"`,
        `"${product.category?.name || 'Uncategorized'}"`,
        product.main_price,
        product.discount_price || '',
        product.quantity,
        product.main_price * product.quantity,
        new Date(product.created_at || '').toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' };
    if (quantity < 5) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' };
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setFilters({
      priceMin: '',
      priceMax: '',
      stockStatus: '',
      dateAdded: ''
    });
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || 
    Object.values(filters).some(f => f !== '');

  const quickActionItems = [
    { label: 'Add Product', icon: Plus, action: () => router.push('/product/add'), color: 'bg-purple-600' },
    { label: 'Import Products', icon: Download, action: () => {}, color: 'bg-blue-600' },
    { label: 'Manage Categories', icon: Settings, action: () => router.push('/categories'), color: 'bg-green-600' },
    { label: 'Analytics', icon: BarChart3, action: () => router.push('/analytics'), color: 'bg-orange-600' },
  ];


  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(filteredProducts.map(p => p.id.toString()));
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const openProductView = (product: Product) => {
    setViewProduct(product);
    setIsViewModalOpen(true);
  };

  const openProductEdit = (product: Product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };


  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category_id?.toString() === selectedCategory;
      
      const price = product.discount_price || product.main_price;
      const matchesPriceMin = !filters.priceMin || price >= parseFloat(filters.priceMin);
      const matchesPriceMax = !filters.priceMax || price <= parseFloat(filters.priceMax);
      
      let matchesStockStatus = true;
      if (filters.stockStatus === 'in-stock') matchesStockStatus = product.quantity > 5;
      else if (filters.stockStatus === 'low-stock') matchesStockStatus = product.quantity > 0 && product.quantity <= 5;
      else if (filters.stockStatus === 'out-of-stock') matchesStockStatus = product.quantity === 0;

      let matchesDateAdded = true;
      if (filters.dateAdded && product.created_at) {
        const productDate = new Date(product.created_at);
        const now = new Date();
        switch (filters.dateAdded) {
          case 'today':
            matchesDateAdded = productDate.toDateString() === now.toDateString();
            break;
          case 'week':
            matchesDateAdded = productDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            matchesDateAdded = productDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'quarter':
            matchesDateAdded = productDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesPriceMin && matchesPriceMax && matchesStockStatus && matchesDateAdded;
    });

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
        break;
      case 'price-high':
        filtered.sort((a, b) => b.main_price - a.main_price);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.main_price - b.main_price);
        break;
      case 'stock-high':
        filtered.sort((a, b) => b.quantity - a.quantity);
        break;
      case 'stock-low':
        filtered.sort((a, b) => a.quantity - b.quantity);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 max-w-7xl">
        <div className="space-y-6 lg:space-y-8">
          
          {/* Header Component */}
          <ProductsHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            isRefreshing={isRefreshing}
            refreshProducts={refreshProducts}
            handleAddProduct={handleAddProduct}
            handleExport={handleExport}
            clearAllFilters={clearAllFilters}
            hasActiveFilters={!!hasActiveFilters}
            quickActions={quickActions}
            setQuickActions={setQuickActions}
            quickActionItems={quickActionItems}
            selectedProducts={selectedProducts}
            clearSelection={clearSelection}
            selectAllProducts={selectAllProducts}
            bulkActionsOpen={bulkActionsOpen}
            setBulkActionsOpen={setBulkActionsOpen}
            filteredProducts={filteredProducts}
            products={products}
          />

          {/* Enhanced Metrics Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{metrics.total.toLocaleString()}</p>
                  <div className="flex items-center mt-1 lg:mt-2">
                    <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-500 mr-1" />
                    <span className="text-xs lg:text-sm text-green-600 font-medium">+{metrics.recentlyAdded} this week</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-purple-100 rounded-lg lg:rounded-xl">
                  <Package className="h-5 w-5 lg:h-8 lg:w-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Inventory Value</p>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{formatPrice(metrics.totalValue)}</p>
                  <div className="flex items-center mt-1 lg:mt-2">
                    <span className="text-xs lg:text-sm text-blue-600 font-medium">Avg: {formatPrice(metrics.averagePrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Low Stock Alert</p>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{metrics.lowInventory}</p>
                  <div className="flex items-center mt-1 lg:mt-2">
                    <AlertCircle className="h-3 w-3 lg:h-4 lg:w-4 text-orange-500 mr-1" />
                    <span className="text-xs lg:text-sm text-orange-600 font-medium">Needs attention</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-orange-100 rounded-lg lg:rounded-xl">
                  <AlertCircle className="h-5 w-5 lg:h-8 lg:w-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{metrics.outOfStock}</p>
                  <div className="flex items-center mt-1 lg:mt-2">
                    {metrics.outOfStock > 0 ? (
                      <>
                        <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-red-500 mr-1" />
                        <span className="text-xs lg:text-sm text-red-600 font-medium">Restock needed</span>
                      </>
                    ) : (
                      <>
                        <Target className="h-3 w-3 lg:h-4 lg:w-4 text-green-500 mr-1" />
                        <span className="text-xs lg:text-sm text-green-600 font-medium">All in stock</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-red-100 rounded-lg lg:rounded-xl">
                  <Activity className="h-5 w-5 lg:h-8 lg:w-8 text-red-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-16 lg:py-20"
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-purple-200 rounded-full"></div>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-purple-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium text-sm lg:text-base">Loading your products...</p>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-xl lg:rounded-2xl p-4 lg:p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 lg:h-6 lg:w-6 text-red-500" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-red-800 font-medium text-sm lg:text-base">Error loading products</h3>
                  <p className="text-red-700 mt-1 text-sm">{error}</p>
                  <button 
                    onClick={fetchProducts}
                    className="mt-3 text-sm text-red-700 underline hover:text-red-800 font-medium"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !error && products.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12 text-center"
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-10 w-10 lg:h-12 lg:w-12 text-purple-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Start Building Your Inventory</h3>
                <p className="text-gray-600 mb-6 lg:mb-8 leading-relaxed text-sm lg:text-base">
                  Add your first product to get started with inventory management. Track stock levels, 
                  manage pricing, and grow your business with powerful analytics.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleAddProduct}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Your First Product
                  </button>
                  <button
                    onClick={() => {}}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Import Products
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* No Results State */}
          {!isLoading && !error && products.length > 0 && filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12 text-center"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 lg:h-10 lg:w-10 text-gray-400" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6 text-sm lg:text-base">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}

          {/* Product Table/Grid */}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {viewMode === 'table' ? (
                <ProductTable products={filteredProducts} onRefresh={fetchProducts} />
              ) : (
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                  <ProductsGrid 
                    filteredProducts={filteredProducts}
                    selectedProducts={selectedProducts}
                    toggleProductSelection={toggleProductSelection}
                    formatPrice={formatPrice}
                    getStockStatus={getStockStatus}
                    openProductView={openProductView}
                    openProductEdit={openProductEdit}
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Product Modals */}
        <ProductModals
          isViewModalOpen={isViewModalOpen}
          setIsViewModalOpen={setIsViewModalOpen}
          viewProduct={viewProduct}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          editProduct={editProduct}
          openProductEdit={openProductEdit}
          formatPrice={formatPrice}
          getStockStatus={getStockStatus}
        />
      </div>
    </div>
  );
};

ProductsPage.Layout = DashboardLayout;
export default ProductsPage;