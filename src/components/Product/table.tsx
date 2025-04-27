"use client"

import { motion } from "framer-motion"
import { FiEdit2, FiTrash2, FiEye, FiMoreVertical, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi"
import { useState } from "react"
import { useRouter } from "next/router"
import apiClient from "../../apiClient"
import type { Product, ProductTableProps } from "./types"

const ProductTable = ({ products, onRefresh }: ProductTableProps) => {
  const router = useRouter()
  const [selectedProducts, setSelectedProducts] = useState<(string | number)[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const toggleSelectProduct = (id: string | number) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map((product) => product.id))
    }
  }

  const openDeleteDialog = (product: Product) => {
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

      // Remove from selected products if present
      setSelectedProducts((prev) => prev.filter((id) => id !== productToDelete.id))

      // Refresh the product list
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewProduct = (product: Product) => {
    router.push(`/dashboard/products/${product.id}`)
  }

  const handleEditProduct = (product: Product) => {
    router.push(`/dashboard/products/edit/${product.id}`)
  }

  const getStockStatusDisplay = (quantity: number) => {
    if (quantity === 0) {
      return {
        text: "Out of stock",
        color: "text-red-600",
        icon: <FiXCircle className="w-4 h-4 mr-1" />,
      }
    } else if (quantity < 5) {
      return {
        text: `Low stock (${quantity})`,
        color: "text-orange-500",
        icon: <FiAlertCircle className="w-4 h-4 mr-1" />,
      }
    } else {
      return {
        text: `${quantity} in stock`,
        color: "text-green-600",
        icon: <FiCheckCircle className="w-4 h-4 mr-1" />,
      }
    }
  }

  const formatPrice = (price: number | undefined) => {
    if (!price) return "₦0.00"
    return `₦${Number.parseFloat(price.toString()).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
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
            {products.map((product, index) => {
              const stockStatus = getStockStatusDisplay(product.quantity)

              return (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded object-contain bg-gray-100"
                          src={product.image_urls && product.image_urls[0]}
                          alt={product.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder-product.jpg"
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
                        <div className="text-xs text-gray-500 line-through">{formatPrice(product.main_price)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${stockStatus.color}`}>
                      {stockStatus.icon}
                      <span>{stockStatus.text}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.category?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <FiEye />
                      </button>
                      <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-900">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => openDeleteDialog(product)} className="text-red-600 hover:text-red-900">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {products.map((product, index) => {
          const stockStatus = getStockStatusDisplay(product.quantity)

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border-b border-gray-200 p-4"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleSelectProduct(product.id)}
                    className="rounded text-purple-600 focus:ring-purple-500 mt-1"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded bg-gray-100 mr-3 flex-shrink-0">
                      <img
                        className="h-full w-full rounded object-contain"
                        src={product.image_urls && product.image_urls[0]}
                        alt={product.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder-product.jpg"
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category?.name}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(product.discount_price || product.main_price)}
                      </div>
                      {product.discount_price && (
                        <div className="text-xs text-gray-500 line-through">{formatPrice(product.main_price)}</div>
                      )}
                    </div>

                    <div className={`flex items-center text-xs ${stockStatus.color}`}>
                      {stockStatus.icon}
                      <span>{stockStatus.text}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-2 relative">
                  <button className="p-1" onClick={() => setProductToDelete(product)}>
                    <FiMoreVertical className="text-gray-500" />
                  </button>

                  {productToDelete?.id === product.id && (
                    <div className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiEye className="mr-2" /> View
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiEdit2 className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => openDeleteDialog(product)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <FiTrash2 className="mr-2" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
            </div>

            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
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
                  <>Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductTable
