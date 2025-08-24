import React, { useState, useEffect, useCallback } from 'react'
import { getUIClasses as _getUIClasses } from '../utils/uiAdapters'
import {
  flattenObject,
  unflattenObject,
  getInputType,
  parseJsonSafely,
  getDisplayName,
} from '../utils/jsonUtils'

/**
 * Fields Component - UI Library Agnostic
 * @param {Object} props - Component props
 * @param {string} props.uiLibrary - (deprecated, ignored in headless)
 * @param {Object} [props.classNames] - slot classes for headless styling
 * @param {Object} [props.styles] - slot inline styles for headless styling
 * @param {Object} [props.renderers] - primitive render overrides: { Container, Box, Button, Input, Select, Textarea, Text, Heading, VStack, HStack, Card, Alert, Label }
 * @param {Function} props.onSave - Callback when save is triggered (nestedData, flatData) => void
 * @param {Function} props.onCancel - Callback when cancel is triggered () => void
 * @param {Function} props.onFieldChange - Callback when field changes (key, value, fullData) => void
 * @param {string} props.saveButtonText - Text for save button
 * @param {string} props.cancelButtonText - Text for cancel button
 * @param {string} props.initialJson - Initial JSON string
 * @param {Object} props.customStyles - Custom styles object
 * @param {boolean} props.showControls - Whether to show save/cancel buttons
 * @param {boolean} props.inlineLabels - Whether to render labels inline with fields
 * @param {number} props.columns - Number of columns for form layout (default: 2)
 * @param {Object} props.fieldConfig - Field configuration for custom input types
 * @param {Array} [props.sections] - Optional sections to group fields: [{ id?, title, description?, fields: string[], collapsible?: boolean, defaultOpen?: boolean }]
 * @param {boolean} [props.includeUnsectioned=false] - If true, render fields not listed in sections under an "Other" section
 * @param {string} [props.unsectionedTitle='Other'] - Title for the unsectioned fields section
 */
const Fields = ({
  // headless styling hooks
  _classNames = {},
  styles: _styleProps = {},
  renderers = {},
  // advanced overrides
  customFieldRenderers = {}, // map of fieldKey => (ctx) => ReactNode
  customInputRenderers = {}, // map of type => (ctx) => ReactNode
  customControlRenderers = {}, // map of fieldKey or type => (ctx) => ReactNode (returns just control)
  customLabelRenderers = {}, // map of fieldKey or type => (ctx) => ReactNode (returns just label)
  // deprecated uiLibrary (ignored in headless; kept for backward compat)
  uiLibrary = 'chakra',
  onSave,
  onCancel,
  onFieldChange,
  saveButtonText = 'Save Changes',
  cancelButtonText = 'Reset Form',
  initialJson = '',
  customStyles = {},
  showControls = true,
  inlineLabels = false,
  columns = 2,
  fieldConfig = {},
  sections = null,
  includeUnsectioned = false,
  unsectionedTitle = 'Other',
  ...props
}) => {
  // mark intentionally unused headless props to satisfy lint
  _classNames
  _styleProps
  const [jsonInput, setJsonInput] = useState(initialJson)
  const [formData, setFormData] = useState({})
  const [originalFormData, setOriginalFormData] = useState({})
  const [, setParsedJson] = useState(null)
  const [error, setError] = useState('')
  // Local input state for tags fields keyed by field name
  const [tagInputs, setTagInputs] = useState({})
  // Open state for collapsible sections
  const [sectionOpenIds, setSectionOpenIds] = useState(() => new Set())

  // Headless primitives; can be overridden by `renderers`
  const UI = {
    Container: renderers.Container || 'div',
    Box: renderers.Box || 'div',
    Button: renderers.Button || 'button',
    Input: renderers.Input || 'input',
    Select: renderers.Select || 'select',
    Textarea: renderers.Textarea || 'textarea',
    Text: renderers.Text || 'span',
    Heading: renderers.Heading || 'h2',
    VStack: renderers.VStack || 'div',
    HStack: renderers.HStack || 'div',
    Card: renderers.Card || 'div',
    Alert: renderers.Alert || 'div',
    Label: renderers.Label || 'label',
  }

  // Segment field renderer (single-select segmented control)
  const renderSegmentField = (key, value, displayName, fieldTypeConfig) => {
    const ctx = {
      key,
      value,
      displayName,
      fieldTypeConfig,
      formData,
      onChange: (val) => handleFieldChange(key, val),
      UI,
      props: { uiLibrary, customStyles, inlineLabels, ...props },
    }

    const labelEl =
      (typeof customLabelRenderers?.[key] === 'function' && customLabelRenderers[key](ctx)) ||
      (typeof customLabelRenderers?.segment === 'function' && customLabelRenderers.segment(ctx)) || (
        <UI.Label className={getUIClasses(uiLibrary, 'Label')} style={{ ...customStyles.fieldLabel, marginBottom: inlineLabels ? 0 : '0.5rem' }}>
          {displayName}
        </UI.Label>
      )

    const controlEl =
      (typeof customControlRenderers?.[key] === 'function' && customControlRenderers[key](ctx)) ||
      (typeof customControlRenderers?.segment === 'function' && customControlRenderers.segment(ctx)) || (
        <UI.HStack
          className={getUIClasses(uiLibrary, 'HStack')}
          style={{
            [inlineLabels ? 'flex' : 'width']: inlineLabels ? 1 : '100%',
            gap: '0.5rem',
            flexWrap: 'wrap',
            ...customStyles.hstack,
          }}
        >
          {(fieldTypeConfig.options || []).map((opt) => {
            const selected = (formData[key] ?? value) === opt
            return (
              <UI.Button
                key={opt}
                type="button"
                onClick={() => handleFieldChange(key, opt)}
                className={getUIClasses(uiLibrary, 'Button', selected ? 'primary' : 'secondary')}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: selected ? '1px solid var(--segment-selected-border, #6366f1)' : '1px solid rgba(0,0,0,0.1)',
                  background: selected ? 'var(--segment-selected-bg, #eef2ff)' : 'var(--segment-bg, #fff)',
                  color: selected ? 'var(--segment-selected-fg, #3730a3)' : 'inherit',
                  cursor: 'pointer',
                }}
              >
                {opt}
              </UI.Button>
            )
          })}
        </UI.HStack>
      )

    const { description, placement } = getDescriptionMeta(key, fieldTypeConfig)
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginTop: '0.25rem' }}>
        {description}
      </UI.Text>
    ) : null

    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        {inlineLabels ? (
          <UI.Box style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UI.Box style={{ minWidth: '30%' }}>{labelEl}</UI.Box>
            <UI.Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {controlEl}
              {descEl}
            </UI.Box>
          </UI.Box>
        ) : (
          <>
            {labelEl}
            {placement === 'label' ? descEl : null}
            {controlEl}
            {placement === 'input' ? descEl : null}
          </>
        )}
      </UI.Box>
    )
  }

  // Key-Value list renderer (generic object/array of objects)
  const renderKeyValueListField = (key, value, displayName, fieldTypeConfig = {}) => {
    const originalIsArray = Array.isArray(value)
    const originalIsObjectMap = !originalIsArray && typeof value === 'object' && value !== null

    // Normalize to array of row objects for editing
    const rows = (() => {
      if (originalIsArray) return value
      if (originalIsObjectMap) return Object.entries(value).map(([k, v]) => ({ key: k, value: v }))
      return []
    })()

    // Determine columns to render
    let columns = []
    if (rows.length) {
      const set = new Set()
      rows.forEach((r) => Object.keys(r || {}).forEach((k) => set.add(k)))
      columns = Array.from(set)
    } else if (Array.isArray(fieldTypeConfig.columns)) {
      columns = fieldTypeConfig.columns
    } else if (originalIsObjectMap) {
      columns = ['key', 'value']
    } else {
      columns = ['key', 'value'] // sensible default
    }

    // Helpers to rebuild the original shape
    const commit = (nextRows) => {
      if (originalIsArray) {
        handleFieldChange(key, nextRows)
      } else if (originalIsObjectMap) {
        const nextObj = {}
        nextRows.forEach((r) => {
          const k = r.key ?? r.name
          const v = r.value ?? r.val
          if (k !== undefined && k !== '') nextObj[k] = v
        })
        handleFieldChange(key, nextObj)
      } else {
        handleFieldChange(key, nextRows)
      }
    }

    const updateCell = (rowIdx, colKey, val) => {
      const next = rows.map((r, i) => (i === rowIdx ? { ...r, [colKey]: val } : r))
      commit(next)
    }

    const addRow = () => {
      const template = columns.reduce((acc, c) => ({ ...acc, [c]: '' }), {})
      commit([...rows, template])
    }

    const removeRow = (idx) => {
      const next = rows.filter((_, i) => i !== idx)
      commit(next)
    }

    const gridRow = {
      display: 'grid',
      gridTemplateColumns: `${'1fr '.repeat(columns.length)}auto`.trim(),
      gap: '0.5rem',
      alignItems: 'center',
      padding: '3px 0px',
    }

    const { description, placement } = getDescriptionMeta(key, fieldTypeConfig)
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginBottom: '0.5rem' }}>
        {description}
      </UI.Text>
    ) : null
    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label
          className={getUIClasses(uiLibrary, 'Label')}
          style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            ...customStyles.fieldLabel,
          }}
        >
          {displayName}
        </UI.Label>
        {placement === 'label' ? descEl : null}

        {/* Header row (optional) */}
        {fieldTypeConfig.showHeader !== false && (
          <UI.Box style={{ ...gridRow, fontSize: '12px', opacity: 0.8 }}>
            {columns.map((c) => (
              <UI.Text key={`hdr-${c}`}>{c}</UI.Text>
            ))}
            <span />
          </UI.Box>
        )}

        <UI.VStack style={{ gap: '0.5rem' }}>
          {rows.map((row, idx) => (
            <UI.Box key={`${key}-${idx}`} style={gridRow}>
              {columns.map((c) => (
                <UI.Input
                  key={`${key}-${idx}-${c}`}
                  type="text"
                  placeholder={c}
                  value={row?.[c] ?? ''}
                  onChange={(e) => updateCell(idx, c, e.target.value)}
                  className={getUIClasses(uiLibrary, 'Input')}
                  style={customStyles.input}
                />
              ))}
              <UI.Button
                aria-label={`Remove ${displayName} row ${idx + 1}`}
                onClick={() => removeRow(idx)}
                className={getUIClasses(uiLibrary, 'Button', 'secondary')}
                style={{ padding: '6px 10px' }}
              >
                ×
              </UI.Button>
            </UI.Box>
          ))}

          <UI.Button
            onClick={addRow}
            className={getUIClasses(uiLibrary, 'Button', 'default')}
            style={{ alignSelf: 'flex-start', padding: '6px 10px' }}
          >
            + Add {displayName}
          </UI.Button>
        </UI.VStack>
        {placement === 'input' ? descEl : null}
      </UI.Box>
    )
  }

  // Use adapter class mapping for tailwind/shadcn; Chakra returns empty string
  const getUIClasses = (lib, component, variant) => _getUIClasses(lib, component, variant)

  // Helper: resolve description text and placement for a field
  // placement: 'label' (default) or 'input'
  const getDescriptionMeta = (key, fieldTypeConfig = {}) => {
    const cfg = fieldConfig?.[key] || {}
    const description = fieldTypeConfig.description ?? cfg.description
    const placementRaw = fieldTypeConfig.descriptionPlacement ?? cfg.descriptionPlacement
    const placement = placementRaw === 'input' ? 'input' : 'label'
    return { description, placement }
  }

  const parseJson = useCallback(
    (jsonString = jsonInput) => {
      const result = parseJsonSafely(jsonString)

      if (result.success) {
        setParsedJson(result.data)
        const flattened = flattenObject(result.data)
        setFormData(flattened)
        setOriginalFormData({ ...flattened })
        setError('')
      } else {
        setError(result.error)
        setParsedJson(null)
        setFormData({})
        setOriginalFormData({})
      }
    },
    [jsonInput],
  )

  useEffect(() => {
    if (initialJson) {
      setJsonInput(initialJson)
      parseJson(initialJson)
    } else if (initialJson === '') {
      // Clear everything when initialJson is explicitly set to empty string
      setJsonInput('')
      setFormData({})
      setOriginalFormData({})
      setParsedJson(null)
      setError('')
    }
  }, [initialJson, parseJson])

  

  const handleFieldChange = (key, value) => {
    const newFormData = {
      ...formData,
      [key]: value,
    }
    setFormData(newFormData)

    if (onFieldChange) {
      const nestedData = unflattenObject(newFormData)
      onFieldChange(key, value, nestedData)
    }
  }

  const handleSave = () => {
    if (onSave) {
      const nestedData = unflattenObject(formData)
      onSave(nestedData, formData)
    }
  }

  const handleCancel = () => {
    setFormData({ ...originalFormData })
    if (onCancel) {
      onCancel()
    }
  }

  const renderFormField = (key, value) => {
    const fieldTypeConfig = getInputType(value, key, fieldConfig)
    const displayName = getDisplayName(key)

    // Parent-aware renderer context
    const rendererCtx = {
      key,
      value,
      displayName,
      fieldTypeConfig,
      formData,
      onChange: (val) => handleFieldChange(key, val),
      UI,
      props: {
        uiLibrary,
        onSave,
        onCancel,
        onFieldChange,
        saveButtonText,
        cancelButtonText,
        initialJson,
        customStyles,
        showControls,
        inlineLabels,
        columns,
        fieldConfig,
        sections,
        includeUnsectioned,
        unsectionedTitle,
        ...props,
      },
    }

    // 1) Per-field override takes precedence
    const fieldOverride = customFieldRenderers?.[key]
    if (typeof fieldOverride === 'function') {
      return <React.Fragment key={key}>{fieldOverride(rendererCtx)}</React.Fragment>
    }

    // 2) Per-type override next
    const typeOverride = customInputRenderers?.[fieldTypeConfig.type]
    if (typeof typeOverride === 'function') {
      return <React.Fragment key={key}>{typeOverride(rendererCtx)}</React.Fragment>
    }

    // Handle different field types based on configuration
    switch (fieldTypeConfig.type) {
      case 'checkbox':
        return renderCheckboxField(key, value, displayName, fieldTypeConfig)
      case 'select':
        return renderSelectField(key, value, displayName, fieldTypeConfig)
      case 'segment':
        return renderSegmentField(key, value, displayName, fieldTypeConfig)
      case 'multi-select':
        return renderMultiSelectField(key, value, displayName, fieldTypeConfig)
      case 'textarea':
        return renderTextareaField(key, value, displayName, fieldTypeConfig)
      case 'email':
      case 'url':
      case 'date':
      case 'password':
        return renderSpecialInputField(key, value, displayName, fieldTypeConfig)
      case 'number':
        return renderNumberField(key, value, displayName, fieldTypeConfig)
      case 'slider':
        return renderSliderField(key, value, displayName, fieldTypeConfig)
      case 'tags':
        return _renderTagsField(key, value, displayName, fieldTypeConfig)
      case 'key-value-list':
        return renderKeyValueListField(key, value, displayName, fieldTypeConfig)
      case 'array':
        return renderArrayField(key, value, displayName, fieldTypeConfig)
      case 'object':
        return renderObjectField(key, value, displayName, fieldTypeConfig)
      default:
        return renderTextInputField(key, value, displayName, fieldTypeConfig)
    }
  }

  // Slider field renderer (HTML range input)
  const renderSliderField = (key, value, displayName, fieldTypeConfig) => {
    const min = fieldTypeConfig.min ?? 0
    const max = fieldTypeConfig.max ?? 100
    const step = fieldTypeConfig.step ?? 1
    const current = typeof formData[key] === 'number' ? formData[key] : (fieldTypeConfig.default ?? min)

    const { description, placement } = getDescriptionMeta(key, fieldTypeConfig)
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginTop: '0.25rem', marginBottom: placement === 'label' ? '0.5rem' : 0 }}>
        {description}
      </UI.Text>
    ) : null
    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label className={getUIClasses(uiLibrary, 'Label')} style={customStyles.label}>
          <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontWeight: '500', ...customStyles.fieldLabel }}>
            {displayName}
          </UI.Text>
        </UI.Label>
        {placement === 'label' ? descEl : null}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            onChange={(e) => handleFieldChange(key, Number(e.target.value))}
            className={getUIClasses(uiLibrary, 'Input', 'range')}
            style={{ width: '100%' }}
          />
          <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ minWidth: '3rem', textAlign: 'right' }}>
            {current}
          </UI.Text>
        </div>
        {placement === 'input' ? descEl : null}
      </UI.Box>
    )
  }

  // Checkbox field renderer
  const renderCheckboxField = (key, value, displayName) => {
    const ctx = {
      key,
      value,
      displayName,
      fieldTypeConfig: { type: 'checkbox' },
      formData,
      onChange: (val) => handleFieldChange(key, val),
      UI,
      props: { uiLibrary, customStyles, inlineLabels, ...props },
    }
    const labelNode =
      (typeof customLabelRenderers?.[key] === 'function' && customLabelRenderers[key](ctx)) ||
      (typeof customLabelRenderers?.checkbox === 'function' && customLabelRenderers.checkbox(ctx)) || (
        <UI.Text
          className={getUIClasses(uiLibrary, 'Text')}
          style={{ fontWeight: '500', ...customStyles.fieldLabel }}
        >
          {displayName}
        </UI.Text>
      )

    const controlNode =
      (typeof customControlRenderers?.[key] === 'function' && customControlRenderers[key](ctx)) ||
      (typeof customControlRenderers?.checkbox === 'function' && customControlRenderers.checkbox(ctx)) || (
        <input
          type="checkbox"
          checked={formData[key] || false}
          onChange={(e) => handleFieldChange(key, e.target.checked)}
          className={getUIClasses(uiLibrary, 'Input', 'checkbox')}
          style={customStyles.checkbox}
        />
      )

    const { description, placement } = getDescriptionMeta(key, { type: 'checkbox', ...fieldConfig?.[key] })
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
        {description}
      </UI.Text>
    ) : null
    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        {placement === 'label' ? descEl : null}
        <UI.Label
          className={getUIClasses(uiLibrary, 'Label')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            ...customStyles.label,
          }}
        >
          {controlNode}
          {labelNode}
        </UI.Label>
        {placement === 'input' ? descEl : null}
      </UI.Box>
    )
  }

  // Select field renderer
  const renderSelectField = (key, value, displayName, fieldTypeConfig) => {
    const ctx = {
      key,
      value,
      displayName,
      fieldTypeConfig,
      formData,
      onChange: (val) => handleFieldChange(key, val),
      UI,
      props: { uiLibrary, customStyles, inlineLabels, ...props },
    }
    const labelEl =
      (typeof customLabelRenderers?.[key] === 'function' && customLabelRenderers[key](ctx)) ||
      (typeof customLabelRenderers?.select === 'function' && customLabelRenderers.select(ctx)) || (
        <UI.Label className={getUIClasses(uiLibrary, 'Label')} style={{ ...customStyles.fieldLabel, marginBottom: inlineLabels ? 0 : '0.5rem' }}>
          {displayName}
        </UI.Label>
      )
    const controlEl =
      (typeof customControlRenderers?.[key] === 'function' && customControlRenderers[key](ctx)) ||
      (typeof customControlRenderers?.select === 'function' && customControlRenderers.select(ctx)) || (
        <UI.Select
          value={formData[key] || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className={getUIClasses(uiLibrary, 'Select')}
          style={{ [inlineLabels ? 'flex' : 'width']: inlineLabels ? 1 : '100%', ...customStyles.select }}
        >
          <option value="">Select {displayName}</option>
          {fieldTypeConfig.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </UI.Select>
      )
    const { description, placement } = getDescriptionMeta(key, fieldTypeConfig)
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginTop: '0.25rem' }}>
        {description}
      </UI.Text>
    ) : null
    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        {inlineLabels ? (
          <UI.Box style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UI.Box style={{ minWidth: '30%' }}>{labelEl}</UI.Box>
            <UI.Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {controlEl}
              {descEl}
            </UI.Box>
          </UI.Box>
        ) : (
          <>
            {labelEl}
            {placement === 'label' ? descEl : null}
            {controlEl}
            {placement === 'input' ? descEl : null}
          </>
        )}
      </UI.Box>
    )
  }

  // Multi-select field renderer
  const renderMultiSelectField = (key, value, displayName, fieldTypeConfig) => {
    const selectedValues = Array.isArray(formData[key]) ? formData[key] : []
    const { description, placement } = getDescriptionMeta(key, fieldTypeConfig)
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginTop: '0.25rem', marginBottom: placement === 'label' ? '0.5rem' : 0 }}>
        {description}
      </UI.Text>
    ) : null

    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label
          className={getUIClasses(uiLibrary, 'Label')}
          style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            ...customStyles.fieldLabel,
          }}
        >
          {displayName}
        </UI.Label>
        {placement === 'label' ? descEl : null}
        <UI.Box style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {fieldTypeConfig.options?.map((option) => (
            <UI.Label
              key={option}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={(e) => {
                  const newValues = e.target.checked
                    ? [...selectedValues, option]
                    : selectedValues.filter((v) => v !== option)
                  handleFieldChange(key, newValues)
                }}
                style={customStyles.checkbox}
              />
              <UI.Text style={{ fontSize: '14px', ...customStyles.text }}>{option}</UI.Text>
            </UI.Label>
          ))}
        </UI.Box>
        {placement === 'input' ? descEl : null}
      </UI.Box>
    )
  }

  // Textarea field renderer
  const renderTextareaField = (key, value, displayName, fieldTypeConfig) => {
    const ctx = {
      key,
      value,
      displayName,
      fieldTypeConfig,
      formData,
      onChange: (val) => handleFieldChange(key, val),
      UI,
      props: { uiLibrary, customStyles, inlineLabels, ...props },
    }
    const labelEl =
      (typeof customLabelRenderers?.[key] === 'function' && customLabelRenderers[key](ctx)) ||
      (typeof customLabelRenderers?.textarea === 'function' && customLabelRenderers.textarea(ctx)) || (
        <UI.Label className={getUIClasses(uiLibrary, 'Label')} style={{ ...customStyles.fieldLabel, marginBottom: inlineLabels ? 0 : '0.5rem' }}>
          {displayName}
        </UI.Label>
      )
    const controlEl =
      (typeof customControlRenderers?.[key] === 'function' && customControlRenderers[key](ctx)) ||
      (typeof customControlRenderers?.textarea === 'function' && customControlRenderers.textarea(ctx)) || (
        <UI.Textarea
          value={formData[key] || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className={getUIClasses(uiLibrary, 'Textarea')}
          style={{
            [inlineLabels ? 'flex' : 'width']: inlineLabels ? 1 : '100%',
            minHeight: `${(fieldTypeConfig.rows || 4) * 1.5}rem`,
            ...customStyles.textarea,
          }}
        />
      )
    const { description, placement } = getDescriptionMeta(key, fieldTypeConfig)
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginTop: '0.25rem' }}>
        {description}
      </UI.Text>
    ) : null
    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        {inlineLabels ? (
          <UI.Box style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <UI.Box style={{ minWidth: '30%' }}>{labelEl}</UI.Box>
            <UI.Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {controlEl}
              {descEl}
            </UI.Box>
          </UI.Box>
        ) : (
          <>
            {labelEl}
            {placement === 'label' ? descEl : null}
            {controlEl}
            {placement === 'input' ? descEl : null}
          </>
        )}
      </UI.Box>
    )
  }

  // Special input field renderer (email, url, date, password)
  const renderSpecialInputField = (key, value, displayName, fieldTypeConfig) => {
    const ctx = {
      key,
      value,
      displayName,
      fieldTypeConfig,
      formData,
      onChange: (val) => handleFieldChange(key, val),
      UI,
      props: { uiLibrary, customStyles, inlineLabels, ...props },
    }
    const labelEl =
      (typeof customLabelRenderers?.[key] === 'function' && customLabelRenderers[key](ctx)) ||
      (typeof customLabelRenderers?.[fieldTypeConfig.type] === 'function' && customLabelRenderers[fieldTypeConfig.type](ctx)) || (
        <UI.Label className={getUIClasses(uiLibrary, 'Label')} style={{ ...customStyles.fieldLabel, marginBottom: inlineLabels ? 0 : '0.5rem' }}>
          {displayName}
        </UI.Label>
      )
    const controlEl =
      (typeof customControlRenderers?.[key] === 'function' && customControlRenderers[key](ctx)) ||
      (typeof customControlRenderers?.[fieldTypeConfig.type] === 'function' && customControlRenderers[fieldTypeConfig.type](ctx)) || (
        <UI.Input
          type={fieldTypeConfig.type}
          value={formData[key] || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className={getUIClasses(uiLibrary, 'Input')}
          style={{ [inlineLabels ? 'flex' : 'width']: inlineLabels ? 1 : '100%', ...customStyles.input }}
        />
      )
    const descEl = fieldTypeConfig.description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginTop: inlineLabels ? '0.25rem' : '0.25rem', marginBottom: inlineLabels ? 0 : '0.25rem' }}>
        {fieldTypeConfig.description}
      </UI.Text>
    ) : null
    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        {inlineLabels ? (
          <UI.Box style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UI.Box style={{ minWidth: '30%' }}>{labelEl}</UI.Box>
            <UI.Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {controlEl}
              {descEl}
            </UI.Box>
          </UI.Box>
        ) : (
          <>
            {labelEl}
            {descEl}
            {controlEl}
          </>
        )}
      </UI.Box>
    )
  }

  // Number field renderer
  const renderNumberField = (key, value, displayName) => {
    const ctx = {
      key,
      value,
      displayName,
      fieldTypeConfig: { type: 'number' },
      formData,
      onChange: (val) => handleFieldChange(key, val),
      UI,
      props: { uiLibrary, customStyles, inlineLabels, ...props },
    }
    const labelEl =
      (typeof customLabelRenderers?.[key] === 'function' && customLabelRenderers[key](ctx)) ||
      (typeof customLabelRenderers?.number === 'function' && customLabelRenderers.number(ctx)) || (
        <UI.Label
          className={getUIClasses(uiLibrary, 'Label')}
          style={{ display: 'block', fontWeight: '600', marginBottom: inlineLabels ? 0 : '0.5rem', ...customStyles.fieldLabel }}
        >
          {displayName}
        </UI.Label>
      )
    const controlEl =
      (typeof customControlRenderers?.[key] === 'function' && customControlRenderers[key](ctx)) ||
      (typeof customControlRenderers?.number === 'function' && customControlRenderers.number(ctx)) || (
        <UI.Input
          type="number"
          value={formData[key] || ''}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0
            handleFieldChange(key, val)
          }}
          className={getUIClasses(uiLibrary, 'Input')}
          style={{ [inlineLabels ? 'flex' : 'width']: inlineLabels ? 1 : '100%', ...customStyles.input }}
        />
      )
    const { description, placement } = getDescriptionMeta(key, { type: 'number', ...fieldConfig?.[key] })
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginTop: '0.25rem' }}>
        {description}
      </UI.Text>
    ) : null
    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        {inlineLabels ? (
          <UI.Box style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UI.Box style={{ minWidth: '30%' }}>{labelEl}</UI.Box>
            <UI.Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {controlEl}
              {descEl}
            </UI.Box>
          </UI.Box>
        ) : (
          <>
            {labelEl}
            {placement === 'label' ? descEl : null}
            {controlEl}
            {placement === 'input' ? descEl : null}
          </>
        )}
      </UI.Box>
    )
  }

  // Array field renderer
  const renderArrayField = (key, value, displayName, fieldTypeConfig) => {
    const arr = Array.isArray(value) ? value : []
    const isStringArray = arr.every((v) => typeof v === 'string')

    // If it's an array of strings, render as pill chips with add/delete
    if (isStringArray) {
      const tags = Array.isArray(formData[key]) ? formData[key] : []
      const newTag = tagInputs[key] || ''

      const addTag = (tag) => {
        const t = (tag || '').trim()
        if (!t) return
        if (tags.includes(t)) return
        handleFieldChange(key, [...tags, t])
        setTagInputs((prev) => ({ ...prev, [key]: '' }))
      }

      const removeTag = (tag) => {
        handleFieldChange(
          key,
          tags.filter((t) => t !== tag),
        )
      }

      const onKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault()
          addTag(newTag)
        } else if (e.key === 'Backspace' && !newTag && tags.length) {
          removeTag(tags[tags.length - 1])
        }
      }

      const pillStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '999px',
        background: '#eef2ff',
        color: '#3730a3',
        border: '1px solid #c7d2fe',
        fontSize: '12px',
      }

      const pillCloseStyle = {
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        color: '#4338ca',
        fontSize: '14px',
        lineHeight: 1,
      }

      const { description, placement } = getDescriptionMeta(key, fieldTypeConfig)
      const descEl = description ? (
        <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginBottom: '0.5rem' }}>
          {description}
        </UI.Text>
      ) : null
      return (
        <UI.Box
          key={key}
          className={getUIClasses(uiLibrary, 'Box')}
          style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
        >
          <UI.Label
            className={getUIClasses(uiLibrary, 'Label')}
            style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
              ...customStyles.fieldLabel,
            }}
          >
            {displayName}
          </UI.Label>
          {placement === 'label' ? descEl : null}
          <UI.Box style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {tags.map((tag) => (
              <span key={tag} style={pillStyle}>
                {tag}
                <button
                  aria-label={`Remove ${tag}`}
                  onClick={() => removeTag(tag)}
                  style={pillCloseStyle}
                >
                  ×
                </button>
              </span>
            ))}
            <UI.Input
              type="text"
              value={newTag}
              onChange={(e) => setTagInputs((prev) => ({ ...prev, [key]: e.target.value }))}
              onKeyDown={onKeyDown}
              placeholder={fieldTypeConfig.placeholder || `Add ${displayName} and press Enter`}
              className={getUIClasses(uiLibrary, 'Input')}
              style={{ minWidth: '140px', flex: '0 1 auto', ...customStyles.input }}
            />
            <UI.Button
              onClick={() => addTag(newTag)}
              className={getUIClasses(uiLibrary, 'Button', 'secondary')}
              style={{ padding: '6px 10px' }}
            >
              Add
            </UI.Button>
          </UI.Box>
          {placement === 'input' ? descEl : null}
        </UI.Box>
      )
    }

    // Fallback: render as JSON textarea for non-string arrays
    const { description, placement } = getDescriptionMeta(key, fieldTypeConfig)
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginBottom: '0.5rem' }}>
        {description}
      </UI.Text>
    ) : null
    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label
          className={getUIClasses(uiLibrary, 'Label')}
          style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            ...customStyles.fieldLabel,
          }}
        >
          {displayName} (Array)
        </UI.Label>
        {placement === 'label' ? descEl : null}
        <UI.Textarea
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              handleFieldChange(key, parsed)
            } catch {
              handleFieldChange(key, e.target.value)
            }
          }}
          className={getUIClasses(uiLibrary, 'Textarea')}
          style={{
            fontFamily: 'monospace',
            minHeight: '100px',
            width: '100%',
            ...customStyles.textarea,
          }}
        />
        {placement === 'input' ? descEl : null}
      </UI.Box>
    )
  }

  // Tags field renderer (pill chips with delete and input to add)
  const _renderTagsField = (key, value, displayName, fieldTypeConfig) => {
    const tags = Array.isArray(formData[key]) ? formData[key] : []
    const newTag = tagInputs[key] || ''

    const addTag = (tag) => {
      const t = (tag || '').trim()
      if (!t) return
      if (tags.includes(t)) return
      handleFieldChange(key, [...tags, t])
      setTagInputs((prev) => ({ ...prev, [key]: '' }))
    }

    const removeTag = (tag) => {
      handleFieldChange(
        key,
        tags.filter((t) => t !== tag),
      )
    }

    const onKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        addTag(newTag)
      } else if (e.key === 'Backspace' && !newTag && tags.length) {
        // quick remove last tag
        removeTag(tags[tags.length - 1])
      }
    }

    const pillStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 8px',
      borderRadius: '999px',
      background: '#eef2ff',
      color: '#3730a3',
      border: '1px solid #c7d2fe',
      fontSize: '12px',
    }

    const pillCloseStyle = {
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      color: '#4338ca',
      fontSize: '14px',
      lineHeight: 1,
    }

    const { description, placement } = getDescriptionMeta(key, fieldTypeConfig)
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginBottom: '0.5rem' }}>
        {description}
      </UI.Text>
    ) : null
    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label
          className={getUIClasses(uiLibrary, 'Label')}
          style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            ...customStyles.fieldLabel,
          }}
        >
          {displayName}
        </UI.Label>
        {placement === 'label' ? descEl : null}
        <UI.Box style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {tags.map((tag) => (
            <span key={tag} style={pillStyle}>
              {tag}
              <button
                aria-label={`Remove ${tag}`}
                onClick={() => removeTag(tag)}
                style={pillCloseStyle}
              >
                ×
              </button>
            </span>
          ))}
          <UI.Input
            type="text"
            value={newTag}
            onChange={(e) => setTagInputs((prev) => ({ ...prev, [key]: e.target.value }))}
            onKeyDown={onKeyDown}
            placeholder={fieldTypeConfig.placeholder || 'Add tag and press Enter'}
            className={getUIClasses(uiLibrary, 'Input')}
            style={{ minWidth: '140px', flex: '0 1 auto', ...customStyles.input }}
          />
          <UI.Button
            onClick={() => addTag(newTag)}
            className={getUIClasses(uiLibrary, 'Button', 'secondary')}
            style={{ padding: '6px 10px' }}
          >
            Add
          </UI.Button>
        </UI.Box>
        {placement === 'input' ? descEl : null}
      </UI.Box>
    )
  }

  // Object field renderer
  const renderObjectField = (key, value, displayName) => {
    const { description, placement } = getDescriptionMeta(key, fieldConfig?.[key] || { type: 'object' })
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginBottom: '0.5rem' }}>
        {description}
      </UI.Text>
    ) : null
    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label
          className={getUIClasses(uiLibrary, 'Label')}
          style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            ...customStyles.fieldLabel,
          }}
        >
          {displayName} (Object)
        </UI.Label>
        {placement === 'label' ? descEl : null}
        <UI.Textarea
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              handleFieldChange(key, parsed)
            } catch {
              // Keep the raw string value for now
              handleFieldChange(key, e.target.value)
            }
          }}
          className={getUIClasses(uiLibrary, 'Textarea')}
          style={{
            fontFamily: 'monospace',
            minHeight: '100px',
            width: '100%',
            ...customStyles.textarea,
          }}
        />
        {placement === 'input' ? descEl : null}
      </UI.Box>
    )
  }

  // Text input field renderer (default)
  const renderTextInputField = (key, value, displayName) => {
    const ctx = {
      key,
      value,
      displayName,
      fieldTypeConfig: { type: 'text' },
      formData,
      onChange: (val) => handleFieldChange(key, val),
      UI,
      props: { uiLibrary, customStyles, inlineLabels, ...props },
    }
    const labelEl =
      (typeof customLabelRenderers?.[key] === 'function' && customLabelRenderers[key](ctx)) ||
      (typeof customLabelRenderers?.text === 'function' && customLabelRenderers.text(ctx)) || (
        <UI.Label
          className={getUIClasses(uiLibrary, 'Label')}
          style={{ display: 'block', fontWeight: '600', marginBottom: inlineLabels ? 0 : '0.5rem', ...customStyles.fieldLabel }}
        >
          {displayName}
        </UI.Label>
      )
    const controlEl =
      (typeof customControlRenderers?.[key] === 'function' && customControlRenderers[key](ctx)) ||
      (typeof customControlRenderers?.text === 'function' && customControlRenderers.text(ctx)) || (
        <UI.Input
          type="text"
          value={formData[key] || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className={getUIClasses(uiLibrary, 'Input')}
          style={{ [inlineLabels ? 'flex' : 'width']: inlineLabels ? 1 : '100%', ...customStyles.input }}
        />
      )
    const { description, placement } = getDescriptionMeta(key, { type: 'text', ...fieldConfig?.[key] })
    const descEl = description ? (
      <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ fontSize: '12px', opacity: 0.8, marginTop: '0.25rem' }}>
        {description}
      </UI.Text>
    ) : null
    return (
      <UI.Box
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        {inlineLabels ? (
          <UI.Box style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UI.Box style={{ minWidth: '30%' }}>{labelEl}</UI.Box>
            <UI.Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {controlEl}
              {descEl}
            </UI.Box>
          </UI.Box>
        ) : (
          <>
            {labelEl}
            {placement === 'label' ? descEl : null}
            {controlEl}
            {placement === 'input' ? descEl : null}
          </>
        )}
      </UI.Box>
    )
  }

  // Function to render form fields in columns
  const renderFormFields = () => {
    // If sections prop is provided, render grouped sections first
    if (Array.isArray(sections) && sections.length) {
      const allKeys = Object.keys(formData)
      const used = new Set()
      const sectionBlocks = sections.map((sec, idx) => {
        const secId = sec.id || `section-${idx}`
        const listed = Array.isArray(sec.fields) ? sec.fields : []
        listed.forEach((k) => used.add(k))
        // Build section content honoring columns
        const sectionKeys = listed.filter((k) => allKeys.includes(k))
        const content = (() => {
          if (columns <= 1) {
            return (
              <UI.VStack key={secId} style={{ gap: '1rem' }}>
                {sectionKeys.map((k) => renderFormField(k, formData[k]))}
              </UI.VStack>
            )
          }
          const fieldsPerColumn = Math.ceil(sectionKeys.length / columns)
          const columnGroups = []
          for (let i = 0; i < columns; i++) {
            const startIndex = i * fieldsPerColumn
            const endIndex = Math.min(startIndex + fieldsPerColumn, sectionKeys.length)
            columnGroups.push(sectionKeys.slice(startIndex, endIndex))
          }
          const gridStyles = {
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '2rem',
            width: '100%',
            ...customStyles.formGrid,
          }
          return (
            <UI.Box key={secId} className={getUIClasses(uiLibrary, 'Box')} style={gridStyles}>
              {columnGroups.map((group, idx) => (
                <UI.VStack
                  key={idx}
                  className={getUIClasses(uiLibrary, 'VStack')}
                  style={{ gap: '1rem', ...customStyles.formColumn }}
                >
                  {group.map((k) => renderFormField(k, formData[k]))}
                </UI.VStack>
              ))}
            </UI.Box>
          )
        })()

        const baselineOpen = !!(sec.defaultOpen || !sec.collapsible)
        const open = sectionOpenIds.has(secId) ? !baselineOpen : baselineOpen
        const toggle = () =>
          setSectionOpenIds((prev) => {
            const next = new Set(prev)
            if (next.has(secId)) next.delete(secId)
            else next.add(secId)
            return next
          })

        return (
          <UI.Box key={`wrap-${secId}`} style={{ marginBottom: '1.25rem' }}>
            <UI.Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <UI.Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {sec.collapsible && (
                  <button
                    aria-label={`Toggle ${sec.title}`}
                    onClick={toggle}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    <span>{open ? '▼' : '▶'}</span>
                  </button>
                )}
                <UI.Heading className={getUIClasses(uiLibrary, 'Heading')} style={{ margin: 0 }}>
                  {sec.title}
                </UI.Heading>
              </UI.Box>
              {sec.description && (
                <UI.Text className={getUIClasses(uiLibrary, 'Text')} style={{ opacity: 0.8 }}>
                  {sec.description}
                </UI.Text>
              )}
            </UI.Box>
            {(!sec.collapsible || open) && content}
          </UI.Box>
        )
      })

      // Unsectioned fields
      let otherBlock = null
      if (includeUnsectioned) {
        const remaining = allKeys.filter((k) => !used.has(k))
        if (remaining.length) {
          const secId = 'unsectioned'
          const baselineOpen = true
          const open = sectionOpenIds.has(secId) ? !baselineOpen : baselineOpen
          const toggle = () =>
            setSectionOpenIds((prev) => {
              const next = new Set(prev)
              if (next.has(secId)) next.delete(secId)
              else next.add(secId)
              return next
            })
          otherBlock = (
            <UI.Box key={`wrap-${secId}`} style={{ marginBottom: '1.25rem' }}>
              <UI.Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}
              >
                <UI.Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    aria-label={`Toggle ${unsectionedTitle}`}
                    onClick={toggle}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    <span>{open ? '▼' : '▶'}</span>
                  </button>
                  <UI.Heading className={getUIClasses(uiLibrary, 'Heading')} style={{ margin: 0 }}>
                    {unsectionedTitle}
                  </UI.Heading>
                </UI.Box>
              </UI.Box>
              {open &&
                (() => {
                  if (columns <= 1) {
                    return (
                      <UI.VStack style={{ gap: '1rem' }}>
                        {remaining.map((k) => renderFormField(k, formData[k]))}
                      </UI.VStack>
                    )
                  }
                  const fieldsPerColumn = Math.ceil(remaining.length / columns)
                  const columnGroups = []
                  for (let i = 0; i < columns; i++) {
                    const startIndex = i * fieldsPerColumn
                    const endIndex = Math.min(startIndex + fieldsPerColumn, remaining.length)
                    columnGroups.push(remaining.slice(startIndex, endIndex))
                  }
                  const gridStyles = {
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: '2rem',
                    width: '100%',
                    ...customStyles.formGrid,
                  }
                  return (
                    <UI.Box className={getUIClasses(uiLibrary, 'Box')} style={gridStyles}>
                      {columnGroups.map((group, idx) => (
                        <UI.VStack
                          key={idx}
                          className={getUIClasses(uiLibrary, 'VStack')}
                          style={{ gap: '1rem', ...customStyles.formColumn }}
                        >
                          {group.map((k) => renderFormField(k, formData[k]))}
                        </UI.VStack>
                      ))}
                    </UI.Box>
                  )
                })()}
            </UI.Box>
          )
        }
      }

      return (
        <UI.VStack
          className={getUIClasses(uiLibrary, 'VStack')}
          style={{ gap: '1rem', ...customStyles.formStack }}
        >
          {sectionBlocks}
          {otherBlock}
        </UI.VStack>
      )
    }

    const formEntries = Object.entries(formData)

    if (columns <= 1) {
      // Single column layout (default)
      return (
        <UI.VStack
          className={getUIClasses(uiLibrary, 'VStack')}
          style={{ gap: '1rem', ...customStyles.formStack }}
        >
          {formEntries.map(([key, value]) => renderFormField(key, value))}
        </UI.VStack>
      )
    }

    // Multi-column layout
    const fieldsPerColumn = Math.ceil(formEntries.length / columns)
    const columnGroups = []

    for (let i = 0; i < columns; i++) {
      const startIndex = i * fieldsPerColumn
      const endIndex = Math.min(startIndex + fieldsPerColumn, formEntries.length)
      columnGroups.push(formEntries.slice(startIndex, endIndex))
    }

    const gridStyles = {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '2rem',
      width: '100%',
      ...customStyles.formGrid,
    }

    return (
      <UI.Box className={getUIClasses(uiLibrary, 'Box')} style={gridStyles}>
        {columnGroups.map((columnFields, columnIndex) => (
          <UI.VStack
            key={columnIndex}
            className={getUIClasses(uiLibrary, 'VStack')}
            style={{ gap: '1rem', ...customStyles.formColumn }}
          >
            {columnFields.map(([key, value]) => renderFormField(key, value))}
          </UI.VStack>
        ))}
      </UI.Box>
    )
  }

  return (
    <UI.Container
      className={getUIClasses(uiLibrary, 'Container')}
      style={customStyles.container}
      {...props}
    >
      <UI.VStack
        className={getUIClasses(uiLibrary, 'VStack')}
        style={{ gap: '1rem', ...customStyles.stack }}
      >
        

        {error && (
          <UI.Alert
            className={getUIClasses(uiLibrary, 'Alert', 'error')}
            style={customStyles.alert}
          >
            <UI.Text style={customStyles.errorText}>{error}</UI.Text>
          </UI.Alert>
        )}

        {Object.keys(formData).length > 0 && (
          <UI.Card
            className={getUIClasses(uiLibrary, 'Card')}
            style={{ width: '100%', padding: '1rem', ...customStyles.formCard }}
          >
            {renderFormFields()}
          </UI.Card>
        )}

        {showControls && Object.keys(formData).length > 0 && (
          <UI.HStack
            className={getUIClasses(uiLibrary, 'HStack')}
            style={{ gap: '0.5rem', marginTop: '1rem', ...customStyles.controlButtons }}
          >
            <UI.Button
              onClick={handleSave}
              className={getUIClasses(uiLibrary, 'Button', 'default')}
              style={customStyles.saveButton}
            >
              {saveButtonText}
            </UI.Button>
            <UI.Button
              onClick={handleCancel}
              className={getUIClasses(uiLibrary, 'Button', 'secondary')}
              style={customStyles.cancelButton}
            >
              {cancelButtonText}
            </UI.Button>
          </UI.HStack>
        )}
      </UI.VStack>
    </UI.Container>
  )
}

export default Fields
