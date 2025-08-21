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
}) {
  const customFormStyles = getFormStyles(palette, theme)

  return (
    <Box flex="0 0 70%" minW={0}>
      <Box px={3} py={2} bg={palette.muted} borderBottom={`1px solid ${palette.border}`} display="flex" alignItems="center" justifyContent="space-between">
        <Text fontSize="12px" color={palette.subtext}>Preview</Text>
        {bundleStats && (
          <Box fontSize="11px" color={palette.subtext}>
            Bundle: {(bundleStats?.totals?.gzipBytes / 1024).toFixed(1)} KB gzip
          </Box>
        )}
      </Box>

      <Box p={4}>
        {!parsedJson && jsonError && (
          <Box p={3} bg={palette.muted} border={`1px solid ${palette.border}`} borderRadius="6px" color={palette.subtext} fontSize="14px">
            Fix JSON to preview.
          </Box>
        )}

        {parsedJson && (
          <Fields
            customStyles={customFormStyles}
            initialJson={editorValue}
            fieldConfig={parsedFieldConfig}
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
      </Box>
    </Box>
  )
}
