import { useState, useEffect } from "react";
import { Box, Container, Tabs, Text } from "@chakra-ui/react";
import { JsonToTable, JsonToFields } from "../lib";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "./utils/storage";

function App() {
  // Load saved tab preference
  const [activeTab, setActiveTab] = useState(() =>
    getStorageItem(STORAGE_KEYS.TAB_PREFERENCE, "table")
  );

  // Form demo state
  const [formJsonInput, setFormJsonInput] = useState('');
  
  // Table demo state
  const [tableJsonInput, setTableJsonInput] = useState('');

  // Save tab preference when it changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.TAB_PREFERENCE, activeTab);
  }, [activeTab]);

  // Sample JSON data for table demo
  const sampleTableJson = JSON.stringify([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Developer", salary: 175000, active: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer", salary: 168000, active: true },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Manager", salary: 185000, active: false },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Developer", salary: 172000, active: true },
  ], null, 2);

  // Sample JSON data for form demo
  const sampleFormJson = JSON.stringify({
    name: "Seyi Ogunbowale",
    email: "seyi@example.com",
    age: 30,
    isActive: true,
    role: "developer",
    skills: ["React", "JavaScript", "Node.js"],
    bio: "Full-stack developer with 5+ years of experience",
    website: "https://github.com/sciphergfx",
    joinDate: "2023-01-15",
    password: "secret123",
    preferences: {
      theme: "dark",
      notifications: true
    },
    tags: ["developer", "react", "javascript"]
  }, null, 2);

  // Sample field configuration to demonstrate flexible field types
  const sampleFieldConfig = {
    email: { type: 'email' },
    website: { type: 'url' },
    joinDate: { type: 'date' },
    password: { type: 'password' },
    role: { 
      type: 'select', 
      options: ['developer', 'designer', 'manager', 'analyst', 'intern'] 
    },
    skills: { 
      type: 'multi-select', 
      options: ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++'] 
    },
    bio: { 
      type: 'textarea', 
      rows: 3 
    }
  };

  const loadSampleTable = () => {
    setTableJsonInput(sampleTableJson);
  };

  const loadSampleForm = () => {
    setFormJsonInput(sampleFormJson);
  };
 
  const customTableStyles = {
    container: {
      background: '#1a1a1a',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #2d2d2d',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    },
    heading: {
      color: '#ffffff',
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '8px',
      letterSpacing: '-0.025em',
    },
    inputContainer: {
      background: '#262626',
      borderRadius: '6px',
      padding: '16px',
      border: '1px solid #404040',
      marginBottom: '16px',
    },
    textarea: {
      background: '#1a1a1a',
      border: '1px solid #404040',
      borderRadius: '6px',
      color: '#ffffff',
      fontSize: '14px',
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      padding: '12px',
      transition: 'border-color 0.2s ease',
      _focus: {
        borderColor: '#10b981',
        outline: 'none',
        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
      }
    },
    buttonGroup: {
      justifyContent: 'flex-start',
      gap: '12px',
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
      }
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
      }
    },
    tableContainer: {
      background: '#1a1a1a',
      borderRadius: '6px',
      marginTop: '24px',
      border: '1px solid #2d2d2d',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
    },
    th: {
      background: '#262626',
      color: '#a3a3a3',
      fontWeight: '500',
      fontSize: '12px',
      textAlign: 'left',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      padding: '12px 16px',
      borderBottom: '1px solid #2d2d2d',
    },
    td: {
      padding: '12px 16px',
      borderBottom: '1px solid #2d2d2d',
      color: '#ffffff',
    },
    input: {
      background: 'transparent',
      border: 'none',
      color: '#ffffff',
      fontSize: '14px',
      width: '100%',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'background-color 0.2s ease',
      _focus: {
        outline: 'none',
        background: '#262626',
      }
    },
    controlButtons: {
      justifyContent: 'flex-start',
      gap: '12px',
      marginTop: '24px',
      paddingTop: '16px',
      borderTop: '1px solid #2d2d2d',
    },
    saveButton: {
      background: '#10b981',
      color: 'white',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      marginRight: '16px',
      fontWeight: '500',
      border: 'none',
      transition: 'all 0.2s ease',
      _hover: {
        background: '#059669',
      }
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
      }
    }
  };

  const customFormStyles = {
    container: {
      background: '#1a1a1a',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #2d2d2d',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    },
    heading: {
      color: '#ffffff',
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '8px',
      letterSpacing: '-0.025em',
    },
    inputContainer: {
      background: '#262626',
      borderRadius: '6px',
      padding: '16px',
      border: '1px solid #404040',
      marginBottom: '16px',
    },
    formCard: {
      background: '#1a1a1a',
      borderRadius: '6px',
      padding: '24px',
      marginTop: '24px',
      border: '1px solid #2d2d2d',
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
      marginBottom: '8px',
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
      }
    },
    textarea: {
      background: '#262626',
      border: '1px solid #404040',
      borderRadius: '6px',
      color: '#ffffff',
      padding: '12px',
      fontSize: '14px',
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      width: '100%',
      minHeight: '120px',
      transition: 'border-color 0.2s ease',
      _focus: {
        borderColor: '#10b981',
        outline: 'none',
        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
      }
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
      }
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
      }
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
      }
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
      }
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
      }
    }
  };

  return (
    <Box minH="100vh" bg="#0f0f0f">
      {/* Header */}
      <Box bg="#1a1a1a" borderBottom="1px solid #2d2d2d" px={6} py={4}>
        <Text fontSize="28px" fontWeight="700" color="#ffffff" letterSpacing="-0.025em" mb={1}>
          JSON to Table Library Demo
        </Text>
        <Text fontSize="16px" color="#a3a3a3" fontWeight="400">
          Components for converting JSON to tables and forms
        </Text>
      </Box>

      {/* Main Content */}
      <Container maxW="8xl" py={6}>
        <Box bg="#1a1a1a" borderRadius="8px" border="1px solid #2d2d2d" overflow="hidden">
          <Tabs.Root
            value={activeTab}
            onValueChange={(e) => setActiveTab(e.value)}
          >
            <Tabs.List bg="#262626" borderBottom="1px solid #2d2d2d" p={0}>
              <Tabs.Trigger 
                value="table"
                bg="transparent"
                color="#a3a3a3"
                px={5}
                py={3}
                fontSize="14px"
                fontWeight="500"
                borderRight="1px solid #2d2d2d"
                borderRadius={0}
                transition="all 0.2s ease"
                _selected={{
                  color: "#ffffff",
                  bg: "#1a1a1a",
                  borderBottom: "2px solid #10b981"
                }}
                _hover={{
                  color: "#ffffff",
                  bg: "#333333"
                }}
              >
                <Text fontSize="lg">📊</Text>
                <Text ml={2}>JSON to Table</Text>
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="fields"
                bg="transparent"
                color="#a3a3a3"
                px={5}
                py={3}
                fontSize="14px"
                fontWeight="500"
                borderRadius={0}
                transition="all 0.2s ease"
                _selected={{
                  color: "#ffffff",
                  bg: "#1a1a1a",
                  borderBottom: "2px solid #10b981"
                }}
                _hover={{
                  color: "#ffffff",
                  bg: "#333333"
                }}
              >
                <Text fontSize="lg">📝</Text>
                <Text ml={2}>JSON to Form Fields</Text>
              </Tabs.Trigger>
            </Tabs.List>

            <Box bg="#1a1a1a">
              <Tabs.Content value="table" p={6}>
                {/* Demo Controls */}
                <Box mb={6} p={4} bg="#262626" borderRadius="6px" border="1px solid #404040">
                  <Text fontSize="16px" fontWeight="600" color="#ffffff" mb={3}>
                    Demo Controls
                  </Text>
                  <Box display="flex" gap="16px" flexWrap="wrap">
                    <Box
                      as="button"
                      onClick={loadSampleTable}
                      bg="#10b981"
                      color="white"
                      borderRadius="6px"
                      px="16px"
                      py="8px"
                      fontSize="14px"
                      fontWeight="500"
                      border="none"
                      cursor="pointer"
                      transition="all 0.2s ease"
                      _hover={{ bg: "#059669" }}
                    >
                      📊 Load Sample Data
                    </Box>
                    <Box
                      as="button"
                      onClick={() => setTableJsonInput('')}
                      bg="transparent"
                      color="#a3a3a3"
                      borderRadius="6px"
                      px="16px"
                      py="8px"
                      fontSize="14px"
                      fontWeight="500"
                      border="1px solid #404040"
                      cursor="pointer"
                      transition="all 0.2s ease"
                      _hover={{ bg: "#262626", borderColor: "#525252", color: "#ffffff" }}
                    >
                      🗑️ Clear Input
                    </Box>
                  </Box>
                </Box>

                <JsonToTable 
                  uiLibrary="chakra"
                  customStyles={customTableStyles}
                  initialJson={tableJsonInput}
                  onSave={(nestedData) => {
                    console.log('Table data saved:', nestedData);
                  }}
                  onCancel={() => {
                    console.log('Table editing cancelled');
                  }}
                  onFieldChange={(key, value) => {
                    console.log(`Field ${key} changed to:`, value);
                  }}
                  saveButtonText="💾 Save Table"
                  cancelButtonText="🔄 Reset Table"
                />
              </Tabs.Content>

              <Tabs.Content value="fields" p={6}>
                {/* Field Configuration Demo Info */}
                <Box mb={6} p={4} bg="#1e3a8a" borderRadius="6px" border="1px solid #3b82f6">
                  <Text fontSize="16px" fontWeight="600" color="#ffffff" mb={2}>
                    🎯 Flexible Field Configuration Demo
                  </Text>
                  <Text fontSize="14px" color="#bfdbfe" mb={3}>
                    This demo showcases intelligent field type detection and custom field configuration. 
                    The form automatically renders appropriate input types based on your JSON data and field configuration.
                  </Text>
                  <Text fontSize="12px" color="#93c5fd">
                    <strong>Featured field types:</strong> Email, URL, Date, Password, Select dropdown, Multi-select checkboxes, Textarea, and more!
                  </Text>
                </Box>

                {/* Demo Controls */}
                <Box mb={6} p={4} bg="#262626" borderRadius="6px" border="1px solid #404040">
                  <Text fontSize="16px" fontWeight="600" color="#ffffff" mb={3}>
                    Demo Controls
                  </Text>
                  <Box display="flex" gap="16px" flexWrap="wrap">
                    <Box
                      as="button"
                      onClick={loadSampleForm}
                      bg="#10b981"
                      color="white"
                      borderRadius="6px"
                      px="16px"
                      py="8px"
                      fontSize="14px"
                      fontWeight="500"
                      border="none"
                      cursor="pointer"
                      transition="all 0.2s ease"
                      _hover={{ bg: "#059669" }}
                    >
                      📝 Load Sample Data
                    </Box>
                    <Box
                      as="button"
                      onClick={() => setFormJsonInput('')}
                      bg="transparent"
                      color="#a3a3a3"
                      borderRadius="6px"
                      px="16px"
                      py="8px"
                      fontSize="14px"
                      fontWeight="500"
                      border="1px solid #404040"
                      cursor="pointer"
                      transition="all 0.2s ease"
                      _hover={{ bg: "#262626", borderColor: "#525252", color: "#ffffff" }}
                    >
                      🗑️ Clear Input
                    </Box>
                  </Box>
                </Box>

                <JsonToFields 
                  uiLibrary="chakra"
                  customStyles={customFormStyles}
                  columns={2}
                  initialJson={formJsonInput}
                  fieldConfig={sampleFieldConfig}
                  onSave={(nestedData) => {
                    console.log('Form data saved:', nestedData);
                  }}
                  onCancel={() => {
                    console.log('Form cancelled');
                  }}
                  onFieldChange={(key, value) => {
                    console.log(`Field ${key} changed to:`, value);
                  }}
                  saveButtonText="💾 Save Form"
                  cancelButtonText="🔄 Reset Form"
                />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
