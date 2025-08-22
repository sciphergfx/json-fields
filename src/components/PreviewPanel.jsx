import { Box, Text, Input as CInput } from '@chakra-ui/react'
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
}) {
  const customFormStyles = getFormStyles(palette, theme)
  const CBox = uiLibrary === 'chakra' ? Box : 'div'
  const CText = uiLibrary === 'chakra' ? Text : 'span'

  // Demo: custom label renderers (per-field and per-type)
  const customLabelRenderers = {
    // Per-field: friendlier label for email
    email: ({ UI }) => <UI.Label style={{ fontWeight: 700 }}>Email Address</UI.Label>,
    // Per-type: add asterisk to all text labels
    text: ({ UI, displayName }) => <UI.Label style={{ fontWeight: 600 }}>{displayName} *</UI.Label>,
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
            sections={[
              {
                id: 'profile',
                title: 'Profile',
                description: 'Basic information',
                fields: ['name', 'email', 'website', 'role', 'joinDate', 'age', 'salary', 'rating'],
                collapsible: true,
                defaultOpen: true,
              },
              {
                id: 'about',
                title: 'About',
                description: 'Biography, skills, tags, headers',
                fields: ['bio', 'skills', 'tags', 'headers'],
                collapsible: true,
                defaultOpen: true,
              },
              {
                id: 'preferences',
                title: 'Preferences',
                description: 'Theme & Notifications',
                fields: ['preferences.theme', 'preferences.notifications', 'isActive'],
                collapsible: true,
                defaultOpen: true,
              },
              {
                id: 'security',
                title: 'Security',
                fields: ['password'],
                collapsible: true,
                defaultOpen: false,
              },
            ]}
            includeUnsectioned
            saveButtonText="Save"
            cancelButtonText="Reset"
          />
        )}
      </CBox>
    </CBox>
  )
}
