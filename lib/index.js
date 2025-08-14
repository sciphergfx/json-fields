// Main library entry point
// New neutral names
export { default as Table } from './components/JsonToTable.jsx'
export { default as Fields } from './components/JsonToFields.jsx'
export { default as List } from './components/JsonToList.jsx'

// Backward-compatible aliases (deprecated)
export { default as JsonToTable } from './components/JsonToTable.jsx'
export { default as JsonToFields } from './components/JsonToFields.jsx'
export { default as JsonToList } from './components/JsonToList.jsx'

// Export utility functions
export * from './utils/jsonUtils.js'
export * from './utils/uiAdapters.js'
