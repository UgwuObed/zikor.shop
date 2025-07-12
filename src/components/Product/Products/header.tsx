import { useState } from 'react';
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
import { useRouter } from 'next/router';

interface ProductsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: any;
  setFilters: (filters: any) => void;
  categories: any[];
  isRefreshing: boolean;
  refreshProducts: () => void;
  handleAddProduct: () => void;
  handleExport: () => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  quickActions: boolean;
  setQuickActions: (show: boolean) => void;
  quickActionItems: any[];
  selectedProducts: string[];
  clearSelection: () => void;
  selectAllProducts: () => void;
  bulkActionsOpen: boolean;
  setBulkActionsOpen: (open: boolean) => void;
  filteredProducts: any[];
  products: any[];
}

const ProductsHeader = ({ 
  searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, 
  viewMode, setViewMode, sortBy, setSortBy, showFilters, setShowFilters,
  filters, setFilters, categories, isRefreshing, refreshProducts,
  handleAddProduct, handleExport, clearAllFilters, hasActiveFilters,
  quickActions, setQuickActions, quickActionItems, selectedProducts,
  clearSelection, selectAllProducts, bulkActionsOpen, setBulkActionsOpen,
  filteredProducts, products
}: ProductsHeaderProps) => {
  const router = useRouter();

  const handleBackNavigation = () => router.back();

  return (
    <>
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
              className="p-2 lg:p-2.5 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 ml-auto"
            >
              <MoreHorizontal className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
            </button>

            <AnimatePresence>
              {quickActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
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
        className="flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-auto lg:w-max justify-center lg:justify-start ml-auto"
      >
        <Plus className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
        <span className="font-medium text-xs lg:text-base">Add Product</span>
      </motion.button>
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
                        onChange={(e) => setFilters((prev: any) => ({ ...prev, priceMin: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={(e) => setFilters((prev: any) => ({ ...prev, priceMax: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                    <select 
                      value={filters.stockStatus}
                      onChange={(e) => setFilters((prev: any) => ({ ...prev, stockStatus: e.target.value }))}
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
                      onChange={(e) => setFilters((prev: any) => ({ ...prev, dateAdded: e.target.value }))}
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
    </>
  );
};

export default ProductsHeader;