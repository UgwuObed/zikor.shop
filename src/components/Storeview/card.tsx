import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, ChevronRight, Tag, Star } from 'lucide-react';

interface Product {
  id: number;
  name?: string | null;
  description?: string | null;
  main_price?: string | null;
  discount_price?: string | null;
  quantity?: number | null;
  image_urls?: string[] | null;
  category?: {
    name?: string | null;
  };
  rating?: number;
  features?: string[];
  is_featured?: boolean;
  is_new?: boolean;
}

interface ProductCardProps {
  product: Product;
  isActive: boolean;
  onClick: () => void;
  onAddToCart: (productId: number) => void;
  themeColor: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isActive,
  onClick,
  onAddToCart,
  themeColor
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const discountPercentage = product.main_price && product.discount_price
    ? Math.round(((Number(product.main_price) - Number(product.discount_price)) / Number(product.main_price)) * 100)
    : 0;
  
  const hasDiscount = discountPercentage > 0;
  const isInStock = (product.quantity ?? 0) > 0;
  const hasMultipleImages = product.image_urls && product.image_urls.length > 1;
  
  const nextImage = () => {
    if (!product.image_urls || product.image_urls.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % product.image_urls!.length);
  };
  
  const prevImage = () => {
    if (!product.image_urls || product.image_urls.length <= 1) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.image_urls!.length - 1 : prev - 1
    );
  };
  
  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.id);
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow cursor-pointer ${
        isActive ? 'ring-2' : ''
      }`}
      style={{ 
        outlineColor: isActive ? themeColor : 'transparent',
        boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : undefined
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Product Image */}
      <div className="relative h-40 sm:h-48 bg-gray-100">
        {/* Image */}
        {product.image_urls?.[currentImageIndex] ? (
          <img
            src={product.image_urls[currentImageIndex]}
            alt={product.name || 'Product image'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        {/* Image Navigation */}
        {hasMultipleImages && isHovered && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1"
            >
              <ChevronRight size={16} className="transform rotate-180" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
        
        {/* Image Indicators */}
        {hasMultipleImages && product.image_urls && product.image_urls.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <div className="flex space-x-1">
              {product.image_urls.map((_, idx) => (
                <div
                  key={idx}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: currentImageIndex === idx ? themeColor : 'rgba(255, 255, 255, 0.7)'
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-colors"
          style={{ color: isFavorite ? 'red' : 'gray' }}
          aria-label="Add to favorites"
        >
          <Heart
            size={16}
            fill={isFavorite ? 'red' : 'none'}
          />
        </button>
        
        {/* Product Tags */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {hasDiscount && (
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded text-white flex items-center"
              style={{ backgroundColor: '#e53e3e' }}
            >
              <Tag size={12} className="mr-1" />
              {discountPercentage}% OFF
            </span>
          )}
          
          {product.is_new && (
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: themeColor }}
            >
              NEW
            </span>
          )}
          
          {product.is_featured && (
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded bg-amber-500 text-white"
            >
              FEATURED
            </span>
          )}
          
          {!isInStock && (
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded bg-gray-500 text-white"
            >
              OUT OF STOCK
            </span>
          )}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900">
            {truncateText(product.name, 40)}
          </h3>
        </div>
        
        {/* Category */}
        <div className="text-xs text-gray-500 mb-2">
          {product?.category?.name || 'Uncategorized'}
        </div>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={star <= product.rating! ? 'text-amber-400' : 'text-gray-300'}
                  fill={star <= product.rating! ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">{product.rating.toFixed(1)}</span>
          </div>
        )}
        
        {/* Description */}
        <p className="text-sm text-gray-500 mb-3">
          {truncateText(product.description, 60)}
        </p>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-gray-900">
              ₦{product.discount_price || '0.00'}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-500 line-through ml-2">
                ₦{product.main_price || '0.00'}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`p-2 rounded-full ${!isInStock ? 'bg-gray-200 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: isInStock ? `${themeColor}15` : undefined }}
            aria-label="Add to cart"
          >
            <ShoppingCart 
              size={18} 
              style={{ color: isInStock ? themeColor : 'gray' }} 
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;