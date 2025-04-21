"use client"

import type React from "react"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BankDetailsFormProps {
  storefront: any
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function BankDetailsForm({ storefront, handleInputChange }: BankDetailsFormProps) {
  // Parse bank details from storefront data
  const bankDetails =
    typeof storefront?.bank_details === "string" ? JSON.parse(storefront.bank_details) : storefront?.bank_details || {}

  return (
    <>
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
        <CardDescription>Add your bank account information for payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your bank details are securely stored and only used for processing payments to you.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="bank_details.bank_name">Bank Name</Label>
          <Input
            id="bank_details.bank_name"
            name="bank_details.bank_name"
            defaultValue={bankDetails.bank_name || ""}
            onChange={handleInputChange}
            placeholder="Enter your bank name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank_details.account_name">Account Name</Label>
          <Input
            id="bank_details.account_name"
            name="bank_details.account_name"
            defaultValue={bankDetails.account_name || ""}
            onChange={handleInputChange}
            placeholder="Enter the name on your account"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank_details.account_number">Account Number</Label>
          <Input
            id="bank_details.account_number"
            name="bank_details.account_number"
            defaultValue={bankDetails.account_number || ""}
            onChange={handleInputChange}
            placeholder="Enter your account number"
          />
        </div>
      </CardContent>
    </>
  )
}
