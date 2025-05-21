import { motion } from 'framer-motion';
import { FiShoppingBag, FiCheckCircle, FiTruck, FiXCircle, FiClock } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import apiClient from '../../apiClient';


interface DateFormatOptions {
    hour: '2-digit';
    minute: '2-digit';
  }

interface CurrencyFormatter {
    (amount: number): string;
  }

interface Order {
  id: string;
  order_number: string;
  items_count: number;
  buyer_name: string;
  total: number;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        setLoading(true);
       
        const response = await apiClient.get('/order/all', {
          headers: {
          'Authorization': `Bearer ${accessToken}`
        },
          params: {
            per_page: 5
          }
        });
        
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error('Error fetching recent orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  const statusIcons = {
    pending: <FiClock className="text-yellow-500" />,
    processing: <FiShoppingBag className="text-blue-500" />,
    completed: <FiCheckCircle className="text-green-500" />,
    cancelled: <FiXCircle className="text-red-500" />,
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };



    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const timeOptions: DateFormatOptions = { hour: '2-digit', minute: '2-digit' };
     
      if (date.toDateString() === now.toDateString()) {
        return `Today, ${date.toLocaleTimeString([], timeOptions)}`;
      } 

      else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString([], timeOptions)}`;
      } 
    
      else {
        return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], timeOptions);
      }
    };



  const formatCurrency: CurrencyFormatter = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p className="text-lg font-medium">Failed to load orders</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No recent orders found</p>
        </div>
      ) : (
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
                      <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                      <div className="text-sm text-gray-500">{order.items_count} items</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.buyer_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">{statusIcons[order.status]}</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentOrders;