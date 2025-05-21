import { useState, useEffect, SetStateAction } from 'react';
import { useRouter, usePathname } from "next/navigation";
import apiClient from '../../apiClient';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiShoppingBag, FiDollarSign, FiUsers, 
  FiPieChart, FiSettings, FiBell, FiHelpCircle,
  FiPlus, FiSearch, FiMenu, FiX, FiChevronDown,
  FiTrendingUp, FiCreditCard, FiBox, FiTruck
} from 'react-icons/fi';
import { FaStore } from 'react-icons/fa';
import { RiExchangeDollarLine } from 'react-icons/ri';
import { BsGraphUp, BsCartCheck } from 'react-icons/bs';
import DashboardCard from '../../components/Dashboard/dashboardCard';
import SalesChart from '../../components/Dashboard/salesChart';
import RecentOrders from '../../components/Dashboard/recentOrders';
import ActivityFeed from '../../components/Dashboard/activityFeed';

interface ChangeCalculator {
  (current: number, previous: number): string;
}

interface DateFormatter {
   (date: Date): string;
}

interface CurrencyFormatter {
  (amount: number): string;
}

interface NumberFormatter {
  (number: number): string;
}

const Dashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    newCustomers: 0,
    revenueChange: '0%',
    ordersChange: '0%',
    productsChange: '0%',
    customersChange: '0%',
    loading: true,
    error: null as string | null
  });
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    const fetchDashboardStats = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
  
        const today = new Date();
      
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 30);
        
        const previous30Start = new Date(last30Days);
        previous30Start.setDate(previous30Start.getDate() - 30);
        

        
        const dateFormat: DateFormatter = (date) => date.toISOString().split('T')[0];
        
        const currentPeriod = {
          start_date: dateFormat(last30Days),
          end_date: dateFormat(today)
        };
        
        const previousPeriod = {
          start_date: dateFormat(previous30Start),
          end_date: dateFormat(last30Days)
        };
        
        
        const currentRevenueResponse = await apiClient.get('/stats', { 
          params: currentPeriod,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        const previousRevenueResponse = await apiClient.get('/stats', { 
          params: previousPeriod ,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        const productsResponse = await apiClient.get('/products', {
          params: { 
            per_page: 1,
            status: 'active'
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
 
        const currentStats = currentRevenueResponse.data.stats;
        const previousStats = previousRevenueResponse.data.stats;
        
        const calculateChange: ChangeCalculator = (current, previous) => {
          if (previous === 0) return '+0%';
          const change = ((current - previous) / previous) * 100;
          return (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
        };
        
        const currentRevenue = currentStats.total_revenue || 0;
        const previousRevenue = previousStats.total_revenue || 0;
        const revenueChange = calculateChange(currentRevenue, previousRevenue);
        
        const currentOrders = currentStats.total_orders || 0;
        const previousOrders = previousStats.total_orders || 0;
        const ordersChange = calculateChange(currentOrders, previousOrders);
        
   
        const activeProducts = productsResponse?.data?.count || 0;
        
    
        const newCustomers = 0;
        const customersChange = '+0%';
        
        // try {
        //   const buyersResponse = await apiClient.get('/store/buyers', {
        //     params: currentPeriod,
        //     headers: {
        //       'Authorization': `Bearer ${accessToken}`
        //     }
        //   });
          
        //   if (buyersResponse.data.success) {
        //     newCustomers = buyersResponse.data.stats.total_unique_buyers || 0;
            
        //     const previousBuyersResponse = await apiClient.get('/store/buyers', {
        //       params: previousPeriod,
        //       headers: {
        //         'Authorization': `Bearer ${accessToken}`
        //       }
        //     });
            
        //     if (previousBuyersResponse.data.success) {
        //       const previousCustomers = previousBuyersResponse.data.stats.total_unique_buyers || 0;
        //       customersChange = calculateChange(newCustomers, previousCustomers);
        //     }
        //   }
        // } catch (err) {
        //   console.error('Error fetching customer stats:', err);
        
        // }
      
        setDashboardStats({
          totalRevenue: currentRevenue,
          totalOrders: currentOrders,
          activeProducts: activeProducts,
          newCustomers: newCustomers,
          revenueChange: revenueChange,
          ordersChange: ordersChange,
          productsChange: '+5.1%', 
          customersChange: customersChange,
          loading: false,
          error: null
        });
        
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setDashboardStats(prevState => ({
          ...prevState,
          loading: false,
          error: 'Failed to load dashboard statistics'
        }));
      }
    };
    
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { 
      name: 'Products', 
      icon: FiShoppingBag, 
      path: '/products',
      subItems: [
        { name: 'All Products', path: '/product/all' },
        { name: 'Categories', path: '/products/categories' },
        { name: 'Inventory', path: '/products/inventory' },
      ]
    },
    { 
      name: 'Sales', 
      icon: FiDollarSign, 
      path: '/sales',
      subItems: [
        { name: 'Orders', path: '/order/sales' },
        { name: 'Transactions', path: '/sales/transactions' },
        { name: 'Refunds', path: '/sales/refunds' },
      ]
    },
    { 
      name: 'Customers', 
      icon: FiUsers, 
      path: '/customers',
      subItems: [
        { name: 'Customer List', path: '/customers' },
        { name: 'Groups', path: '/customers/groups' },
      ]
    },
    { 
      name: 'Analytics', 
      icon: FiPieChart, 
      path: '/analytics',
      subItems: [
        { name: 'Sales Analytics', path: '/analytics/sales' },
        { name: 'Customer Analytics', path: '/analytics/customers' },
        { name: 'Product Analytics', path: '/analytics/products' },
      ]
    },
    { 
      name: 'Marketing', 
      icon: BsGraphUp, 
      path: '/marketing',
      subItems: [
        { name: 'Discounts', path: '/marketing/discounts' },
        { name: 'Email Campaigns', path: '/marketing/email' },
        { name: 'Social Media', path: '/marketing/social' },
      ]
    },
    { 
      name: 'Settings', 
      icon: FiSettings, 
      path: '/settings',
      subItems: [
        { name: 'Store Settings', path: '/settings/store' },
        { name: 'Payment Methods', path: '/settings/payments' },
        { name: 'Shipping', path: '/settings/shipping' },
      ]
    },
  ];

  const toggleSubmenu = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name);
  };




  const formatCurrency: CurrencyFormatter = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };




  const formatNumber: NumberFormatter = (number) => {
    return new Intl.NumberFormat('en').format(number);
  };


  const stats = [
    { 
      title: "Total Revenue", 
      value: dashboardStats.loading ? "Loading..." : formatCurrency(dashboardStats.totalRevenue), 
      change: dashboardStats.revenueChange, 
      icon: FiDollarSign, 
      color: "purple" 
    },
    { 
      title: "Total Orders", 
      value: dashboardStats.loading ? "Loading..." : formatNumber(dashboardStats.totalOrders), 
      change: dashboardStats.ordersChange, 
      icon: BsCartCheck, 
      color: "blue" 
    },
    { 
      title: "Total Products", 
      value: dashboardStats.loading ? "Loading..." : formatNumber(dashboardStats.activeProducts), 
      change: dashboardStats.productsChange, 
      icon: FiShoppingBag, 
      color: "green" 
    },
    { 
      title: "New Customers", 
      value: dashboardStats.loading ? "Loading..." : formatNumber(dashboardStats.newCustomers), 
      change: dashboardStats.customersChange, 
      icon: FiUsers, 
      color: "orange" 
    },
  ];

  const quickActions = [
    { title: "Add Product", icon: FiPlus, link: "/product/add" },
    { title: "Create Discount", icon: RiExchangeDollarLine, link: "/marketing/discounts" },
    { title: "View Analytics", icon: BsGraphUp, link: "/analytics" },
    { title: "Process Orders", icon: FiTruck, link: "/order/sales" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop (always visible) and Mobile (conditional) */}
      <motion.aside
        className={`fixed lg:relative z-30 h-full bg-white shadow-lg ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-all duration-300 ease-in-out`}
        style={{
          width: sidebarExpanded ? '280px' : '80px'
        }}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {sidebarExpanded && (
            <div className="flex items-center">
              <FaStore className="text-purple-600 text-2xl mr-2" />
              <span className="text-xl font-bold text-purple-800">MyStore</span>
            </div>
          )}
          
          {/* Always show the toggle button on desktop */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hidden lg:block"
          >
            {sidebarExpanded ? <FiX /> : <FiMenu />}
          </button>

          {/* Show close button on mobile only */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 lg:hidden"
          >
            <FiX />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <div key={item.name}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (item.subItems) {
                      toggleSubmenu(item.name);
                    } else {
                      router.push(item.path);
                    }
                  }}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    pathname === item.path ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="text-lg flex-shrink-0" />
                  {sidebarExpanded && (
                    <span className="ml-3">{item.name}</span>
                  )}
                  {item.subItems && sidebarExpanded && (
                    <motion.div
                      className="ml-auto transition-transform"
                      animate={{ rotate: activeSubmenu === item.name ? 180 : 0 }}
                    >
                      <FiChevronDown />
                    </motion.div>
                  )}
                </motion.div>

                {/* Submenu items */}
                {item.subItems && sidebarExpanded && (
                  <AnimatePresence>
                    {activeSubmenu === item.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-8 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.subItems.map((subItem) => (
                          <motion.div
                            key={subItem.name}
                            whileHover={{ x: 5 }}
                            onClick={() => router.push(subItem.path)}
                            className={`p-2 rounded cursor-pointer text-sm ${
                              pathname === subItem.path 
                                ? 'text-purple-600 font-medium' 
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                          >
                            {subItem.name}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-100">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <FiHelpCircle />
            {sidebarExpanded && (
              <span className="ml-3">Help & Support</span>
            )}
          </motion.div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              {/* Mobile menu button - only visible on mobile */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 mr-2 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <FiMenu />
              </button>
              
              <div className="relative w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 relative rounded-full hover:bg-gray-100">
                <FiBell />
                {unreadNotifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"
                  />
                )}
              </button>
              
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                  JD
                </div>
                <span className="ml-2 hidden md:inline">John Doe</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dashboard Content */}
            <div className="space-y-6">
              {/* Welcome banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold">Welcome back, John!</h1>
                    <p className="mt-2 opacity-90">Here's what's happening with your store today.</p>
                  </div>
                  <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all">
                    View Store
                  </button>
                </div>
              </motion.div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <DashboardCard {...stat} />
                  </motion.div>
                ))}
              </div>

              {/* Charts and main content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
                >
                  <SalesChart />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.title}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push(action.link)}
                        className="bg-gray-50 hover:bg-purple-50 border border-gray-100 rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all"
                      >
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600 mb-2">
                          <action.icon className="text-xl" />
                        </div>
                        <span className="text-sm font-medium text-center">{action.title}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Bottom section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-lg font-semibold mb-6">Recent Orders</h2>
                  <RecentOrders />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-lg font-semibold mb-6">Activity Feed</h2>
                  <ActivityFeed />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;