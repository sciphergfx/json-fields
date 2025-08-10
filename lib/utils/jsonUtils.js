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
  let flattened = {};
  
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
};

/**
 * Convert flattened object back to nested structure
 * @param {Object} flat - Flattened object with dot-notation keys
 * @returns {Object} Nested object
 */
export const unflattenObject = (flat) => {
  const result = {};
  
  for (let key in flat) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = flat[key];
  }
  
  return result;
};

/**
 * Determine input type based on value and optional field configuration
 * @param {any} value - Value to check
 * @param {string} key - Field key/name
 * @param {Object} fieldConfig - Optional field configuration override
 * @returns {Object} Field type configuration
 */
export const getInputType = (value, key = '', fieldConfig = {}) => {
  // 1. Check explicit field configuration first
  if (fieldConfig[key]) {
    return { type: fieldConfig[key].type, ...fieldConfig[key] };
  }
  
  // 2. Basic type detection
  if (typeof value === 'boolean') return { type: 'checkbox' };
  if (typeof value === 'number') return { type: 'number' };
  if (Array.isArray(value)) return { type: 'array', items: value };
  if (typeof value === 'object' && value !== null) return { type: 'object' };
  
  // 3. Enhanced string analysis
  if (typeof value === 'string') {
    // Long text detection
    if (value.length > 100) return { type: 'textarea', rows: 4 };
    
    // Email detection
    if (value.includes('@') || key.toLowerCase().includes('email')) {
      return { type: 'email' };
    }
    
    // URL detection
    if (value.startsWith('http') || key.toLowerCase().includes('url')) {
      return { type: 'url' };
    }
    
    // Date detection
    if (value.match(/^\d{4}-\d{2}-\d{2}$/) || key.toLowerCase().includes('date')) {
      return { type: 'date' };
    }
    
    // Password detection
    if (key.toLowerCase().includes('password')) {
      return { type: 'password' };
    }
  }
  
  // 4. Fallback to text
  return { type: 'text' };
};

/**
 * Parse JSON string safely
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} Parsed object or error
 */
export const parseJsonSafely = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    return { success: true, data: parsed };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Format JSON string with proper indentation
 * @param {any} obj - Object to stringify
 * @param {number} spaces - Number of spaces for indentation
 * @returns {string} Formatted JSON string
 */
export const formatJson = (obj, spaces = 2) => {
  return JSON.stringify(obj, null, spaces);
};

/**
 * Get nested level from key
 * @param {string} key - Dot-notation key
 * @returns {number} Nesting level
 */
export const getNestedLevel = (key) => {
  return key.split('.').length - 1;
};

/**
 * Get display name from key
 * @param {string} key - Dot-notation key
 * @returns {string} Display name
 */
export const getDisplayName = (key) => {
  return key
    .split('.')
    .pop()
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
    .trim();
};
