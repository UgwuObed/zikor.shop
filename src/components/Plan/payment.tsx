import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { 
  BiCheck, BiStore, BiMobile, BiBarChart, 
  BiCreditCard, BiSupport, BiPackage, 
  BiLock, BiWorld, BiCustomize,
  BiRocket, BiCalendar
} from "react-icons/bi";

interface PlanFeature {
  [key: string]: React.ReactNode;
}

interface Plan {
  id: string;
  name: string;
  price: {
    monthly: string;
    yearly: string;
  };
  period?: string;
  color: string;
  icon: React.ReactNode;
  popular?: boolean;
  features: string[];
  savingsPercentage?: number;
}

const PaymentPlansPage = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: {
        monthly: "₦0",
        yearly: "₦0"
      },
      color: "#10B981", // Green
      popular: false,
      features: [
        "Basic Storefront",
        "100 Product Limit",
        "Payment Integration",
      ],
      icon: <BiStore className="w-6 h-6" />
    },
    {
      id: "pro",
      name: "Pro",
      price: {
        monthly: "₦4,500",
        yearly: "₦45,000"
      },
      period: billingCycle === "monthly" ? "/mo" : "/yr",
      color: "#FBBF24", // Yellow
      popular: true,
      features: [
        "Full-featured Storefront",
        "Unlimited Products",
        "Instagram Product Import",
        "AI Business Assistant",
        "Sales Channels (WhatsApp, Facebook)",
        "Inventory Management",
        "Marketing Tools (Bulk SMS, Email)",
        "Basic Sales Reports",
        "Auto-Invoicing & Receipts",
        "Customer Database & CRM",
        "Abandoned Cart Recovery",
        "Fast Support"
      ],
      savingsPercentage: 17,
      icon: <BiBarChart className="w-6 h-6" />
    },
    {
      id: "business",
      name: "Business",
      price: {
        monthly: "₦15,000",
        yearly: "₦150,000"
      },
      period: billingCycle === "monthly" ? "/mo" : "/yr",
      color: "#EF4444", // Red
      popular: false,
      features: [
        "Advanced Store + Analytics",
        "Unlimited Products",
        "Custom Domain",
        "Real-time Logistics Tracking",
        "Dedicated Account Rep",
        "Up to 5 Team Members",
        "Advanced Insights + Customer Behavior",
        "Referral Links & Promo Codes"
      ],
      savingsPercentage: 17,
      icon: <BiRocket className="w-6 h-6" />
    }
  ];

  const getFeatureIcon = (feature: string): React.ReactElement => {
    const iconMap: PlanFeature = {
      "Basic Storefront": <BiStore />,
      "Full-featured Storefront": <BiStore />,
      "Advanced Store": <BiStore />,
      "10 Product Limit": <BiPackage />,
      "Unlimited Products": <BiPackage />,
      "Instagram Product Import": <BiMobile />,
      "AI Business Assistant": <BiCustomize />,
      "Sales Channels": <BiMobile />,
      "Inventory Management": <BiPackage />,
      "Custom Domain": <BiWorld />,
      "Logistics Integration": <BiPackage />,
      "Payment Integration": <BiCreditCard />,
      "Marketing Tools": <BiBarChart />,
      "CAC Registration": <BiLock />,
      "Business Analytics": <BiBarChart />,
      "Auto-Invoicing": <BiCreditCard />,
      "Customer Database": <BiCustomize />,
      "Abandoned Cart": <BiStore />,
      "Staff Access": <BiCustomize />,
      "Priority Support": <BiSupport />,
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (feature.includes(key)) {
        return icon as React.ReactElement;
      }
    }
    
    return <BiCheck />;
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    
    // Direct redirect for starter plan
    if (plan.id === "starter") {
      setProcessingPayment(true);
      setTimeout(() => {
        router.push("/store/storefront");
      }, 800);
    }
  };

  const handleContinueToPayment = async () => {
    if (!selectedPlan) return;
    
    setProcessingPayment(true);
    setErrorMessage("");
    
    try {
      // Store selected plan in localStorage or state management
      localStorage.setItem("selectedPlan", JSON.stringify({
        ...selectedPlan,
        billingCycle
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    
      router.push("/store/storefront");
    } catch (error) {
      setErrorMessage("Payment processing failed. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setProcessingPayment(false);
    }
  };

  const toggleBillingCycle = () => {
    setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly");
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth/signin");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-gray-100 flex flex-col items-center py-12 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the plan that works best for your business needs. You can upgrade or downgrade at any time.
        </p>
      </motion.div>
      
      {/* Billing Toggle */}
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center bg-white p-1 rounded-full shadow-md">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
              billingCycle === "monthly" 
                ? "bg-purple-600 text-white shadow-sm" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Monthly
          </button>
          
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
              billingCycle === "yearly" 
                ? "bg-purple-600 text-white shadow-sm" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BiCalendar className="mr-1" />
            Yearly
            {billingCycle === "yearly" && (
              <span className="ml-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            )}
          </button>
        </div>
      </motion.div>
      
      {/* Error message */}
      {errorMessage && (
        <motion.div 
          className="w-full max-w-4xl bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </motion.div>
      )}
      
      {/* Plans Container */}
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative rounded-xl border-2 bg-white transition-all duration-300 overflow-hidden ${
                selectedPlan?.id === plan.id 
                  ? `ring-2 ring-opacity-50 shadow-lg transform scale-[1.02]` 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              onClick={() => handlePlanSelect(plan)}
              whileHover={{ 
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              style={{ 
                borderColor: selectedPlan?.id === plan.id ? plan.color : undefined,
                boxShadow: selectedPlan?.id === plan.id ? `0 8px 25px -5px ${plan.color}30` : undefined
              }}
            >
              {plan.popular && (
                <div 
                  className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg"
                  style={{ borderTopRightRadius: '0.5rem' }}
                >
                  POPULAR
                </div>
              )}
              
              <div 
                className="h-2 w-full"
                style={{ backgroundColor: plan.color }}
              />
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div 
                      className="rounded-full p-2 mr-3"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                  </div>
                  
                  <div 
                    className="h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors"
                    style={{ 
                      borderColor: selectedPlan?.id === plan.id ? plan.color : '#D1D5DB',
                      backgroundColor: selectedPlan?.id === plan.id ? plan.color : 'white'
                    }}
                  >
                    {selectedPlan?.id === plan.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white rounded-full h-2 w-2"
                      />
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <motion.div
                    key={`${plan.id}-${billingCycle}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end"
                  >
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price[billingCycle]}
                    </span>
                    {plan.period && (
                      <span className="text-gray-500 text-sm ml-1 mb-1">{plan.period}</span>
                    )}
                  </motion.div>
                  
                  {billingCycle === "yearly" && plan.savingsPercentage && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-green-600 text-sm mt-1 font-medium"
                    >
                      Save {plan.savingsPercentage}% with annual billing
                    </motion.p>
                  )}
                </div>
                
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <motion.div 
                      key={idx}
                      className="flex items-center text-gray-700"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (0.05 * idx) }}
                    >
                      <div className="text-gray-500 mr-2">
                        {getFeatureIcon(feature)}
                      </div>
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Continue Button */}
        <motion.div 
          className="mt-12 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {selectedPlan?.id !== "starter" && (
            <motion.button
              onClick={handleContinueToPayment}
              disabled={!selectedPlan || processingPayment}
              className={`px-10 py-4 rounded-lg font-medium text-lg shadow-md transition-all duration-300 ${
                selectedPlan 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={selectedPlan ? { scale: 1.03 } : {}}
              whileTap={selectedPlan ? { scale: 0.98 } : {}}
            >
              {processingPayment ? (
                <div className="flex items-center">
                  <motion.div
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                  Processing...
                </div>
              ) : (
                <>
                  {selectedPlan ? `Continue with ${selectedPlan.name} (${billingCycle})` : 'Select a plan to continue'}
                </>
              )}
            </motion.button>
          )}
          
          <p className="text-gray-500 text-sm mt-4">
            You can change your plan any time after creating your store
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPlansPage;