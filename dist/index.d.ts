import React from 'react';

export interface JsonToTableProps {
  uiLibrary?: 'chakra' | 'tailwind' | 'shadcn';
  onSave?: (nestedData: any, flatData: any) => void;
  onCancel?: () => void;
  onFieldChange?: (key: string, value: any, fullData: any) => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  initialJson?: string;
  customStyles?: Record<string, React.CSSProperties>;
  showControls?: boolean;
  [key: string]: any;
}

export interface JsonToFieldsProps {
  uiLibrary?: 'chakra' | 'tailwind' | 'shadcn';
  onSave?: (nestedData: any, flatData: any) => void;
  onCancel?: () => void;
  onFieldChange?: (key: string, value: any, fullData: any) => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  initialJson?: string;
  customStyles?: Record<string, React.CSSProperties>;
  showControls?: boolean;
  showJsonInput?: boolean;
  [key: string]: any;
}

export declare const JsonToTable: React.FC<JsonToTableProps>;
export declare const JsonToFields: React.FC<JsonToFieldsProps>;

// Utility functions
export declare function flattenObject(obj: any, prefix?: string): Record<string, any>;
export declare function unflattenObject(flat: Record<string, any>): any;
export declare function getInputType(value: any): string;
export declare function parseJsonSafely(jsonString: string): { success: boolean; data?: any; error?: string };
export declare function formatJson(obj: any, spaces?: number): string;
export declare function getNestedLevel(key: string): number;
export declare function getDisplayName(key: string): string;

// UI Adapters
export declare function getUIComponents(uiLibrary?: string): Record<string, string>;
export declare function getUIClasses(uiLibrary?: string, component?: string, variant?: string): string;
