"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiShoppingBag, FiDollarSign, FiUsers, 
  FiPieChart, FiBarChart2, FiGrid
} from 'react-icons/fi';


import OrdersManagement from '../../components/Order/manage';
import OrderStats from '../../components/Order/stats';
import BuyersList from '../../components/Order/buyer';


const TABS = {
  ORDERS: 'orders',
  STATISTICS: 'statistics',
  BUYERS: 'buyers',
};

const OrdersIndex = () => {
  const [activeTab, setActiveTab] = useState(TABS.ORDERS);


  const tabs = [
    { 
      id: TABS.ORDERS, 
      label: 'Orders', 
      icon: FiShoppingBag,
      component: OrdersManagement
    },
    { 
      id: TABS.STATISTICS, 
      label: 'Statistics', 
      icon: FiBarChart2,
      component: OrderStats
    },
    { 
      id: TABS.BUYERS, 
      label: 'Buyers', 
      icon: FiUsers,
      component: BuyersList
    },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || OrdersManagement;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Tab navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-4 flex items-center border-b-2 font-medium text-sm focus:outline-none transition-colors ${
                    isActive
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`mr-2 ${isActive ? 'text-purple-500' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active tab content */}
      <div className="py-6">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default OrdersIndex;