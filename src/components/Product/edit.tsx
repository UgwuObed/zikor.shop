"use client"

import React, { useState, useEffect } from "react"
import { FiX, FiUpload } from "react-icons/fi"
import apiClient from "../../apiClient"
import type { Product } from "./types"


interface EditProductFormProps {
  product: Product
  onClose: () => void
  onSave: () => void
}

// Export the component as a named export with proper typing
const EditProductForm: React.FC<EditProductFormProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    main_price: product.main_price || 0,
    discount_price: product.discount_price || 0,
    quantity: product.quantity || 0,
    category_id: product.category?.id || "",
    image: product.image || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<{id: string | number, name: string}[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [currentImages, setCurrentImages] = useState<string[]>(product.image_urls || [])


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await apiClient.get("/categories", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setCategories(response.data.data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setImageFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeCurrentImage = (index: number) => {
    setCurrentImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const accessToken = localStorage.getItem("accessToken")
      
      // Create form data for submission
      const submitData = new FormData()
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          submitData.append(key, value.toString())
        }
      })
      
      // Add current images
      submitData.append('current_images', JSON.stringify(currentImages))
      
      // Add new images
      imageFiles.forEach((file) => {
        submitData.append('images[]', file)
      })

      // Send update request
      await apiClient.put(`/products/${product.id}`, submitData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      onSave()
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Failed to update product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Pricing */}
        <div>
          <label htmlFor="main_price" className="block text-sm font-medium text-gray-700 mb-1">
            Regular Price (₦) *
          </label>
          <input
            type="number"
            id="main_price"
            name="main_price"
            value={formData.main_price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700 mb-1">
            Discount Price (₦)
          </label>
          <input
            type="number"
            id="discount_price"
            name="discount_price"
            value={formData.discount_price || ""}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Inventory */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity in Stock *
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Current Images */}
        {currentImages.length > 0 && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
            <div className="flex flex-wrap gap-4">
              {currentImages.map((url, index) => (
                <div key={`current-${index}`} className="relative w-24 h-24 border rounded-md">
                  <img
                    src={url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeCurrentImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Upload */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images</label>
          <div className="flex items-center">
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
            >
              <FiUpload className="mr-2" />
              Choose Images
            </label>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Preview new images */}
          {imageFiles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {imageFiles.map((file, index) => (
                <div key={`new-${index}`} className="relative w-24 h-24 border rounded-md">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New upload ${index + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
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
              Saving...
            </>
          ) : (
            <>Save Changes</>
          )}
        </button>
      </div>
    </form>
  )
}

export default EditProductForm