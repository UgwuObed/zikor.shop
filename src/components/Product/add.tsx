import { useState, /*useEffect*/ } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BiArrowToLeft, BiChevronRight, BiImageAdd,  BiUpload, BiX, BiLogOut } from 'react-icons/bi';

interface ProductImage {
  file: File;
  preview: string;
  id: string; 
}

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
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessName, setBusinessName] = useState('Your Business');

  // useEffect(() => {
  //   fetchCategories();
  //   fetchBusinessInfo();
  // }, []);

  // const fetchCategories = async () => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   if (!accessToken) {
  //     router.push('/auth/signin');
  //     return;
  //   }

  //   try {
  //     const response = await axios.get('/api/categories', {
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`
  //       }
  //     });
  //     setCategories(response.data.categories);
  //   } catch (error) {
  //     console.error('Error fetching categories:', error);
  //     setErrorMessage('Failed to fetch categories. Please try again later.');
  //   }
  // };

  // const fetchBusinessInfo = async () => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   if (!accessToken) return;

  //   try {
  //     const response = await axios.get('/api/business/profile', {
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`
  //       }
  //     });
  //     setBusinessName(response.data.business?.name || 'Your Business');
  //   } catch (error) {
  //     console.error('Error fetching business info:', error);
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/auth/signin');
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
    if (e.target.files && e.target.files.length > 0) {
      const newImages: ProductImage[] = [];
      
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            newImages.push({
              file,
              preview: event.target.result as string,
              id: Date.now() + Math.random().toString(36).substring(2, 9)
            });
            
            // Only update state after all files are processed
            if (newImages.length === e.target.files!.length) {
              setProductImages(prev => [...prev, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (id: string) => {
    setProductImages(prev => prev.filter(image => image.id !== id));
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
    if (productImages.length === 0) {
      setErrorMessage('Please select at least one image.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    // if (!accessToken) {
    //   router.push('/auth/signin');
    //   return;
    // }

    setIsLoading(true);
    setErrorMessage('');

    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('main_price', formData.main_price);
    formDataObj.append('discount_price', formData.discount_price);
    formDataObj.append('quantity', formData.quantity);
    formDataObj.append('category_id', formData.selectedCategory);
    formDataObj.append('description', formData.description);
    
    // Append all images
    productImages.forEach((image, index) => {
      formDataObj.append(`images[${index}]`, image.file);
    });

    try {
      // const response = await axios.post('/api/products', formDataObj, {
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      
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
      {/* Header with Business Name and Logout */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">{businessName}</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 text-gray-700 transition-colors duration-200"
          >
            <BiLogOut className="w-5 h-5 text-purple-600" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Form container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                          <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name*
                          </label>
                          <input
                            type="text"
                            id="product-name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                            placeholder="Enter product name"
                          />
                          {errorMessage && !formData.name && (
                            <p className="mt-1 text-sm text-red-600">Please enter a product name.</p>
                          )}
                        </motion.div>

                        {/* Price section */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Product Price */}
                          <div className="form-group">
                            <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">
                              Product Price*
                            </label>
                            <input
                              type="number"
                              id="product-price"
                              name="main_price"
                              value={formData.main_price}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              placeholder="No comma"
                            />
                            {errorMessage && !formData.main_price && (
                              <p className="mt-1 text-sm text-red-600">Please enter a product price.</p>
                            )}
                          </div>

                          {/* Discount Price */}
                          <div className="form-group">
                            <label htmlFor="discount-price" className="block text-sm font-medium text-gray-700 mb-1">
                              Discount Price (Optional)
                            </label>
                            <input
                              type="number"
                              id="discount-price"
                              name="discount_price"
                              value={formData.discount_price}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              placeholder="No comma"
                            />
                            {validateDiscountPrice() && (
                              <p className="mt-1 text-sm text-red-600">Discount should be lower than the main price.</p>
                            )}
                          </div>
                        </motion.div>

                        {/* Discount Note */}
                        <motion.div 
                          variants={itemVariants}
                          className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-lg"
                        >
                          <p className="font-medium text-purple-800">Note:</p>
                          <p className="text-sm text-purple-600 mt-1">
                            You can set a discount price if you're running a promo, but it is optional!
                          </p>
                        </motion.div>

                        {/* Quantity and Category row */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Quantity */}
                          <div className="form-group">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                              Quantity (Optional)
                            </label>
                            <input
                              type="number"
                              id="quantity"
                              name="quantity"
                              value={formData.quantity}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              placeholder="Available quantity"
                            />
                          </div>

                          {/* Category */}
                          <div className="form-group">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                              Category*
                            </label>
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
                          </div>
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
                        <h3 className="text-2xl font-bold text-gray-800 ml-2">Add Product Images</h3>
                      </div>

                      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
                        {/* Multiple Image Upload */}
                        <motion.div variants={itemVariants} className="space-y-4">
                          <div className="flex flex-wrap gap-4">
                            {/* Image previews */}
                            {productImages.map((image) => (
                              <div 
                                key={image.id} 
                                className="relative group w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden"
                              >
                                <img 
                                  src={image.preview} 
                                  alt="Product preview" 
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => removeImage(image.id)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                  <BiX className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            
                            {/* Add more images button */}
                            <label className="flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors duration-200">
                              <input
                                type="file"
                                id="images"
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                                multiple
                              />
                              <BiImageAdd className="w-8 h-8 text-purple-400" />
                              <p className="mt-1 text-xs text-center text-gray-500">Add Image</p>
                            </label>
                          </div>
                          {errorMessage && productImages.length === 0 && (
                            <p className="text-sm text-red-600">Please select at least one image.</p>
                          )}
                          <p className="text-sm text-gray-500">Upload multiple product images. The first image will be used as the main product image.</p>
                        </motion.div>

                        {/* Upload Button */}
                        <motion.div variants={itemVariants} className="pt-4">
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
                                Upload Product
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
          
          {/* Right side - Preview/Info panel */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Product Preview</h3>
              
              {currentStep === 'step1' ? (
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <BiImageAdd className="w-12 h-12 text-gray-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-lg">
                      {formData.name || "Product Name"}
                    </h4>
                    
                    <div className="flex items-center">
                      {formData.discount_price ? (
                        <>
                          <span className="text-purple-600 font-bold">₦{formData.discount_price}</span>
                          <span className="ml-2 text-gray-500 line-through text-sm">₦{formData.main_price}</span>
                        </>
                      ) : (
                        <span className="text-purple-600 font-bold">
                          ₦{formData.main_price || "0.00"}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm">
                      {formData.description || "No description added yet."}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Tips:</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start text-sm text-gray-600">
                        <span className="text-purple-500 mr-2">•</span>
                        Use clear, descriptive product names
                      </li>
                      <li className="flex items-start text-sm text-gray-600">
                        <span className="text-purple-500 mr-2">•</span>
                        Set competitive pricing
                      </li>
                      <li className="flex items-start text-sm text-gray-600">
                        <span className="text-purple-500 mr-2">•</span>
                        Add detailed descriptions to improve sales
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {productImages.length > 0 ? (
                      <>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={productImages[0].preview} 
                            alt="Main product" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2, 3].map((index) => (
                            <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              {productImages[index] ? (
                                <img 
                                  src={productImages[index].preview} 
                                  alt={`Product view ${index}`} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BiImageAdd className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <BiImageAdd className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2, 3].map((index) => (
                            <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                              <BiImageAdd className="w-6 h-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="pt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Image Tips:</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start text-sm text-gray-600">
                        <span className="text-purple-500 mr-2">•</span>
                        Use high-quality, well-lit images
                      </li>
                      <li className="flex items-start text-sm text-gray-600">
                        <span className="text-purple-500 mr-2">•</span>
                        Show product from multiple angles
                      </li>
                      <li className="flex items-start text-sm text-gray-600">
                        <span className="text-purple-500 mr-2">•</span>
                        First image will be the main product display
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;