"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface BusinessDay {
  open: string
  close: string
  closed: boolean
}

interface BusinessHours {
  [key: string]: BusinessDay
}

interface PresetSchedule {
  name: string
  schedule: BusinessHours
}

interface EnhancedBusinessHoursProps {
  businessHours?: BusinessHours
  onChange: (hours: BusinessHours) => void
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const
type DayOfWeek = (typeof daysOfWeek)[number]

const BusinessHours: React.FC<EnhancedBusinessHoursProps> = ({ businessHours = {}, onChange }) => {
  const [activeDay, setActiveDay] = useState<DayOfWeek | null>(null)
  const [showHours, setShowHours] = useState(true)

  const completeBusinessHours = useMemo(() => {
    const complete: BusinessHours = { ...businessHours }

    daysOfWeek.forEach((day) => {
      if (!complete[day] || typeof complete[day] !== "object") {
        complete[day] = { open: "", close: "", closed: false }
      }
    })

    return complete
  }, [businessHours])

  const presetSchedules: PresetSchedule[] = [
    {
      name: "Weekdays 9-5",
      schedule: {
        Monday: { open: "09:00", close: "17:00", closed: false },
        Tuesday: { open: "09:00", close: "17:00", closed: false },
        Wednesday: { open: "09:00", close: "17:00", closed: false },
        Thursday: { open: "09:00", close: "17:00", closed: false },
        Friday: { open: "09:00", close: "17:00", closed: false },
        Saturday: { open: "", close: "", closed: true },
        Sunday: { open: "", close: "", closed: true },
      },
    },
    {
      name: "All week",
      schedule: {
        Monday: { open: "09:00", close: "18:00", closed: false },
        Tuesday: { open: "09:00", close: "18:00", closed: false },
        Wednesday: { open: "09:00", close: "18:00", closed: false },
        Thursday: { open: "09:00", close: "18:00", closed: false },
        Friday: { open: "09:00", close: "18:00", closed: false },
        Saturday: { open: "10:00", close: "16:00", closed: false },
        Sunday: { open: "10:00", close: "16:00", closed: false },
      },
    },
    {
      name: "Weekdays + Saturday AM",
      schedule: {
        Monday: { open: "09:00", close: "17:00", closed: false },
        Tuesday: { open: "09:00", close: "17:00", closed: false },
        Wednesday: { open: "09:00", close: "17:00", closed: false },
        Thursday: { open: "09:00", close: "17:00", closed: false },
        Friday: { open: "09:00", close: "17:00", closed: false },
        Saturday: { open: "09:00", close: "13:00", closed: false },
        Sunday: { open: "", close: "", closed: true },
      },
    },
  ]

  const applyPreset = (preset: PresetSchedule) => {
    // Keep the internal state as BusinessHours
    onChange(preset.schedule)

    // Log the formatted version for debugging
    console.log("API format:", getFormattedHoursForAPI(preset.schedule))
  }

  const formatBusinessHoursForBackend = (hours: BusinessHours) => {
    // This is just for display and debugging - not actually changing the data structure
    const formattedHours: { [key: string]: string } = {}

    Object.entries(hours).forEach(([day, dayData]) => {
      const dayKey = day.toLowerCase()

      if (dayData.closed) {
        formattedHours[dayKey] = "Closed"
      } else if (dayData.open && dayData.close) {
        const formatAmPm = (time: string) => {
          if (!time) return ""
          const [hours, minutes] = time.split(":")
          const h = Number.parseInt(hours, 10)
          return `${h % 12 || 12}${minutes === "00" ? "" : `:${minutes}`}${h >= 12 ? "pm" : "am"}`
        }

        formattedHours[dayKey] = `${formatAmPm(dayData.open)} - ${formatAmPm(dayData.close)}`
      } else {
        formattedHours[dayKey] = ""
      }
    })

    // For debugging
    console.log("Formatted for display:", formattedHours)

    // Return the original hours structure to maintain type compatibility
    return hours
  }

  const getFormattedHoursForAPI = (hours: BusinessHours) => {
    const formattedHours: { [key: string]: string } = {}

    Object.entries(hours).forEach(([day, dayData]) => {
      const dayKey = day.toLowerCase()

      if (dayData.closed) {
        formattedHours[dayKey] = "Closed"
      } else if (dayData.open && dayData.close) {
        const formatAmPm = (time: string) => {
          if (!time) return ""
          const [hours, minutes] = time.split(":")
          const h = Number.parseInt(hours, 10)
          return `${h % 12 || 12}${minutes === "00" ? "" : `:${minutes}`}${h >= 12 ? "pm" : "am"}`
        }

        formattedHours[dayKey] = `${formatAmPm(dayData.open)} - ${formatAmPm(dayData.close)}`
      } else {
        formattedHours[dayKey] = ""
      }
    })

    console.log("Formatted for API:", formattedHours)
    return formattedHours
  }

  const handleDayClick = (day: DayOfWeek) => {
    setActiveDay(activeDay === day ? null : day)
  }

  const handleHoursChange = (day: DayOfWeek, field: keyof BusinessDay, value: string | boolean) => {
    const updatedHours = { ...completeBusinessHours }

    if (field === "open" || field === "close") {
      if (typeof value === "string" && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) && value !== "") {
        return
      }
      updatedHours[day][field] = value as string
    } else if (field === "closed") {
      updatedHours[day].closed = value as boolean
      if (value === true) {
        updatedHours[day].open = ""
        updatedHours[day].close = ""
      }
    }

    // Keep the internal state as BusinessHours
    onChange(updatedHours)

    // Log the formatted version for debugging
    console.log("API format:", getFormattedHoursForAPI(updatedHours))
  }

  const getReadableHours = (day: DayOfWeek) => {
    const dayData = completeBusinessHours[day]
    if (!dayData || dayData.closed) return "Closed"

    const formatTime = (time: string) => {
      if (!time) return ""
      const [hours, minutes] = time.split(":")
      const h = Number.parseInt(hours, 10)
      return `${h % 12 || 12}:${minutes} ${h >= 12 ? "PM" : "AM"}`
    }

    return `${formatTime(dayData.open)} - ${formatTime(dayData.close)}`
  }

  const copyHours = (fromDay: DayOfWeek) => {
    const fromHours = completeBusinessHours[fromDay]
    if (!fromHours) return

    const updatedHours = { ...completeBusinessHours }
    daysOfWeek.forEach((day) => {
      if (day !== fromDay) {
        updatedHours[day] = { ...fromHours }
      }
    })

    // Keep the internal state as BusinessHours
    onChange(updatedHours)

    // Log the formatted version for debugging
    console.log("API format:", getFormattedHoursForAPI(updatedHours))
  }

  return (
    <div className="rounded-lg bg-white shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center">
          <div className="text-purple-700 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-base font-medium text-gray-800">Business Hours</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowHours(!showHours)}
          className={`flex items-center px-3 py-1 rounded-full text-sm ${showHours ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"} transition-colors`}
        >
          {showHours ? "Hide" : "Show"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 ml-1 transition-transform ${showHours ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 15.79a.75.75 0 01-.02-1.06l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 11-1.08 1.04L10 11.832 6.29 15.77a.75.75 0 01-1.06.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {showHours && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5">
              {/* Preset Templates */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Templates</h4>
                <div className="flex flex-wrap gap-2">
                  {presetSchedules.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days of Week Selection */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {daysOfWeek.map((day) => {
                  const dayData = completeBusinessHours[day]
                  const isActive = activeDay === day
                  const isClosed = dayData.closed

                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-purple-700 text-white ring-2 ring-purple-300"
                          : isClosed
                            ? "bg-gray-100 text-gray-400"
                            : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                      }`}
                    >
                      <span className="text-xs font-medium">{day.slice(0, 3)}</span>
                      {!isActive && <span className="text-xs mt-1 max-w-full truncate">{getReadableHours(day)}</span>}
                    </button>
                  )
                })}
              </div>

              {/* Day Editor */}
              <AnimatePresence>
                {activeDay && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-50 rounded-lg p-4 mb-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-800">{activeDay} Hours</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => copyHours(activeDay)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Copy to All Days
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveDay(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`closed-${activeDay}`}
                          checked={completeBusinessHours[activeDay].closed}
                          onChange={(e) => handleHoursChange(activeDay, "closed", e.target.checked)}
                          className="h-4 w-4 text-purple-700 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`closed-${activeDay}`} className="ml-2 text-sm text-gray-600">
                          Closed on {activeDay}
                        </label>
                      </div>

                      {!completeBusinessHours[activeDay].closed && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={`open-${activeDay}`}
                              className="block text-xs font-medium text-gray-700 mb-1"
                            >
                              Opening Time
                            </label>
                            <input
                              type="time"
                              id={`open-${activeDay}`}
                              value={completeBusinessHours[activeDay].open}
                              onChange={(e) => handleHoursChange(activeDay, "open", e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`close-${activeDay}`}
                              className="block text-xs font-medium text-gray-700 mb-1"
                            >
                              Closing Time
                            </label>
                            <input
                              type="time"
                              id={`close-${activeDay}`}
                              value={completeBusinessHours[activeDay].close}
                              onChange={(e) => handleHoursChange(activeDay, "close", e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Summary View */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 px-4 py-3">
                  <h4 className="text-sm font-medium text-gray-700">Your Schedule</h4>
                </div>
                <div className="divide-y divide-gray-100">
                  {daysOfWeek.map((day) => {
                    const dayData = completeBusinessHours[day]
                    return (
                      <div key={day} className="flex justify-between px-4 py-3">
                        <span className="text-sm font-medium text-gray-700">{day}</span>
                        <span className={`text-sm ${dayData.closed ? "text-gray-400" : "text-gray-700"}`}>
                          {getReadableHours(day)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BusinessHours
