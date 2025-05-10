"use client"

import { useState, useEffect } from "react";
import apiClient from '../apiClient'; 

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

interface BuyerInfo {
  name: string;
  email: string;
  phone: string;
}

export default function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [buyerInfoSaved, setBuyerInfoSaved] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState<Product | null>(null);
  
  
  useEffect(() => {
    fetchCart();
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/cart');
      
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
        
        if (response.data.cart && response.data.cart.buyer_name) {
          setBuyerInfo({
            name: response.data.cart.buyer_name,
            email: response.data.cart.buyer_email,
            phone: response.data.cart.buyer_phone
          });
          
          if (response.data.cart.buyer_name) {
            setBuyerInfoSaved(true);
          }
        }
      }
    } catch (err) {
      setError('Failed to load cart data');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity = 1, product?: Product) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/cart/add', {
        product_id: productId,
        quantity: quantity
      });
      
      if (response.data && response.data.items) {
        const updatedItems = response.data.items.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          product: item.product 
        }));
        
        setCartItems(updatedItems);
        
        if (product) {
          setNotificationProduct(product);
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
        
        setShowCart(false);
      }
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItemQuantity = async (productId: number, newQuantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Updating cart item ${productId} to quantity ${newQuantity}`);
      
      const response = await apiClient.put(`/cart/item/${productId}`, {
        quantity: newQuantity
      });
      
      if (response.data && response.data.items) {
        console.log('Server returned updated cart items:', response.data.items);
        setCartItems(response.data.items);
      } else {
        console.warn('Server did not return updated cart items, updating locally');
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
      
      return true;
    } catch (err) {
      console.error('Error updating cart item:', err);
      
      if (err instanceof Error && (err as any).response && (err as any).response.status === 404) {
        console.log('Item not found, attempting to add item instead');
        try {
          const addResponse = await apiClient.post('/cart/add', {
            product_id: productId,
            quantity: newQuantity
          });
          
          if (addResponse.data && addResponse.data.items) {
            console.log('Successfully added item:', addResponse.data.items);
            setCartItems(addResponse.data.items);
            return true;
          }
        } catch (addErr) {
          console.error('Error adding item as fallback:', addErr);
          setError('Failed to update cart item: Item not found and could not be added');
          return false;
        }
      } else {
        setError('Failed to update cart item');
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

 
  const removeFromCart = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.delete(`/cart/item/${productId}`);
      
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      } else {
        console.warn('Server did not return updated cart items, removing locally');
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      }
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

 
  const saveBuyerInfo = async (info: BuyerInfo): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/cart/buyer-info', info);
      
      if (response.data && response.data.success) {
        setBuyerInfo(info);
        setBuyerInfoSaved(true);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to save buyer information');
      console.error('Error saving buyer info:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };


  const checkout = async (buyerInfo: BuyerInfo): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
    
      if (!buyerInfoSaved) {
        await saveBuyerInfo(buyerInfo);
      }
      
      // Then process checkout
      const response = await apiClient.post('/cart/checkout', {
        buyerInfo
      });
      
      if (response.data && response.data.success) {
        // Clear cart after successful checkout
        setCartItems([]);
        
        // Close the cart drawer
        setShowCart(false);
        
        // Reset buyer info saved state
        setBuyerInfoSaved(false);
        
        // Clear buyer info
        setBuyerInfo({
          name: '',
          email: '',
          phone: ''
        });
      } else {
        throw new Error(response.data?.message || 'Checkout failed');
      }
    } catch (err) {
      setError('Checkout failed. Please try again.');
      console.error('Error during checkout:', err);
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  return {
    cartItems,
    cartCount,
    loading,
    error,
    buyerInfo,
    buyerInfoSaved,
    showCart,
    showNotification,
    notificationProduct,
    fetchCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    saveBuyerInfo,
    checkout,
    setBuyerInfo,
    setBuyerInfoSaved,
    setShowCart,
    setShowNotification
  };
}