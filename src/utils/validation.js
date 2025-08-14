/**
 * Validation utilities for JSON and input sanitization
 */

/**
 * Check if JSON string is within size limit
 * @param {string} jsonString - JSON string to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {Object} Validation result
 */
export const validateJsonSize = (jsonString, maxSize = 5242880) => {
  const size = new Blob([jsonString]).size
  return {
    valid: size <= maxSize,
    size,
    maxSize,
    message:
      size > maxSize
        ? `JSON size (${formatBytes(size)}) exceeds maximum allowed size (${formatBytes(maxSize)})`
        : null,
  }
}

/**
 * Format bytes to human readable format
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted string
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Sanitize JSON string for safe parsing
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
export const sanitizeJsonInput = (input) => {
  if (typeof input !== 'string') {
    return ''
  }

  // Remove potential dangerous characters while preserving JSON structure
  // This is a basic sanitization - adjust based on security requirements
  return (
    input
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // Remove control characters
      .trim()
  )
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} date - Date string to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false

  const d = new Date(date)
  return d instanceof Date && !isNaN(d)
}

/**
 * Check if value is a safe number
 * @param {any} value - Value to check
 * @returns {boolean} True if safe number
 */
export const isSafeNumber = (value) => {
  const num = Number(value)
  return (
    !isNaN(num) && isFinite(num) && num >= Number.MIN_SAFE_INTEGER && num <= Number.MAX_SAFE_INTEGER
  )
}

/**
 * Validate JSON structure depth
 * @param {any} obj - Object to validate
 * @param {number} maxDepth - Maximum allowed depth
 * @param {number} currentDepth - Current depth (internal use)
 * @returns {Object} Validation result
 */
export const validateJsonDepth = (obj, maxDepth = 10, currentDepth = 0) => {
  if (currentDepth > maxDepth) {
    return {
      valid: false,
      depth: currentDepth,
      message: `JSON structure exceeds maximum depth of ${maxDepth}`,
    }
  }

  if (typeof obj !== 'object' || obj === null) {
    return { valid: true, depth: currentDepth }
  }

  let maxFoundDepth = currentDepth

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const result = validateJsonDepth(obj[key], maxDepth, currentDepth + 1)
      if (!result.valid) {
        return result
      }
      maxFoundDepth = Math.max(maxFoundDepth, result.depth)
    }
  }

  return { valid: true, depth: maxFoundDepth }
}

/**
 * Check if JSON has circular references
 * @param {any} obj - Object to check
 * @returns {boolean} True if no circular references
 */
export const hasNoCircularReferences = (obj) => {
  try {
    JSON.stringify(obj)
    return true
  } catch (error) {
    if (error.message.includes('circular')) {
      return false
    }
    throw error
  }
}

/**
 * Validate field name for form safety
 * @param {string} fieldName - Field name to validate
 * @returns {boolean} True if valid field name
 */
export const isValidFieldName = (fieldName) => {
  // Allow alphanumeric, dots, underscores, and hyphens
  const fieldNameRegex = /^[a-zA-Z0-9._-]+$/
  return fieldNameRegex.test(fieldName)
}
