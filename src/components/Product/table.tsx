"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiShoppingBag,
  FiDownload,
  FiUpload,
  FiRefreshCw,
} from "react-icons/fi"
import apiClient from "../../apiClient"
import type { Product, ProductTableProps } from "./types"
import EditProductForm from "../Product/edit"
import { useRouter } from "next/router"

const ProductTable = ({ products: initialProducts, onRefresh }: ProductTableProps) => {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [selectedProducts, setSelectedProducts] = useState<(string | number)[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null)
  const [showDeleteNotification, setShowDeleteNotification] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "category">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  const actionMenuRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  const categories = Array.from(new Set(products.map(product => product.category?.name))).filter(Boolean)

  
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActionMenuOpen(null)
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (isViewModalOpen && viewProduct) {
        if (e.key === "ArrowLeft") {
          e.preventDefault()
          navigateImages("prev")
        } else if (e.key === "ArrowRight") {
          e.preventDefault()
          navigateImages("next")
        } else if (e.key === "Escape") {
          setIsViewModalOpen(false)
        }
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isViewModalOpen, viewProduct])

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const toggleSelectProduct = (id: string | number, e?: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
    e?.stopPropagation()
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(productId => productId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelectedProducts(selectedProducts.length === currentProducts.length ? [] : currentProducts.map(product => product.id))
  }

  const openDeleteDialog = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
    setActionMenuOpen(null)
  }

  const openBulkDeleteDialog = () => {
    setIsBulkDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    setIsLoading(true)
    const accessToken = localStorage.getItem("accessToken")

    try {
      await apiClient.delete(`/products/${productToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
      setSelectedProducts(prev => prev.filter(id => id !== productToDelete.id))
      
      setShowDeleteNotification(true)
      setTimeout(() => setShowDeleteNotification(false), 4000)
      
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const bulkDeleteProducts = async () => {
    if (selectedProducts.length === 0) return
    
    setIsLoading(true)
    const accessToken = localStorage.getItem("accessToken")
    
    try {
      await Promise.all(
        selectedProducts.map(id => 
          apiClient.delete(`/products/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        )
      )
      
      setSelectedProducts([])
      setIsBulkDeleteDialogOpen(false)
      setShowDeleteNotification(true)
      setTimeout(() => setShowDeleteNotification(false), 4000)
      
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Error bulk deleting products:", error)
      alert("Failed to delete some products. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const openProductView = useCallback((product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setViewProduct(product)
    setCurrentImageIndex(0)
    setIsViewModalOpen(true)
    setActionMenuOpen(null)
  }, [])

  const navigateImages = (direction: "next" | "prev", e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!viewProduct?.image_urls || viewProduct.image_urls.length <= 1) return

    if (direction === "next") {
      setCurrentImageIndex(prev => (prev + 1) % (viewProduct.image_urls?.length || 1))
    } else {
      setCurrentImageIndex(prev => (prev - 1 + (viewProduct.image_urls?.length || 0)) % (viewProduct.image_urls?.length || 1))
    }
  }

  const handleEditProduct = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setProductToEdit(product)
    setIsEditModalOpen(true)
    setActionMenuOpen(null)
  }

  const getStockStatusDisplay = (quantity: number) => {
    if (quantity === 0) {
      return {
        text: "Out of stock",
        color: "text-red-600",
        bgColor: "bg-red-50",
        icon: <FiXCircle className="w-4 h-4 mr-1" />,
      }
    } else if (quantity < 5) {
      return {
        text: `Low stock (${quantity})`,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        icon: <FiAlertCircle className="w-4 h-4 mr-1" />,
      }
    } else {
      return {
        text: `${quantity} in stock`,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        icon: <FiCheckCircle className="w-4 h-4 mr-1" />,
      }
    }
  }

  const formatPrice = (price: number | undefined) => {
    if (!price) return "₦0.00"
    return `₦${Number.parseFloat(price.toString()).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getProductImage = (product: Product, index = 0) => {
    if (!product.image_urls || !Array.isArray(product.image_urls) || product.image_urls.length === 0) {
      return ""
    }
    return product.image_urls[index]
  }

  const toggleActionMenu = (id: number | null, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setActionMenuOpen(actionMenuOpen === id ? null : id)
  }

  const calculateDiscountPercentage = (mainPrice: number, discountPrice: number) => {
    if (!mainPrice || !discountPrice) return 0
    return Math.round(((mainPrice - discountPrice) / mainPrice) * 100)
  }

  const SortIcon = ({ column }: { column: typeof sortBy }) => {
    if (sortBy !== column) return null
    return (
      <span className="ml-1">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    )
  }

  const Pagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{Math.min(endIndex, products.length)}</span> of{" "}
              <span className="font-medium">{products.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                    currentPage === page
                      ? "z-10 bg-purple-50 border-purple-500 text-purple-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Enhanced Header with Search, Filter, and Actions */}
      <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
   
        <div className="flex items-center space-x-3">
          

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <span className="text-sm text-gray-600">
                {selectedProducts.length} selected
              </span>
              <button
                onClick={openBulkDeleteDialog}
                className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg bg-red-50 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                <FiTrash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </motion.div>
          )}

          {/* Refresh Button */}
          {/* <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button> */}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("name")}
              >
                Product <SortIcon column="name" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("price")}
              >
                Price <SortIcon column="price" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("stock")}
              >
                Stock <SortIcon column="stock" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("category")}
              >
                Category <SortIcon column="category" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => {
                const stockStatus = getStockStatusDisplay(product.quantity)

                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => openProductView(product)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => toggleSelectProduct(product.id, e)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 overflow-hidden rounded-lg border border-gray-100">
                          <img
                            className="h-10 w-10 object-contain bg-gray-50"
                            src={getProductImage(product) || "/placeholder.svg"}
                            alt={product.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(product.discount_price || product.main_price)}
                        </div>
                        {product.discount_price && (
                          <div className="flex items-center">
                            <div className="text-xs text-gray-500 line-through mr-2">{formatPrice(product.main_price)}</div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              -{calculateDiscountPercentage(product.main_price, product.discount_price)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}>
                        {stockStatus.icon}
                        <span>{stockStatus.text}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.category?.name ? (
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">Uncategorized</span>
                      )}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => openProductView(product, e)}
                          className="p-1.5 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-full transition-colors"
                          title="View product"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleEditProduct(product, e)}
                          className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit product"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => openDeleteDialog(product, e)}
                          className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete product"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FiShoppingBag className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-1">No products found</p>
                    <p className="text-sm">Try adjusting your search or filter to find what you're looking for.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination />
      </div>

      {/* Enhanced Mobile Card View */}
      <div className="md:hidden space-y-3">
        {currentProducts.length > 0 ? (
          currentProducts.map((product, index) => {
            const stockStatus = getStockStatusDisplay(product.quantity)

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                onClick={() => openProductView(product)}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => toggleSelectProduct(product.id, e)}
                        className="rounded text-purple-600 focus:ring-purple-500 mt-1"
                      />
                    </div>

                    <div className="h-16 w-16 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                      <img
                        className="h-full w-full object-contain"
                        src={getProductImage(product) || "/placeholder.svg"}
                        alt={product.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                          {product.category?.name ? (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                              {product.category.name}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs mt-1 block">Uncategorized</span>
                          )}
                        </div>

                        <div className="flex-shrink-0 ml-2 relative" onClick={(e) => e.stopPropagation()} ref={actionMenuRef}>
                          <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={(e) => toggleActionMenu(product.id as number, e)}
                          >
                            <FiMoreVertical className="text-gray-500 w-4 h-4" />
                          </button>

                          <AnimatePresence>
                            {actionMenuOpen === product.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-1 w-40 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openProductView(product)
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <FiEye className="mr-3 text-purple-500 w-4 h-4" /> 
                                    <span>View Details</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditProduct(product)
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <FiEdit2 className="mr-3 text-blue-500 w-4 h-4" /> 
                                    <span>Edit Product</span>
                                  </button>
                                  <div className="border-t border-gray-100"></div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openDeleteDialog(product)
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <FiTrash2 className="mr-3 w-4 h-4" /> 
                                    <span>Delete Product</span>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatPrice(product.discount_price || product.main_price)}
                            </div>
                            {product.discount_price && (
                              <div className="flex items-center mt-1">
                                <div className="text-xs text-gray-500 line-through mr-2">{formatPrice(product.main_price)}</div>
                                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  -{calculateDiscountPercentage(product.main_price, product.discount_price)}%
                                </span>
                              </div>
                            )}
                          </div>

                          <div className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}>
                            {stockStatus.icon}
                            <span className="hidden sm:inline">{stockStatus.text}</span>
                            <span className="sm:hidden">{product.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <FiShoppingBag className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-1">No products found</p>
              <p className="text-sm">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          </div>
        )}

        {/* Mobile Pagination */}
        <div className="mt-4">
          <Pagination />
        </div>
      </div>

      {/* Enhanced Product View Modal */}
      <AnimatePresence>
        {isViewModalOpen && viewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
                <button 
                  onClick={() => setIsViewModalOpen(false)} 
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row p-6 overflow-y-auto">
                {/* Enhanced Image Gallery */}
                <div className="lg:w-1/2 mb-6 lg:mb-0 lg:pr-6 flex flex-col">
                  <div className="relative bg-gray-50 rounded-xl h-64 md:h-80 lg:h-96 flex items-center justify-center border border-gray-100 overflow-hidden group">
                    {viewProduct.image_urls && viewProduct.image_urls.length > 0 ? (
                      <>
                        <motion.img
                          key={currentImageIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          src={viewProduct.image_urls[currentImageIndex] || "/placeholder.svg"}
                          alt={`${viewProduct.name} - image ${currentImageIndex + 1}`}
                          className="max-h-full max-w-full object-contain p-4"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />

                        {/* Navigation arrows - only show on hover for desktop */}
                        {viewProduct.image_urls.length > 1 && (
                          <>
                            <button
                              onClick={(e) => navigateImages("prev", e)}
                              className="absolute left-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 lg:opacity-100"
                              aria-label="Previous image"
                            >
                              <FiChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => navigateImages("next", e)}
                              className="absolute right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 lg:opacity-100"
                              aria-label="Next image"
                            >
                              <FiChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Image counter */}
                        {viewProduct.image_urls.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {viewProduct.image_urls.length}
                          </div>
                        )}
                      </>
                    ) : (
                      <img
                        src="/placeholder.svg"
                        alt={viewProduct.name}
                        className="max-h-full max-w-full object-contain p-4"
                      />
                    )}
                  </div>

                  {/* Enhanced Thumbnail row */}
                  {viewProduct.image_urls && viewProduct.image_urls.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {viewProduct.image_urls.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentImageIndex(idx)
                          }}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                            idx === currentImageIndex 
                              ? "ring-2 ring-purple-500 ring-offset-2" 
                              : "border border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enhanced Product Details */}
                <div className="lg:w-1/2 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewProduct.name}</h2>
                    
                    <div className="flex items-center space-x-3">
                      {viewProduct.discount_price ? (
                        <>
                          <span className="text-2xl font-bold text-purple-600">
                            {formatPrice(viewProduct.discount_price)}
                          </span>
                          <span className="text-lg line-through text-gray-500">{formatPrice(viewProduct.main_price)}</span>
                          <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            -{calculateDiscountPercentage(viewProduct.main_price, viewProduct.discount_price)}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-purple-600">{formatPrice(viewProduct.main_price)}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-semibold">Category</p>
                      {viewProduct.category?.name ? (
                        <span className="inline-block px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-sm font-medium">
                          {viewProduct.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">Uncategorized</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-semibold">Stock Status</p>
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-lg ${getStockStatusDisplay(viewProduct.quantity).bgColor} ${getStockStatusDisplay(viewProduct.quantity).color}`}>
                        {getStockStatusDisplay(viewProduct.quantity).icon}
                        <span className="ml-1">{getStockStatusDisplay(viewProduct.quantity).text}</span>
                      </div>
                    </div>
                  </div>

                  {viewProduct.description && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-semibold">Description</p>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{viewProduct.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Additional product info */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Product ID</p>
                      <p className="text-sm font-mono text-gray-900">{viewProduct.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Stock Quantity</p>
                      <p className="text-sm font-semibold text-gray-900">{viewProduct.quantity} units</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    handleEditProduct(viewProduct)
                  }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <FiEdit2 className="mr-2 w-4 h-4" /> Edit Product
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Delete Dialog */}
      <AnimatePresence>
        {isDeleteDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <FiAlertCircle className="text-red-600 w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
              </div>

              <div className="px-6 py-4">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete <span className="font-semibold">"{productToDelete?.name}"</span>?
                </p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone and will permanently remove all product data.
                </p>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="mr-2 w-4 h-4" /> Delete Product
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Delete Dialog */}
      <AnimatePresence>
        {isBulkDeleteDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <FiAlertCircle className="text-red-600 w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete Products</h3>
              </div>

              <div className="px-6 py-4">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete <span className="font-semibold">{selectedProducts.length} selected product{selectedProducts.length > 1 ? 's' : ''}</span>?
                </p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone and will permanently remove all selected products and their data.
                </p>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                <button
                  onClick={() => setIsBulkDeleteDialogOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={bulkDeleteProducts}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="mr-2 w-4 h-4" /> Delete All Selected
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && productToEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <EditProductForm
                  product={productToEdit}
                  onClose={() => setIsEditModalOpen(false)}
                  onSave={() => {
                    setIsEditModalOpen(false)
                    if (onRefresh) onRefresh()
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Success Notification */}
      <AnimatePresence>
        {showDeleteNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-4 right-4 bg-white border border-green-200 shadow-lg rounded-lg z-50 max-w-sm"
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">Success!</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedProducts.length > 1 ? `${selectedProducts.length} products` : 'Product'} deleted successfully.
                  </p>
                </div>
                <button 
                  onClick={() => setShowDeleteNotification(false)} 
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State for No Products */}
      {products.length === 0 && !searchTerm && filterCategory === "all" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-10 text-center"
        >
          <div className="flex flex-col items-center justify-center text-gray-500 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No products yet</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Add your first product to get started with inventory management. You can track stock, manage pricing, and organize by categories.
            </p>
            <button 
              onClick={() => router.push('/product/add')} 
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center shadow-sm"
            >
              <FiShoppingBag className="mr-2 w-5 h-5" /> Add Your First Product
            </button>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default ProductTable