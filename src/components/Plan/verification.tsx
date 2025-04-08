// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { motion } from "framer-motion";
// import { 
//   BiCheckCircle, BiX, BiArrowBack, 
//   BiStore, BiSupport, BiEnvelope 
// } from "react-icons/bi";
// import Link from "next/link";
// import apiClient from '../../apiClient';

// const PaymentVerificationPage = () => {
//   const router = useRouter();
//   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
//   const [message, setMessage] = useState("");
//   const [countdown, setCountdown] = useState(5);
  
//   useEffect(() => {
//     const { payment, message: urlMessage } = router.query;
    
//     if (payment === "success") {
//       setStatus("success");
//       setMessage(typeof urlMessage === 'string' ? decodeURIComponent(urlMessage) : "Your payment was successful! Your plan has been activated.");
      
//       verifySubscription();
      
//       const timer = setInterval(() => {
//         setCountdown(prevCount => {
//           if (prevCount <= 1) {
//             clearInterval(timer);
//             router.push("/store/storefront");
//             return 0;
//           }
//           return prevCount - 1;
//         });
//       }, 1000);
      
//       return () => clearInterval(timer);
      
//     } else if (payment === "failed") {
//       setStatus("error");
//       setMessage(typeof urlMessage === 'string' ? decodeURIComponent(urlMessage) : "There was an issue processing your payment. Please try again.");
//     } else {
//       // If we don't have a payment status yet, keep the loading state
//       // This handles the initial load
//     }
//   }, [router.query]);
  
//   const verifySubscription = async () => {
//     try {
//       const response = await apiClient.get('/subscription/', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
//         }
//       });
      
//       if (!response.data.has_subscription) {
//         setStatus("error");
//         setMessage("Subscription not found - please contact support");
//       }
//     } catch (error) {
//       console.error("Failed to verify subscription", error);
//     }
//   };
  
//   const getContent = () => {
//     switch (status) {
//       case "loading":
//         return (
//           <div className="flex flex-col items-center">
//             <motion.div
//               className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mb-6"
//               animate={{ rotate: 360 }}
//               transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//             />
//             <h2 className="text-xl font-medium text-gray-700">Verifying your payment...</h2>
//             <p className="text-gray-500 mt-2">Please wait while we confirm.</p>
//           </div>
//         );
        
//       case "success":
//         return (
//           <motion.div 
//             className="flex flex-col items-center text-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <motion.div 
//               className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring" }}
//             >
//               <BiCheckCircle className="text-green-500 text-6xl" />
//             </motion.div>
            
//             <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Successful!</h2>
//             <p className="text-gray-600 mb-6 max-w-md">{message || "Your plan has been activated successfully!"}</p>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
//               <Link href="/store/storefront" passHref>
//                 <motion.a 
//                   className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center"
//                   whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                 >
//                   <BiStore className="text-purple-500 text-2xl mb-2" />
//                   <h3 className="font-medium text-gray-700">Visit Store</h3>
//                   <p className="text-gray-500 text-sm text-center">Manage your products</p>
//                 </motion.a>
//               </Link>
              
//               <Link href="/support" passHref>
//                 <motion.a 
//                   className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center"
//                   whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                 >
//                   <BiSupport className="text-purple-500 text-2xl mb-2" />
//                   <h3 className="font-medium text-gray-700">Get Support</h3>
//                   <p className="text-gray-500 text-sm text-center">Our team is ready to help</p>
//                 </motion.a>
//               </Link>
              
//               <Link href="/contact" passHref>
//                 <motion.a 
//                   className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center"
//                   whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                 >
//                   <BiEnvelope className="text-purple-500 text-2xl mb-2" />
//                   <h3 className="font-medium text-gray-700">Contact Sales</h3>
//                   <p className="text-gray-500 text-sm text-center">For plan questions</p>
//                 </motion.a>
//               </Link>
//             </div>
            
//             <p className="text-gray-500">
//               Redirecting to dashboard in <span className="font-medium text-purple-600">{countdown}</span> seconds...
//             </p>
//           </motion.div>
//         );
        
//       case "error":
//         return (
//           <motion.div 
//             className="flex flex-col items-center text-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <motion.div 
//               className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring" }}
//             >
//               <BiX className="text-red-500 text-6xl" />
//             </motion.div>
            
//             <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Failed</h2>
//             <p className="text-gray-600 mb-6 max-w-md">{message}</p>
            
//             <div className="flex flex-col md:flex-row gap-4">
//               <Link href="/plan" passHref>
//                 <motion.a 
//                   className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <BiArrowBack className="mr-2" />
//                   Try Again
//                 </motion.a>
//               </Link>
              
//               <Link href="/support" passHref>
//                 <motion.a 
//                   className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <BiSupport className="mr-2" />
//                   Contact Support
//                 </motion.a>
//               </Link>
//             </div>
//           </motion.div>
//         );
//     }
//   };
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100 flex flex-col items-center justify-center py-12 px-4">
//       <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
//         {getContent()}
//       </div>
//     </div>
//   );
// };

// export default PaymentVerificationPage;