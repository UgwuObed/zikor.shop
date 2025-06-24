"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BiCheck, BiX } from "react-icons/bi"
import { CreditCard, Banknote, ChevronDown, GripHorizontal } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile" // Assuming this hook is available

interface Bank {
  name: string
  code: string
}

interface BankFormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  formData: {
    bank_name: string
    bank_code: string
    account_number: string
    account_name: string
  }
  setFormData: React.Dispatch<
    React.SetStateAction<{
      bank_name: string
      bank_code: string
      account_number: string
      account_name: string
    }>
  >
  banks: Bank[]
  filteredBanks: Bank[]
  bankSearchTerm: string
  setBankSearchTerm: React.Dispatch<React.SetStateAction<string>>
  handleBankSelect: (bank: Bank) => void
  handleAccountNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  verifyAccount: () => Promise<void>
  isVerifying: boolean
  verifiedAccountName: string
  isAccountVerified: boolean
  modalErrorMessage: string
  modalSuccessMessage: string
  modalStep: number
  handleModalSubmit: (e: React.FormEvent) => Promise<void>
  isSubmitting: boolean
  setShowBankDropdown: React.Dispatch<React.SetStateAction<boolean>>
  showBankDropdown: boolean
  drawerHeight: number
  setDrawerHeight: React.Dispatch<React.SetStateAction<number>>
}

const BankFormModal: React.FC<BankFormModalProps> = ({
  isOpen,
  onClose,
  title,
  formData,
  setFormData,
  banks,
  filteredBanks,
  bankSearchTerm,
  setBankSearchTerm,
  handleBankSelect,
  handleAccountNumberChange,
  verifyAccount,
  isVerifying,
  verifiedAccountName,
  isAccountVerified,
  modalErrorMessage,
  modalSuccessMessage,
  modalStep,
  handleModalSubmit,
  isSubmitting,
  setShowBankDropdown,
  showBankDropdown,
  drawerHeight,
  setDrawerHeight,
}) => {
  const isMobile = useMobile()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showBankDropdown && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showBankDropdown])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowBankDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setShowBankDropdown])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    if (isMobile) {
      const dragThreshold = 50 // pixels
      if (info.offset.y > dragThreshold) {
        onClose() // Close if dragged down significantly
      } else if (info.offset.y < -dragThreshold) {
        setDrawerHeight(90) // Extend to 90% if dragged up
      } else {
        setDrawerHeight(60) // Snap back to 60% if not dragged enough
      }
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: isMobile ? 1 : 0.95, y: isMobile ? "100%" : 0 },
    visible: {
      opacity: 1,
      scale: 1,
      y: isMobile ? `${100 - drawerHeight}%` : 0,
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
    exit: { opacity: 0, scale: isMobile ? 1 : 0.95, y: isMobile ? "100%" : 0 },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 backdrop-blur-sm md:items-center md:p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose} // Close modal when clicking outside
        >
          <motion.div
            ref={contentRef}
            className={`relative w-full bg-white rounded-t-2xl shadow-2xl p-6 md:rounded-xl md:max-w-md md:p-8 ${
              isMobile ? "h-[var(--drawer-height)]" : ""
            }`}
            style={{ "--drawer-height": `${drawerHeight}vh` } as React.CSSProperties}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {isMobile && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 cursor-grab">
                <GripHorizontal className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <BiX className="w-6 h-6 text-gray-500" />
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h3>

            {modalErrorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 mb-4 text-sm"
              >
                {modalErrorMessage}
              </motion.div>
            )}
            {modalSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 mb-4 text-sm"
              >
                {modalSuccessMessage}
              </motion.div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-5">
              {modalStep === 1 && (
                <>
                  <div className="relative" ref={dropdownRef}>
                    <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="bank_name"
                        name="bank_name"
                        value={bankSearchTerm}
                        onChange={(e) => {
                          setBankSearchTerm(e.target.value)
                          setShowBankDropdown(true)
                        }}
                        onFocus={() => setShowBankDropdown(true)}
                        placeholder="Search for a bank"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                        required
                        autoComplete="off"
                        ref={searchInputRef}
                      />
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    {showBankDropdown && bankSearchTerm.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                        {filteredBanks.length > 0 ? (
                          filteredBanks.map((bank) => (
                            <div
                              key={bank.code}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                              onClick={() => handleBankSelect(bank)}
                            >
                              <Banknote className="w-4 h-4 mr-2 text-gray-500" />
                              {bank.name}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">No banks found.</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="modal_account_number" className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="modal_account_number"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleAccountNumberChange}
                      placeholder="Enter 10-digit account number"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={verifyAccount}
                    disabled={isVerifying || !formData.bank_code || formData.account_number.length !== 10}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <>
                        <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <BiCheck className="w-5 h-5 mr-2" />
                        Verify Account
                      </>
                    )}
                  </button>
                </>
              )}

              {modalStep === 2 && (
                <>
                  <div>
                    <label htmlFor="verified_account_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Verified Account Name
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
                      <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="text-gray-900 font-medium flex-1">{verifiedAccountName}</span>
                      {isAccountVerified && <BiCheck className="w-6 h-6 text-green-500" />}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isAccountVerified}
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Bank Details"
                    )}
                  </button>
                </>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BankFormModal
