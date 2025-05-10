"use client"

import { useState, useEffect } from 'react'
import apiClient from '../apiClient'; 

interface OrderResponse {
    data: Order | null;
}

interface Order {
    id: string;
    total?: number;
    
}

interface BuyerInfo {
    name: string;
    email: string;
    phone: string;
    [key: string]: any;
}

interface CheckoutResponse {
    success: boolean;
    order: Order;
    message?: string;
}

interface OrdersResponse {
    data: Order[];
    total?: number;
    page?: number;
}

const useOrder = (cartItems: any[], buyerInfo: BuyerInfo) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [orderCreated, setOrderCreated] = useState<boolean>(false)
    const [orderDetails, setOrderDetails] = useState<Order | null>(null)

    const checkout = async (checkoutInfo: BuyerInfo | null = null): Promise<Order> => {
        setLoading(true)
        setError(null)
        
        try {
            const buyerDetails = checkoutInfo || buyerInfo
            
            if (!buyerDetails || !buyerDetails.name || !buyerDetails.email || !buyerDetails.phone) {
                throw new Error('Complete buyer information is required')
            }
            
            const response = await apiClient.post<CheckoutResponse>('/checkout', buyerDetails)
            
            if (response.data && response.data.success) {
                setOrderDetails(response.data.order)
                setOrderCreated(true)
                
                localStorage.setItem('lastOrder', JSON.stringify(response.data.order))
                if (response.data.order.total) {
                    localStorage.setItem('orderTotal', response.data.order.total.toString())
                }
                
                return response.data.order
            } else {
                throw new Error(response.data?.message || 'Checkout failed')
            }
        } catch (err: any) {
            console.error('Checkout error:', err)
            setError(err.response?.data?.message || err.message || 'An error occurred during checkout')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getOrder = async (orderId: string): Promise<Order> => {
        setLoading(true)
        setError(null)
        
        try {
            const response: OrderResponse = await apiClient.get(`/orders/${orderId}`)
            
            if (response.data) {
                return response.data
            } else {
                throw new Error('Failed to fetch order details')
            }
        } catch (err: any) {
            console.error('Get order error:', err)
            setError(err.response?.data?.message || err.message || 'Failed to fetch order')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getOrders = async (page: number = 1, limit: number = 10): Promise<OrdersResponse> => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await apiClient.get<OrdersResponse>(`/orders?page=${page}&limit=${limit}`)
            
            if (response.data) {
                return response.data
            } else {
                throw new Error('Failed to fetch orders')
            }
        } catch (err: any) {
            console.error('Get orders error:', err)
            setError(err.response?.data?.message || err.message || 'Failed to fetch orders')
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {
        checkout,
        getOrder,
        getOrders,
        loading,
        error,
        orderCreated,
        orderDetails
    }
}

export default useOrder