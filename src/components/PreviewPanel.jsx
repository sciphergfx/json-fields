import { Box, Text } from '@chakra-ui/react'
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
}) {
  const customFormStyles = getFormStyles(palette, theme)
  const CBox = uiLibrary === 'chakra' ? Box : 'div'
  const CText = uiLibrary === 'chakra' ? Text : 'span'

  return (
    <CBox style={{ display: '0 0 70%', minWidth: 0 }}>
      <CBox style={{ padding: '8px 12px', background: palette.muted, borderBottom: `1px solid ${palette.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CText style={{ fontSize: '12px', color: palette.subtext }}>Preview</CText>
        {bundleStats && (
          <CBox style={{ fontSize: '11px', color: palette.subtext }}>
            Bundle: {(bundleStats?.totals?.gzipBytes / 1024).toFixed(1)} KB gzip
          </CBox>
        )}
      </CBox>

      <CBox style={{ padding: '16px' }}>
        {!parsedJson && jsonError && (
          <CBox style={{ padding: '12px', background: palette.muted, border: `1px solid ${palette.border}`, borderRadius: '6px', color: palette.subtext, fontSize: '14px' }}>
            Fix JSON to preview.
          </CBox>
        )}

        {parsedJson && (
          <Fields
            customStyles={customFormStyles}
            initialJson={editorValue}
            fieldConfig={parsedFieldConfig}
            {...(uiLibrary !== 'none' ? { uiLibrary } : {})}
            columns={2}
            sections={[
              { id: 'profile', title: 'Profile', description: 'Basic information', fields: ['name', 'email', 'website', 'role', 'joinDate', 'age', 'salary', 'rating'], collapsible: true, defaultOpen: true },
              { id: 'about', title: 'About', description: 'Biography, skills, tags, headers', fields: ['bio', 'skills', 'tags', 'headers'], collapsible: true, defaultOpen: true },
              { id: 'preferences', title: 'Preferences', description: 'Theme & Notifications', fields: ['preferences.theme', 'preferences.notifications', 'isActive'], collapsible: true, defaultOpen: true },
              { id: 'security', title: 'Security', fields: ['password'], collapsible: true, defaultOpen: false },
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
