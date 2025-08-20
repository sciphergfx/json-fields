  import { Box, Container, Tabs, Text } from '@chakra-ui/react'
import Editor from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { Fields, List, Table } from '../lib'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from './utils/storage'

// Field config defaults (module scope to avoid re-creating per render)
const sampleFieldConfig = {
  email: { type: 'email' },
  website: { type: 'url' },
  joinDate: { type: 'date' },
  password: { type: 'password' },
  role: { type: 'select', options: ['developer', 'designer', 'manager', 'analyst', 'intern'] },
  age: { type: 'number', min: 0, max: 120, step: 1 },
  salary: { type: 'number', min: 0, step: 1000 },
  rating: { type: 'slider', min: 0, max: 100, step: 1 },
  skills: {
    type: 'multi-select',
    options: ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++'],
  },
  tags: { type: 'tags' },
  body: { type: 'key-value-list', showHeader: false },
  headers: { type: 'object' },
  bio: { type: 'textarea', rows: 3 },
}
const FIELD_CONFIG_DEFAULT = JSON.stringify(sampleFieldConfig, null, 2)

// Rich sample showcasing all form features (including tags/capsules)
const sampleFormDataRich = JSON.stringify(
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    website: 'https://example.com',
    joinDate: '2024-06-01',
    password: 'secret',
    role: 'designer',
    age: 32,
    salary: 120000,
    rating: 75,
    skills: ['React', 'Node.js'],
    tags: ['alpha', 'beta', 'gamma'],
    body: [{
      mykey: 'key',
      myvalue: 'value',
    }],
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ...',
    },
    bio: 'UX-focused designer and frontend developer.',
    preferences: { theme: 'dark', notifications: true },
    isActive: true,
  },
  null,
  2,
)

function App() {
  // Load saved tab preference
  const [activeTab, setActiveTab] = useState(() =>
    getStorageItem(STORAGE_KEYS.TAB_PREFERENCE, 'playground'),
  )

  // (removed) form/list demo state now that tabs were consolidated into Playground
  // Playground state
  const [editorValue, setEditorValue] = useState(sampleFormDataRich)
  const [parsedJson, setParsedJson] = useState(null)
  const [jsonError, setJsonError] = useState(null)
  // Field config editable via Monaco
  const [fieldConfigValue, setFieldConfigValue] = useState(FIELD_CONFIG_DEFAULT)
  const [parsedFieldConfig, setParsedFieldConfig] = useState(sampleFieldConfig)
  const [fieldConfigError, setFieldConfigError] = useState(null)
  const [activeViewKind, setActiveViewKind] = useState('fields') // 'fields' | 'table' | 'list'

  // Table pagination/cache demo controls
  const [tablePaginationEnabled, setTablePaginationEnabled] = useState(true)
  const [tablePageSize, setTablePageSize] = useState(10)
  const [tableCacheSize, setTableCacheSize] = useState(3)
  const [tableInitialPage, setTableInitialPage] = useState(1)
  const [tableUseCustomPager, setTableUseCustomPager] = useState(false)

  // Theme
  const [theme, setTheme] = useState('dark')
  const [bundleStats, setBundleStats] = useState(null)
  const palette =
    theme === 'light'
      ? {
          background: '#f8fafc', // slate-50
          panel: '#ffffff',
          muted: '#f1f5f9', // slate-100
          border: '#e5e7eb', // gray-200
          text: '#0f172a', // slate-900
          subtext: '#475569', // slate-600
          accent: '#10b981', // emerald-500
          danger: '#ef4444',
          tableHeader: '#f1f5f9',
          inputBg: '#ffffff',
          inputText: '#0f172a',
          icon: '#334155',
          hover: '#e2e8f0',
        }
      : {
          background: '#0f0f0f',
          panel: '#1a1a1a',
          muted: '#262626',
          border: '#2d2d2d',
          text: '#ffffff',
          subtext: '#a3a3a3',
          accent: '#10b981',
          danger: '#ef4444',
          tableHeader: '#262626',
          inputBg: '#262626',
          inputText: '#ffffff',
          icon: '#e5e7eb',
          hover: '#333333',
        }

  // Rich sample includes a headers object to demonstrate key-value-list

  // Demo custom pager renderer for Table
  const renderCustomPager = ({
    currentPage,
    totalPages,
    goToPage,
    prevPage,
    nextPage,
    pageSize,
    cacheSize,
  }) => {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={3}
        p={2}
        bg={palette.muted}
        borderRadius="6px"
        border={`1px solid ${palette.border}`}
      >
        <Box display="flex" gap="8px" alignItems="center">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage <= 1}
            style={{ opacity: currentPage <= 1 ? 0.5 : 1 }}
          >
            ⏮ First
          </button>
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            style={{ opacity: currentPage <= 1 ? 0.5 : 1 }}
          >
            ◀ Prev
          </button>
        </Box>
        <Box>
          <Text>{`Page ${currentPage} of ${totalPages} • size ${pageSize} • cache ${cacheSize}`}</Text>
        </Box>
        <Box display="flex" gap="8px" alignItems="center">
          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            style={{ opacity: currentPage >= totalPages ? 0.5 : 1 }}
          >
            Next ▶
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage >= totalPages}
            style={{ opacity: currentPage >= totalPages ? 0.5 : 1 }}
          >
            Last ⏭
          </button>
        </Box>
      </Box>
    )
  }
  // GitHub repo stats
  const REPO_OWNER = 'sciphergfx'
  const REPO_NAME = 'json-to-table'
  const [forks, setForks] = useState(null)

  useEffect(() => {
    // Fetch forks count from GitHub
    const controller = new AbortController()
    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.forks_count === 'number') {
          setForks(data.forks_count)
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  // Save tab preference when it changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.TAB_PREFERENCE, activeTab)
  }, [activeTab])

  // Parse editor JSON with debounce
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

  // Parse field config JSON with debounce
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

  // Sample JSON data for table demo
  const sampleTableJson = JSON.stringify(
    [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer',
        salary: 175000,
        active: true,
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Designer',
        salary: 168000,
        active: true,
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'Manager',
        salary: 185000,
        active: false,
      },
      {
        id: 4,
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'Developer',
        salary: 172000,
        active: true,
      },
    ],
    null,
    2,
  )

  // Utility: generate many rows for pagination demo
  const generateManyRows = (count = 53) => {
    const roles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Intern']
    const rows = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: roles[i % roles.length],
      salary: 150000 + (i % 10) * 3500,
      active: i % 3 !== 0,
    }))
    return JSON.stringify(rows, null, 2)
  }

  // Sample JSON data for list demo
  const sampleListData = [
    {
      label: 'Main',
      children: [{ label: 'Sample' }, { label: 'Flow 2' }],
    },
    {
      label: 'Workflow Type',
      children: [],
    },
    {
      label: 'Sample',
      children: [{ label: 'Sample' }, { label: 'Flow 2' }],
    },
    {
      label: 'Flow 2',
    },
  ]

  // Sample JSON data for form demo is provided via DEFAULT_JSON

  const loadSampleTable = () => {
    setEditorValue(sampleTableJson);
  };

  const loadLargeSampleTable = () => {
    setEditorValue(generateManyRows(57));
  };

  

  const customTableStyles = {
    container: {
      background: palette.panel,
      borderRadius: '8px', 
    },
    heading: {
      color: palette.text,
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '8px',
      letterSpacing: '-0.025em',
    },
    inputContainer: {
      background: palette.muted,
      borderRadius: '6px',
      padding: '16px',
      border: `1px solid ${palette.border}`,
      marginBottom: '16px',
    },
    textarea: {
      background: palette.panel,
      border: `1px solid ${palette.border}`,
      borderRadius: '6px',
      color: palette.text,
      fontSize: '14px',
      fontFamily:
        'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      padding: '12px',
      transition: 'border-color 0.2s ease',
      _focus: {
        borderColor: palette.accent,
        outline: 'none',
        boxShadow: 'none',
      },
    },
    buttonGroup: {
      justifyContent: 'flex-start',
      gap: '12px',
    },
    button: {
      background: palette.accent,
      color: '#ffffff',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      border: 'none',
      transition: 'all 0.2s ease',
      _hover: {
        background: '#059669',
      },
    },
    secondaryButton: {
      background: 'transparent',
      color: palette.subtext,
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      border: `1px solid ${palette.border}`,
      transition: 'all 0.2s ease',
      _hover: {
        background: palette.muted,
        borderColor: palette.border,
        color: palette.text,
      },
    },
    tableContainer: {
      background: palette.panel,
      borderRadius: '6px',
      marginTop: '24px',
      border: `1px solid ${palette.border}`,
      overflow: 'hidden',
    },
    table: {
      width: '100%',
    },
    th: {
      background: palette.tableHeader,
      color: palette.subtext,
      fontWeight: '500',
      fontSize: '12px',
      textAlign: 'left',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      padding: '12px 16px',
      borderBottom: `1px solid ${palette.border}`,
    },
    td: {
      padding: '12px 16px',
      borderBottom: `1px solid ${palette.border}`,
      color: palette.text,
    },
    input: {
      background: 'transparent',
      border: 'none',
      color: palette.text,
      fontSize: '14px',
      width: '100%',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'background-color 0.2s ease',
      _focus: {
        outline: 'none',
        background: palette.muted,
      },
    },
    controlButtons: {
      justifyContent: 'flex-start',
      gap: '12px',
      marginTop: '24px',
      paddingTop: '16px',
      borderTop: '1px solid #2d2d2d',
    },
    saveButton: {
      background: palette.accent,
      color: theme === 'light' ? '#ffffff' : 'white',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      marginRight: '16px',
      fontWeight: '500',
      border: 'none',
      transition: 'all 0.2s ease',
      _hover: {
        background: '#059669',
      },
    },
    cancelButton: {
      background: 'transparent',
      color: palette.danger,
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      border: `1px solid ${palette.danger}`,
      transition: 'all 0.2s ease',
      _hover: {
        background: palette.danger,
        color: '#ffffff',
      },
    },
  }

  const customFormStyles = {
    container: {
      background: palette.panel,
      borderRadius: '8px', 
    },
    heading: {
      color: palette.text,
      fontSize: '24px',
      fontWeight: '600', 
      marginBottom: '8px',
      letterSpacing: '-0.025em',
    },
    inputContainer: {
      background: palette.muted,
      borderRadius: '6px',
      padding: '16px',
      border: `1px solid ${palette.border}`,
      marginBottom: '16px',
    },
    formCard: {
      color: palette.text,
      background: palette.panel,
      borderRadius: '6px',
      padding: '24px', 
      border: `1px solid ${palette.border}`,
    },
    formStack: {
      gap: '20px',
    },
    fieldContainer: {
      marginBottom: '20px',
    },
    fieldLabel: {
      color: '#ffffff',
      fontWeight: '500',
      marginBottom: '2px',
      fontSize: '14px',
      display: 'block',
    },
    input: {
      background: '#262626',
      border: '1px solid #404040',
      borderRadius: '6px',
      color: '#ffffff',
      padding: '8px 12px',
      fontSize: '14px',
      width: '100%',
      transition: 'border-color 0.2s ease',
      _focus: {
        borderColor: '#10b981',
        outline: 'none',
        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
      },
    },
    textarea: {
      background: '#262626',
      border: '1px solid #404040',
      borderRadius: '6px',
      color: '#ffffff',
      padding: '12px',
      fontSize: '14px',
      fontFamily:
        'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      width: '100%',
      minHeight: '120px',
      transition: 'border-color 0.2s ease',
      _focus: {
        borderColor: '#10b981',
        outline: 'none',
        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
      },
    },
    select: {
      background: '#1a1a1a',
      border: '1px solid #404040',
      borderRadius: '6px',
      color: '#ffffff',
      fontSize: '14px',
      padding: '12px 40px 12px 12px', // Extra right padding for dropdown arrow
      width: '100%',
      transition: 'border-color 0.2s ease',
      appearance: 'none', // Remove default styling
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a3a3a3' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 12px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      _focus: {
        borderColor: '#10b981',
        outline: 'none',
        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
      },
    },
    checkbox: {
      width: '16px',
      height: '16px',
      accentColor: '#10b981',
      marginRight: '8px',
      flexShrink: 0, // Prevent checkbox from shrinking
    },
    label: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#ffffff',
      fontSize: '14px',
    },
    text: {
      color: '#ffffff',
      fontSize: '14px',
    },
    button: {
      background: '#10b981',
      color: 'white',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      border: 'none',
      transition: 'all 0.2s ease',
      _hover: {
        background: '#059669',
      },
    },
    secondaryButton: {
      background: 'transparent',
      color: '#a3a3a3',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid #404040',
      transition: 'all 0.2s ease',
      _hover: {
        background: '#262626',
        borderColor: '#525252',
        color: '#ffffff',
      },
    },
    buttonGroup: {
      justifyContent: 'flex-start',
      gap: '16px',
    },
    controlButtons: {
      justifyContent: 'flex-start',
      gap: '16px',
      marginTop: '24px',
      paddingTop: '16px',
      borderTop: '1px solid #2d2d2d',
    },
    /**
     * Styling for the save button
     * @type {object}
     * @property {string} background - Background color
     * @property {string} color - Text color
     * @property {string} borderRadius - Border radius
     * @property {string} padding - Padding
     * @property {string} fontSize - Font size
     * @property {string} fontWeight - Font weight
     * @property {string} border - Border style
     * @property {string} marginRight - Right margin
     * @property {object} _hover - Styling for when the button is hovered
     * @property {string} _hover.background - Background color when hovered
     */
    saveButton: {
      background: '#10b981',
      color: 'white',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      border: 'none',
      marginRight: '16px',
      transition: 'all 0.2s ease',
      _hover: {
        background: '#059669',
      },
    },
    cancelButton: {
      background: 'transparent',
      color: '#ef4444',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid #ef4444',
      transition: 'all 0.2s ease',
      _hover: {
        background: '#ef4444',
        color: 'white',
      },
    },
  }

  return (
    <Box minH="100vh" bg={palette.background}>
      {/* Header */}
      <Box
        bg={palette.panel}
        borderBottom={`1px solid ${palette.border}`}
        px={6}
        py={4}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="16px"
      >
        <Box>
          <Text
            fontSize="28px"
            fontWeight="700"
            color={palette.text}
            letterSpacing="-0.025em"
            mb={1}
          >
            JSON to Table Library Demo
          </Text>
          <Text fontSize="16px" color={palette.subtext} fontWeight="400">
            Components for converting JSON to tables and forms
          </Text>
        </Box>
        <Box display="flex" alignItems="center" gap="12px">
          <Box
            as="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            bg={palette.muted}
            color={palette.text}
            border={`1px solid ${palette.border}`}
            borderRadius="6px"
            px="12px"
            py="6px"
            fontSize="14px"
            fontWeight="600"
            cursor="pointer"
            _hover={{ background: palette.hover }}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </Box>
          <Box
            as="a"
            href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
            target="_blank"
            rel="noreferrer"
            bg={theme === 'light' ? '#f8fafc' : '#0f172a'}
            color={palette.text}
            border={`1px solid ${palette.border}`}
            borderRadius="6px"
            px="12px"
            py="6px"
            fontSize="14px"
            fontWeight="600"
            _hover={{ background: palette.hover, borderColor: palette.border }}
          >
            GitHub ↗
          </Box>
          <Box
            bg={theme === 'light' ? '#eef2ff' : '#111827'}
            color={theme === 'light' ? '#1e3a8a' : '#93c5fd'}
            border={`1px solid ${palette.border}`}
            borderRadius="9999px"
            px="10px"
            py="4px"
            fontSize="12px"
            fontWeight="600"
          >
            Forks: {forks ?? '—'}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxW="8xl" py={6}>
        <Box
          bg={palette.panel}
          borderRadius="8px"
          border={`1px solid ${palette.border}`}
          overflow="hidden"
        >
          <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>

            <Box bg={palette.panel}>
              <Tabs.Content value="playground" p={0}>
                <Box display="flex" gap="0" minH="70vh" borderTop={`1px solid ${palette.border}`}>
                  {/* Left: Monaco Editor */}
                  <Box flex="1 1 50%" borderRight={`1px solid ${palette.border}`} minW={0} display="flex" flexDirection="column" minH={0}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      px={3}
                      py={2}
                      bg={palette.muted}
                      borderBottom={`1px solid ${palette.border}`}
                    >
                      <Text fontSize="12px" color={palette.subtext}>
                        Data JSON
                      </Text>
                      <Box display="flex" gap="8px">
                        <Box
                          as="button"
                          onClick={() =>
                            setEditorValue(
                              JSON.stringify(JSON.parse(editorValue || 'null'), null, 2),
                            )
                          }
                          bg="transparent"
                          color={palette.subtext}
                          border={`1px solid ${palette.border}`}
                          borderRadius="6px"
                          px="10px"
                          py="4px"
                          fontSize="12px"
                        >
                          Format
                        </Box>
                        <Box
                          as="button"
                          onClick={() => setEditorValue(sampleFormDataRich)}
                          bg="transparent"
                          color={palette.subtext}
                          border={`1px solid ${palette.border}`}
                          borderRadius="6px"
                          px="10px"
                          py="4px"
                          fontSize="12px"
                        >
                          Load rich sample
                        </Box>
                        {/* API demo button removed */}
                      </Box>
                    </Box>
                    <Box flex={activeViewKind === 'fields' ? 'none' : '1 1 auto'}   height={'50%'}>
                      <Editor
                   
                        defaultLanguage="json"
                        value={editorValue}
                        theme={theme === 'light' ? 'light' : 'vs-dark'}
                        onChange={(v) => setEditorValue(v ?? '')}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 13,
                          wordWrap: 'on',
                          scrollBeyondLastLine: false,
                          tabSize: 2,
                        }}
                      />
                    </Box>
                    {jsonError && (
                      <Box
                        px={3}
                        py={2}
                        color="#fee2e2"
                        bg="#7f1d1d"
                        fontSize="12px"
                        borderTop={`1px solid ${palette.border}`}
                      >
                        JSON error: {jsonError}
                      </Box>
                    )}

                    {/* Field Config Editor */}
                    {activeViewKind === 'fields' && (
                    <>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      px={3}
                      py={2}
                      bg={palette.muted}
                      borderTop={`1px solid ${palette.border}`}
                      borderBottom={`1px solid ${palette.border}`}
                    >
                      <Text fontSize="12px" color={palette.subtext}>
                        Field Config
                      </Text>
                      <Box display="flex" gap="8px">
                        <Box
                          as="button"
                          onClick={() =>
                            setFieldConfigValue(
                              JSON.stringify(JSON.parse(fieldConfigValue || 'null'), null, 2),
                            )
                          }
                          bg="transparent"
                          color={palette.subtext}
                          border={`1px solid ${palette.border}`}
                          borderRadius="6px"
                          px="10px"
                          py="4px"
                          fontSize="12px"
                        >
                          Format
                        </Box>
                        <Box
                          as="button"
                          onClick={() => setFieldConfigValue(FIELD_CONFIG_DEFAULT)}
                          bg="transparent"
                          color={palette.subtext}
                          border={`1px solid ${palette.border}`}
                          borderRadius="6px"
                          px="10px"
                          py="4px"
                          fontSize="12px"
                        >
                          Load sample
                        </Box>
                        {/* API-specific config loader removed; keep config generic */}
                      </Box>
                    </Box>
                    <Editor
                      height="calc(30vh)"
                      defaultLanguage="json"
                      value={fieldConfigValue}
                      theme={theme === 'light' ? 'light' : 'vs-dark'}
                      onChange={(v) => setFieldConfigValue(v ?? '')}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        tabSize: 2,
                      }}
                    />
                    {fieldConfigError && (
                      <Box
                        px={3}
                        py={2}
                        color="#fee2e2"
                        bg="#7f1d1d"
                        fontSize="12px"
                        borderTop={`1px solid ${palette.border}`}
                      >
                        Field config error: {fieldConfigError}
                      </Box>
                    )}
                  
                  </>
                  )}

                  </Box>
                  {/* Right: Palette + Preview */}
                  <Box flex="1 1 50%" minW={0}>
                    <Box
                      px={3}
                      py={2}
                      bg={palette.muted}
                      borderBottom={`1px solid ${palette.border}`}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text fontSize="12px" color={palette.subtext}>
                        Preview
                      </Text>
                      {bundleStats && (
                        <Box fontSize="11px" color={palette.subtext}>
                          Bundle: {(bundleStats?.totals?.gzipBytes / 1024).toFixed(1)} KB gzip
                        </Box>
                      )}
                      <Box display="flex" gap="8px">
                        {[
                          { id: 'fields', label: 'Form' },
                          { id: 'table', label: 'Table' },
                          { id: 'list', label: 'List' },
                        ].map((opt) => (
                          <Box
                            key={opt.id}
                            as="button"
                            onClick={() => setActiveViewKind(opt.id)}
                            bg={activeViewKind === opt.id ? palette.panel : 'transparent'}
                            color={activeViewKind === opt.id ? palette.text : palette.subtext}
                            border={`1px solid ${palette.border}`}
                            borderRadius="6px"
                            px="10px"
                            py="4px"
                            fontSize="12px"
                          >
                            {opt.label}
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    <Box p={4}>
                      {!parsedJson && jsonError && (
                        <Box
                          p={3}
                          bg={palette.muted}
                          border={`1px solid ${palette.border}`}
                          borderRadius="6px"
                          color={palette.subtext}
                          fontSize="14px"
                        >
                          Fix JSON to preview.
                        </Box>
                      )}

                      {parsedJson && activeViewKind === 'fields' && (
                        <Fields
                          customStyles={customFormStyles}
                          initialJson={editorValue}
                          fieldConfig={parsedFieldConfig}
                          columns={2}
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

                      {parsedJson && activeViewKind === 'table' && (
                        <>
                          {/* Table Controls (moved from Table tab) */}
                          <Box
                            mb={4}
                            p={3}
                            bg={palette.muted}
                            borderRadius="6px"
                            border={`1px solid ${palette.border}`}
                          >
                            <Text fontSize="14px" fontWeight="600" color={palette.text} mb={2}>
                              Table Controls
                            </Text>
                            <Box display="flex" gap="12px" flexWrap="wrap">
                              <Box
                                as="button"
                                onClick={loadSampleTable}
                                bg={palette.accent}
                                color="#ffffff"
                                borderRadius="6px"
                                px="12px"
                                py="6px"
                                fontSize="13px"
                                fontWeight="500"
                                border="none"
                                cursor="pointer"
                                transition="all 0.2s ease"
                                _hover={{ bg: '#059669' }}
                              >
                                📊 Load Sample Data
                              </Box>
                              <Box
                                as="button"
                                onClick={loadLargeSampleTable}
                                bg={palette.accent}
                                color="#ffffff"
                                borderRadius="6px"
                                px="12px"
                                py="6px"
                                fontSize="13px"
                                fontWeight="500"
                                border="none"
                                cursor="pointer"
                                transition="all 0.2s ease"
                                _hover={{ bg: '#059669' }}
                              >
                                📈 Load 57 Rows
                              </Box>
                              <Box
                                as="button"
                                onClick={() => setEditorValue('')}
                                bg="transparent"
                                color={palette.subtext}
                                borderRadius="6px"
                                px="12px"
                                py="6px"
                                fontSize="13px"
                                fontWeight="500"
                                border={`1px solid ${palette.border}`}
                                cursor="pointer"
                                transition="all 0.2s ease"
                                _hover={{ bg: palette.muted, borderColor: palette.border, color: palette.text }}
                              >
                                🗑️ Clear Input
                              </Box>
                            </Box>

                            {/* Pagination & Cache Controls */}
                            <Box mt={3} display="flex" gap="12px" flexWrap="wrap" alignItems="center">
                              <Box display="flex" alignItems="center" gap="8px">
                                <input
                                  id="pg-pagination"
                                  type="checkbox"
                                  checked={tablePaginationEnabled}
                                  onChange={(e) => setTablePaginationEnabled(e.target.checked)}
                                />
                                <label htmlFor="pg-pagination">Enable pagination</label>
                              </Box>
                              <Box display="flex" alignItems="center" gap="8px">
                                <input
                                  id="pg-custompager"
                                  type="checkbox"
                                  checked={tableUseCustomPager}
                                  onChange={(e) => setTableUseCustomPager(e.target.checked)}
                                />
                                <label htmlFor="pg-custompager">Use custom pager</label>
                              </Box>
                              <Box display="flex" alignItems="center" gap="8px">
                                <label htmlFor="pg-pagesize">Page size</label>
                                <input
                                  id="pg-pagesize"
                                  type="number"
                                  min={1}
                                  value={tablePageSize}
                                  onChange={(e) => setTablePageSize(Math.max(1, parseInt(e.target.value || '1', 10)))}
                                  style={{ width: 80, padding: '4px 8px', background: theme === 'light' ? '#fff' : '#1f2937', color: palette.text, border: `1px solid ${palette.border}`, borderRadius: 6 }}
                                />
                              </Box>
                              <Box display="flex" alignItems="center" gap="8px">
                                <label htmlFor="pg-cachesize">Cache size</label>
                                <input
                                  id="pg-cachesize"
                                  type="number"
                                  min={1}
                                  value={tableCacheSize}
                                  onChange={(e) => setTableCacheSize(Math.max(1, parseInt(e.target.value || '1', 10)))}
                                  style={{ width: 80, padding: '4px 8px', background: theme === 'light' ? '#fff' : '#1f2937', color: palette.text, border: `1px solid ${palette.border}`, borderRadius: 6 }}
                                />
                              </Box>
                              <Box display="flex" alignItems="center" gap="8px">
                                <label htmlFor="pg-initialpage">Initial page</label>
                                <input
                                  id="pg-initialpage"
                                  type="number"
                                  min={1}
                                  value={tableInitialPage}
                                  onChange={(e) => setTableInitialPage(Math.max(1, parseInt(e.target.value || '1', 10)))}
                                  style={{ width: 80, padding: '4px 8px', background: theme === 'light' ? '#fff' : '#1f2937', color: palette.text, border: `1px solid ${palette.border}`, borderRadius: 6 }}
                                />
                              </Box>
                            </Box>
                          </Box>

                          <Table
                            uiLibrary="chakra"
                            customStyles={customTableStyles}
                            initialJson={editorValue}
                            pagination={tablePaginationEnabled}
                            pageSize={tablePageSize}
                            cacheSize={tableCacheSize}
                            initialPage={tableInitialPage}
                            paginationRenderer={tableUseCustomPager ? renderCustomPager : null}
                          />
                        </>
                      )}

                      {activeViewKind === 'list' && (
                        <>
                          <Box
                            mb={4}
                            p={3}
                            bg={palette.muted}
                            borderRadius="6px"
                            border={`1px solid ${palette.border}`}
                          >
                            <Text fontSize="14px" fontWeight="600" color={palette.text} mb={2}>
                              List Controls
                            </Text>
                            <Box display="flex" gap="12px" flexWrap="wrap">
                              <Box
                                as="button"
                                onClick={() => setEditorValue(JSON.stringify(sampleListData, null, 2))}
                                bg={palette.accent}
                                color="#ffffff"
                                borderRadius="6px"
                                px="12px"
                                py="6px"
                                fontSize="13px"
                                fontWeight="500"
                                border="none"
                                cursor="pointer"
                                transition="all 0.2s ease"
                                _hover={{ bg: '#059669' }}
                              >
                                📚 Load Sample List
                              </Box>
                              <Box
                                as="button"
                                onClick={() => setEditorValue('')}
                                bg="transparent"
                                color={palette.subtext}
                                borderRadius="6px"
                                px="12px"
                                py="6px"
                                fontSize="13px"
                                fontWeight="500"
                                border={`1px solid ${palette.border}`}
                                cursor="pointer"
                                transition="all 0.2s ease"
                                _hover={{ bg: palette.muted, borderColor: palette.border, color: palette.text }}
                              >
                                🗑️ Clear Input
                              </Box>
                            </Box>
                          </Box>

                          {!Array.isArray(parsedJson) && (
                            <Box
                              p={3}
                              mb={3}
                              bg={palette.muted}
                              border={`1px solid ${palette.border}`}
                              borderRadius="6px"
                              color={palette.subtext}
                              fontSize="14px"
                            >
                              Provide an array of list items in the editor (or click "Load Sample List").
                            </Box>
                          )}

                          {Array.isArray(parsedJson) && (
                            <List
                              data={parsedJson}
                              mode={theme === 'light' ? 'light' : 'dark'}
                              parentOpenIcon={<span style={{ fontSize: 12 }}>▼</span>}
                              parentClosedIcon={<span style={{ fontSize: 12 }}>▶</span>}
                              customStyles={{
                                container: {
                                  background: palette.panel,
                                  border: `1px solid ${palette.border}`,
                                  borderRadius: '8px',
                                },
                                header: {
                                  padding: '8px 12px',
                                  color: palette.subtext,
                                  background: palette.muted,
                                  borderBottom: `1px solid ${palette.border}`,
                                },
                                list: { padding: '6px 8px 10px' },
                              }}
                            />
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Tabs.Content>
              {/* Table tab content moved into Playground -> Table */}
            </Box>
          </Tabs.Root>
        </Box>
      </Container>
    </Box>
  )
}

export default App
