import { Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Editor from '@monaco-editor/react'
import { FIELD_CONFIG_DEFAULT } from '../constants/demoData'

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
    <Box minH="70vh" borderTop={`1px solid ${palette.border}`} flex="0 0 30%" display="flex" flexDirection="column">
      <Tabs variant="enclosed" isFitted>
        <TabList borderBottom={`1px solid ${palette.border}`}>
          <Tab fontSize="12px">Data JSON</Tab>
          <Tab fontSize="12px">Field Config</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Box display="flex" alignItems="center" justifyContent="flex-end" px={3} py={2} bg={palette.muted} borderBottom={`1px solid ${palette.border}`}>
              <Box as="button" onClick={() => setEditorValue(JSON.stringify(JSON.parse(editorValue || 'null'), null, 2))} bg="transparent" color={palette.subtext} border={`1px solid ${palette.border}`} borderRadius="6px" px="10px" py="4px" fontSize="12px">Format</Box>
            </Box>
            <Box height={'60vh'}>
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
          </TabPanel>
          <TabPanel p={0}>
            <Box display="flex" alignItems="center" justifyContent="flex-end" px={3} py={2} bg={palette.muted} borderBottom={`1px solid ${palette.border}`}>
              <Box as="button" onClick={() => setFieldConfigValue(JSON.stringify(JSON.parse(fieldConfigValue || 'null'), null, 2))} bg="transparent" color={palette.subtext} border={`1px solid ${palette.border}`} borderRadius="6px" px="10px" py="4px" fontSize="12px">Format</Box>
              <Box as="button" onClick={() => setFieldConfigValue(FIELD_CONFIG_DEFAULT)} bg="transparent" color={palette.subtext} border={`1px solid ${palette.border}`} borderRadius="6px" px="10px" py="4px" fontSize="12px" ml={2}>Load sample</Box>
            </Box>
            <Box height={'60vh'}>
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
