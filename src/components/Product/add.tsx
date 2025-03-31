// eslint-disable-next-line @typescript-eslint/no-explicit-any

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BiArrowToLeft, BiChevronRight, BiImageAdd, BiUpload } from 'react-icons/bi';

const AddProduct = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2'>('step1');
  const [formData, setFormData] = useState({
    name: '',
    main_price: '',
    discount_price: '',
    quantity: '',
    selectedCategory: '',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

    try {
      const response = await axios.get('/api/categories', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMessage('Failed to fetch categories. Please try again later.');
    }
  };

  const validateDiscountPrice = () => {
    return parseFloat(formData.discount_price) >= parseFloat(formData.main_price) && formData.discount_price !== '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (!formData.name || !formData.main_price || !formData.selectedCategory) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    
    if (validateDiscountPrice()) {
      setErrorMessage('Discount price must be lower than main price.');
      return;
    }
    
    setErrorMessage('');
    setCurrentStep('step2');
  };

  const prevStep = () => {
    setCurrentStep('step1');
  };

  const uploadProduct = async () => {
    if (!image) {
      setErrorMessage('Please select an image.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('main_price', formData.main_price);
    formDataObj.append('discount_price', formData.discount_price);
    formDataObj.append('quantity', formData.quantity);
    formDataObj.append('category_id', formData.selectedCategory);
    formDataObj.append('description', formData.description);
    if (image) formDataObj.append('image', image);

    try {
    //   const response = await axios.post('/api/products', formDataObj, {
    //     headers: {
    //       'Authorization': `Bearer ${accessToken}`,
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   });
      
      router.push('/products/upload-success');
    } catch (error) {
      console.error('Error uploading product:', error);
      setErrorMessage('Failed to upload product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-2">
          <motion.div
            className="bg-purple-600 h-2"
            initial={{ width: currentStep === 'step1' ? '50%' : '100%' }}
            animate={{ width: currentStep === 'step1' ? '50%' : '100%' }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {currentStep === 'step1' ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <motion.h3 
                  className="text-2xl font-bold text-gray-800"
                  variants={itemVariants}
                >
                  Add Product
                </motion.h3>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
                  {/* Product Name */}
                  <motion.div variants={itemVariants} className="form-group">
                    <input
                      type="text"
                      id="product-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="Product Name"
                    />
                    {errorMessage && !formData.name && (
                      <p className="mt-1 text-sm text-red-600">Please enter a product name.</p>
                    )}
                  </motion.div>

                  {/* Product Price */}
                  <motion.div variants={itemVariants} className="form-group">
                    <input
                      type="number"
                      id="product-price"
                      name="main_price"
                      value={formData.main_price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="Product Price (No comma)"
                    />
                    {errorMessage && !formData.main_price && (
                      <p className="mt-1 text-sm text-red-600">Please enter a product price.</p>
                    )}
                  </motion.div>

                  {/* Discount Price */}
                  <motion.div variants={itemVariants} className="form-group">
                    <input
                      type="number"
                      id="discount-price"
                      name="discount_price"
                      value={formData.discount_price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="Discount Price (No comma, Optional)"
                    />
                    {validateDiscountPrice() && (
                      <p className="mt-1 text-sm text-red-600">Discount should be lower than the main price.</p>
                    )}
                  </motion.div>

                  {/* Discount Note */}
                  <motion.div 
                    variants={itemVariants}
                    className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-lg"
                  >
                    <p className="font-medium text-purple-800">Note:</p>
                    <p className="text-sm text-purple-600 mt-1">
                      Set a discount price to help our bot negotiate and increase your chances of closing deals faster!
                    </p>
                  </motion.div>

                  {/* Quantity */}
                  <motion.div variants={itemVariants} className="form-group">
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="Quantity (Optional)"
                    />
                  </motion.div>

                  {/* Category */}
                  <motion.div variants={itemVariants} className="form-group">
                    <select
                      id="category"
                      name="selectedCategory"
                      value={formData.selectedCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errorMessage && !formData.selectedCategory && (
                      <p className="mt-1 text-sm text-red-600">Please select a category.</p>
                    )}
                  </motion.div>

                  {/* General Error */}
                  {errorMessage && (
                    <motion.div 
                      variants={itemVariants}
                      className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg"
                    >
                      <p className="text-sm text-red-600">{errorMessage}</p>
                    </motion.div>
                  )}

                  {/* Next Button */}
                  <motion.div variants={itemVariants} className="pt-2">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={validateDiscountPrice()}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                        validateDiscountPrice()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      Next
                      <BiChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center">
                  <button
                    onClick={prevStep}
                    className="p-2 rounded-full hover:bg-purple-50 text-purple-600 transition-colors duration-200"
                  >
                    <BiArrowToLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-2xl font-bold text-gray-800 ml-2">Add Image</h3>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
                  {/* Image Upload */}
                  <motion.div variants={itemVariants} className="flex flex-col items-center">
                    <label className="relative cursor-pointer">
                      <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                      {previewImage ? (
                        <div className="relative group">
                          <img
                            src={previewImage}
                            alt="Product preview"
                            className="w-48 h-48 object-cover rounded-lg border-2 border-purple-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
                            <BiImageAdd className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-48 h-48 border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center hover:bg-purple-50 transition-colors duration-200">
                          <BiImageAdd className="w-10 h-10 text-purple-400" />
                          <p className="mt-2 text-sm text-gray-500">Click to add an image</p>
                        </div>
                      )}
                    </label>
                    {errorMessage && !image && (
                      <p className="mt-2 text-sm text-red-600">Please select an image.</p>
                    )}
                  </motion.div>

                  {/* Description */}
                  <motion.div variants={itemVariants} className="form-group">
                    <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Description (Optional)
                    </label>
                    <textarea
                      id="product-description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 min-h-[120px]"
                      placeholder="Describe your product..."
                    />
                  </motion.div>

                  {/* Upload Button */}
                  <motion.div variants={itemVariants} className="pt-2">
                    <button
                      type="button"
                      onClick={uploadProduct}
                      disabled={isLoading}
                      className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          Upload
                          <BiUpload className="w-5 h-5 ml-1" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;