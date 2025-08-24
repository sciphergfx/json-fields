/**
 * Local Storage utility functions
 * Provides safe access to localStorage with fallback
 */

const STORAGE_PREFIX = 'json_tools_'

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Stored value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
  if (!isStorageAvailable()) {
    return defaultValue
  }

  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export const setStorageItem = (key, value) => {
  if (!isStorageAvailable()) {
    return false
  }

  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Error writing to localStorage:', error)
    return false
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeStorageItem = (key) => {
  if (!isStorageAvailable()) {
    return false
  }

  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
    return true
  } catch (error) {
    console.error('Error removing from localStorage:', error)
    return false
  }
}

/**
 * Clear all items with our prefix from localStorage
 * @returns {boolean} Success status
 */
export const clearStorage = () => {
  if (!isStorageAvailable()) {
    return false
  }

  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
    return true
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return false
  }
}

/**
 * Get storage size for our app
 * @returns {number} Size in bytes
 */
export const getStorageSize = () => {
  if (!isStorageAvailable()) {
    return 0
  }

  let size = 0
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        size += localStorage.getItem(key).length + key.length
      }
    })
  } catch (error) {
    console.error('Error calculating storage size:', error)
  }
  return size
}

// Storage keys constants
export const STORAGE_KEYS = {
  LAST_JSON_INPUT: 'last_json_input',
  USER_PREFERENCES: 'user_preferences',
  RECENT_CONVERSIONS: 'recent_conversions',
  THEME_MODE: 'theme_mode',
  TAB_PREFERENCE: 'tab_preference',
}
