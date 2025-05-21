"use client"

import { useState, useCallback, useEffect } from "react"
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

  
  const categories = Array.from(new Set(products.map(product => product.category?.name))).filter(Boolean)


  useEffect(() => {
    let filtered = initialProducts

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterCategory && filterCategory !== "all") {
      filtered = filtered.filter(product => product.category?.name === filterCategory)
    }

    setProducts(filtered)
  }, [searchTerm, filterCategory, initialProducts])

  const toggleSelectProduct = (id: string | number, e?: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
    e?.stopPropagation()
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(productId => productId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelectedProducts(selectedProducts.length === products.length ? [] : products.map(product => product.id))
  }

  const openDeleteDialog = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
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
      setTimeout(() => setShowDeleteNotification(false), 3000)
      
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
      setShowDeleteNotification(true)
      setTimeout(() => setShowDeleteNotification(false), 3000)
      
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

  const closeActionMenu = () => {
    setActionMenuOpen(null)
  }

  useEffect(() => {
    // Close action menu when clicking outside
    const handleClickOutside = () => {
      closeActionMenu()
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  // Calculate discount percentage
  const calculateDiscountPercentage = (mainPrice: number, discountPrice: number) => {
    if (!mainPrice || !discountPrice) return 0
    return Math.round(((mainPrice - discountPrice) / mainPrice) * 100)
  }

  return (
    <>
 
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product, index) => {
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
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
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
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {products.length > 0 ? (
          products.map((product, index) => {
            const stockStatus = getStockStatusDisplay(product.quantity)

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                onClick={() => openProductView(product)}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => toggleSelectProduct(product.id, e)}
                        className="rounded text-purple-600 focus:ring-purple-500 mt-1"
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center">
                        <div className="h-14 w-14 rounded-lg bg-gray-50 border border-gray-100 mr-3 flex-shrink-0 overflow-hidden">
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
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{product.name}</h3>
                          {product.category?.name ? (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                              {product.category.name}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs">Uncategorized</span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(product.discount_price || product.main_price)}
                          </div>
                          {product.discount_price && (
                            <div className="flex items-center">
                              <div className="text-xs text-gray-500 line-through mr-1">{formatPrice(product.main_price)}</div>
                              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded-sm">
                                -{calculateDiscountPercentage(product.main_price, product.discount_price)}%
                              </span>
                            </div>
                          )}
                        </div>

                        <div className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}>
                          {stockStatus.icon}
                          <span>{stockStatus.text}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-2 relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={(e) => toggleActionMenu(product.id as number, e)}
                      >
                        <FiMoreVertical className="text-gray-500" />
                      </button>

                      <AnimatePresence>
                        {actionMenuOpen === product.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-1 w-36 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1 divide-y divide-gray-100">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  closeActionMenu()
                                  openProductView(product)
                                }}
                                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <FiEye className="mr-2 text-purple-500" /> View
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  closeActionMenu()
                                  handleEditProduct(product)
                                }}
                                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <FiEdit2 className="mr-2 text-blue-500" /> Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  closeActionMenu()
                                  openDeleteDialog(product)
                                }}
                                className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50"
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
      </div>

      {/* Product View Modal */}
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
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex flex-col md:flex-row p-6 overflow-y-auto">
                {/* Image Gallery */}
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6 flex flex-col">
                  <div className="relative bg-gray-50 rounded-xl h-64 md:h-80 flex items-center justify-center border border-gray-100 overflow-hidden">
                    {viewProduct.image_urls && viewProduct.image_urls.length > 0 ? (
                      <>
                        <motion.img
                          key={currentImageIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          src={viewProduct.image_urls[currentImageIndex] || "/placeholder.svg"}
                          alt={`${viewProduct.name} - image ${currentImageIndex + 1}`}
                          className="max-h-full max-w-full object-contain p-2"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />

                        {/* Navigation arrows */}
                        {viewProduct.image_urls.length > 1 && (
                          <>
                            <button
                              onClick={(e) => navigateImages("prev", e)}
                              className="absolute left-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                            >
                              <FiChevronLeft />
                            </button>
                            <button
                              onClick={(e) => navigateImages("next", e)}
                              className="absolute right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                            >
                              <FiChevronRight />
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <img
                        src="/placeholder.svg"
                        alt={viewProduct.name}
                        className="max-h-full max-w-full object-contain p-2"
                      />
                    )}
                  </div>

                  {/* Thumbnail row */}
                  {viewProduct.image_urls && viewProduct.image_urls.length > 1 && (
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {viewProduct.image_urls.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentImageIndex(idx)
                          }}
                          className={`w-16 h-16 rounded-lg overflow-hidden ${
                            idx === currentImageIndex ? "ring-2 ring-purple-500" : "border border-gray-200"
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

                {/* Product Details */}
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewProduct.name}</h2>

                  <div className="mb-4">
                    {viewProduct.discount_price ? (
                      <div className="flex items-center">
                        <span className="text-xl font-bold text-purple-600 mr-2">
                          {formatPrice(viewProduct.discount_price)}
                        </span>
                        <span className="text-sm line-through text-gray-500 mr-2">{formatPrice(viewProduct.main_price)}</span>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          -{calculateDiscountPercentage(viewProduct.main_price, viewProduct.discount_price)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-purple-600">{formatPrice(viewProduct.main_price)}</span>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 font-semibold">Category</p>
                    {viewProduct.category?.name ? (
                      <span className="inline-block mt-1 px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-sm font-medium">
                        {viewProduct.category.name}
                      </span>
                    ) : (
                      <p className="text-gray-700">Uncategorized</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 font-semibold">Stock Status</p>
                    <div className={`inline-flex items-center px-3 py-1.5 mt-1 rounded-lg ${getStockStatusDisplay(viewProduct.quantity).bgColor} ${getStockStatusDisplay(viewProduct.quantity).color}`}>
                      {getStockStatusDisplay(viewProduct.quantity).icon}
                      <span>{getStockStatusDisplay(viewProduct.quantity).text}</span>
                    </div>
                  </div>

                  {viewProduct.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 font-semibold mb-1">Description</p>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-gray-700 whitespace-pre-line">{viewProduct.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    handleEditProduct(viewProduct)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FiEdit2 className="mr-1.5" /> Edit Product
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
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
                <FiAlertCircle className="text-red-500 mr-2 flex-shrink-0" />
                <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
              </div>

              <div className="px-6 py-4">
                <p className="text-gray-700">
                  Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
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
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
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
                      <FiTrash2 className="mr-1.5" /> Delete
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
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                  <FiX />
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

      {/* Success Notification */}
      <AnimatePresence>
        {showDeleteNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg z-50 flex items-center"
          >
            <FiCheckCircle className="mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Success!</p>
              <p className="text-sm">Product{selectedProducts.length > 1 ? "s" : ""} deleted successfully.</p>
            </div>
            <button 
              onClick={() => setShowDeleteNotification(false)} 
              className="ml-4 text-green-500 hover:text-green-700"
            >
              <FiX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State for No Products */}
      {products.length === 0 && !searchTerm && filterCategory === "all" && (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <div className="flex flex-col items-center justify-center text-gray-500 max-w-md mx-auto">
            <FiShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6">Add your first product to get started with inventory management.</p>
            <button 
              onClick={() => router.push('/product/add')} 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <FiShoppingBag className="mr-2" /> Add Your First Product
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductTable