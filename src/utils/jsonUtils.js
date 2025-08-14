/**
 * Utility functions for JSON parsing and object manipulation
 */

/**
 * Flatten nested objects into dot-notation keys
 * @param {Object} obj - Object to flatten
 * @param {string} prefix - Key prefix for nested properties
 * @returns {Object} Flattened object
 */
export const flattenObject = (obj, prefix = '') => {
  let flattened = {}

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey))
      } else {
        flattened[newKey] = obj[key]
      }
    }
  }

  return flattened
}

/**
 * Convert flattened object back to nested structure
 * @param {Object} flat - Flattened object with dot-notation keys
 * @returns {Object} Nested object
 */
export const unflattenObject = (flat) => {
  const result = {}

  for (let key in flat) {
    const keys = key.split('.')
    let current = result

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = flat[key]
  }

  return result
}

/**
 * Determine input type based on value
 * @param {any} value - Value to check
 * @returns {string} Input type
 */
export const getInputType = (value) => {
  if (typeof value === 'boolean') return 'checkbox'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string' && value.includes('@')) return 'email'
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) return 'date'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object' && value !== null) return 'object'
  return 'text'
}

/**
 * Parse JSON string safely
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} Parsed object or error
 */
export const parseJsonSafely = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString)
    return { success: true, data: parsed }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Format JSON string with proper indentation
 * @param {any} obj - Object to stringify
 * @param {number} spaces - Number of spaces for indentation
 * @returns {string} Formatted JSON string
 */
export const formatJson = (obj, spaces = 2) => {
  return JSON.stringify(obj, null, spaces)
}

/**
 * Get nested level from key
 * @param {string} key - Dot-notation key
 * @returns {number} Nesting level
 */
export const getNestedLevel = (key) => {
  return key.split('.').length - 1
}

/**
 * Get display name from key
 * @param {string} key - Dot-notation key
 * @returns {string} Display name
 */
export const getDisplayName = (key) => {
  return key.split('.').pop()
}
