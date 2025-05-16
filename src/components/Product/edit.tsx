"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FiTrash2, FiUpload, FiSave } from "react-icons/fi"
import apiClient from "../../apiClient"
import type { Product, Category } from "../../types/product"

interface EditProductFormProps {
  product: Product
  onClose: () => void
  onSave: () => void
}

export default function EditProductForm({ product, onClose, onSave }: EditProductFormProps) {
  const [formData, setFormData] = useState({
    name: product.name || "",
    main_price: product.main_price || 0,
    discount_price: product.discount_price || "",
    quantity: product.quantity || 0,
    description: product.description || "",
    category_id: product.category?.id || "",
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>(product.image_urls || [])
  const [newImages, setNewImages] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await apiClient.get("/categories", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setCategories(response.data.categories)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setNewImages((prev) => [...prev, ...filesArray])
    }
  }

  const removeExistingImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (formData.main_price <= 0) {
      newErrors.main_price = "Price must be greater than zero"
    }

    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative"
    }

    if (formData.discount_price && Number(formData.discount_price) >= formData.main_price) {
      newErrors.discount_price = "Discount price must be less than main price"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    let uploadedImageUrls: string[] = [];

    try {
        if (newImages.length > 0) {
            const formData = new FormData();
            newImages.forEach((file) => formData.append("image", file)); 

            const uploadResponse = await apiClient.post("/upload", formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            uploadedImageUrls = uploadResponse.data.urls || (Array.isArray(uploadResponse.data) ? uploadResponse.data : [uploadResponse.data.url]).filter(Boolean); // Adjust based on your backend response
        }

        const productData = {
            ...formData,
            image: JSON.stringify([...images, ...uploadedImageUrls]), 
        };

        await apiClient.patch(`/products/${product.id}`, productData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        onSave();
    } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product. Please try again.");
    } finally {
        setIsLoading(false);
    }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="main_price" className="block text-sm font-medium text-gray-700">
            Main Price*
          </label>
          <input
            type="number"
            id="main_price"
            name="main_price"
            value={formData.main_price}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${
              errors.main_price ? "border-red-500" : ""
            }`}
          />
          {errors.main_price && <p className="mt-1 text-sm text-red-600">{errors.main_price}</p>}
        </div>

        <div>
          <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700">
            Discount Price (Optional)
          </label>
          <input
            type="number"
            id="discount_price"
            name="discount_price"
            value={formData.discount_price}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${
              errors.discount_price ? "border-red-500" : ""
            }`}
          />
          {errors.discount_price && <p className="mt-1 text-sm text-red-600">{errors.discount_price}</p>}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity*
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${
              errors.quantity ? "border-red-500" : ""
            }`}
          />
          {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>

        {/* Existing images */}
        {images.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Current Images</p>
            <div className="flex flex-wrap gap-4">
              {images.map((url, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Product image ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = ""
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="text-white p-1 hover:text-red-400"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New images preview */}
        {newImages.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">New Images</p>
            <div className="flex flex-wrap gap-4">
              {newImages.map((file, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`New image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="text-white p-1 hover:text-red-400"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload button */}
        <div className="mt-2">
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <FiUpload className="mr-2 -ml-1 h-5 w-5" />
            Upload Images
          </label>
          <input
            id="image-upload"
            name="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="sr-only"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          disabled={isLoading}
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
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <FiSave className="mr-2 -ml-1" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  )
}


