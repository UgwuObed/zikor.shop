"use client"

import type React from "react"

import { useState, useEffect } from "react"
import apiClient from "../../apiClient"
import { motion } from "framer-motion"
import {
  FiDollarSign,
  FiShoppingBag,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiDownload,
  FiClock,
} from "react-icons/fi"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (type: "start" | "end", value: string) => void
}

const DateRangePicker = ({ startDate, endDate, onChange }: DateRangePickerProps) => {
  return (
    <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-2 w-full">
      <div className="relative w-full xs:w-auto">
        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChange("start", e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-full"
        />
      </div>
      <span className="text-gray-500 hidden xs:block">to</span>
      <div className="relative w-full xs:w-auto">
        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange("end", e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-full"
        />
      </div>
    </div>
  )
}

interface KpiCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  change?: string
  color: string
}

const KpiCard = ({ title, value, icon: Icon, change, color }: KpiCardProps) => {
  const isPositive = change && change.startsWith("+")
  const ChangeIcon = isPositive ? FiTrendingUp : FiTrendingDown

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`bg-${color}-100 p-3 rounded-lg text-${color}-600`}>
          <Icon className="text-xl" />
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
            <ChangeIcon className="mr-1" />
            {change}
          </span>
          <span className="text-xs text-gray-500 ml-2">vs previous period</span>
        </div>
      )}
    </motion.div>
  )
}

const OrderStats = () => {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })
  interface RevenueStats {
    monthly_data?: Array<{
      period: string
      total_revenue: number
      platform_fees: number
      payout_amount: number
      order_count: number
    }>
    stats?: {
      total_revenue: number
      total_orders: number
      completed_orders: number
      cancelled_orders: number
      processing_orders: number
      platform_fees: number
      shipping_revenue: number
      payout_amount: number
      period_start: string
      period_end: string
    }
    storefront_name?: string
    success?: boolean
  }

  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartType, setChartType] = useState("revenue")

  useEffect(() => {
    const fetchRevenueStats = async () => {
      const accessToken = localStorage.getItem("accessToken")
      setLoading(true)
      try {
        const params: Record<string, string> = {}
        if (dateRange.startDate) params.start_date = dateRange.startDate
        if (dateRange.endDate) params.end_date = dateRange.endDate

        const response = await apiClient.get("/stats", {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if (response.data.success) {
          setRevenueStats(response.data)
        } else {
          setError(response.data.message || "Failed to fetch revenue statistics")
        }
      } catch (err) {
        setError("Error connecting to the server")
        console.error("Error fetching revenue statistics:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueStats()
  }, [dateRange])

  interface DateRange {
    startDate: string
    endDate: string
  }

  const handleDateChange = (type: "start" | "end", value: string): void => {
    setDateRange((prev: DateRange) => ({
      ...prev,
      [type === "start" ? "startDate" : "endDate"]: value,
    }))
  }

  interface CurrencyFormatOptions {
    style: "currency"
    currency: string
    minimumFractionDigits: number
  }

  const formatCurrency = (amount: number): string => {
    const options: CurrencyFormatOptions = {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }

    return new Intl.NumberFormat("en-NG", options).format(amount)
  }

  interface FormatPercentageOptions {
    value: number
  }

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`
  }

  const getChartData = () => {
    if (!revenueStats || !revenueStats.monthly_data) return null

    const labels = revenueStats.monthly_data.map((item) => item.period)

    if (chartType === "revenue") {
      return {
        labels,
        datasets: [
          {
            label: "Total Revenue",
            data: revenueStats.monthly_data.map((item) => item.total_revenue),
            borderColor: "#7c3aed",
            backgroundColor: "rgba(124, 58, 237, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#7c3aed",
            pointBorderColor: "#fff",
            pointHoverRadius: 6,
            pointHoverBorderWidth: 2,
          },
        ],
      }
    } else if (chartType === "orders") {
      return {
        labels,
        datasets: [
          {
            label: "Order Count",
            data: revenueStats.monthly_data.map((item) => item.order_count),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.6)",
            borderWidth: 0,
            barThickness: 20,
            borderRadius: 4,
          },
        ],
      }
    } else if (chartType === "comparison") {
      return {
        labels,
        datasets: [
          {
            label: "Total Revenue",
            data: revenueStats.monthly_data.map((item) => item.total_revenue),
            borderColor: "#7c3aed",
            backgroundColor: "rgba(0, 0, 0, 0)",
            tension: 0.4,
            fill: false,
            pointBackgroundColor: "#7c3aed",
            pointBorderColor: "#fff",
            pointHoverRadius: 6,
            yAxisID: "y",
          },
          {
            label: "Platform Fees",
            data: revenueStats.monthly_data.map((item) => item.platform_fees),
            borderColor: "#f59e0b",
            backgroundColor: "rgba(0, 0, 0, 0)",
            tension: 0.4,
            fill: false,
            pointBackgroundColor: "#f59e0b",
            pointBorderColor: "#fff",
            pointHoverRadius: 6,
            yAxisID: "y",
          },
          {
            label: "Payout Amount",
            data: revenueStats.monthly_data.map((item) => item.payout_amount),
            borderColor: "#10b981",
            backgroundColor: "rgba(0, 0, 0, 0)",
            tension: 0.4,
            fill: false,
            pointBackgroundColor: "#10b981",
            pointBorderColor: "#fff",
            pointHoverRadius: 6,
            yAxisID: "y",
          },
        ],
      }
    }

    return null
  }

  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: chartType === "comparison",
          position: "top" as const,
          labels: {
            boxWidth: 12,
            padding: 15,
            usePointStyle: true,
          },
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
          callbacks: {
            label: (context: any) => {
              let label = context.dataset.label || ""
              if (label) {
                label += ": "
              }
              if (context.parsed.y !== null) {
                if (chartType === "orders") {
                  label += context.parsed.y.toString()
                } else {
                  label += formatCurrency(context.parsed.y)
                }
              }
              return label
            },
          },
        },
      },
      scales: {
        y: {
          type: "linear" as const,
          beginAtZero: true,
          ticks: {
            callback: (tickValue: number | string) => {
              if (chartType === "orders") {
                return tickValue.toString()
              }
              return formatCurrency(Number(tickValue))
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
        x: {
          type: "category" as const,
          grid: {
            display: false,
          },
        },
      },
    }

    return baseOptions
  }

  const chartData = getChartData()
  const chartOptions = getChartOptions()

  const getKpiCardsData = () => {
    if (!revenueStats || !revenueStats.stats) return []

    const { stats } = revenueStats

    return [
      {
        title: "Total Revenue",
        value: formatCurrency(stats.total_revenue || 0),
        icon: FiDollarSign,
        color: "purple",
      },
      {
        title: "Total Orders",
        value: stats.total_orders || 0,
        icon: FiShoppingBag,
        color: "blue",
      },
      {
        title: "Completed Orders",
        value: stats.completed_orders || 0,
        icon: FiCheckCircle,
        color: "green",
      },
      {
        title: "Cancelled Orders",
        value: stats.cancelled_orders || 0,
        icon: FiXCircle,
        color: "red",
      },
    ]
  }

  // Download report as CSV
  const downloadReport = () => {
    if (!revenueStats || !revenueStats.monthly_data) return

    // Create CSV content
    let csv = "Period,Total Revenue,Platform Fees,Payout Amount,Order Count\n"

    revenueStats.monthly_data.forEach((item) => {
      csv += `${item.period},${item.total_revenue},${item.platform_fees},${item.payout_amount},${item.order_count}\n`
    })

    // Create download link
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", "revenue_report.csv")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const kpiCardsData = getKpiCardsData()

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Date range and filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="font-medium text-gray-700 mb-2 sm:mb-0">
              {revenueStats?.storefront_name && <span>Store: {revenueStats.storefront_name}</span>}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <DateRangePicker
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  onChange={handleDateChange}
                />
              </div>

              <button
                onClick={downloadReport}
                disabled={!revenueStats || loading}
                className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm w-full sm:w-auto mt-2 sm:mt-0 ${
                  !revenueStats || loading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                <FiDownload className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="animate-pulse">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="h-3 w-24 bg-gray-200 rounded mb-3"></div>
                      <div className="h-7 w-32 bg-gray-300 rounded"></div>
                    </div>
                    <div className="bg-gray-200 p-3 rounded-lg"></div>
                  </div>
                  <div className="mt-4">
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full bg-red-50 rounded-xl p-6 text-red-600">
              <p className="font-medium">Error loading statistics</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : (
            kpiCardsData.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <KpiCard {...card} />
              </motion.div>
            ))
          )}
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Breakdown</h2>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : revenueStats ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-medium">{formatCurrency(revenueStats?.stats?.total_revenue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fees</span>
                  <span className="font-medium">{formatCurrency(revenueStats?.stats?.platform_fees || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Revenue</span>
                  <span className="font-medium">{formatCurrency(revenueStats?.stats?.shipping_revenue || 0)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-medium">Your Payout</span>
                    <span className="text-purple-600 font-medium">
                      {formatCurrency(revenueStats?.stats?.payout_amount || 0)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Status</h2>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : revenueStats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiClock className="text-yellow-500 mr-2" />
                    <span className="text-gray-600">Pending</span>
                  </div>
                  <span className="font-medium">
                    {(revenueStats?.stats?.total_orders ?? 0) -
                      ((revenueStats?.stats?.completed_orders ?? 0) +
                        (revenueStats?.stats?.processing_orders ?? 0) +
                        (revenueStats?.stats?.cancelled_orders ?? 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiRefreshCw className="text-blue-500 mr-2" />
                    <span className="text-gray-600">Processing</span>
                  </div>
                  <span className="font-medium">{revenueStats?.stats?.processing_orders || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span className="text-gray-600">Completed</span>
                  </div>
                  <span className="font-medium">{revenueStats?.stats?.completed_orders || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiXCircle className="text-red-500 mr-2" />
                    <span className="text-gray-600">Cancelled</span>
                  </div>
                  <span className="font-medium">{revenueStats?.stats?.cancelled_orders || 0}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Period Info</h2>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : revenueStats ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium">{revenueStats?.stats?.period_start || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date</span>
                  <span className="font-medium">{revenueStats?.stats?.period_end}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Order Value</span>
                  <span className="font-medium">
                    {revenueStats?.stats?.total_orders && revenueStats.stats.total_orders > 0
                      ? formatCurrency(revenueStats.stats.total_revenue / revenueStats.stats.total_orders)
                      : formatCurrency(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Earnings %</span>
                  <span className="font-medium">
                    {revenueStats?.stats?.total_revenue && revenueStats.stats.total_revenue > 0
                      ? formatPercentage((revenueStats.stats.payout_amount / revenueStats.stats.total_revenue) * 100)
                      : "0.00%"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
            <h2 className="text-lg font-medium text-gray-900">Performance Over Time</h2>
            <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setChartType("revenue")}
                className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${
                  chartType === "revenue" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setChartType("orders")}
                className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${
                  chartType === "orders" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setChartType("comparison")}
                className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${
                  chartType === "comparison"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Comparison
              </button>
            </div>
          </div>

          <div className="h-60 sm:h-80">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center text-red-500">
                  <p className="text-lg font-medium">Failed to load chart data</p>
                  <p className="text-sm mt-2">{error}</p>
                </div>
              </div>
            ) : !chartData ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium">No data available</p>
                  <p className="text-sm mt-2">Try selecting a different date range</p>
                </div>
              </div>
            ) : (
              <motion.div
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {chartType === "orders" ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <Line data={chartData} options={chartOptions} />
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Monthly Data Table */}
        {!loading && revenueStats && revenueStats.monthly_data && revenueStats.monthly_data.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm mt-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Monthly Breakdown</h2>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Period
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Orders
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total Revenue
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Platform Fees
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Your Payout
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Avg. Order Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {revenueStats.monthly_data.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.period}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.order_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.total_revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.platform_fees)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                          {formatCurrency(item.payout_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.order_count > 0
                            ? formatCurrency(item.total_revenue / item.order_count)
                            : formatCurrency(0)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderStats
