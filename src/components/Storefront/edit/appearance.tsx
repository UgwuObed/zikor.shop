"use client"

import type React from "react"

import { useState } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, Trash2 } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface AppearanceFormProps {
  storefront: any
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  formData: FormData
}

export default function AppearanceForm({
  storefront,
  handleInputChange,
  handleFileChange,
  formData,
}: AppearanceFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(storefront?.logo || null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(storefront?.banner || null)
  const [colorTheme, setColorTheme] = useState(storefront?.color_theme || "#6366f1")

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e)

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e)

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleColorChange = (color: string) => {
    setColorTheme(color)

    // Create a synthetic event to pass to the parent handler
    const syntheticEvent = {
      target: {
        name: "color_theme",
        value: color,
      },
    } as React.ChangeEvent<HTMLInputElement>

    handleInputChange(syntheticEvent)
  }

  const removeLogo = () => {
    setLogoPreview(null)
    formData.set("remove_logo", "true")
  }

  const removeBanner = () => {
    setBannerPreview(null)
    formData.set("remove_banner", "true")
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how your storefront looks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label>Logo</Label>
          <div className="flex items-start space-x-4">
            <div className="w-24 h-24 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
              {logoPreview ? (
                <img
                  src={logoPreview || "/placeholder.svg"}
                  alt="Logo preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-400 text-sm">No logo</span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Label
                  htmlFor="logo"
                  className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md flex items-center"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Label>
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                {logoPreview && (
                  <Button type="button" variant="outline" onClick={removeLogo}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-500">Recommended size: 500x500px. Max size: 2MB</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Banner</Label>
          <div className="flex items-start space-x-4">
            <div className="w-48 h-24 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
              {bannerPreview ? (
                <img
                  src={bannerPreview || "/placeholder.svg"}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">No banner</span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Label
                  htmlFor="banner"
                  className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md flex items-center"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Banner
                </Label>
                <Input
                  id="banner"
                  name="banner"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
                {bannerPreview && (
                  <Button type="button" variant="outline" onClick={removeBanner}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-500">Recommended size: 1200x400px. Max size: 2MB</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Theme Color</Label>
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[120px] h-[40px] border-2"
                  style={{ backgroundColor: colorTheme }}
                >
                  <span className="sr-only">Pick a color</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <HexColorPicker color={colorTheme} onChange={handleColorChange} />
                <div className="flex items-center mt-2">
                  <span className="mr-2 text-sm">Hex:</span>
                  <Input value={colorTheme} onChange={(e) => handleColorChange(e.target.value)} className="h-8" />
                </div>
              </PopoverContent>
            </Popover>
            <div>
              <p className="text-sm font-medium">Selected Color: {colorTheme}</p>
              <p className="text-xs text-gray-500">This color will be used throughout your storefront</p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  )
}
