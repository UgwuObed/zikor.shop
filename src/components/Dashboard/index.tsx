
// import { motion } from 'framer-motion';
// import { 
//   FiTrendingUp, FiDollarSign, FiShoppingBag, 
//   FiUsers, FiCreditCard, FiBox, FiTruck
// } from 'react-icons/fi';
// import { BsGraphUp, BsCartCheck } from 'react-icons/bs';
// import { RiExchangeDollarLine } from 'react-icons/ri';
// import DashboardCard from '../../components/DashboardCard';
// import SalesChart from '../../components/SalesChart';
// import RecentOrders from '../../components/RecentOrders';
// import ActivityFeed from '../../components/ActivityFeed';

// const Dashboard = () => {
//   const stats = [
//     { title: "Total Revenue", value: "₦1,245,890", change: "+12.5%", icon: FiDollarSign, color: "purple" },
//     { title: "Total Orders", value: "1,845", change: "+8.2%", icon: BsCartCheck, color: "blue" },
//     { title: "Active Products", value: "128", change: "+5.1%", icon: FiShoppingBag, color: "green" },
//     { title: "New Customers", value: "56", change: "+3.4%", icon: FiUsers, color: "orange" },
//   ];

//   const quickActions = [
//     { title: "Add Product", icon: FiPlus, link: "/products/add" },
//     { title: "Create Discount", icon: RiExchangeDollarLine, link: "/marketing/discounts" },
//     { title: "View Analytics", icon: BsGraphUp, link: "/analytics" },
//     { title: "Process Orders", icon: FiTruck, link: "/sales/orders" },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Welcome banner */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//         className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
//       >
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold">Welcome back, John!</h1>
//             <p className="mt-2 opacity-90">Here's what's happening with your store today.</p>
//           </div>
//           <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all">
//             View Store
//           </button>
//         </div>
//       </motion.div>

//       {/* Stats cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 + index * 0.1 }}
//           >
//             <DashboardCard {...stat} />
//           </motion.div>
//         ))}
//       </div>

//       {/* Charts and main content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.3 }}
//           className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-semibold">Sales Overview</h2>
//             <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
//               <option>Last 7 days</option>
//               <option>Last 30 days</option>
//               <option>Last 3 months</option>
//             </select>
//           </div>
//           <SalesChart />
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white rounded-xl shadow-sm p-6"
//         >
//           <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
//           <div className="grid grid-cols-2 gap-4">
//             {quickActions.map((action, index) => (
//               <motion.div
//                 key={action.title}
//                 whileHover={{ y: -5 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="bg-gray-50 hover:bg-purple-50 border border-gray-100 rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all"
//               >
//                 <div className="bg-purple-100 p-3 rounded-full text-purple-600 mb-2">
//                   <action.icon className="text-xl" />
//                 </div>
//                 <span className="text-sm font-medium text-center">{action.title}</span>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       </div>

//       {/* Bottom section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
//         >
//           <h2 className="text-lg font-semibold mb-6">Recent Orders</h2>
//           <RecentOrders />
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="bg-white rounded-xl shadow-sm p-6"
//         >
//           <h2 className="text-lg font-semibold mb-6">Activity Feed</h2>
//           <ActivityFeed />
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// Dashboard.Layout = DashboardLayout;

// export default Dashboard;