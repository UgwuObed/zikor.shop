import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  icon: IconType;
  color: string;
}

const DashboardCard = ({ title, value, change, icon: Icon, color }: DashboardCardProps) => {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex justify-between">
        <div className={`${colorClasses[color as keyof typeof colorClasses]} p-3 rounded-lg`}>
          <Icon className="text-xl" />
        </div>
        <span className={`text-sm font-medium ${
          change.startsWith('+') ? 'text-green-500' : 'text-red-500'
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-gray-500 text-sm mt-4">{title}</h3>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </motion.div>
  );
};

export default DashboardCard;