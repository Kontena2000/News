
import { useState, useEffect } from "react"

interface LastUpdatedInfoProps {
  date: Date
}

export function LastUpdatedInfo({ date }: LastUpdatedInfoProps) {
  const [formattedDateTime, setFormattedDateTime] = useState<string>("")

  useEffect(() => {
    // Format date and time consistently for client-side only
    const formatDateTime = (date: Date) => {
      const hours = date.getUTCHours().toString().padStart(2, '0')
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      const seconds = date.getUTCSeconds().toString().padStart(2, '0')
      
      const year = date.getUTCFullYear()
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
      const day = date.getUTCDate().toString().padStart(2, '0')
      
      return `${hours}:${minutes}:${seconds} UTC · ${year}-${month}-${day}`
    }

    setFormattedDateTime(formatDateTime(date))
  }, [date])

  if (!formattedDateTime) {
    return null
  }

  return (
    <div className="text-xs text-muted-foreground">
      Last updated: {formattedDateTime}
    </div>
  )
}
