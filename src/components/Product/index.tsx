import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiPlus, FiFilter, FiEdit2, 
  FiTrash2, FiEye, FiDownload, FiAlertCircle 
} from 'react-icons/fi';
import DashboardLayout from '../../components/Dashboard/index';
import DashboardCard from '../../components/Dashboard/dashboardCard';
import ProductTable from '../../components/Product/table';
import apiClient from '../../apiClient';
import { useRouter } from 'next/router';

const ProductsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [products, setProducts] = useState<{ id: string; name: string; category_id: string; quantity: number; main_price: number }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Metrics derived from actual products
  const [metrics, setMetrics] = useState({
    total: 0,
    outOfStock: 0,
    lowInventory: 0
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
      const response = await apiClient.get('/products', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (response.data && response.data.products) {
        setProducts(response.data.products);
        
        // Calculate metrics
        const total = response.data.products.length;
        const outOfStock = response.data.products.filter((p: { quantity: number; }) => p.quantity === 0).length;
        const lowInventory = response.data.products.filter((p: { quantity: number; }) => p.quantity > 0 && p.quantity < 5).length;
        
        setMetrics({
          total,
          outOfStock,
          lowInventory
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    
    try {
      const response = await apiClient.get('/categories', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (response.data && response.data.categories) {
        // Add "All Categories" option
        const allCategories = [
          { id: 'all', name: 'All Categories' },
          ...response.data.categories
        ];
        setCategories(allCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleAddProduct = () => {
    router.push('/product/add');
  };
  
  const handleExport = () => {
    // Implementation for exporting product data
    // Could create a CSV from filteredProducts
    alert('Export functionality will be implemented soon');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page header - Improved for mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-2xl font-bold"
        >
          Products
        </motion.h1>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddProduct}
          className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Product
        </motion.button>
      </div>

      {/* Stats cards*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
          title="Total Products" 
          value={metrics.total.toString()} 
          change="+5.1%" 
          icon={FiEye} 
          color="purple" 
        />
        <DashboardCard 
          title="Out of Stock" 
          value={metrics.outOfStock.toString()} 
          change="-2.3%" 
          icon={FiFilter} 
          color="orange" 
        />
        <DashboardCard 
          title="Low Inventory" 
          value={metrics.lowInventory.toString()} 
          change="+1.8%" 
          icon={FiAlertCircle} 
          color="blue" 
        />
      </div>

      {/* Filters and search  */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-4 md:p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="min-w-[140px] text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-2">
              <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <FiFilter className="mr-2" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              <button 
                onClick={handleExport}
                className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <FiDownload className="mr-2" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchProducts}
            className="mt-2 text-sm text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
            <FiPlus className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first product to your inventory.</p>
          <button
            onClick={handleAddProduct}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Product
          </button>
        </motion.div>
      )}

      {/* Products table with actual data */}
      {!isLoading && !error && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <ProductTable products={filteredProducts} onRefresh={fetchProducts} />
        </motion.div>
      )}
    </div>
  );
};
ProductsPage.Layout = DashboardLayout;

export default ProductsPage;