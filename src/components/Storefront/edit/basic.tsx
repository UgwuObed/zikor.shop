"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

interface BasicInfoFormProps {
  storefront: any
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export default function BasicInfoForm({ storefront, handleInputChange }: BasicInfoFormProps) {
  const [slug, setSlug] = useState(storefront?.slug || "")
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null)
  const [slugCheckTimeout, setSlugCheckTimeout] = useState<NodeJS.Timeout | null>(null)

  const categories = [
    "Fashion & Apparel",
    "Electronics",
    "Home & Garden",
    "Beauty & Personal Care",
    "Food & Beverages",
    "Health & Wellness",
    "Art & Crafts",
    "Books & Stationery",
    "Sports & Outdoors",
    "Toys & Games",
    "Jewelry & Accessories",
    "Automotive",
    "Pet Supplies",
    "Other",
  ]

  useEffect(() => {
    // Reset slug availability when slug changes
    if (slugCheckTimeout) {
      clearTimeout(slugCheckTimeout)
    }

    if (slug && slug !== storefront?.slug) {
      setIsSlugAvailable(null)
      setIsCheckingSlug(true)

      const timeout = setTimeout(() => {
        checkSlugAvailability(slug)
      }, 500)

      setSlugCheckTimeout(timeout)
    } else if (slug === storefront?.slug) {
      setIsSlugAvailable(true)
      setIsCheckingSlug(false)
    }

    return () => {
      if (slugCheckTimeout) {
        clearTimeout(slugCheckTimeout)
      }
    }
  }, [slug, storefront?.slug])

  const checkSlugAvailability = async (slug: string) => {
    try {
      const response = await fetch(`/api/storefront/check-slug?slug=${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      // If this is the current storefront's slug, it's available for this storefront
      if (slug === storefront?.slug) {
        setIsSlugAvailable(true)
      } else {
        setIsSlugAvailable(data.is_available)
      }
    } catch (error) {
      console.error("Error checking slug availability:", error)
      setIsSlugAvailable(false)
    } finally {
      setIsCheckingSlug(false)
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

    setSlug(value)

    // Create a synthetic event to pass to the parent handler
    const syntheticEvent = {
      target: {
        name: "slug",
        value,
      },
    } as React.ChangeEvent<HTMLInputElement>

    handleInputChange(syntheticEvent)
  }

  const generateSlugFromBusinessName = (businessName: string) => {
    const generatedSlug = businessName
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

    setSlug(generatedSlug)

    // Create a synthetic event to pass to the parent handler
    const syntheticEvent = {
      target: {
        name: "slug",
        value: generatedSlug,
      },
    } as React.ChangeEvent<HTMLInputElement>

    handleInputChange(syntheticEvent)
  }

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e)

    // If slug is empty or matches the previous auto-generated slug, update it
    if (!slug || slug === storefront?.slug) {
      generateSlugFromBusinessName(e.target.value)
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Enter the basic details about your storefront</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="business_name">Business Name</Label>
          <Input
            id="business_name"
            name="business_name"
            defaultValue={storefront?.business_name || ""}
            onChange={handleBusinessNameChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">
            Storefront URL
            {isCheckingSlug && <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-gray-500" />}
            {isSlugAvailable === true && !isCheckingSlug && (
              <CheckCircle className="inline ml-2 h-4 w-4 text-green-500" />
            )}
            {isSlugAvailable === false && !isCheckingSlug && <XCircle className="inline ml-2 h-4 w-4 text-red-500" />}
          </Label>
          <div className="flex items-center">
            <span className="bg-gray-100 px-3 py-2 rounded-l-md border border-r-0 text-gray-500">
              yourdomain.com/store/
            </span>
            <Input id="slug" name="slug" value={slug} onChange={handleSlugChange} className="rounded-l-none" required />
          </div>
          {isSlugAvailable === false && !isCheckingSlug && (
            <p className="text-sm text-red-500 mt-1">This URL is already taken. Please choose another one.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            name="category"
            defaultValue={storefront?.category || ""}
            onValueChange={(value: any) => {
              const syntheticEvent = {
                target: {
                  name: "category",
                  value,
                },
              } as React.ChangeEvent<HTMLSelectElement>
              handleInputChange(syntheticEvent)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            name="tagline"
            defaultValue={storefront?.tagline || ""}
            onChange={handleInputChange}
            placeholder="A short catchy phrase for your business"
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={storefront?.description || ""}
            onChange={handleInputChange}
            placeholder="Tell customers about your business"
            rows={4}
          />
        </div>
      </CardContent>
    </>
  )
}
