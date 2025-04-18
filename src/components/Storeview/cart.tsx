import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as CartIcon, X, Plus, Minus, CreditCard } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  main_price: string;
  discount_price: string;
  quantity: number;
  image_urls: string[];
}

interface CartItem {
  id: number;
  quantity: number;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  themeColor: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  isOpen,
  onClose,
  cartItems,
  products,
  onUpdateQuantity,
  onRemoveItem,
  themeColor
}) => {
  const [productsInCart, setProductsInCart] = useState<(Product & { cartQuantity: number })[]>([]);
  
  useEffect(() => {
    const itemsWithDetails = cartItems.map(item => {
      const productDetails = products.find(p => p.id === item.id);
      if (!productDetails) return null;
      
      return {
        ...productDetails,
        cartQuantity: item.quantity
      };
    }).filter(Boolean) as (Product & { cartQuantity: number })[];
    
    setProductsInCart(itemsWithDetails);
  }, [cartItems, products]);
  
  const subtotal = productsInCart.reduce(
    (total, item) => total + (Number(item.discount_price) * item.cartQuantity), 
    0
  );
  
  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;
  
  const formatPrice = (price: number) => `₦${price.toFixed(2)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <div className="flex items-center">
                <CartIcon size={20} className="mr-2" />
                <h2 className="font-bold text-lg">Your Cart</h2>
                {cartItems.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs rounded-full text-white"
                        style={{ backgroundColor: themeColor }}>
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {productsInCart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <CartIcon size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-700 font-medium">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm mt-2">Looks like you haven't added any products to your cart yet.</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 px-4 py-2 rounded text-sm font-medium"
                    style={{ 
                      backgroundColor: `${themeColor}15`, 
                      color: themeColor 
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {productsInCart.map(product => (
                    <div key={product.id} className="border-b pb-4">
                      <div className="flex">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        {product.image_urls && product.image_urls.length > 0 ? (
                            <img 
                              src={product.image_urls[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs text-gray-400">No image</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="font-medium" style={{ color: themeColor }}>
                            ₦{product.discount_price}
                            </span>
                            {Number(product.main_price) > Number(product.discount_price) && (
                              <span className="text-gray-400 text-sm line-through ml-2">
                                ₦{product.main_price}
                              </span>
                            )}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded">
                              <button 
                                onClick={() => onUpdateQuantity(product.id, Math.max(1, product.cartQuantity - 1))}
                                className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                disabled={product.cartQuantity <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center text-sm">{product.cartQuantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(product.id, product.cartQuantity + 1)}
                                className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                disabled={product.cartQuantity >= product.quantity}
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => onRemoveItem(product.id)}
                              className="text-sm text-gray-500 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Cart Summary */}
            {productsInCart.length > 0 && (
              <div className="border-t p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span style={{ color: themeColor }}>{formatPrice(total)}</span>
                  </div>
                </div>
                
                <button 
                  className="w-full py-3 rounded-lg font-medium text-white flex items-center justify-center"
                  style={{ backgroundColor: themeColor }}
                >
                  <CreditCard size={18} className="mr-2" />
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;