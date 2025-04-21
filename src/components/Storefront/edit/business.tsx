"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BusinessHoursFormProps {
  storefront: any
  onBusinessHoursChange: (businessHours: any) => void
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function BusinessHoursForm({ storefront, onBusinessHoursChange }: BusinessHoursFormProps) {
  const [businessHours, setBusinessHours] = useState<Record<string, { open: string; close: string; closed: boolean }>>({
    Monday: { open: "09:00", close: "17:00", closed: false },
    Tuesday: { open: "09:00", close: "17:00", closed: false },
    Wednesday: { open: "09:00", close: "17:00", closed: false },
    Thursday: { open: "09:00", close: "17:00", closed: false },
    Friday: { open: "09:00", close: "17:00", closed: false },
    Saturday: { open: "09:00", close: "17:00", closed: false },
    Sunday: { open: "09:00", close: "17:00", closed: true },
  })

  useEffect(() => {
    // Initialize business hours from storefront data
    if (storefront?.business_hours) {
      let hours: Record<string, { open: string; close: string; closed: boolean }> = {}

      try {
        if (typeof storefront.business_hours === "string") {
          hours = JSON.parse(storefront.business_hours)
        } else {
          hours = storefront.business_hours
        }

        // Ensure all days are present
        const updatedHours = { ...businessHours }

        for (const day of DAYS_OF_WEEK) {
          if (hours[day]) {
            updatedHours[day] = hours[day]
          }
        }

        setBusinessHours(updatedHours)
      } catch (error) {
        console.error("Error parsing business hours:", error)
      }
    }
  }, [storefront])

  useEffect(() => {
    // Create a form event-like object to satisfy the parent component's expectations
    const formData = new FormData();
    formData.append('business_hours', JSON.stringify(businessHours));
    
    // Create a mock form event
    const mockEvent = {
      preventDefault: () => {},
      target: {
        elements: {
          business_hours: {
            value: JSON.stringify(businessHours)
          }
        },
        business_hours: {
          value: JSON.stringify(businessHours)
        }
      }
    } as any;

    // Notify parent component when business hours change
    onBusinessHoursChange(mockEvent);
  }, [businessHours, onBusinessHoursChange])

  const handleToggleClosed = (day: string, closed: boolean) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        closed,
      },
    }))
  }

  const handleTimeChange = (day: string, type: "open" | "close", value: string) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }))
  }

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        const time = `${formattedHour}:${formattedMinute}`
        options.push(time)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  return (
    <>
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
        <CardDescription>Set your store's operating hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-4">
                <Label htmlFor={`${day}-closed`} className="w-24 font-medium">
                  {day}
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${day}-closed`}
                    checked={!businessHours[day].closed}
                    onCheckedChange={(checked) => handleToggleClosed(day, !checked)}
                  />
                  <Label htmlFor={`${day}-closed`}>{businessHours[day].closed ? "Closed" : "Open"}</Label>
                </div>
              </div>

              {!businessHours[day].closed && (
                <div className="flex items-center space-x-2">
                  <Select
                    value={businessHours[day].open}
                    onValueChange={(value) => handleTimeChange(day, "open", value)}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Opening" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={`${day}-open-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span>to</span>

                  <Select
                    value={businessHours[day].close}
                    onValueChange={(value) => handleTimeChange(day, "close", value)}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Closing" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={`${day}-close-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </>
  )
}