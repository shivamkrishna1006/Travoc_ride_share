// Format price to USD
export const formatPrice = (price) => {
  return `$${Number(price).toFixed(2)}`
}

// Format distance
export const formatDistance = (km) => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}

// Format time to HH:MM
export const formatTime = (date) => {
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// Format date to MM/DD/YYYY
export const formatDate = (date) => {
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const year = d.getFullYear()
  return `${month}/${day}/${year}`
}

// Format datetime
export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`
}

// Format duration (minutes)
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// Format rating
export const formatRating = (rating) => {
  return Number(rating).toFixed(1)
}

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Format ride type label
export const formatRideType = (type) => {
  const types = {
    economy: 'Economy',
    premium: 'Premium',
    xl: 'XL',
  }
  return types[type] || type
}

// Format address - shorten long addresses
export const formatAddress = (address, maxLength = 30) => {
  if (address.length > maxLength) {
    return address.substring(0, maxLength) + '...'
  }
  return address
}

// Format phone number
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}
