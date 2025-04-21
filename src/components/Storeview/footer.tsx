"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Clock, ChevronUp, ExternalLink } from "lucide-react"

interface StorefrontFooterProps {
  storefront: {
    business_name: string
    description: string
    email: string
    phone: string
    address: string
    social_links: string[]
    business_hours: { [key: string]: string }
  }
  themeColor: string
}

const StorefrontFooter: React.FC<StorefrontFooterProps> = ({ storefront, themeColor }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const currentYear = new Date().getFullYear()


  const generateGradient = (color: string) => {
    const lighterColor = adjustColorBrightness(color, 40)
    return `linear-gradient(135deg, ${color}, ${lighterColor})`
  }

  return (
    <footer className="relative overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-12 text-white"
          fill="currentColor"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Main footer content */}
      <div className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Company info */}
            <div className="md:col-span-5 space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold mb-4">{storefront.business_name}</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">{storefront.description}</p>

                {/* Social links */}
                {storefront.social_links && storefront.social_links.length > 0 && (
                  <div className="flex space-x-3 mt-6">
                    {storefront.social_links.includes("instagram") && (
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.1, y: -3 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: generateGradient(themeColor) }}
                      >
                        <Instagram size={18} className="text-white" />
                      </motion.a>
                    )}
                    {storefront.social_links.includes("facebook") && (
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.1, y: -3 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: generateGradient(themeColor) }}
                      >
                        <Facebook size={18} className="text-white" />
                      </motion.a>
                    )}
                    {storefront.social_links.includes("twitter") && (
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.1, y: -3 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: generateGradient(themeColor) }}
                      >
                        <Twitter size={18} className="text-white" />
                      </motion.a>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Contact info */}
            <div className="md:col-span-3">
              <div className="md:hidden">
                <button
                  onClick={() => toggleSection("contact")}
                  className="flex justify-between items-center w-full py-2 border-b border-gray-700 mb-4"
                >
                  <h3 className="text-lg font-semibold">Contact Us</h3>
                  <ChevronUp
                    size={18}
                    className={`transition-transform ${expandedSection === "contact" ? "" : "transform rotate-180"}`}
                  />
                </button>
              </div>

              <h3 className="text-lg font-semibold mb-4 hidden md:block">Contact Us</h3>

              <div
                className={`space-y-4 ${expandedSection === "contact" || expandedSection === null ? "block" : "hidden md:block"}`}
              >
                {storefront.phone && (
                  <motion.div whileHover={{ x: 5 }} className="flex items-center group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gray-800 group-hover:bg-gray-700 transition-colors">
                      <Phone size={16} style={{ color: themeColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <a href={`tel:${storefront.phone}`} className="text-gray-200 hover:text-white transition-colors">
                        {storefront.phone}
                      </a>
                    </div>
                  </motion.div>
                )}

                {storefront.email && (
                  <motion.div whileHover={{ x: 5 }} className="flex items-center group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gray-800 group-hover:bg-gray-700 transition-colors">
                      <Mail size={16} style={{ color: themeColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <a
                        href={`mailto:${storefront.email}`}
                        className="text-gray-200 hover:text-white transition-colors"
                      >
                        {storefront.email}
                      </a>
                    </div>
                  </motion.div>
                )}

                {storefront.address && (
                  <motion.div whileHover={{ x: 5 }} className="flex items-start group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gray-800 group-hover:bg-gray-700 transition-colors mt-1">
                      <MapPin size={16} style={{ color: themeColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-gray-200">{storefront.address}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Business hours - takes 4/12 on desktop */}
            <div className="md:col-span-4">
              <div className="md:hidden">
                <button
                  onClick={() => toggleSection("hours")}
                  className="flex justify-between items-center w-full py-2 border-b border-gray-700 mb-4"
                >
                  <h3 className="text-lg font-semibold">Business Hours</h3>
                  <ChevronUp
                    size={18}
                    className={`transition-transform ${expandedSection === "hours" ? "" : "transform rotate-180"}`}
                  />
                </button>
              </div>

              <h3 className="text-lg font-semibold mb-4 hidden md:block">Business Hours</h3>

              <div
                className={`${expandedSection === "hours" || expandedSection === null ? "block" : "hidden md:block"}`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gray-800">
                    <Clock size={16} style={{ color: themeColor }} />
                  </div>
                  <p className="text-gray-300">We're open during these hours</p>
                </div>

                {storefront.business_hours && Object.keys(storefront.business_hours).length > 0 ? (
                  <div className="bg-gray-800 rounded-lg p-4">
                    {Object.entries(storefront.business_hours).map(([day, hours], index) => (
                      <div
                        key={day}
                        className={`flex justify-between py-2 text-sm ${
                          index < Object.entries(storefront.business_hours).length - 1 ? "border-b border-gray-700" : ""
                        }`}
                      >
                        <span className="capitalize text-gray-300 font-medium">{day}</span>
                        <span className="text-gray-300">{hours}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Hours not specified</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom bar with copyright */}
          <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} {storefront.business_name}. All rights reserved.
            </p>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm mr-2">Powered by</span>
              <a
                href="https://www.zikor.shop"
                target="_blank"
                className="text-sm font-medium flex items-center hover:text-white transition-colors"
                style={{ color: themeColor }}
              >
                Zikor
                <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


function adjustColorBrightness(hex: string, percent: number): string {
  hex = hex.replace(/^#/, "")

  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  const newR = Math.min(255, r + percent)
  const newG = Math.min(255, g + percent)
  const newB = Math.min(255, b + percent)

  return `#${Math.round(newR).toString(16).padStart(2, "0")}${Math.round(newG).toString(16).padStart(2, "0")}${Math.round(newB).toString(16).padStart(2, "0")}`
}

export default StorefrontFooter
