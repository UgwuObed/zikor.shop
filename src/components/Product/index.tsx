import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiPlus, FiFilter, FiDownload, 
  FiAlertCircle, FiArrowLeft,
  FiEye
} from 'react-icons/fi';
import DashboardLayout from '../../components/Dashboard/index';
import DashboardCard from '../../components/Dashboard/dashboardCard';
import ProductTable from '../../components/Product/table';
import apiClient from '../../apiClient';
import { useRouter } from 'next/router';

interface Product {
  id: string;
  name: string;
  category_id: string;
  quantity: number;
  main_price: number;
}

interface Category {
  id: string;
  name: string;
}

const ProductsPage = () => {
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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
      const { data } = await apiClient.get('/products', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (data?.products) {
        setProducts(data.products);
        setMetrics({
          total: data.products.length,
          outOfStock: data.products.filter((p: Product) => p.quantity === 0).length,
          lowInventory: data.products.filter((p: Product) => p.quantity > 0 && p.quantity < 5).length
        });
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const { data } = await apiClient.get('/categories', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (data?.categories) {
        setCategories([{ id: 'all', name: 'All Categories' }, ...data.categories]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleAddProduct = () => router.push('/product/add');

  const handleExport = () => {
    alert('Export functionality will be implemented soon');
  };

  const handleBackNavigation = () => {
    router.back();
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <button 
              onClick={handleBackNavigation}
              className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Products</h1>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddProduct}
            className="flex items-center justify-center px-4 py-2.5 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Add Product
          </motion.button>
        </div>

        {/* Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
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
            icon={FiAlertCircle} 
            color="orange" 
          />
          <DashboardCard 
            title="Low Inventory" 
            value={metrics.lowInventory.toString()} 
            change="+1.8%" 
            icon={FiFilter} 
            color="blue" 
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-5 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="min-w-[160px] text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <button className="flex items-center px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <FiFilter className="mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
                <button 
                  onClick={handleExport}
                  className="flex items-center px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiDownload className="mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
              {/* <p className="mt-4 text-gray-600">Loading products...</p> */}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="mt-2 text-sm text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && !error && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center my-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
              <FiPlus className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Get started by adding your first product to your inventory.</p>
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Product
            </button>
          </motion.div>
        )}

        {/* Table */}
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
    </div>
  );
};

ProductsPage.Layout = DashboardLayout;
export default ProductsPage;