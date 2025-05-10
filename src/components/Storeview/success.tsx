"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const CheckoutSuccessPage = () => {
  const router = useRouter();
  const { orderId, orderNumber } = router.query;

  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    orderNumber: "",
    total: 0,
    status: "pending",
  });

  useEffect(() => {
    if (orderId && orderNumber) {
      setOrderDetails({
        orderId: Array.isArray(orderId) ? orderId[0] : orderId,
        orderNumber: Array.isArray(orderNumber) ? orderNumber[0] : orderNumber,
        total: 1000, 
        status: "confirmed",
      });
    }
  }, [orderId, orderNumber]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Order Confirmed!</title>
        <meta name="description" content="Your order has been confirmed and is being processed." />
      </Head>

      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle size={50} color="#6366f1" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Order Confirmed!</h2>
          <p className="text-gray-600">Thank you for your purchase. Your order is being processed.</p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-lg">Order Details</h3>
          <p className="text-sm text-gray-500">Order Number: <span className="font-medium">{orderDetails.orderNumber || "Not Available"}</span></p>
          <p className="text-sm text-gray-500">Total Amount: <span className="font-medium">₦{orderDetails.total.toLocaleString()}</span></p>
          <p className="text-sm text-gray-500">Status: <span className="font-medium capitalize">{orderDetails.status}</span></p>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/" className="px-4 py-2 text-white bg-blue-600 rounded-lg">
            Return to Store
          </Link>

          <button onClick={() => window.print()} className="px-4 py-2 text-white bg-gray-600 rounded-lg">
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
