import { motion } from 'framer-motion';
import { Eye, Edit2, Check } from 'lucide-react';

interface ProductsGridProps {
  filteredProducts: any[];
  selectedProducts: string[];
  toggleProductSelection: (id: string) => void;
  formatPrice: (price: number) => string;
  getStockStatus: (quantity: number) => any;
  openProductView: (product: any) => void;
  openProductEdit: (product: any) => void;
}

const ProductsGrid = ({ 
  filteredProducts, selectedProducts, toggleProductSelection,
  formatPrice, getStockStatus, openProductView, openProductEdit 
}: ProductsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product, index) => {
        const stockStatus = getStockStatus(product.quantity);
        const isSelected = selectedProducts.includes(product.id.toString());
        
        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
              isSelected ? 'border-purple-300 bg-purple-50' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => toggleProductSelection(product.id.toString())}
          >
            <div className="p-5">
              {/* Product Image */}
              <div className="relative mb-4">
                <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                  <img
                    src={product.image_urls?.[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-contain p-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                {/* Selection indicator */}
                <div className={`absolute top-3 left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'bg-white border-gray-300 hover:border-purple-400'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>

                {/* Discount badge */}
                {product.discount_price && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    -{Math.round(((product.main_price - product.discount_price) / product.main_price) * 100)}%
                  </div>
                )}

                {/* Stock status */}
                <div className="absolute bottom-3 left-3">
                  <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${stockStatus.color}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${stockStatus.dot}`}></div>
                    {stockStatus.label}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  {product.category?.name && (
                    <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      {product.category.name}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.discount_price || product.main_price)}
                    </span>
                    {product.discount_price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.main_price)}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Stock</div>
                    <div className="font-semibold text-gray-900">{product.quantity}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openProductView(product);
                    }}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openProductEdit(product);
                    }}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4 mr-1.5" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProductsGrid;