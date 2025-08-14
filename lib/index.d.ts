import React from 'react'

// New neutral prop names (aliases for backward compatibility)
export interface TableProps {
  uiLibrary?: 'chakra' | 'tailwind' | 'shadcn'
  onSave?: (nestedData: any, flatData: any) => void
  onCancel?: () => void
  onFieldChange?: (key: string, value: any, fullData: any) => void
  saveButtonText?: string
  cancelButtonText?: string
  initialJson?: string
  customStyles?: Record<string, React.CSSProperties>
  showControls?: boolean
  [key: string]: any
}

export interface FieldsProps {
  uiLibrary?: 'chakra' | 'tailwind' | 'shadcn'
  onSave?: (nestedData: any, flatData: any) => void
  onCancel?: () => void
  onFieldChange?: (key: string, value: any, fullData: any) => void
  saveButtonText?: string
  cancelButtonText?: string
  initialJson?: string
  customStyles?: Record<string, React.CSSProperties>
  showControls?: boolean
  showJsonInput?: boolean
  columns?: number
  [key: string]: any
}

export interface ListProps {
  data?: any[]
  uiLibrary?: 'chakra' | 'tailwind' | 'shadcn'
  headerTitle?: string
  headerDescription?: React.ReactNode
  mode?: 'light' | 'dark'
  startIcon?: React.ReactNode
  parentIcon?: React.ReactNode
  parentOpenIcon?: React.ReactNode
  parentClosedIcon?: React.ReactNode
  childIcon?: React.ReactNode
  hoverIcon?: React.ReactNode
  onItemClick?: (item: any) => void
  onToggle?: (id: string, open: boolean) => void
  sections?: Array<{
    id?: string
    title: string
    description?: string
    collapsible?: boolean
    defaultOpen?: boolean
    items?: any[]
  }> | null
  groupBy?: ((item: any) => string) | null
  sectionOrder?: string[] | null
  customStyles?: Record<string, React.CSSProperties>
  [key: string]: any
}

// Backward-compatible names
export type JsonToTableProps = TableProps
export type JsonToFieldsProps = FieldsProps
export type JsonToListProps = ListProps

// Component exports (new + aliases)
export declare const Table: React.FC<TableProps>
export declare const Fields: React.FC<FieldsProps>
export declare const List: React.FC<ListProps>
export declare const JsonToTable: React.FC<JsonToTableProps>
export declare const JsonToFields: React.FC<JsonToFieldsProps>
export declare const JsonToList: React.FC<JsonToListProps>

// Utility functions
export declare function flattenObject(obj: any, prefix?: string): Record<string, any>
export declare function unflattenObject(flat: Record<string, any>): any
export declare function getInputType(value: any): string
export declare function parseJsonSafely(jsonString: string): {
  success: boolean
  data?: any
  error?: string
}
export declare function formatJson(obj: any, spaces?: number): string
export declare function getNestedLevel(key: string): number
export declare function getDisplayName(key: string): string

// UI Adapters
export declare function getUIComponents(uiLibrary?: string): Record<string, string>
export declare function getUIClasses(
  uiLibrary?: string,
  component?: string,
  variant?: string,
): string
