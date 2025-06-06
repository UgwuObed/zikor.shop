import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const router = useRouter();


  useEffect(() => {
    const handleRouteChange = () => {
      setMobileSidebarOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard/dashboard' },
    { 
      name: 'Products', 
      icon: FiShoppingBag, 
      // path: '/product',
      subItems: [
        { name: 'All Products', path: '/product/all' },
        { name: 'Categories', path: '/products/categories' },
        { name: 'Inventory', path: '/products/inventory' },
      ]
    },
    { 
      name: 'Orders', 
      icon: FiDollarSign, 
      // path: '/sales',
      subItems: [
        { name: 'Orders', path: '/order/all' },
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

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ 
          x: mobileSidebarOpen ? 0 : -300,
          width: sidebarOpen ? '280px' : '80px'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed lg:relative z-30 flex flex-col h-full bg-white shadow-lg transition-all duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center ${sidebarOpen ? 'block' : 'hidden'}`}
          >
            <FaStore className="text-purple-600 text-2xl mr-2" />
            <span className="text-xl font-bold text-purple-800">MyStore</span>
          </motion.div>
          
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              if (!sidebarOpen) setMobileSidebarOpen(false);
            }}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
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
                    router.pathname === item.path ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="text-lg flex-shrink-0" />
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: sidebarOpen ? 1 : 0 }}
                    className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'}`}
                  >
                    {item.name}
                  </motion.span>
                  {item.subItems && (
                    <motion.div
                      className={`ml-auto transition-transform ${sidebarOpen ? 'block' : 'hidden'}`}
                      animate={{ rotate: activeSubmenu === item.name ? 180 : 0 }}
                    >
                      <FiChevronDown />
                    </motion.div>
                  )}
                </motion.div>

                {/* Submenu items */}
                {item.subItems && sidebarOpen && (
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
                              router.pathname === subItem.path 
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
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'}`}
            >
              Help & Support
            </motion.span>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setMobileSidebarOpen(true)}
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
                {/* <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                  JD
                </div>
                <span className="ml-2 hidden md:inline">John Doe</span> */}
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
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;