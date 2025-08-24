import { Box, Text, Input as CInput } from '@chakra-ui/react'
import { useRef } from 'react'
import { Fields } from '../../lib'
import { getFormStyles } from '../styles/formStyles'

export default function PreviewPanel({
  palette,
  theme,
  parsedJson,
  jsonError,
  bundleStats,
  editorValue,
  parsedFieldConfig,
  uiLibrary,
  inlineLabels,
  sectionsConfig,
}) {
  const customFormStyles = getFormStyles(palette, theme)
  const CBox = uiLibrary === 'chakra' ? Box : 'div'
  const CText = uiLibrary === 'chakra' ? Text : 'span'
  const inputRef = useRef(null)
  const inputRefMulti = useRef(null)

  // Demo: custom label renderers (per-field and per-type)
  const customLabelRenderers = {
    // Per-field: friendlier label for email
    email: ({ UI }) => <UI.Label style={{ fontWeight: 700 }}>Email Address</UI.Label>,
    // Per-type: add asterisk to all text labels
    text: ({ UI, displayName }) => <UI.Label style={{ fontWeight: 600 }}>{displayName} *</UI.Label>,
  }

  // Helper to batch-assign the same renderer across many fields
  const mapFields = (keys, renderer) => Object.fromEntries(keys.map((k) => [k, renderer]))

  // Factory for Chakra-styled image drop zones (single/multiple)
  const makeImageDrop =
    ({ multiple }) =>
    ({ key, value, onChange, UI }) => {
      const list = multiple && Array.isArray(value) ? value : value
      const onFiles = (files) => {
        const imgs = files.filter((f) => f && f.type?.startsWith('image/'))
        if (!imgs.length) return
        if (multiple) {
          const urls = imgs.map((f) => URL.createObjectURL(f))
          onChange([...(Array.isArray(list) ? list : []), ...urls])
        } else {
          onChange(URL.createObjectURL(imgs[0]))
        }
      }
      const onDrop = (e) => {
        e.preventDefault()
        onFiles(Array.from(e.dataTransfer?.files || []))
      }
      const onSelect = (e) => onFiles(Array.from(e.target.files || []))
      const preventDefaults = (e) => {
        e.preventDefault()
        e.stopPropagation()
      }
      const removeAt = (idx) => onChange((list || []).filter((_, i) => i !== idx))
      const clearAll = () => onChange(multiple ? [] : '')
      return (
        <UI.Box>
          <div
            onDragEnter={preventDefaults}
            onDragOver={preventDefaults}
            onDragLeave={preventDefaults}
            onDrop={onDrop}
            onClick={() =>
              multiple ? inputRefMulti?.current?.click() : inputRef?.current?.click()
            }
            style={{
              border: `1px dashed ${palette.border}`,
              background: palette.muted,
              padding: 12,
              borderRadius: 8,
              cursor: 'pointer',
              textAlign: 'center',
              color: palette.subtext,
              fontSize: 12,
            }}
          >
            {multiple
              ? 'Drag & drop images here, or click to select'
              : 'Drag & drop an image here, or click to select'}
          </div>
          <input
            ref={(el) => (multiple ? (inputRefMulti.current = el) : (inputRef.current = el))}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={onSelect}
            style={{ display: 'none' }}
          />
          {multiple ? (
            Array.isArray(list) && list.length ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {list.map((url, idx) => (
                    <div key={`${key}-${idx}`} style={{ position: 'relative' }}>
                      <img
                        src={url}
                        alt={`img-${idx}`}
                        style={{
                          width: 64,
                          height: 64,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: `1px solid ${palette.border}`,
                        }}
                      />
                      <button
                        type="button"
                        aria-label="Remove image"
                        onClick={() => removeAt(idx)}
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: `1px solid ${palette.border}`,
                          background: palette.panel,
                          fontSize: 12,
                          lineHeight: '18px',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={clearAll} style={{ marginTop: 8, fontSize: 12 }}>
                  Clear all
                </button>
              </div>
            ) : null
          ) : value ? (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <img
                src={value}
                alt="preview"
                style={{
                  width: 64,
                  height: 64,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: `1px solid ${palette.border}`,
                }}
              />
              <button type="button" onClick={clearAll} style={{ fontSize: 12 }}>
                Clear
              </button>
            </div>
          ) : null}
        </UI.Box>
      )
    }

  // Demo: custom input renderers (type-based) using the factory
  const customInputRenderers = {
    file: makeImageDrop({ multiple: false }),
    files: makeImageDrop({ multiple: true }),
  }

  // Demo: per-field renderer mapping to reuse the same renderer across many fields
  const imageRenderer = makeImageDrop({ multiple: false })
  const customFieldRenderers = {
    ...mapFields(['avatarUrl', 'profilePhoto', 'coverImg'], imageRenderer),
  }

  // Demo: custom control renderers (per-field and per-type)
  const customControlRenderers = {
    // Per-field: website as URL with subtle prefix
    website: ({ UI, value, onChange }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
        <span style={{ fontSize: 12, color: palette.subtext }}>https://</span>
        <UI.Input
          type="url"
          value={(value || '').replace(/^https?:\/\//, '')}
          onChange={(e) => onChange(`https://${e.target.value.replace(/^https?:\/\//, '')}`)}
          style={{ flex: 1 }}
        />
      </div>
    ),
    // Per-field (Chakra example): use Chakra's Input for `name` when using Chakra UI

    name: ({ value, onChange }) => (
      <CInput
        size="sm"
        variant="filled"
        placeholder="Full name"
        value={value || ''}
        color="gray.900"
        onChange={(e) => onChange(e.target.value)}
      />
    ),

    // Per-type: text inputs with placeholder and rounded look
    text: ({ UI, value, onChange }) => (
      <UI.Input
        type="text"
        placeholder="Enter text…"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', borderRadius: 8, padding: '8px 10px' }}
      />
    ),
    // Per-type: segmented control for 'segment'
    segment: ({ UI, value, onChange, fieldTypeConfig }) => (
      <UI.HStack style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(fieldTypeConfig?.options || []).map((opt) => {
          const selected = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: `1px solid ${selected ? palette.accent || '#6366f1' : palette.border}`,
                background: selected ? palette.muted : palette.panel,
                color: selected ? (palette.accentText || '#3730a3') : 'inherit',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {opt}
            </button>
          )
        })}
      </UI.HStack>
    ),
  }

  return (
    <CBox style={{ minWidth: 0 }}>
      <CBox
        style={{
          padding: '8px 12px',
          background: palette.muted,
          borderBottom: `1px solid ${palette.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <CText style={{ fontSize: '12px', color: palette.subtext }}>Preview</CText>
        {bundleStats && (
          <CBox style={{ fontSize: '11px', color: palette.subtext }}>
            Bundle: {(bundleStats?.totals?.gzipBytes / 1024).toFixed(1)} KB gzip
          </CBox>
        )}
      </CBox>

      <CBox style={{ padding: '16px' }}>
        {!parsedJson && jsonError && (
          <CBox
            style={{
              padding: '12px',
              background: palette.muted,
              border: `1px solid ${palette.border}`,
              borderRadius: '6px',
              color: palette.subtext,
              fontSize: '14px',
            }}
          >
            Fix JSON to preview.
          </CBox>
        )}

        {parsedJson && (
          <Fields
            customStyles={customFormStyles}
            initialJson={editorValue}
            fieldConfig={parsedFieldConfig}
            {...(uiLibrary !== 'none' ? { uiLibrary } : {})}
            inlineLabels={!!inlineLabels}
            columns={2}
            customLabelRenderers={customLabelRenderers}
            customControlRenderers={customControlRenderers}
            customFieldRenderers={customFieldRenderers}
            customInputRenderers={customInputRenderers}
            sections={sectionsConfig}
            includeUnsectioned
            saveButtonText="Save"
            cancelButtonText="Reset"
          />
        )}
      </CBox>
    </CBox>
  )
}
