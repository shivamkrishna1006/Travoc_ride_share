const TOKEN_KEY = 'ride_app_token'
const USER_KEY = 'ride_app_user'
const DRIVER_KEY = 'ride_app_driver'
const PREFERENCES_KEY = 'ride_app_preferences'

// Token storage
export const getSecureToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (err) {
    console.error('Error retrieving token:', err)
    return null
  }
}

export const setSecureToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch (err) {
    console.error('Error storing token:', err)
  }
}

export const clearSecureToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (err) {
    console.error('Error clearing token:', err)
  }
}

// User storage
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  } catch (err) {
    console.error('Error retrieving user:', err)
    return null
  }
}

export const setStoredUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  } catch (err) {
    console.error('Error storing user:', err)
  }
}

export const clearStoredUser = () => {
  try {
    localStorage.removeItem(USER_KEY)
  } catch (err) {
    console.error('Error clearing user:', err)
  }
}

// Driver storage
export const getStoredDriver = () => {
  try {
    const driver = localStorage.getItem(DRIVER_KEY)
    return driver ? JSON.parse(driver) : null
  } catch (err) {
    console.error('Error retrieving driver:', err)
    return null
  }
}

export const setStoredDriver = (driver) => {
  try {
    if (driver) {
      localStorage.setItem(DRIVER_KEY, JSON.stringify(driver))
    } else {
      localStorage.removeItem(DRIVER_KEY)
    }
  } catch (err) {
    console.error('Error storing driver:', err)
  }
}

export const clearStoredDriver = () => {
  try {
    localStorage.removeItem(DRIVER_KEY)
  } catch (err) {
    console.error('Error clearing driver:', err)
  }
}

// Preferences storage
export const getPreferences = () => {
  try {
    const prefs = localStorage.getItem(PREFERENCES_KEY)
    return prefs ? JSON.parse(prefs) : {}
  } catch (err) {
    console.error('Error retrieving preferences:', err)
    return {}
  }
}

export const setPreferences = (preferences) => {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
  } catch (err) {
    console.error('Error storing preferences:', err)
  }
}

export const updatePreference = (key, value) => {
  try {
    const prefs = getPreferences()
    prefs[key] = value
    setPreferences(prefs)
  } catch (err) {
    console.error('Error updating preference:', err)
  }
}

// Clear all storage
export const clearAllStorage = () => {
  try {
    clearSecureToken()
    clearStoredUser()
    clearStoredDriver()
    localStorage.removeItem(PREFERENCES_KEY)
  } catch (err) {
    console.error('Error clearing storage:', err)
  }
}
