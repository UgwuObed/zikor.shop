import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface DashboardCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: IconType;
  color: string;
}

const DashboardCard = ({ title, value, change, icon: Icon, color }: DashboardCardProps) => {
  const isLoading = value === "Loading...";
  const isPositiveChange = change?.startsWith('+');
  
  const getColorClass = (color: string) => {
    switch (color) {
      case 'purple':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-600',
          light: 'bg-purple-50'
        };
      case 'blue':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-600',
          light: 'bg-blue-50'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          light: 'bg-green-50'
        };
      case 'orange':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-600',
          light: 'bg-orange-50'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          light: 'bg-gray-50'
        };
    }
  };

  const colorClasses = getColorClass(color);
  
  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
          {isLoading ? (
            <div className="h-7 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          )}
        </div>
        <div className={`${colorClasses.bg} p-3 rounded-lg ${colorClasses.text}`}>
          <Icon className="text-xl" />
        </div>
      </div>
      
      {!isLoading && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="text-xs text-gray-500 ml-2">vs previous period</span>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardCard;