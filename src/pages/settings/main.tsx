"use client"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Building, Truck, Palette, Clock, CreditCard, ArrowRight, SettingsIcon, LifeBuoy } from "lucide-react"
import SettingsHeader from "../../components/Settings/header"

const settingsItems = [
  {
    id: "business-info",
    title: "Business Information",
    description: "Update your business name, contact details, and description",
    icon: Building,
    href: "/settings/business",
    color: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "shipping-fees",
    title: "Shipping Fees",
    description: "Configure delivery fees for different locations",
    icon: Truck,
    href: "/settings/shipping",
    color: "bg-gradient-to-br from-green-50 to-green-100 text-green-700 border-green-200",
  },
  {
    id: "branding",
    title: "Visual Branding",
    description: "Upload logo, banner, and set your brand colors",
    icon: Palette,
    href: "/settings/branding",
    color: "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "business-hours",
    title: "Business Hours",
    description: "Set your store operating hours for each day",
    icon: Clock,
    href: "/settings/hours",
    color: "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 border-orange-200",
  },
  {
    id: "bank-details",
    title: "Bank Details",
    description: "Manage bank account for receiving payments",
    icon: CreditCard,
    href: "/settings/bank",
    color: "bg-gradient-to-br from-pink-50 to-pink-100 text-pink-700 border-pink-200",
  },
]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
    },
  },
}

export default function SettingsIndexPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState("")

  useEffect(() => {
    const fetchBusinessName = async () => {
   
      await new Promise((resolve) => setTimeout(resolve, 500))
      // setBusinessName("Zikor Shop") // Hardcode for example
    }

    fetchBusinessName()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    router.push("/auth/signin")
  }

  const handleBack = () => {
    router.push("/dashboard/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-4 px-4 md:py-8">
      <SettingsHeader
        businessName={businessName}
        title="Settings"
        onBack={handleBack}
      />

      <main className="max-w-5xl mx-auto">
        {" "}
        {/* Increased max-w */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {" "}
          {/* More rounded, stronger shadow */}
          <div className="p-6 md:p-10">
            {" "}
            {/* Increased padding */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              {" "}
            
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center pb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {" "}
                 
                  <SettingsIcon className="w-10 h-10 text-white" /> 
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                  {" "}
                 
                  Storefront Settings
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  {" "}
                  {/* Larger text, better line height */}
                  Customize and configure your online store to match your business needs and enhance customer
                  experience.
                </p>
              </motion.div>
              {/* Settings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {" "}
                {/* Responsive grid, increased gap */}
                {settingsItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => router.push(item.href)}
                      className="group relative p-6 bg-white border border-gray-200 rounded-xl overflow-hidden
                                 hover:border-purple-400 hover:shadow-xl transition-all duration-300 text-left
                                 flex flex-col justify-between h-full" 
                      whileHover={{ y: -5, scale: 1.02 }} 
                      whileTap={{ y: 0, scale: 0.98 }}
                      variants={itemVariants} 
                    >
                     
                      <div className={`absolute inset-0 opacity-20 ${item.color} pointer-events-none`}></div>

                      <div className="relative z-10 flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div
                              className={`rounded-full w-12 h-12 flex items-center justify-center ${item.color
                                .replace("border-", "bg-")
                                .replace("text-", "text-")} mr-4 shadow-md`}
                            >
                              {" "}
                             
                              <IconComponent className="w-6 h-6" /> 
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-700 transition-colors">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
              {/* Help Section */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 mt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6"
              >
                <div className="flex items-center space-x-4 text-center md:text-left">
                  <div className="bg-blue-100 rounded-full p-3 flex-shrink-0 shadow-md">
                    <LifeBuoy className="w-7 h-7 text-blue-600" /> 
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-800 mb-2 text-xl">Need Assistance?</h3>
                    <p className="text-blue-700 text-base leading-relaxed">
                      Our dedicated support team is ready to help you with any configuration questions or issues.
                    </p>
                  </div>
                </div>
                <button className="flex-shrink-0 text-base bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Contact Support
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
