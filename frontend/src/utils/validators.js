// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const validatePassword = (password) => {
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  if (!/[!@#$%^&*]/.test(password)) return false
  return true
}

// Phone number validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Name validation
export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50
}

// Location validation
export const validateLocation = (location) => {
  return location && location.trim().length >= 2
}

// Ride type validation
export const validateRideType = (rideType) => {
  return ['economy', 'premium', 'xl'].includes(rideType)
}

// Form field validation
export const validateFormFields = (fields) => {
  const errors = {}

  Object.entries(fields).forEach(([key, { value, validator }]) => {
    if (!validator(value)) {
      errors[key] = `${key} is invalid`
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Required field validation
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}
