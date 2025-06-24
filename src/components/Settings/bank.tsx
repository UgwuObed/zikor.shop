"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { motion } from "framer-motion"
import { BiTrash, BiEdit } from "react-icons/bi"
import { CheckCircle, CreditCard, Clock, AlertTriangle, Shield, Banknote } from "lucide-react"
import apiClient from "../../apiClient"
import BankFormModal from "./bankForm" 


interface BankDetails {
  bank_name: string
  bank_code: string
  account_number: string
  account_name: string
  is_verified: boolean
  has_complete_details: boolean
  last_updated: string
}

interface MessageAlertProps {
  type: "success" | "error" | "warning"
  message: string
}


interface Bank {
  name: string
  code: string
}


const MessageAlert: React.FC<MessageAlertProps> = ({ type, message }) => {
  if (!message) return null

  const alertClasses = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border rounded-lg p-4 ${alertClasses[type]}`}
    >
      <div className="flex items-center">
        {type === "success" && <CheckCircle className="w-5 h-5 mr-2" />}
        {type === "error" && <AlertTriangle className="w-5 h-5 mr-2" />}
        {type === "warning" && <AlertTriangle className="w-5 h-5 mr-2" />}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </motion.div>
  )
}

const SettingsHeader: React.FC<{

  onBack: () => void
}> = ({  onBack }) => (
  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </motion.div>
)


const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
}

const BankDetailsSettings = () => {
  const router = useRouter()
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

 
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    bank_name: "",
    bank_code: "",
    account_number: "",
    account_name: "",
  })
  const [verifiedAccountName, setVerifiedAccountName] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalErrorMessage, setModalErrorMessage] = useState("")
  const [modalSuccessMessage, setModalSuccessMessage] = useState("")
  const [isAccountVerified, setIsAccountVerified] = useState(false)
  const [modalStep, setModalStep] = useState(1)
  const [drawerHeight, setDrawerHeight] = useState(60) 
  const [banks, setBanks] = useState<Bank[]>([])
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([])
  const [bankSearchTerm, setBankSearchTerm] = useState("")
  const [showBankDropdown, setShowBankDropdown] = useState(false) 

  useEffect(() => {
    fetchBankDetails()
    fetchBanks()
  }, [])

  useEffect(() => {
    const filtered = banks.filter((bank) => bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase()))
    setFilteredBanks(filtered.slice(0, 200))
  }, [bankSearchTerm, banks])

  const fetchBankDetails = async () => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      router.push("/auth/signin")
      return
    }

    try {
      setIsFetching(true)
      setErrorMessage("")

     
      const response = await apiClient.get("/user/bank-details", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        const details = response.data.bank_details
        if (details && details.has_complete_details) {
          setBankDetails(details)
        } else {
          setBankDetails(null)
        }
      } else {
        setErrorMessage(response.data.message || "Failed to load bank details")
      }
    } catch (error: any) {
      console.error("Error fetching bank details:", error)
      if (error?.response?.status === 401) {
        localStorage.removeItem("accessToken")
        router.push("/auth/signin")
      } else {
        setErrorMessage("Failed to load bank details. Please try again.")
      }
    } finally {
      setIsFetching(false)
    }
  }

  const fetchBanks = async () => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) return

    try {
      const response = await apiClient.get("/banks", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setBanks(response.data.banks)
      setFilteredBanks(response.data.banks.slice(0, 100))
    } catch (error) {
      console.error("Error fetching banks:", error)
    }
  }

  const resetModalState = () => {
    setFormData({
      bank_name: "",
      bank_code: "",
      account_number: "",
      account_name: "",
    })
    setVerifiedAccountName("")
    setIsVerifying(false)
    setIsSubmitting(false)
    setModalErrorMessage("")
    setModalSuccessMessage("")
    setShowBankDropdown(false)
    setBankSearchTerm("")
    setIsAccountVerified(false)
    setModalStep(1)
    setDrawerHeight(60)
  }

  const openAddModal = () => {
    resetModalState()
    setShowAddModal(true)
  }

  const openEditModal = () => {
    if (bankDetails) {
      setFormData({
        bank_name: bankDetails.bank_name,
        bank_code: bankDetails.bank_code,
        account_number: bankDetails.account_number,
        account_name: bankDetails.account_name,
      })
      setBankSearchTerm(bankDetails.bank_name)
      setVerifiedAccountName(bankDetails.account_name)
      setIsAccountVerified(bankDetails.is_verified)
      setModalStep(2)
    }
    setModalErrorMessage("")
    setModalSuccessMessage("")
    setShowEditModal(true)
  }

  const closeModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    resetModalState()
  }

  const handleBankSelect = (bank: Bank) => {
    setFormData({
      ...formData,
      bank_name: bank.name,
      bank_code: bank.code,
    })
    setBankSearchTerm(bank.name)
    setShowBankDropdown(false)
    setIsAccountVerified(false)
    setVerifiedAccountName("")

    setTimeout(() => {
      const accountNumInput = document.getElementById("modal_account_number")
      if (accountNumInput) {
        accountNumInput.focus()
      }
    }, 100)
  }

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d{0,10}$/.test(value)) {
      setFormData({
        ...formData,
        account_number: value,
      })
      setIsAccountVerified(false)
      setVerifiedAccountName("")
      setModalErrorMessage("")

      if (value.length === 10 && formData.bank_code) {
        verifyAccount()
      }
    }
  }

  const verifyAccount = async () => {
    if (!formData.account_number || !formData.bank_code) {
      setModalErrorMessage("Please select a bank and enter account number")
      return
    }

    if (formData.account_number.length !== 10) {
      setModalErrorMessage("Account number must be 10 digits")
      return
    }

    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      router.push("/auth/signin")
      return
    }

    setIsVerifying(true)
    setModalErrorMessage("")

    try {
      const response = await apiClient.post(
        "/user/verify",
        {
          account_number: formData.account_number,
          bank_code: formData.bank_code,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.data.success) {
        setVerifiedAccountName(response.data.account_name)
        setFormData({
          ...formData,
          account_name: response.data.account_name,
        })
        setIsAccountVerified(true)
        setModalSuccessMessage("Account verified successfully!")
        setModalStep(2)

        setTimeout(() => {
          setModalSuccessMessage("")
        }, 3000)
      }
    } catch (error: any) {
      console.error("Error verifying account:", error)
      if (error.response && error.response.data) {
        setModalErrorMessage(error.response.data.message || "Account verification failed")
      } else {
        setModalErrorMessage("Account verification failed. Please try again.")
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAccountVerified) {
      setModalErrorMessage("Please verify your account details first")
      return
    }

    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      router.push("/auth/signin")
      return
    }

    setIsSubmitting(true)
    setModalErrorMessage("")

    try {
      const response = await apiClient.patch("/user/bank-details", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        setModalSuccessMessage("Bank details saved successfully!")
        await fetchBankDetails()
        setTimeout(() => {
          closeModals()
          setSuccessMessage("Bank details updated successfully!")
          setTimeout(() => setSuccessMessage(""), 5000)
        }, 2000)
      }
    } catch (error: any) {
      console.error("Error updating bank details:", error)
      if (error.response && error.response.data) {
        if (error.response.data.suggested_name) {
          setModalErrorMessage(`${error.response.data.message}. Did you mean: ${error.response.data.suggested_name}?`)
        } else {
          setModalErrorMessage(error.response.data.message || "Failed to save bank details")
        }
      } else {
        setModalErrorMessage("Failed to save bank details. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    router.push("/auth/signin")
  }

  const handleBack = () => {
    router.back()
  }

  const handleEditBank = () => {
    openEditModal()
  }

  const handleAddBank = () => {
    openAddModal()
  }

  const handleDeleteBank = async () => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      router.push("/auth/signin")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = await apiClient.delete("/user/bank-details", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        setBankDetails(null)
        setSuccessMessage("Bank details removed successfully!")
        setIsConfirmingDelete(false)
        setTimeout(() => setSuccessMessage(""), 5000)
      } else {
        setErrorMessage(response.data.message || "Failed to remove bank details")
        setIsConfirmingDelete(false)
        setTimeout(() => setErrorMessage(""), 5000)
      }
    } catch (error: any) {
      console.error("Error deleting bank details:", error)
      const message = error?.response?.data?.message || "Failed to remove bank details. Please try again."
      setErrorMessage(message)
      setIsConfirmingDelete(false)
      setTimeout(() => setErrorMessage(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAccountNumber = (number: string): string => {
    if (!number) return ""
    const parts: string[] = []
    for (let i = 0; i < number.length; i += 3) {
      parts.push(number.substring(i, i + 3))
    }
    return parts.join(" ")
  }

  const formatLastUpdated = (dateString: string): string => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-4 px-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="animate-pulse space-y-6">
                <div className="text-center">
                  <div className="bg-gray-200 rounded-full w-20 h-20 mx-auto mb-6"></div>
                  <div className="h-8 bg-gray-200 rounded-lg w-48 mx-auto mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded-lg w-64 mx-auto"></div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded-lg w-40"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-5 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-4 px-4 md:py-8">
      <SettingsHeader
       
        onBack={handleBack}
        
      />

      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center pb-4">
                {/* <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CreditCard className="w-10 h-10 text-white" />
                </div> */}
                {/* <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                  Bank Details
                </h2> */}
                
              </motion.div>

              {/* Messages */}
              <MessageAlert type="success" message={successMessage} />
              <MessageAlert type="error" message={errorMessage} />

              {/* Current Bank Details */}
              {bankDetails ? (
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 md:p-8"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0 lg:space-x-8">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h3 className="font-bold text-gray-800 text-xl mb-2 sm:mb-0">Current Bank Account</h3>
                        <div className="flex flex-wrap gap-2">
                          {bankDetails.is_verified ? (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-100 text-sm font-semibold text-green-800 shadow-sm">
                              <CheckCircle className="w-4 h-4 mr-1.5" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-yellow-100 text-sm font-semibold text-yellow-800 shadow-sm">
                              <Clock className="w-4 h-4 mr-1.5" />
                              Pending
                            </span>
                          )}
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-sm font-semibold text-blue-800 shadow-sm">
                            <Shield className="w-4 h-4 mr-1.5" />
                            Secure
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <p className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                            <Banknote className="w-4 h-4 mr-1.5" />
                            Bank Name
                          </p>
                          <p className="font-semibold text-gray-900 text-lg">{bankDetails.bank_name}</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <p className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                            <CreditCard className="w-4 h-4 mr-1.5" />
                            Account Number
                          </p>
                          <p className="font-semibold text-gray-900 text-lg font-mono tracking-wider">
                            {formatAccountNumber(bankDetails.account_number)}
                          </p>
                        </div>

                        <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <p className="text-sm font-medium text-gray-500 mb-2">Account Name</p>
                          <p className="font-semibold text-gray-900 text-lg">{bankDetails.account_name}</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1.5" />
                          Last updated: {formatLastUpdated(bankDetails.last_updated)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 lg:w-48">
                      <button
                        onClick={handleEditBank}
                        className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <BiEdit className="w-4 h-4 mr-2" />
                        Edit Details
                      </button>
                      <button
                        onClick={() => setIsConfirmingDelete(true)}
                        disabled={isLoading}
                        className="flex items-center justify-center px-4 py-3 border-2 border-red-200 bg-white text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50 font-semibold shadow-sm hover:shadow"
                      >
                        {isLoading ? (
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
                            Removing...
                          </>
                        ) : (
                          <>
                            <BiTrash className="w-4 h-4 mr-2" />
                            Remove
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
                >
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CreditCard className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">No Bank Details Added</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                    Add your bank account details to start receiving payments from your customers securely
                  </p>
                  <button
                    onClick={handleAddBank}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Add Bank Details
                  </button>
                </motion.div>
              )}


              {/* Delete Confirmation Modal */}
              {isConfirmingDelete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200"
                  >
                    <div className="text-center">
                      <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                        <BiTrash className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">Delete Bank Details?</h3>
                      <p className="text-gray-600 mb-8 leading-relaxed">
                        Are you sure you want to remove your bank account details? This action cannot be undone and you
                        won't be able to receive payments until you add new bank details.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => setIsConfirmingDelete(false)}
                          className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteBank}
                          disabled={isLoading}
                          className="flex-1 px-6 py-3 text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:bg-red-400 font-semibold shadow-lg"
                        >
                          {isLoading ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <BankFormModal
        isOpen={showAddModal}
        onClose={closeModals}
        title="Add Bank Details"
        formData={formData}
        setFormData={setFormData}
        banks={banks}
        filteredBanks={filteredBanks}
        bankSearchTerm={bankSearchTerm}
        setBankSearchTerm={setBankSearchTerm}
        handleBankSelect={handleBankSelect}
        handleAccountNumberChange={handleAccountNumberChange}
        verifyAccount={verifyAccount}
        isVerifying={isVerifying}
        verifiedAccountName={verifiedAccountName}
        isAccountVerified={isAccountVerified}
        modalErrorMessage={modalErrorMessage}
        modalSuccessMessage={modalSuccessMessage}
        modalStep={modalStep}
        handleModalSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
        setShowBankDropdown={setShowBankDropdown}
        showBankDropdown={showBankDropdown}
        drawerHeight={drawerHeight}
        setDrawerHeight={setDrawerHeight}
      />

   
      <BankFormModal
        isOpen={showEditModal}
        onClose={closeModals}
        title="Edit Bank Details"
        formData={formData}
        setFormData={setFormData}
        banks={banks}
        filteredBanks={filteredBanks}
        bankSearchTerm={bankSearchTerm}
        setBankSearchTerm={setBankSearchTerm}
        handleBankSelect={handleBankSelect}
        handleAccountNumberChange={handleAccountNumberChange}
        verifyAccount={verifyAccount}
        isVerifying={isVerifying}
        verifiedAccountName={verifiedAccountName}
        isAccountVerified={isAccountVerified}
        modalErrorMessage={modalErrorMessage}
        modalSuccessMessage={modalSuccessMessage}
        modalStep={modalStep}
        handleModalSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
        setShowBankDropdown={setShowBankDropdown}
        showBankDropdown={showBankDropdown}
        drawerHeight={drawerHeight}
        setDrawerHeight={setDrawerHeight}
      />
    </div>
  )
}

export default BankDetailsSettings
