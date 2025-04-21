"use client"

import type React from "react"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Facebook, Instagram, Twitter, Globe } from "lucide-react"

interface ContactInfoFormProps {
  storefront: any
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function ContactInfoForm({ storefront, handleInputChange }: ContactInfoFormProps) {
  // Parse social links from storefront data
  const socialLinks =
    typeof storefront?.social_links === "string" ? JSON.parse(storefront.social_links) : storefront?.social_links || {}

  return (
    <>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>How customers can reach you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={storefront?.email || ""}
            onChange={handleInputChange}
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={storefront?.phone || ""}
            onChange={handleInputChange}
            placeholder="+1234567890"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            defaultValue={storefront?.address || ""}
            onChange={handleInputChange}
            placeholder="Your business address"
            rows={3}
          />
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Social Media Links</h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Facebook className="h-5 w-5 text-blue-600" />
              <Input
                id="social_links.facebook"
                name="social_links.facebook"
                defaultValue={socialLinks.facebook || ""}
                onChange={handleInputChange}
                placeholder="Facebook page URL"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Instagram className="h-5 w-5 text-pink-600" />
              <Input
                id="social_links.instagram"
                name="social_links.instagram"
                defaultValue={socialLinks.instagram || ""}
                onChange={handleInputChange}
                placeholder="Instagram profile URL"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Twitter className="h-5 w-5 text-blue-400" />
              <Input
                id="social_links.twitter"
                name="social_links.twitter"
                defaultValue={socialLinks.twitter || ""}
                onChange={handleInputChange}
                placeholder="Twitter profile URL"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-600" />
              <Input
                id="social_links.website"
                name="social_links.website"
                defaultValue={socialLinks.website || ""}
                onChange={handleInputChange}
                placeholder="Your website URL"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </>
  )
}
