import { motion } from 'framer-motion';
import { 
  FiShoppingBag, FiDollarSign, FiUserPlus, 
  FiBox, FiTruck, FiCreditCard, FiAlertCircle 
} from 'react-icons/fi';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'order',
      title: 'New order received',
      description: 'Order #ORD-005 from David Wilson',
      time: '2 minutes ago',
      icon: FiShoppingBag,
      color: 'text-purple-500 bg-purple-100'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment received',
      description: '₦45,000 from John Doe for Order #ORD-001',
      time: '1 hour ago',
      icon: FiDollarSign,
      color: 'text-green-500 bg-green-100'
    },
    {
      id: 3,
      type: 'customer',
      title: 'New customer registered',
      description: 'Sarah Johnson created an account',
      time: '3 hours ago',
      icon: FiUserPlus,
      color: 'text-blue-500 bg-blue-100'
    },
    {
      id: 4,
      type: 'inventory',
      title: 'Low stock alert',
      description: 'Only 2 units left for "Wireless Headphones"',
      time: '5 hours ago',
      icon: FiBox,
      color: 'text-orange-500 bg-orange-100'
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${activity.color}`}>
            <activity.icon className="text-lg" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
            <p className="text-sm text-gray-500">{activity.description}</p>
            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
          </div>
        </motion.div>
      ))}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
      >
        View all activity
      </motion.button>
    </div>
  );
};

export default ActivityFeed;