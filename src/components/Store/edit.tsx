"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import apiClient from '../../apiClient';
import BasicInfoForm from "../Storefront/edit/basic"
import AppearanceForm from "../Storefront/edit/appearance"
import ContactInfoForm from "../Storefront/edit/contact"
import BusinessHoursForm from "../Storefront/edit/business"
import BankDetailsForm from "../Storefront/edit/bank"

const EditStorefrontPage = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [storefront, setStorefront] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState<FormData>(new FormData())
  const router = useRouter()

  useEffect(() => {
    fetchStorefrontData()
  }, [])


  
  const fetchStorefrontData = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken'); // grab token
  
      const response = await apiClient.get("/storefront", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // add token to header
        },
      });
  
      if (response.status !== 200) {
        throw new Error("Failed to fetch storefront data");
      }
  
      const data = response.data;
      setStorefront(data.storefront);
  
      // Initialize form data with existing values
      const initialFormData = new FormData();
      Object.entries(data.storefront).forEach(([key, value]) => {
        if (key !== "logo" && key !== "banner" && value !== null) {
          if (typeof value === "object") {
            initialFormData.append(key, JSON.stringify(value));
          } else {
            initialFormData.append(key, value as string);
          }
        }
      });
  
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error fetching storefront data:", error);
      toast({
        title: "Error",
        description: "Failed to load storefront data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Handle nested objects (social_links, bank_details, etc.)
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      const currentValue = formData.get(parent)
      let parsedValue = {}

      try {
        parsedValue = currentValue ? JSON.parse(currentValue as string) : {}
      } catch (e) {
        parsedValue = {}
      }

      const updatedValue = { ...parsedValue, [child]: value }
      formData.set(parent, JSON.stringify(updatedValue))
    } else {
      formData.set(name, value)
    }

    // Create a new FormData instance to trigger re-render
    setFormData(new FormData(formData as any))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      formData.set(name, files[0])
      // Create a new FormData instance to trigger re-render
      setFormData(new FormData(formData as any))
    }
  }

  const handleBusinessHoursChange = (businessHours: any) => {
    formData.set("business_hours", JSON.stringify(businessHours))
    setFormData(new FormData(formData as any))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      const response = await fetch("/api/storefront", {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update storefront")
      }

      const result = await response.json()

      toast({
        title: "Success",
        description: "Your storefront has been updated successfully!",
      })

      // Redirect to storefront view or dashboard
      setTimeout(() => {
        router.push("/storefront")
      }, 1500)
    } catch (error: any) {
      console.error("Error updating storefront:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update storefront. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading storefront data...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Your Storefront</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="hours">Business Hours</TabsTrigger>
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
          </TabsList>

          <Card className="mb-8">
            <TabsContent value="basic">
              <BasicInfoForm storefront={storefront} handleInputChange={handleInputChange} />
            </TabsContent>

            <TabsContent value="appearance">
              <AppearanceForm
                storefront={storefront}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
                formData={formData}
              />
            </TabsContent>

            <TabsContent value="contact">
              <ContactInfoForm storefront={storefront} handleInputChange={handleInputChange} />
            </TabsContent>

            <TabsContent value="hours">
              <BusinessHoursForm storefront={storefront} onBusinessHoursChange={handleBusinessHoursChange} />
            </TabsContent>

            <TabsContent value="bank">
              <BankDetailsForm storefront={storefront} handleInputChange={handleInputChange} />
            </TabsContent>

            <CardFooter className="flex justify-between border-t pt-6 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const prevTab = {
                    basic: "basic",
                    appearance: "basic",
                    contact: "appearance",
                    hours: "contact",
                    bank: "hours",
                  }[activeTab] as string
                  setActiveTab(prevTab)
                }}
                disabled={activeTab === "basic" || saving}
              >
                Previous
              </Button>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const nextTab = {
                      basic: "appearance",
                      appearance: "contact",
                      contact: "hours",
                      hours: "bank",
                      bank: "bank",
                    }[activeTab] ?? "bank"
                    setActiveTab(nextTab)
                  }}
                  disabled={activeTab === "bank" || saving}
                >
                  Next
                </Button>

                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Tabs>
      </form>
    </div>
  )
}

export default EditStorefrontPage