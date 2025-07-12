import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2 } from 'lucide-react';
import EditProductForm from "../edit";

interface ProductModalsProps {
  isViewModalOpen: boolean;
  setIsViewModalOpen: (open: boolean) => void;
  viewProduct: any;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  editProduct: any;
  openProductEdit: (product: any) => void;
  formatPrice: (price: number) => string;
  getStockStatus: (quantity: number) => any;
}

const ProductModals = ({
  isViewModalOpen, setIsViewModalOpen, viewProduct,
  isEditModalOpen, setIsEditModalOpen, editProduct,
  openProductEdit, formatPrice, getStockStatus
}: ProductModalsProps) => {
  return (
    <>
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
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row p-6 overflow-y-auto">
                {/* Product Image */}
                <div className="lg:w-1/2 mb-6 lg:mb-0 lg:pr-6">
                  <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                    <img
                      src={viewProduct.image_urls?.[0] || '/placeholder.svg'}
                      alt={viewProduct.name}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>

                {/* Product Details */}
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
                            -{Math.round(((viewProduct.main_price - viewProduct.discount_price) / viewProduct.main_price) * 100)}% OFF
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
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-lg ${getStockStatus(viewProduct.quantity).color}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${getStockStatus(viewProduct.quantity).dot}`}></div>
                        <span className="ml-1">{getStockStatus(viewProduct.quantity).label}</span>
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
                    setIsViewModalOpen(false);
                    openProductEdit(viewProduct);
                  }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Edit2 className="mr-2 w-4 h-4" /> Edit Product
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

      {/* Product Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && editProduct && (
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
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <EditProductForm
                  product={editProduct}
                  onClose={() => setIsEditModalOpen(false)}
                  onSave={() => {
                    setIsEditModalOpen(false)
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductModals;