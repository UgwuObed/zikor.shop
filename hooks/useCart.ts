// // File: hooks/useCart.ts
// // This is a custom hook to manage cart state and operations

// import { useState, useEffect } from "react";
// import apiClient from '../apiClient'

// interface Product {
//   id: number;
//   name: string;
//   main_price: string;
//   discount_price: string;
//   quantity: number;
//   image_urls: string[];
//   // Add other product fields as needed
// }

// interface CartItem {
//   id: number;
//   quantity: number;
// }

// interface BuyerInfo {
//   name: string;
//   email: string;
//   phone: string;
// }

// export default function useCart() {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
//     name: '',
//     email: '',
//     phone: ''
//   });
//   const [showCart, setShowCart] = useState(false);
//   const [showNotification, setShowNotification] = useState(false);
//   const [notificationProduct, setNotificationProduct] = useState<Product | null>(null);
  
//   // Get cart data on mount
//   useEffect(() => {
//     fetchCart();
//   }, []);

//   // Calculate cart count
//   const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
//   // Fetch cart data from API
//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await apiClient.get('/cart');
      
//       if (response.data && response.data.items) {
//         setCartItems(response.data.items);
        
//         // If buyer info exists in the response, set it
//         if (response.data.cart && response.data.cart.buyer_name) {
//           setBuyerInfo({
//             name: response.data.cart.buyer_name,
//             email: response.data.cart.buyer_email,
//             phone: response.data.cart.buyer_phone
//           });
//         }
//       }
//     } catch (err) {
//       setError('Failed to load cart data');
//       console.error('Error fetching cart:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add item to cart
//   const addToCart = async (productId: number, quantity = 1, product?: Product) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await apiClient.post('/cart/add', {
//         product_id: productId,
//         quantity: quantity
//       });
      
//       if (response.data && response.data.items) {
//         setCartItems(response.data.items);
        
//         // Show notification
//         if (product) {
//           setNotificationProduct(product);
//           setShowNotification(true);
//           setTimeout(() => setShowNotification(false), 3000);
//         }
//       }
//     } catch (err) {
//       setError('Failed to add item to cart');
//       console.error('Error adding to cart:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update cart item quantity
//   const updateCartItemQuantity = async (productId: number, newQuantity: number) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await apiClient.put(`/cart/item/${productId}`, {
//         quantity: newQuantity
//       });
      
//       if (response.data) {
//         setCartItems(prevItems => 
//           prevItems.map(item => 
//             item.id === productId ? { ...item, quantity: newQuantity } : item
//           )
//         );
//       }
//     } catch (err) {
//       setError('Failed to update cart item');
//       console.error('Error updating cart item:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remove item from cart
//   const removeFromCart = async (productId: number) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await apiClient.delete(`/cart/item/${productId}`);
      
//       if (response.data) {
//         setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
//       }
//     } catch (err) {
//       setError('Failed to remove item from cart');
//       console.error('Error removing from cart:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update buyer information
//   const updateBuyerInfo = async (info: BuyerInfo): Promise<boolean> => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await apiClient.post('/cart/buyer-info', info);
      
//       if (response.data) {
//         setBuyerInfo(info);
//         return true;
//       }
//       return false;
//     } catch (err) {
//       setError('Failed to update buyer information');
//       console.error('Error updating buyer info:', err);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Checkout process
//   const checkout = async (): Promise<{success: boolean, orderId?: string}> => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       if (!buyerInfo.name || !buyerInfo.email || !buyerInfo.phone) {
//         setError('Please provide your contact information');
//         return { success: false };
//       }
      
//       const response = await apiClient.post('/cart/checkout', {
//         buyerInfo
//       });
      
//       if (response.data && response.data.orderId) {
//         // Clear cart after successful checkout
//         setCartItems([]);
//         return { success: true, orderId: response.data.orderId };
//       }
      
//       return { success: false };
//     } catch (err) {
//       setError('Checkout failed. Please try again.');
//       console.error('Error during checkout:', err);
//       return { success: false };
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     cartItems,
//     cartCount,
//     loading,
//     error,
//     buyerInfo,
//     showCart,
//     showNotification,
//     notificationProduct,
//     fetchCart,
//     addToCart,
//     updateCartItemQuantity,
//     removeFromCart,
//     updateBuyerInfo,
//     checkout,
//     setBuyerInfo,
//     setShowCart,
//     setShowNotification
//   };
// }