"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import apiClient from "../../apiClient"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiShoppingBag,
  FiCalendar,
  FiDownload,
  FiEye,
  FiX,
  FiClock,
  FiTruck,
  FiArrowLeft,
  FiArrowRight,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiInfo,
  FiPhone,
  FiMail,
} from "react-icons/fi"
import { format, parseISO } from "date-fns"

// Add custom hook for mobile detection
const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return isMobile
}

// Add skeleton loader component
const OrderSkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="h-16 bg-gray-200 rounded-md mb-3"></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        <div className="h-5 bg-gray-200 rounded col-span-1"></div>
        <div className="h-5 bg-gray-200 rounded col-span-1"></div>
        <div className="h-5 bg-gray-200 rounded col-span-1 hidden md:block"></div>
        <div className="h-5 bg-gray-200 rounded col-span-1 hidden md:block"></div>
        <div className="h-5 bg-gray-200 rounded col-span-1 hidden sm:block"></div>
        <div className="h-5 bg-gray-200 rounded col-span-1 hidden sm:block"></div>
        <div className="h-5 bg-gray-200 rounded col-span-1 hidden md:block"></div>
      </div>
    </div>
  )
}

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (type: "start" | "end", value: string) => void
}

interface Order {
  id: string
  order_number: string
  status: "pending" | "processing" | "completed" | "cancelled"
  payment_status: "paid" | "pending" | "failed" | "refunded"
  payment_method?: string
  delivery_method?: string
  created_at: string
  items: Array<{
    id: string
    product_id: string
    product_name: string
    product_image?: string
    price: number
    discount_price?: number
    quantity: number
    total: number
  }>
  subtotal: number
  shipping: number
  platform_fee: number
  total: number
  payout_amount: number
  buyer_name: string
  buyer_email: string
  buyer_phone?: string
  buyer_address?: string
  delivery_notes?: string
}

interface OrderDetailsProps {
  order: Order | null
  onClose: () => void
  onStatusChange: (orderId: string, status: Order["status"]) => void
}

interface FormatCurrencyProps {
  amount: number
}

const StatusBadge = ({ status }: { status: "pending" | "processing" | "completed" | "cancelled" }) => {
  const statusConfig = {
    pending: { icon: FiClock, bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    processing: { icon: FiRefreshCw, bg: "bg-blue-100", text: "text-blue-800", label: "Processing" },
    completed: { icon: FiCheckCircle, bg: "bg-green-100", text: "text-green-800", label: "Completed" },
    cancelled: { icon: FiXCircle, bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
  }

  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="mr-1" size={12} />
      {config.label}
    </div>
  )
}

const PaymentBadge = ({ status }: { status: "paid" | "pending" | "failed" | "refunded" }) => {
  const statusConfig = {
    paid: { bg: "bg-green-100", text: "text-green-800", label: "Paid" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
    refunded: { bg: "bg-purple-100", text: "text-purple-800", label: "Refunded" },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <div
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </div>
  )
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

const OrderDetails = ({ order, onClose, onStatusChange }: OrderDetailsProps) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState(order?.status || "pending")

  const formatCurrency = ({ amount }: FormatCurrencyProps): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  interface FormatDateProps {
    dateString: string
  }

  const formatDate = ({ dateString }: FormatDateProps): string => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy • HH:mm")
    } catch (error) {
      return dateString
    }
  }

  const handleStatusChange = async () => {
    if (!order || newStatus === order.status) return

    setIsUpdating(true)

    try {
      const accessToken = localStorage.getItem("accessToken")

      const response = await apiClient.patch(
        `/order/status/${order.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.data.success) {
        onStatusChange(order.id, newStatus)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        {order ? (
          <>
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center sticky top-0 bg-white z-10 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FiShoppingBag className="mr-2 text-purple-600" />
                  Order #{order.order_number}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{formatDate({ dateString: order.created_at })}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Order["status"])}
                    className="rounded-lg sm:rounded-r-none border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 w-full sm:w-auto"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={handleStatusChange}
                    disabled={isUpdating || newStatus === order.status}
                    className={`rounded-lg sm:rounded-l-none px-4 py-2 text-sm text-white w-full sm:w-auto ${
                      isUpdating || newStatus === order.status ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                  <FiX />
                </button>
              </div>
            </div>

            {/* Main content */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: Order details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status section */}
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Payment</h3>
                    <div className="mt-1">
                      <PaymentBadge status={order.payment_status} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Method</h3>
                    <p className="mt-1 text-sm font-medium text-gray-900 capitalize">
                      {order.payment_method || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Delivery</h3>
                    <p className="mt-1 text-sm font-medium text-gray-900 capitalize">
                      {order.delivery_method || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Order items */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Product
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Price
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Quantity
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map((item) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {item.product_image ? (
                                      <img
                                        src={item.product_image || "/placeholder.svg"}
                                        alt={item.product_name}
                                        className="h-10 w-10 rounded object-cover"
                                      />
                                    ) : (
                                      <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                                        <FiShoppingBag />
                                      </div>
                                    )}
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                                      <div className="text-xs text-gray-500">ID: {item.product_id}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {formatCurrency({ amount: item.discount_price || item.price })}
                                  </div>
                                  {item.discount_price && (
                                    <div className="text-xs text-gray-500 line-through">
                                      {formatCurrency({ amount: item.price })}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {formatCurrency({ amount: item.total })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Subtotal</span>
                      <span className="text-sm font-medium">{formatCurrency({ amount: order.subtotal })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Shipping</span>
                      <span className="text-sm font-medium">{formatCurrency({ amount: order.shipping })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Platform Fee</span>
                      <span className="text-sm font-medium">{formatCurrency({ amount: order.platform_fee })}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-purple-600">{formatCurrency({ amount: order.total })}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Your payout</span>
                        <span>{formatCurrency({ amount: order.payout_amount })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery notes */}
                {order.delivery_notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-800 flex items-center mb-2">
                      <FiInfo className="mr-2" />
                      Delivery Notes
                    </h3>
                    <p className="text-sm text-yellow-700">{order.delivery_notes}</p>
                  </div>
                )}
              </div>

              {/* Right column: Customer information */}
              <div className="space-y-6">
                {/* Customer details */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FiUser className="mr-2 text-purple-600" />
                    Customer
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.buyer_name}</div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiMail className="mr-2" />
                      {order.buyer_email}
                    </div>
                    {order.buyer_phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FiPhone className="mr-2" />
                        {order.buyer_phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping address */}
                {order.buyer_address && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <FiTruck className="mr-2 text-purple-600" />
                      Shipping Address
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{order.buyer_address}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <FiDownload className="mr-2" />
                      Download Invoice
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
                      <FiTruck className="mr-2" />
                      Fulfill Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 flex flex-col items-center justify-center">
            <FiShoppingBag className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">Loading order details...</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

const OrdersManagement = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useMobileDetect()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filters, setFilters] = useState({
    status: "",
    payment_status: "",
    start_date: "",
    end_date: "",
  })

  interface FormatCurrencyProps {
    amount: number
  }

  const formatCurrency = ({ amount }: FormatCurrencyProps): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  interface FormatDateProps {
    dateString: string
  }

  const formatDate = (dateString: string): string => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy")
    } catch (error) {
      return dateString
    }
  }

  const fetchOrders = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken")
    setLoading(true)
    try {
      const response = await apiClient.get("/order/all", {
        params: {
          page: currentPage,
          per_page: perPage,
          ...filters,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        setOrders(response.data.orders)
        setTotalPages(response.data.pagination.last_page)
      } else {
        setError(response.data.message || "Failed to fetch orders")
      }
    } catch (err) {
      setError("Error connecting to the server")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, perPage, filters])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  interface FilterKey {
    key: "status" | "payment_status" | "start_date" | "end_date"
  }

  interface Filters {
    status: string
    payment_status: string
    start_date: string
    end_date: string
  }

  const handleFilterChange = (key: FilterKey["key"], value: string): void => {
    setFilters((prev: Filters) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  interface DateType {
    type: "start" | "end"
  }

  interface FiltersState {
    start_date: string
    end_date: string
    status: string
    payment_status: string
  }

  const handleDateChange = (type: DateType["type"], value: string): void => {
    if (type === "start") {
      setFilters((prev: FiltersState) => ({ ...prev, start_date: value }))
    } else {
      setFilters((prev: FiltersState) => ({ ...prev, end_date: value }))
    }
    setCurrentPage(1)
  }

  interface OrderResponse {
    success: boolean
    order: Order
  }

  const handleViewOrder = async (orderId: string): Promise<void> => {
    const accessToken = localStorage.getItem("accessToken")
    try {
      const response = await apiClient.get<OrderResponse>(`/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (response.data.success) {
        setSelectedOrder(response.data.order)
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
    }
  }

  interface OrderStatusUpdate {
    orderId: string
    newStatus: Order["status"]
  }

  const handleOrderStatusChange = (orderId: string, status: Order["status"]): void => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status } : null))
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex flex-col xs:flex-row xs:items-center space-y-4 xs:space-y-0 xs:space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-500">Status:</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="rounded-lg border border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 w-full xs:w-auto"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-500">Payment:</label>
                  <select
                    value={filters.payment_status}
                    onChange={(e) => handleFilterChange("payment_status", e.target.value)}
                    className="rounded-lg border border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 w-full xs:w-auto"
                  >
                    <option value="">All</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <DateRangePicker
                  startDate={filters.start_date}
                  endDate={filters.end_date}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  setFilters({
                    status: "",
                    payment_status: "",
                    start_date: "",
                    end_date: "",
                  })
                  setCurrentPage(1)
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={fetchOrders}
                className="px-4 py-1.5 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-4">
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <OrderSkeletonLoader key={index} />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p className="text-lg font-medium">Failed to load orders</p>
              <p className="text-sm mt-2">{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
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
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Order
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Payment
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                            <div className="text-xs text-gray-500">{order.items.length} items</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(order.created_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.buyer_name}</div>
                            <div className="text-xs text-gray-500">{order.buyer_email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency({ amount: order.total })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.delivery_method === "pickup" ? "Pickup" : "Delivery"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <PaymentBadge status={order.payment_status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewOrder(order.id)
                              }}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              <FiEye className="h-5 w-5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleOrderStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrdersManagement
