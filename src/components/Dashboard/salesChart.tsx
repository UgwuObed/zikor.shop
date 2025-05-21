import { useState, useEffect, SetStateAction } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';
import apiClient from '../../apiClient';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

 interface MonthlyDataItem {
            period: string;
            total_revenue: number;
            platform_fees: number;
            payout_amount: number;
          }

          interface ChartDataset {
            label: string;
            data: number[];
            borderColor: string;
            backgroundColor: string;
            tension: number;
            fill: boolean;
            pointBackgroundColor: string;
            pointBorderColor: string;
            pointHoverRadius: number;
            pointHoverBorderWidth: number;
            borderDash?: number[];
          }

          interface ChartData {
            labels: string[];
            datasets: ChartDataset[];
          }

    interface SalesChartProps {
            period?: 'last_7_days' | 'last_30_days' | 'last_3_months' | 'last_6_months' | 'last_year';
          }

interface ChartOptions {
    responsive: boolean;
    maintainAspectRatio: boolean;
    plugins: {
      legend: {
        position: 'top';
        labels: {
          boxWidth: number;
          padding: number;
          usePointStyle: boolean;
        };
      };
      tooltip: {
        mode: 'index';
        intersect: boolean;
        callbacks: {
          label: (context: any) => string;
        };
      };
    };
    scales: {
      y: {
        beginAtZero: boolean;
        ticks: {
          callback: (value: number) => string;
        };
        grid: {
          color: string;
        };
      };
      x: {
        grid: {
          display: boolean;
        };
      };
    };
  }

  interface FormatCurrencyOptions {
    style: 'currency';
    currency: string;
    maximumFractionDigits: number;
  }

  
const SalesChart = ({ period = 'last_30_days' }: SalesChartProps) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(period);

  useEffect(() => {
    const fetchRevenueStats = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        setLoading(true);
        
        let params = {};
        const today = new Date();
        
        if (timeRange === 'last_7_days') {
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          params = {
            start_date: lastWeek.toISOString().split('T')[0],
            end_date: today.toISOString().split('T')[0]
          };
        } else if (timeRange === 'last_30_days') {
          const lastMonth = new Date(today);
          lastMonth.setDate(today.getDate() - 30);
          params = {
            start_date: lastMonth.toISOString().split('T')[0],
            end_date: today.toISOString().split('T')[0]
          };
        } else if (timeRange === 'last_3_months') {
          const lastThreeMonths = new Date(today);
          lastThreeMonths.setMonth(today.getMonth() - 3);
          params = {
            start_date: lastThreeMonths.toISOString().split('T')[0],
            end_date: today.toISOString().split('T')[0]
          };
        } else if (timeRange === 'last_6_months') {
          const lastSixMonths = new Date(today);
          lastSixMonths.setMonth(today.getMonth() - 6);
          params = {
            start_date: lastSixMonths.toISOString().split('T')[0],
            end_date: today.toISOString().split('T')[0]
          };
        } else if (timeRange === 'last_year') {
          const lastYear = new Date(today);
          lastYear.setFullYear(today.getFullYear() - 1);
          params = {
            start_date: lastYear.toISOString().split('T')[0],
            end_date: today.toISOString().split('T')[0]
          };
        }
        
        const response = await apiClient.get('/stats', { 
          params,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.data.success) {
          const monthlyData = response.data.monthly_data;
          
          const labels: string[] = monthlyData.map((item: MonthlyDataItem) => item.period);
          const salesData: number[] = monthlyData.map((item: MonthlyDataItem) => item.total_revenue);
          const platformFeesData = monthlyData.map((item: MonthlyDataItem) => item.platform_fees);
          const payoutData = monthlyData.map((item: MonthlyDataItem) => item.payout_amount);
          
          setChartData({
            labels,
            datasets: [
              {
                label: 'Total Revenue',
                data: salesData,
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#7c3aed',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointHoverBorderWidth: 2,
              },
              {
                label: 'Platform Fees',
                data: platformFeesData,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0)',
                borderDash: [5, 5],
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointHoverBorderWidth: 2,
              },
              {
                label: 'Payout Amount',
                data: payoutData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointHoverBorderWidth: 2,
              }
            ],
          });
        } else {
          setError(response.data.message || 'Failed to fetch revenue data');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error('Error fetching revenue stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueStats();
  }, [timeRange]);

  const formatCurrency = (value: number): string => {
    const options: FormatCurrencyOptions = {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    };
    return new Intl.NumberFormat('en-NG', options).format(value);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        type: 'category' as const,
        grid: {
          display: false,
        },
      },
    },
  };

  const handleTimeRangeChange = (e: { target: { value: string; }; }) => {
    setTimeRange(e.target.value as 'last_7_days' | 'last_30_days' | 'last_3_months' | 'last_6_months' | 'last_year');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Sales Overview</h2>
        <select 
          className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={timeRange}
          onChange={handleTimeRangeChange}
        >
          <option value="last_7_days">Last 7 days</option>
          <option value="last_30_days">Last 30 days</option>
          <option value="last_3_months">Last 3 months</option>
          <option value="last_6_months">Last 6 months</option>
          <option value="last_year">Last year</option>
        </select>
      </div>

      <div className="h-[300px] relative">
       {loading ? (
  <div className="absolute inset-0 p-4 space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3" />
    <div className="h-60 bg-gray-100 rounded" />
  </div>
) : error ? (
  <div className="absolute inset-0 flex items-center justify-center text-red-500">
    <p>Failed to load revenue data: {error}</p>
  </div>
) : chartData && chartData.labels.length > 0 ? (
  <motion.div
    className="h-full"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    <Line data={chartData} options={options} />
  </motion.div>
  ) : (
    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
      <p>No revenue data available for the selected period</p>
    </div>
  )}
    </div>
    </div>
  );
};
export default SalesChart;