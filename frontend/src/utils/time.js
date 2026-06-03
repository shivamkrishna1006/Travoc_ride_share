// Get current time
export const getCurrentTime = () => {
  return new Date()
}

// Get time difference in seconds
export const getTimeDifference = (date1, date2) => {
  return Math.abs((new Date(date1) - new Date(date2)) / 1000)
}

// Get time difference in minutes
export const getMinutesDifference = (date1, date2) => {
  return Math.round(getTimeDifference(date1, date2) / 60)
}

// Get time difference in hours
export const getHoursDifference = (date1, date2) => {
  return Math.round(getTimeDifference(date1, date2) / 3600)
}

// Check if time is within business hours
export const isBusinessHours = (date = new Date()) => {
  const hours = date.getHours()
  const day = date.getDay()
  // Monday (1) to Friday (5), 9 AM to 5 PM
  return day >= 1 && day <= 5 && hours >= 9 && hours < 17
}

// Get time period (Morning, Afternoon, Evening, Night)
export const getTimePeriod = (date = new Date()) => {
  const hours = date.getHours()

  if (hours >= 5 && hours < 12) return 'Morning'
  if (hours >= 12 && hours < 17) return 'Afternoon'
  if (hours >= 17 && hours < 21) return 'Evening'
  return 'Night'
}

// Calculate ETA as readable string
export const formatETA = (minutes) => {
  if (minutes < 1) return 'Less than 1 min'
  if (minutes === 1) return '1 min'
  if (minutes < 60) return `${minutes} mins`

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
  return `${hours}h ${mins}m`
}

// Add minutes to date
export const addMinutes = (date, minutes) => {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}

// Add hours to date
export const addHours = (date, hours) => {
  return addMinutes(date, hours * 60)
}

// Add days to date
export const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Check if date is today
export const isToday = (date) => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// Check if date is tomorrow
export const isTomorrow = (date) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  )
}

// Get time ago string (e.g., "2 hours ago")
export const getTimeAgo = (date) => {
  const now = new Date()
  const secondsAgo = Math.floor((now - new Date(date)) / 1000)

  if (secondsAgo < 60) return `${secondsAgo}s ago`

  const minutesAgo = Math.floor(secondsAgo / 60)
  if (minutesAgo < 60) return `${minutesAgo}m ago`

  const hoursAgo = Math.floor(minutesAgo / 60)
  if (hoursAgo < 24) return `${hoursAgo}h ago`

  const daysAgo = Math.floor(hoursAgo / 24)
  return `${daysAgo}d ago`
}

// Check if date is expired
export const isExpired = (expiryDate) => {
  return new Date() > new Date(expiryDate)
}

// Get remaining time string
export const getRemainingTime = (expiryDate) => {
  const remaining = new Date(expiryDate) - new Date()

  if (remaining <= 0) return 'Expired'

  const seconds = Math.floor(remaining / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d left`
  if (hours > 0) return `${hours}h left`
  if (minutes > 0) return `${minutes}m left`
  return `${seconds}s left`
}

// Get next occurrence of time (e.g., next Monday)
export const getNextOccurrence = (dayOfWeek, time = '00:00') => {
  const today = new Date()
  const currentDay = today.getDay()
  const daysUntil = (dayOfWeek - currentDay + 7) % 7 || 7

  const nextDate = new Date(today)
  nextDate.setDate(nextDate.getDate() + daysUntil)

  const [hours, minutes] = time.split(':').map(Number)
  nextDate.setHours(hours, minutes, 0, 0)

  return nextDate
}
