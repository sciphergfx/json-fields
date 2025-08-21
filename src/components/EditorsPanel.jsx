import { Box, Text } from '@chakra-ui/react'
import Editor from '@monaco-editor/react'
import { FIELD_CONFIG_DEFAULT, sampleFormDataRich } from '../constants/demoData'

export default function EditorsPanel({
  theme,
  palette,
  editorValue,
  setEditorValue,
  jsonError,
  fieldConfigValue,
  setFieldConfigValue,
  fieldConfigError,
  activeViewKind = 'fields',
}) {
  return (
    <Box display="flex" gap="0" minH="70vh" borderTop={`1px solid ${palette.border}`}>
      {/* Left: Data JSON editor */}
      <Box flex="1 1 50%" borderRight={`1px solid ${palette.border}`} minW={0} display="flex" flexDirection="column" minH={0}>
        <Box display="flex" alignItems="center" justifyContent="space-between" px={3} py={2} bg={palette.muted} borderBottom={`1px solid ${palette.border}`}>
          <Text fontSize="12px" color={palette.subtext}>Data JSON</Text>
          <Box display="flex" gap="8px">
            <Box as="button" onClick={() => setEditorValue(JSON.stringify(JSON.parse(editorValue || 'null'), null, 2))} bg="transparent" color={palette.subtext} border={`1px solid ${palette.border}`} borderRadius="6px" px="10px" py="4px" fontSize="12px">Format</Box>
            <Box as="button" onClick={() => setEditorValue(sampleFormDataRich)} bg="transparent" color={palette.subtext} border={`1px solid ${palette.border}`} borderRadius="6px" px="10px" py="4px" fontSize="12px">Load rich sample</Box>
          </Box>
        </Box>
        <Box flex={activeViewKind === 'fields' ? 'none' : '1 1 auto'} height={'50vh'}>
          <Editor
            defaultLanguage="json"
            value={editorValue}
            theme={theme === 'light' ? 'light' : 'vs-dark'}
            onChange={(v) => setEditorValue(v ?? '')}
            options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: 'on', scrollBeyondLastLine: false, tabSize: 2 }}
          />
        </Box>
        {jsonError && (
          <Box px={3} py={2} color="#fee2e2" bg="#7f1d1d" fontSize="12px" borderTop={`1px solid ${palette.border}`}>
            JSON error: {jsonError}
          </Box>
        )}

        {/* Field Config Editor */}
        {activeViewKind === 'fields' && (
          <>
            <Box display="flex" alignItems="center" justifyContent="space-between" px={3} py={2} bg={palette.muted} borderTop={`1px solid ${palette.border}`} borderBottom={`1px solid ${palette.border}`}>
              <Text fontSize="12px" color={palette.subtext}>Field Config</Text>
              <Box display="flex" gap="8px">
                <Box as="button" onClick={() => setFieldConfigValue(JSON.stringify(JSON.parse(fieldConfigValue || 'null'), null, 2))} bg="transparent" color={palette.subtext} border={`1px solid ${palette.border}`} borderRadius="6px" px="10px" py="4px" fontSize="12px">Format</Box>
                <Box as="button" onClick={() => setFieldConfigValue(FIELD_CONFIG_DEFAULT)} bg="transparent" color={palette.subtext} border={`1px solid ${palette.border}`} borderRadius="6px" px="10px" py="4px" fontSize="12px">Load sample</Box>
              </Box>
            </Box>
            <Box flex={activeViewKind === 'fields' ? 'none' : '1 1 auto'} height={'50%'}>
              <Editor
                defaultLanguage="json"
                value={fieldConfigValue}
                theme={theme === 'light' ? 'light' : 'vs-dark'}
                onChange={(v) => setFieldConfigValue(v ?? '')}
                options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: 'on', scrollBeyondLastLine: false, tabSize: 2 }}
              />
            </Box>
            {fieldConfigError && (
              <Box px={3} py={2} color="#fee2e2" bg="#7f1d1d" fontSize="12px" borderTop={`1px solid ${palette.border}`}>
                Field config error: {fieldConfigError}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}
