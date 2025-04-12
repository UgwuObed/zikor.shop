import { motion } from 'framer-motion';
import { FiShoppingBag, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';

const RecentOrders = () => {
  const orders = [
    { 
      id: '#ORD-001', 
      customer: 'John Doe', 
      amount: '₦45,000', 
      date: 'Today, 10:45 AM', 
      status: 'completed',
      items: 2
    },
    { 
      id: '#ORD-002', 
      customer: 'Jane Smith', 
      amount: '₦32,500', 
      date: 'Today, 09:30 AM', 
      status: 'processing',
      items: 3
    },
    { 
      id: '#ORD-003', 
      customer: 'Michael Johnson', 
      amount: '₦28,750', 
      date: 'Yesterday, 4:20 PM', 
      status: 'shipped',
      items: 1
    },
    { 
      id: '#ORD-004', 
      customer: 'Sarah Williams', 
      amount: '₦62,300', 
      date: 'Yesterday, 2:15 PM', 
      status: 'cancelled',
      items: 4
    },
  ];

  const statusIcons = {
    completed: <FiCheckCircle className="text-green-500" />,
    processing: <FiShoppingBag className="text-blue-500" />,
    shipped: <FiTruck className="text-purple-500" />,
    cancelled: <FiXCircle className="text-red-500" />,
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order, index) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
              className="cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    <FiShoppingBag />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-500">{order.items} items</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{order.customer}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{order.amount}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{order.date}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="mr-2">{statusIcons[order.status as keyof typeof statusIcons]}</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status as keyof typeof statusColors]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;