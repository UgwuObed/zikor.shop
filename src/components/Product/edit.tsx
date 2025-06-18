"use client"

import React, { useState, useEffect } from "react"
import { FiX, FiUpload, FiDollarSign, FiPackage, FiTag, FiAlignLeft, FiImage } from "react-icons/fi"
import apiClient from "../../apiClient"
import type { Product } from "./types"

interface EditProductFormProps {
  product: Product
  onClose: () => void
  onSave: () => void
}

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
  const [activeTab, setActiveTab] = useState('basic')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await apiClient.get("/categories", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setCategories(response.data.categories || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = "Product name is required"
    }
    
    if (formData.main_price <= 0) {
      errors.main_price = "Price must be greater than 0"
    }
    
    if (formData.discount_price && formData.discount_price >= formData.main_price) {
      errors.discount_price = "Discount price must be less than regular price"
    }
    
    if (formData.quantity < 0) {
      errors.quantity = "Quantity cannot be negative"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target
  
  let processedValue: string | number = value
  
  if (name === 'main_price' || name === 'discount_price' || name === 'quantity') {
    processedValue = value === '' ? '' : Number(value)
  }
  
  setFormData((prev) => ({ ...prev, [name]: processedValue }))
  
  if (formErrors[name]) {
    setFormErrors(prev => ({ ...prev, [name]: "" }))
  }
}

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const newFiles = Array.from(e.target.files)
    setImageFiles((prev) => {
      const updated = [...prev, ...newFiles]
      return updated
    })
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
  
  if (!validateForm()) {
    return
  }
  
  setIsLoading(true)

  try {
    const accessToken = localStorage.getItem("accessToken")
    
   
    const { image, ...rawUpdateData } = formData
    

    const updateData = {
      ...rawUpdateData,
    
      discount_price: rawUpdateData.discount_price && rawUpdateData.discount_price > 0 
        ? rawUpdateData.discount_price 
        : null,
    
      main_price: Number(rawUpdateData.main_price),
      quantity: Number(rawUpdateData.quantity),
   
      category_id: rawUpdateData.category_id || null
    }
    
    await apiClient.patch(`/products/${product.id}`, updateData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    
    const hasNewImages = imageFiles.length > 0
    const hasRemovedImages = currentImages.length !== (product.image_urls?.length || 0)
    
    if (hasRemovedImages) {
      const imagesToRemove = (product.image_urls || []).filter(
        (url: string) => !currentImages.includes(url)
      )
      
      if (imagesToRemove.length > 0) {
        await apiClient.delete(`/products/${product.id}/images/remove`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          data: {
            image_urls: imagesToRemove
          }
        })
      }
    }
    
    if (hasNewImages) {
      const formData = new FormData()
      
      imageFiles.forEach((file) => {
        formData.append('images[]', file)
      })
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://prod.zikor.shop/api'}/products/${product.id}/images/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add images')
      }
      
      const result = await response.json()
    }
    
    onSave()
    
  } catch (error: any) {
    console.error("Update error:", error)
    
    if (error.response?.data?.error) {
      const errorMessages = Object.values(error.response.data.error).flat()
      alert(`Failed to update product: ${errorMessages.join(', ')}`)
    } else {
      alert(error.message || "Failed to update product. Please try again.")
    }
  } finally {
    setIsLoading(false)
  }
}


const handleReplaceAllImages = async () => {
  if (imageFiles.length === 0) return
  
  try {
    const accessToken = localStorage.getItem("accessToken")
    const formData = new FormData()
    
    imageFiles.forEach((file) => {
      formData.append('images[]', file)
    })
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://prod.zikor.shop/api'}/products/${product.id}/images/replace`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Failed to replace images')
    }
    
    const result = await response.json()
     
    setImageFiles([])
    setCurrentImages(result.new_images)
    
  } catch (error) {
    console.error('Replace images error:', error)
    alert('Failed to replace images')
  }
}

  const calculateSavings = () => {
    if (formData.discount_price && formData.main_price > formData.discount_price) {
      const savings = formData.main_price - formData.discount_price;
      const percentage = (savings / formData.main_price) * 100;
      return Math.round(percentage);
    }
    return 0;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <div className={`relative rounded-md shadow-sm ${formErrors.name ? 'ring-2 ring-red-500' : ''}`}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiTag className="text-gray-400" />
                </div>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FiAlignLeft className="text-gray-400" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        );
      
      case 'pricing':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="main_price" className="block text-sm font-medium text-gray-700 mb-1">
                Regular Price (₦) *
              </label>
                <div className={`relative rounded-md shadow-sm ${formErrors.main_price ? 'ring-2 ring-red-500' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">₦</span>
                </div>
                <input
                  type="number"
                  id="main_price"
                  name="main_price"
                  value={formData.main_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                </div>
              {formErrors.main_price && <p className="mt-1 text-sm text-red-600">{formErrors.main_price}</p>}
            </div>

            <div>
              <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Price (₦)
              </label>
              <div className={`relative rounded-md shadow-sm ${formErrors.discount_price ? 'ring-2 ring-red-500' : ''}`}>
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">₦</span>
                </div>
                <input
                  type="number"
                  id="discount_price"
                  name="discount_price"
                  value={formData.discount_price || ""}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {formErrors.discount_price && <p className="mt-1 text-sm text-red-600">{formErrors.discount_price}</p>}
              
              {formData.discount_price > 0 && formData.discount_price < formData.main_price && (
                <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md text-sm">
                  Customer saves {calculateSavings()}% (₦{(formData.main_price - formData.discount_price).toFixed(2)})
                </div>
              )}
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity in Stock *
              </label>
              <div className={`relative rounded-md shadow-sm ${formErrors.quantity ? 'ring-2 ring-red-500' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPackage className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {formErrors.quantity && <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>}
            </div>
          </div>
        );
      
      case 'images':
        return (
          <div className="space-y-6">
            {/* Current Images */}
            {currentImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Current Images</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {currentImages.map((url, index) => (
                    <div key={`current-${index}`} className="relative bg-gray-50 rounded-lg overflow-hidden group h-32">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => removeCurrentImage(index)}
                          className="bg-red-500 text-white rounded-full p-2 transform hover:scale-110 transition-transform"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Add New Images</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Upload button */}
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-400 transition-colors"
                >
                  <FiImage size={24} />
                  <span className="mt-2 text-sm text-center px-2">Upload Images</span>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                
                {/* Preview new images */}
                {imageFiles.map((file, index) => (
                  <div key={`new-${index}`} className="relative bg-gray-50 rounded-lg overflow-hidden group h-32">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New upload ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-red-500 text-white rounded-full p-2 transform hover:scale-110 transition-transform"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="mt-2 text-xs text-gray-500">
                Click on the upload box to add product images. You can upload multiple images.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-2 md:p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Tab Navigation */}
        <div className="mb-6 border-b flex overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-3 whitespace-nowrap font-medium text-sm mr-4 border-b-2 transition-colors ${
              activeTab === 'basic' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Basic Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-3 whitespace-nowrap font-medium text-sm mr-4 border-b-2 transition-colors ${
              activeTab === 'pricing' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pricing & Stock
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-4 py-3 whitespace-nowrap font-medium text-sm mr-4 border-b-2 transition-colors ${
              activeTab === 'images' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Images
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-2">
          {renderTabContent()}
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center disabled:opacity-70"
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
    </div>
  )
}

export default EditProductForm