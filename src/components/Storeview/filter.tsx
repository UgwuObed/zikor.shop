import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface FilterOptions {
  categories: number[];
  priceRange: {
    min: number;
    max: number;
  };
  inStock: boolean;
}

interface ProductFilterProps {
  categories: Category[];
  minPrice: number;
  maxPrice: number;
  onFilterChange: (filters: FilterOptions) => void;
  themeColor: string;
  mobileView?: boolean;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  minPrice,
  maxPrice,
  onFilterChange,
  themeColor,
  mobileView = false
}) => {
  const [isOpen, setIsOpen] = useState(!mobileView);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [rangeMin, setRangeMin] = useState(minPrice);
  const [rangeMax, setRangeMax] = useState(maxPrice);

  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      priceRange: {
        min: priceRange.min,
        max: priceRange.max
      },
      inStock: inStockOnly
    });
  }, [selectedCategories, priceRange, inStockOnly, onFilterChange]);

  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    if (type === 'min') {
      setRangeMin(numValue);
      if (numValue <= priceRange.max) {
        setPriceRange({ ...priceRange, min: numValue });
      }
    } else {
      setRangeMax(numValue);
      if (numValue >= priceRange.min) {
        setPriceRange({ ...priceRange, max: numValue });
      }
    }
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: minPrice, max: maxPrice });
    setRangeMin(minPrice);
    setRangeMax(maxPrice);
    setInStockOnly(false);
  };

  const formatPrice = (price: number) => `₦${price.toFixed(2)}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Header */}
      <div 
        className="px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Filter size={18} className="mr-2" />
          <h3 className="font-medium">Filter Products</h3>
        </div>
        <button>
          {isOpen ? 
            <ChevronUp size={18} /> : 
            <ChevronDown size={18} />
          }
        </button>
      </div>
      
      {/* Filter Body */}
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4"
        >
          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Categories</h4>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="mr-2 h-4 w-4 rounded cursor-pointer"
                    style={{ accentColor: themeColor }}
                  />
                  <label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Price Range</h4>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Min</label>
                <input 
                  type="number" 
                  value={rangeMin}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  min={minPrice}
                  max={maxPrice}
                />
              </div>
              <div className="text-gray-400">-</div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Max</label>
                <input 
                  type="number" 
                  value={rangeMax}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  min={minPrice}
                  max={maxPrice}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-xs text-gray-500">
                <span>{formatPrice(minPrice)}</span>
                <span>{formatPrice(maxPrice)}</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-full rounded-full"
                  style={{ 
                    left: `${((priceRange.min - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    right: `${100 - ((priceRange.max - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    backgroundColor: themeColor
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Availability */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Availability</h4>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="in-stock"
                checked={inStockOnly}
                onChange={() => setInStockOnly(!inStockOnly)}
                className="mr-2 h-4 w-4 rounded cursor-pointer"
                style={{ accentColor: themeColor }}
              />
              <label htmlFor="in-stock" className="text-sm cursor-pointer">
                In Stock Only
              </label>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-2">
            <button 
              onClick={resetFilters}
              className="px-3 py-2 text-sm flex items-center bg-gray-100 hover:bg-gray-200 rounded"
            >
              <X size={14} className="mr-1" />
              Reset Filters
            </button>
            
            {selectedCategories.length > 0 || inStockOnly || 
             priceRange.min > minPrice || priceRange.max < maxPrice ? (
              <div 
                className="px-3 py-2 text-xs rounded-full text-white"
                style={{ backgroundColor: themeColor }}
              >
                {selectedCategories.length + (inStockOnly ? 1 : 0) + 
                 ((priceRange.min > minPrice || priceRange.max < maxPrice) ? 1 : 0)} 
                filters applied
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductFilter;