import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { 
  BiCheck, BiStore, BiMobile, BiBarChart, 
  BiCreditCard, BiSupport, BiPackage, 
  BiLock, BiWorld, BiCustomize,
  BiRocket, BiCalendar, BiX,
  BiDollar, BiUser, BiCheckCircle
} from "react-icons/bi";
import apiClient from '../../apiClient';

interface PlanFeature {
  [key: string]: React.ReactNode;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: string;
    yearly: string;
  };
  period?: string;
  color: string;
  icon: React.ReactNode;
  popular?: boolean;
  features: {
    text: string;
    included: boolean;
    highlight?: boolean;
  }[];
  savingsPercentage?: number;
}

const PaymentPlansPage = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const email = localStorage.getItem("userEmail"); 
    setAccessToken(token);
    setUserEmail(email);
    
    // Handle payment callback
    const { payment, message, token: callbackToken } = router.query;
    
    if (payment === "success") {
        if (callbackToken) {
            // Store the new token from callback
            localStorage.setItem("accessToken", callbackToken as string);
        }
        
        setSuccessMessage("Payment successful! Your plan has been activated.");
        setTimeout(() => {
            setSuccessMessage("");
            router.replace("/store/storefront", undefined, { shallow: true });
        }, 5000);
        
        // Verify subscription was created
        verifySubscription();
        
    } else if (payment === "failed" && typeof message === "string") {
        setErrorMessage(decodeURIComponent(message));
        setTimeout(() => setErrorMessage(""), 5000);
    }
}, [router.query]);

const verifySubscription = async () => {
    try {
        const response = await apiClient.get('/api/subscription', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        
        if (!response.data.has_subscription) {
            setErrorMessage("Subscription not found - please contact support");
        }
    } catch (error) {
        setErrorMessage("Failed to verify subscription");
    }
};

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      description: "For new businesses just getting started",
      price: {
        monthly: "₦0",
        yearly: "₦0"
      },
      color: "#8B5CF6", // Changed to purple
      popular: false,
      features: [
        { text: "Basic storefront", included: true },
        { text: "Up to 100 products", included: true },
        { text: "Basic payment integration", included: true },
        { text: "Unlimited Products", included: false },
        { text: "Sales channels (WhatsApp, Facebook)", included: false },
        { text: "Marketing tools", included: false },
        { text: "Auto-invoicing & receipts", included: false },
        { text: "Customer database & CRM", included: false },
        { text: "Abandoned cart recovery", included: false },
        { text: "Custom domain", included: false },
        { text: "Team members", included: false },
        { text: "Support", included: false }
      ],
      icon: <BiStore className="w-6 h-6" />
    },
    {
      id: "pro",
      name: "Pro",
      description: "For growing businesses ready to scale",
      price: {
        monthly: "₦4,500",
        yearly: "₦45,000"
      },
      period: billingCycle === "monthly" ? "/mo" : "/yr",
      color: "#7C3AED", // Changed to darker purple
      popular: true,
      features: [
        { text: "Full-featured storefront", included: true, highlight: true },
        { text: "Unlimited Products", included: true, highlight: true },
        { text: "Instagram product import", included: true, highlight: true },
        { text: "AI Business Assistant", included: true, highlight: true },
        { text: "Sales channels (WhatsApp, Facebook)", included: true },
        { text: "Inventory management", included: true },
        { text: "Marketing tools (Bulk SMS, Email)", included: true },
        { text: "Auto-invoicing & receipts", included: true },
        { text: "Customer database & CRM", included: true },
        { text: "Abandoned cart recovery", included: true },
        { text: "Basic sales reports", included: true },
        { text: "Fast support", included: true }
      ],
      savingsPercentage: 17,
      icon: <BiBarChart className="w-6 h-6" />
    },
    {
      id: "business",
      name: "Business",
      description: "For established businesses seeking growth",
      price: {
        monthly: "₦15,000",
        yearly: "₦150,000"
      },
      period: billingCycle === "monthly" ? "/mo" : "/yr",
      color: "#6D28D9", // Changed to deep purple
      popular: false,
      features: [
        { text: "Everything in Pro, plus:", included: true, highlight: true },
        { text: "Custom domain included", included: true, highlight: true },
        { text: "Real-time logistics tracking", included: true, highlight: true },
        { text: "Dedicated account representative", included: true, highlight: true },
        { text: "Up to 5 team members", included: true, highlight: true },
        { text: "Advanced analytics dashboard", included: true },
        { text: "Customer behavior insights", included: true },
        { text: "Referral links & promo codes", included: true },
        { text: "Multiple payment gateways", included: true },
        { text: "Priority customer support", included: true },
        { text: "Advanced inventory management", included: true },
        { text: "Unlimited discounts & coupons", included: true }
      ],
      savingsPercentage: 17,
      icon: <BiRocket className="w-6 h-6" />
    }
  ];

  const getFeatureIcon = (feature: string, included: boolean): React.ReactElement => {
    if (!included) {
      return <BiX className="text-gray-400" />;
    }
    
    const iconMap: PlanFeature = {
      "Basic storefront": <BiStore className="text-gray-600" />,
      "Full-featured storefront": <BiStore className="text-purple-500" />,
      "Everything in Pro": <BiCheck className="text-purple-600" />,
      "Unlimited Products": <BiPackage className="text-purple-500" />,
      "Instagram product import": <BiMobile className="text-purple-500" />,
      "AI Business Assistant": <BiCustomize className="text-purple-500" />,
      "Sales channels": <BiMobile className="text-purple-500" />,
      "Inventory management": <BiPackage className="text-purple-500" />,
      "Custom domain": <BiWorld className="text-purple-500" />,
      "Real-time logistics": <BiPackage className="text-purple-500" />,
      "Basic payment": <BiCreditCard className="text-gray-600" />,
      "Marketing tools": <BiBarChart className="text-purple-500" />,
      "Auto-invoicing": <BiCreditCard className="text-purple-500" />,
      "Customer database": <BiUser className="text-purple-500" />,
      "Abandoned cart": <BiStore className="text-purple-500" />,
      "team members": <BiUser className="text-purple-500" />,
      "Priority": <BiSupport className="text-purple-500" />,
      "Dedicated account": <BiSupport className="text-purple-500" />,
      "Fast support": <BiSupport className="text-purple-500" />,
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (feature.toLowerCase().includes(key.toLowerCase())) {
        return icon as React.ReactElement;
      }
    }
    
    return included ? <BiCheck className="text-purple-500" /> : <BiX className="text-gray-400" />;
  };

  const continueToPayment = async (plan: Plan) => {
    if (!accessToken || !userEmail) {
      setErrorMessage("You need to be logged in to select a plan");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }
    
    setSelectedPlan(plan);
    setProcessingPayment(true);
    setErrorMessage("");
    
    try {
      const response = await apiClient.post("/payment/initialize", {
        plan_id: plan.id === 'pro' ? 2 : plan.id === 'business' ? 3 : 1,
        billing_cycle: billingCycle,
        email: userEmail,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
  
      if (plan.id === "starter") {
        setSuccessMessage("Free plan activated successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          router.push("/store/storefront");
        }, 2000);
      } else {
        // Save payment reference in localStorage for potential verification needs
        localStorage.setItem("payment_reference", response.data.reference);
        
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        "An error occurred during payment processing";
      
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
                                  .flat()
                                  .join('\n');
        setErrorMessage(errorMessages);
      } else {
        setErrorMessage(errorMessage);
      }
      
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100 flex flex-col items-center py-12 px-4">
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
      
      {/* Display messages if there are any */}
      {errorMessage && (
        <motion.div 
          className="w-full max-w-6xl mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <BiX className="text-red-600 text-xl mr-2" />
          {errorMessage}
        </motion.div>
      )}
      
      {successMessage && (
        <motion.div 
          className="w-full max-w-6xl mb-6 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <BiCheckCircle className="text-green-600 text-xl mr-2" />
          {successMessage}
        </motion.div>
      )}
      
      {/* Plans Container */}
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative rounded-xl border-2 bg-white transition-all duration-300 overflow-hidden h-full flex flex-col ${
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
                  MOST POPULAR
                </div>
              )}
              
              <div 
                className="h-2 w-full"
                style={{ backgroundColor: plan.color }}
              />
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
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
                
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
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
                
                <div className="space-y-3 flex-1">
                  {plan.features.map((feature, idx) => (
                    <motion.div 
                      key={idx}
                      className={`flex items-center ${
                        feature.included ? 'text-gray-700' : 'text-gray-400'
                      } ${feature.highlight ? 'font-medium' : ''}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (0.05 * idx) }}
                    >
                      <div className="mr-2 flex-shrink-0">
                        {getFeatureIcon(feature.text, feature.included)}
                      </div>
                      <span className="text-sm">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button 
                  className={`mt-6 w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                    processingPayment && selectedPlan?.id === plan.id
                      ? 'opacity-70 cursor-not-allowed'
                      : ''
                  } ${
                    plan.id === "starter" 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-gradient-to-r text-white'
                  }`}
                  style={{
                    backgroundImage: plan.id !== "starter" 
                      ? `linear-gradient(to right, ${plan.color}, ${plan.color}dd)` 
                      : undefined
                  }}
                  whileHover={{ scale: processingPayment && selectedPlan?.id === plan.id ? 1 : 1.02 }}
                  whileTap={{ scale: processingPayment && selectedPlan?.id === plan.id ? 1 : 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    if (!processingPayment) {
                      continueToPayment(plan);
                    }
                  }}
                  disabled={processingPayment}
                >
                  {processingPayment && selectedPlan?.id === plan.id ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      />
                      Processing...
                    </div>
                  ) : (
                    <>
                      {plan.id === "starter" ? "Start for Free" : `Choose ${plan.name} (${billingCycle})`}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-8 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-500 text-sm flex items-center">
            <BiLock className="mr-1 text-purple-500" />
            Secure payments processed by Paystack. You can change your plan any time.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPlansPage;