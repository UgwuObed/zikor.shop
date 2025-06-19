import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Filter, Download, 
  AlertCircle, ArrowLeft, Eye, Package,
  TrendingUp, TrendingDown, DollarSign,
  BarChart3, Grid3X3, List, RefreshCw,
  Settings, MoreHorizontal, Star,
  ShoppingBag, Zap, Target, Activity,
  Edit2, Trash2, ExternalLink, Heart,
  SlidersHorizontal, Calendar, Tag,
  ArrowUpDown, X, Check, ChevronDown
} from 'lucide-react';
import DashboardLayout from '../../components/Dashboard/index';
// import DashboardCard from '../../components/Dashboard/dashboardCard';
import ProductTable from '../../components/Product/table';
import EditProductForm from "../Product/edit"
import apiClient from '../../apiClient';
import { useRouter } from 'next/router';
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
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
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

  const handleBackNavigation = () => router.back();

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
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

  
  const ProductGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product, index) => {
        const stockStatus = getStockStatus(product.quantity);
        const isSelected = selectedProducts.includes(product.id.toString());
        
        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
              isSelected ? 'border-purple-300 bg-purple-50' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => toggleProductSelection(product.id.toString())}
          >
            <div className="p-5">
              {/* Product Image */}
              <div className="relative mb-4">
                <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                  <img
                    src={product.image_urls?.[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-contain p-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                {/* Selection indicator */}
                <div className={`absolute top-3 left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'bg-white border-gray-300 hover:border-purple-400'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>

                {/* Discount badge */}
                {product.discount_price && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    -{Math.round(((product.main_price - product.discount_price) / product.main_price) * 100)}%
                  </div>
                )}

                {/* Stock status */}
                <div className="absolute bottom-3 left-3">
                  <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${stockStatus.color}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${stockStatus.dot}`}></div>
                    {stockStatus.label}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  {product.category?.name && (
                    <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      {product.category.name}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.discount_price || product.main_price)}
                    </span>
                    {product.discount_price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.main_price)}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Stock</div>
                    <div className="font-semibold text-gray-900">{product.quantity}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openProductView(product);
                    }}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openProductEdit(product);
                    }}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4 mr-1.5" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const openProductView = (product: Product) => {
    setViewProduct(product);
    setIsViewModalOpen(true);
  };

  const openProductEdit = (product: Product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (updatedProduct: Product) => {
    setIsEditModalOpen(false);
    setEditProduct(null);
  
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 max-w-7xl">
        <div className="space-y-6 lg:space-y-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6"
          >
            <div className="flex items-center space-x-3 lg:space-x-4">
              <button 
                onClick={handleBackNavigation}
                className="p-2 lg:p-2.5 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-200"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
              </button>
              
              <div>
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Product Inventory
                </h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage your products, track inventory, and analyze performance</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-3 w-full lg:w-auto">
              <button
                onClick={refreshProducts}
                disabled={isRefreshing}
                className="p-2 lg:p-2.5 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 lg:h-5 lg:w-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setQuickActions(!quickActions)}
                  className="p-2 lg:p-2.5 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <MoreHorizontal className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
                </button>

                <AnimatePresence>
                  {quickActions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                    >
                      {quickActionItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            item.action();
                            setQuickActions(false);
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className={`p-1.5 rounded-lg ${item.color} mr-3`}>
                            <item.icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddProduct}
                className="flex items-center px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex-1 lg:flex-none justify-center lg:justify-start"
              >
                <Plus className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                <span className="font-medium text-sm lg:text-base">Add Product</span>
              </motion.button>
            </div>
          </motion.div>

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
                    <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 text-blue-500 mr-1" />
                    <span className="text-xs lg:text-sm text-blue-600 font-medium">Avg: {formatPrice(metrics.averagePrice)}</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-blue-100 rounded-lg lg:rounded-xl">
                  <DollarSign className="h-5 w-5 lg:h-8 lg:w-8 text-blue-600" />
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

          {/* Enhanced Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6"
          >
            <div className="space-y-4">
              {/* Primary Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 lg:h-5 lg:w-5" />
                  <input
                    type="text"
                    placeholder="Search products by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm lg:text-base"
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg lg:rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 lg:p-2.5 rounded-lg transition-all ${
                      viewMode === 'table' 
                        ? 'bg-white shadow-sm text-purple-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 lg:p-2.5 rounded-lg transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-purple-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                </div>
              </div>

              {/* Secondary Controls Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:min-w-[200px] px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm lg:text-base appearance-none bg-white"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} {category.productCount !== undefined && `(${category.productCount})`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:min-w-[160px] px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm lg:text-base appearance-none bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name A-Z</option>
                    <option value="price-high">Price High-Low</option>
                    <option value="price-low">Price Low-High</option>
                    <option value="stock-high">Stock High-Low</option>
                    <option value="stock-low">Stock Low-High</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2.5 lg:p-3 rounded-lg lg:rounded-xl border transition-all ${
                      showFilters 
                        ? 'border-purple-300 bg-purple-50 text-purple-600' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <SlidersHorizontal className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                  
                  <button 
                    onClick={handleExport}
                    className="p-2.5 lg:p-3 rounded-lg lg:rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                    title="Export to CSV"
                  >
                    <Download className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.priceMin}
                            onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.priceMax}
                            onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                        <select 
                          value={filters.stockStatus}
                          onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="">All Stock Levels</option>
                          <option value="in-stock">In Stock</option>
                          <option value="low-stock">Low Stock</option>
                          <option value="out-of-stock">Out of Stock</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Added</label>
                        <select 
                          value={filters.dateAdded}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateAdded: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="">All Time</option>
                          <option value="today">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                          <option value="quarter">This Quarter</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={clearAllFilters}
                        className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear All Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-purple-900">
                    {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-purple-600 hover:text-purple-800 underline"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={selectAllProducts}
                    className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-800 border border-purple-300 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setBulkActionsOpen(!bulkActionsOpen)}
                    className="px-4 py-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Bulk Actions
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Summary */}
          {!isLoading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-600 px-1 gap-2"
            >
              <span>
                Showing {filteredProducts.length} of {products.length} products
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              </span>
              
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}

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
                  <X className="w-4 h-4 mr-1" />
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
                  <ProductGrid />
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Product View Modal */}
        <AnimatePresence>
          {isViewModalOpen && viewProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
              onClick={() => setIsViewModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
                  <button 
                    onClick={() => setIsViewModalOpen(false)} 
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row p-6 overflow-y-auto">
                  {/* Product Image */}
                  <div className="lg:w-1/2 mb-6 lg:mb-0 lg:pr-6">
                    <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                      <img
                        src={viewProduct.image_urls?.[0] || '/placeholder.svg'}
                        alt={viewProduct.name}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="lg:w-1/2 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewProduct.name}</h2>
                      
                      <div className="flex items-center space-x-3">
                        {viewProduct.discount_price ? (
                          <>
                            <span className="text-2xl font-bold text-purple-600">
                              {formatPrice(viewProduct.discount_price)}
                            </span>
                            <span className="text-lg line-through text-gray-500">{formatPrice(viewProduct.main_price)}</span>
                            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                              -{Math.round(((viewProduct.main_price - viewProduct.discount_price) / viewProduct.main_price) * 100)}% OFF
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-purple-600">{formatPrice(viewProduct.main_price)}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 font-semibold">Category</p>
                        {viewProduct.category?.name ? (
                          <span className="inline-block px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-sm font-medium">
                            {viewProduct.category.name}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">Uncategorized</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 font-semibold">Stock Status</p>
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-lg ${getStockStatus(viewProduct.quantity).color}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${getStockStatus(viewProduct.quantity).dot}`}></div>
                          <span className="ml-1">{getStockStatus(viewProduct.quantity).label}</span>
                        </div>
                      </div>
                    </div>

                    {viewProduct.description && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 font-semibold">Description</p>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{viewProduct.description}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Product ID</p>
                        <p className="text-sm font-mono text-gray-900">{viewProduct.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Stock Quantity</p>
                        <p className="text-sm font-semibold text-gray-900">{viewProduct.quantity} units</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openProductEdit(viewProduct);
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <Edit2 className="mr-2 w-4 h-4" /> Edit Product
                  </button>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Edit Modal */}
        <AnimatePresence>
          {isEditModalOpen && editProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
                  <button 
                    onClick={() => setIsEditModalOpen(false)} 
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto">
                 
                 
                    {/* <div className="mt-4 text-xs bg-gray-100 p-3 rounded-lg text-left font-mono"> */}
                      <EditProductForm
                  product={editProduct}
                  onClose={() => setIsEditModalOpen(false)}
                  onSave={() => {
                    setIsEditModalOpen(false)
                  }}
                />
                    </div>
                {/* </div> */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

ProductsPage.Layout = DashboardLayout;
export default ProductsPage;