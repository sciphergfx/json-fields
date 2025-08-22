import { Box, Container } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import DemoHeader from './components/DemoHeader'
import EditorsPanel from './components/EditorsPanel'
import PreviewPanel from './components/PreviewPanel'
import { FIELD_CONFIG_DEFAULT, sampleFieldConfig, sampleFormDataRich } from './constants/demoData'
import { getPalette } from './theme/palette'
import { setStorageItem, STORAGE_KEYS } from './utils/storage'

function App() {
  // State
  const [theme, setTheme] = useState('dark')
  const [editorValue, setEditorValue] = useState(sampleFormDataRich)
  const [parsedJson, setParsedJson] = useState(null)
  const [jsonError, setJsonError] = useState(null)
  const [fieldConfigValue, setFieldConfigValue] = useState(FIELD_CONFIG_DEFAULT)
  const [parsedFieldConfig, setParsedFieldConfig] = useState(sampleFieldConfig)
  const [fieldConfigError, setFieldConfigError] = useState(null)
  const [activeViewKind] = useState('fields')
  const [bundleStats] = useState(null)
  const [forks, setForks] = useState(null)
  const [uiLibrary, setUiLibrary] = useState('chakra')
  const [inlineLabels] = useState(false)

  // Theme palette
  const palette = getPalette(theme)

  // GitHub repo stats (from env, with defaults)
  const REPO_OWNER = import.meta.env.VITE_GITHUB_REPO_OWNER || 'sciphergfx'
  const REPO_NAME = import.meta.env.VITE_GITHUB_REPO_NAME || 'json-fields'

  useEffect(() => {
    const controller = new AbortController()
    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.forks_count === 'number') setForks(data.forks_count)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [REPO_OWNER, REPO_NAME])

  // Persist last active tab key (legacy compatibility)
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.TAB_PREFERENCE, 'playground')
  }, [])

  // Parse editor JSON
  useEffect(() => {
    const h = setTimeout(() => {
      try {
        const obj = JSON.parse(editorValue || 'null')
        setParsedJson(obj)
        setJsonError(null)
      } catch (e) {
        setParsedJson(null)
        setJsonError(e.message || 'Invalid JSON')
      }
    }, 250)
    return () => clearTimeout(h)
  }, [editorValue])

  // Parse field config JSON
  useEffect(() => {
    const h = setTimeout(() => {
      try {
        const obj = JSON.parse(fieldConfigValue || 'null')
        setParsedFieldConfig(obj || sampleFieldConfig)
        setFieldConfigError(null)
      } catch (e) {
        setParsedFieldConfig(sampleFieldConfig)
        setFieldConfigError(e.message || 'Invalid JSON')
      }
    }, 250)
    return () => clearTimeout(h)
  }, [fieldConfigValue])

  return (
    <div style={{ minHeight: '100vh', background: palette.background }}>
      <DemoHeader
        theme={theme}
        setTheme={setTheme}
        palette={palette}
        repoOwner={REPO_OWNER}
        repoName={REPO_NAME}
        forks={forks}
        uiLibrary={uiLibrary}
        setUiLibrary={setUiLibrary}
      />

      <Container maxW="8xl" py={6}>
        <Box
          bg={palette.panel}
          borderRadius="8px"
          border={`1px solid ${palette.border}`}
          overflow="hidden"
        >
          <Box display="flex" gap="0" minH="70vh">
            <EditorsPanel
              theme={theme}
              palette={palette}
              editorValue={editorValue}
              setEditorValue={setEditorValue}
              jsonError={jsonError}
              fieldConfigValue={fieldConfigValue}
              setFieldConfigValue={setFieldConfigValue}
              fieldConfigError={fieldConfigError}
              activeViewKind={activeViewKind}
            />
            <PreviewPanel
              palette={palette}
              theme={theme}
              parsedJson={parsedJson}
              jsonError={jsonError}
              bundleStats={bundleStats}
              editorValue={editorValue}
              parsedFieldConfig={parsedFieldConfig}
              uiLibrary={uiLibrary}
              inlineLabels={inlineLabels}
            />
          </Box>
        </Box>
      </Container>
    </div>
  )
}

export default App
