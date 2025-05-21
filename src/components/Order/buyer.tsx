"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FiUser,
  FiCalendar,
  FiFilter,
  FiSearch,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiShoppingBag,
  FiArrowLeft,
  FiArrowRight,
  FiDownload,
  FiRefreshCw,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi"
import { format, parseISO } from "date-fns"

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (type: "start" | "end", value: string) => void
}

interface CustomerInsightsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<React.SVGAttributes<SVGElement>>
  subtitle?: string
  color: string
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

const CustomerInsightsCard = ({ title, value, icon: Icon, subtitle, color }: CustomerInsightsCardProps) => {
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
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`bg-${color}-100 p-3 rounded-lg text-${color}-600`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </motion.div>
  )
}

const CustomerRowSkeleton = () => (
  <div className="animate-pulse px-6 py-4">
    <div className="flex items-center">
      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full"></div>
      <div className="ml-4 flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="ml-auto flex space-x-8">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
)

const BuyersList = () => {
  interface Buyer {
    name?: string
    email?: string
    phone?: string
    address?: string
    total_orders: number
    total_spent: number
    last_purchase_date: string
  }

  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [buyerStats, setBuyerStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "last_purchase_date",
    direction: "desc",
  } as SortConfig)
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
  })

  interface CurrencyFormatterOptions {
    style: "currency"
    currency: string
    minimumFractionDigits: number
  }

  const formatCurrency = (amount: number): string => {
    const options: CurrencyFormatterOptions = {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }
    return new Intl.NumberFormat("en-NG", options).format(amount)
  }

  type DateFormatter = (dateString: string) => string

  const formatDate: DateFormatter = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy")
    } catch (error) {
      return dateString
    }
  }

  //   const fetchBuyers = useCallback(async () => {
  //      const accessToken = localStorage.getItem('accessToken');
  //     setLoading(true);
  //     try {
  //       const response = await apiClient.get('/store/buyers', {
  //         params: {
  //           page: currentPage,
  //           per_page: perPage,
  //           sort_by: sortConfig.field,
  //           sort_direction: sortConfig.direction,
  //           ...filters
  //         },
  //         headers: {
  //           'Authorization': `Bearer ${accessToken}`
  //         }
  //       });

  //       if (response.data.success) {
  //         setBuyers(response.data.buyers);
  //         setBuyerStats(response.data.stats);
  //         setTotalPages(response.data.pagination.last_page);
  //       } else {
  //         setError(response.data.message || 'Failed to fetch buyers');
  //       }
  //     } catch (err) {
  //       setError('Error connecting to the server');
  //       console.error('Error fetching buyers:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, [currentPage, perPage, sortConfig, filters]);

  //   useEffect(() => {
  //     fetchBuyers();
  //   }, [fetchBuyers]);

  interface SortConfig {
    field: string
    direction: "asc" | "desc"
  }

  const handleSort = (field: string): void => {
    setSortConfig(
      (prevState: SortConfig): SortConfig => ({
        field,
        direction: prevState.field === field && prevState.direction === "asc" ? "desc" : "asc",
      }),
    )
  }

  interface DateFilters {
    start_date: string
    end_date: string
  }

  const handleDateChange = (type: "start" | "end", value: string): void => {
    setFilters(
      (prev: DateFilters): DateFilters => ({
        ...prev,
        [type === "start" ? "start_date" : "end_date"]: value,
      }),
    )
  }

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // fetchBuyers();
  }

  const getFilteredBuyers = () => {
    if (!searchQuery.trim()) return buyers

    return buyers.filter((buyer) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        buyer.name?.toLowerCase().includes(searchLower) ||
        buyer.email?.toLowerCase().includes(searchLower) ||
        buyer.phone?.toLowerCase().includes(searchLower) ||
        buyer.address?.toLowerCase().includes(searchLower)
      )
    })
  }

  const exportBuyerData = () => {
    if (!buyers || buyers.length === 0) return

    let csv = "Name,Email,Phone,Address,Total Orders,Total Spent,Last Purchase Date\n"

    buyers.forEach((buyer) => {
      type CsvEscaper = (field: string | undefined) => string

      const escapeCsv: CsvEscaper = (field) => {
        if (!field) return ""
        return `"${field.replace(/"/g, '""')}"`
      }

      csv += `${escapeCsv(buyer.name)},${escapeCsv(buyer.email)},${escapeCsv(buyer.phone)},${escapeCsv(
        buyer.address,
      )},${buyer.total_orders},${buyer.total_spent},${buyer.last_purchase_date}\n`
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", "customers.csv")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const filteredBuyers = getFilteredBuyers()

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Customer Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {loading ? (
            [...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="animate-pulse">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="h-3 w-24 bg-gray-200 rounded mb-3"></div>
                      <div className="h-7 w-32 bg-gray-300 rounded"></div>
                      <div className="h-2 w-20 bg-gray-200 rounded mt-3"></div>
                    </div>
                    <div className="bg-gray-200 p-3 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full bg-red-50 rounded-xl p-6 text-red-600">
              <p className="font-medium">Error loading customer statistics</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : (
            <>
              <CustomerInsightsCard
                title="Total Customers"
                value={buyerStats?.total_unique_buyers || 0}
                subtitle="All time unique buyers"
                icon={FiUser}
                color="purple"
              />

              <CustomerInsightsCard
                title="Repeat Customers"
                value={buyerStats?.repeat_customers || 0}
                subtitle="Customers who purchased more than once"
                icon={FiUserCheck}
                color="green"
              />

              <CustomerInsightsCard
                title="Repeat Purchase Rate"
                value={`${buyerStats?.repeat_purchase_rate || 0}%`}
                subtitle="Percentage of customers who return"
                icon={FiRefreshCw}
                color="blue"
              />
            </>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col space-y-4">
            <div className="w-full">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search customers by name, email or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiFilter />
                </button>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-auto">
                <DateRangePicker
                  startDate={filters.start_date}
                  endDate={filters.end_date}
                  onChange={handleDateChange}
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  //   onClick={fetchBuyers}
                  className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg w-full sm:w-auto"
                >
                  Apply Filters
                </button>
                <button
                  onClick={exportBuyerData}
                  disabled={!buyers || buyers.length === 0}
                  className={`px-4 py-2 text-sm rounded-lg flex items-center justify-center w-full sm:w-auto ${
                    !buyers || buyers.length === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FiDownload className="mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <CustomerRowSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p className="text-lg font-medium">Failed to load customers</p>
              <p className="text-sm mt-2">{error}</p>
              <button
                // onClick={fetchBuyers}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredBuyers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiUserX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
              <p className="text-sm">Try changing your filters or check back later.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("buyer_name")}
                        >
                          <div className="flex items-center">
                            Customer
                            {sortConfig.field === "buyer_name" && (
                              <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Contact
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("total_orders")}
                        >
                          <div className="flex items-center">
                            Orders
                            {sortConfig.field === "total_orders" && (
                              <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("total_spent")}
                        >
                          <div className="flex items-center">
                            Spent
                            {sortConfig.field === "total_spent" && (
                              <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("last_purchase_date")}
                        >
                          <div className="flex items-center">
                            Last Purchase
                            {sortConfig.field === "last_purchase_date" && (
                              <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBuyers.map((buyer, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">
                                {buyer.name ? buyer.name.charAt(0).toUpperCase() : "U"}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{buyer.name || "Unknown"}</div>
                                <div className="text-xs text-gray-500">
                                  {buyer.address ? (
                                    <div className="flex items-center">
                                      <FiMapPin className="mr-1" size={12} />
                                      {buyer.address.split(",")[0]}
                                    </div>
                                  ) : (
                                    "No address"
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center mb-1">
                                <FiMail className="mr-2 text-gray-400" size={14} />
                                {buyer.email || "No email"}
                              </div>
                              {buyer.phone && (
                                <div className="flex items-center">
                                  <FiPhone className="mr-2 text-gray-400" size={14} />
                                  {buyer.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiShoppingBag className="mr-2 text-gray-400" size={14} />
                              <div className="text-sm text-gray-900">{buyer.total_orders}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiDollarSign className="mr-2 text-gray-400" size={14} />
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(buyer.total_spent)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(buyer.last_purchase_date)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">First</span>
                        <FiArrowLeft className="h-5 w-5" />
                      </button>

                      {/* Page numbers */}
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum

                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        // Skip if page number is out of range
                        if (pageNum <= 0 || pageNum > totalPages) return null

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? "z-10 bg-purple-50 border-purple-500 text-purple-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Last</span>
                        <FiArrowRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyersList
