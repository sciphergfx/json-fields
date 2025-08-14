import { useState, useEffect } from "react";
import { Box, Container, Tabs, Text } from "@chakra-ui/react";
import { Table, Fields, List } from "../lib";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "./utils/storage";

function App() {
  // Load saved tab preference
  const [activeTab, setActiveTab] = useState(() =>
    getStorageItem(STORAGE_KEYS.TAB_PREFERENCE, "table")
  );

  // Form demo state
  const [formJsonInput, setFormJsonInput] = useState("");

  // Table demo state
  const [tableJsonInput, setTableJsonInput] = useState("");
  // Table pagination/cache demo controls
  const [tablePaginationEnabled, setTablePaginationEnabled] = useState(true);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [tableCacheSize, setTableCacheSize] = useState(3);
  const [tableInitialPage, setTableInitialPage] = useState(1);
  const [tableUseCustomPager, setTableUseCustomPager] = useState(false);

  // Theme
  const [theme, setTheme] = useState("dark");
  const palette =
    theme === "light"
      ? {
          background: "#f8fafc", // slate-50
          panel: "#ffffff",
          muted: "#f1f5f9", // slate-100
          border: "#e5e7eb", // gray-200
          text: "#0f172a", // slate-900
          subtext: "#475569", // slate-600
          accent: "#10b981", // emerald-500
          danger: "#ef4444",
          tableHeader: "#f1f5f9",
          inputBg: "#ffffff",
          inputText: "#0f172a",
          icon: "#334155",
          hover: "#e2e8f0",
        }
      : {
          background: "#0f0f0f",
          panel: "#1a1a1a",
          muted: "#262626",
          border: "#2d2d2d",
          text: "#ffffff",
          subtext: "#a3a3a3",
          accent: "#10b981",
          danger: "#ef4444",
          tableHeader: "#262626",
          inputBg: "#262626",
          inputText: "#ffffff",
          icon: "#e5e7eb",
          hover: "#333333",
        };

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
    );
  };
  // GitHub repo stats
  const REPO_OWNER = "sciphergfx";
  const REPO_NAME = "json-to-table";
  const [forks, setForks] = useState(null);

  useEffect(() => {
    // Fetch forks count from GitHub
    const controller = new AbortController();
    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.forks_count === "number") {
          setForks(data.forks_count);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Save tab preference when it changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.TAB_PREFERENCE, activeTab);
  }, [activeTab]);

  // Sample JSON data for table demo
  const sampleTableJson = JSON.stringify(
    [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "Developer",
        salary: 175000,
        active: true,
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "Designer",
        salary: 168000,
        active: true,
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        role: "Manager",
        salary: 185000,
        active: false,
      },
      {
        id: 4,
        name: "Alice Brown",
        email: "alice@example.com",
        role: "Developer",
        salary: 172000,
        active: true,
      },
    ],
    null,
    2
  );

  // Utility: generate many rows for pagination demo
  const generateManyRows = (count = 53) => {
    const roles = ["Developer", "Designer", "Manager", "Analyst", "Intern"];
    const rows = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: roles[i % roles.length],
      salary: 150000 + (i % 10) * 3500,
      active: i % 3 !== 0,
    }));
    return JSON.stringify(rows, null, 2);
  };

  // Sample JSON data for list demo
  const sampleListData = [
    {
      label: "Main",
      children: [{ label: "Sample" }, { label: "Flow 2" }],
    },
    {
      label: "Workflow Type",
      children: [],
    },
    {
      label: "Sample",
      children: [{ label: "Sample" }, { label: "Flow 2" }],
    },
    {
      label: "Flow 2",
    },
  ];

  // Sample JSON data for form demo
  const sampleFormJson = JSON.stringify(
    {
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
        notifications: true,
      },
      tags: ["developer", "react", "javascript"],
    },
    null,
    2
  );

  // Sample field configuration to demonstrate flexible field types
  const sampleFieldConfig = {
    email: { type: "email" },
    website: { type: "url" },
    joinDate: { type: "date" },
    password: { type: "password" },
    role: {
      type: "select",
      options: ["developer", "designer", "manager", "analyst", "intern"],
    },
    skills: {
      type: "multi-select",
      options: [
        "React",
        "Vue",
        "Angular",
        "JavaScript",
        "TypeScript",
        "Node.js",
        "Python",
        "Java",
        "C++",
      ],
    },
    bio: {
      type: "textarea",
      rows: 3,
    },
  };

  const loadSampleTable = () => {
    setTableJsonInput(sampleTableJson);
  };

  const loadLargeSampleTable = () => {
    setTableJsonInput(generateManyRows(57));
  };

  const loadSampleForm = () => {
    setFormJsonInput(sampleFormJson);
  };

  const customTableStyles = {
    container: {
      background: palette.panel,
      borderRadius: "8px",
      padding: "24px",
      border: `1px solid ${palette.border}`,
    },
    heading: {
      color: palette.text,
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "8px",
      letterSpacing: "-0.025em",
    },
    inputContainer: {
      background: palette.muted,
      borderRadius: "6px",
      padding: "16px",
      border: `1px solid ${palette.border}`,
      marginBottom: "16px",
    },
    textarea: {
      background: palette.panel,
      border: `1px solid ${palette.border}`,
      borderRadius: "6px",
      color: palette.text,
      fontSize: "14px",
      fontFamily:
        'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      padding: "12px",
      transition: "border-color 0.2s ease",
      _focus: {
        borderColor: palette.accent,
        outline: "none",
        boxShadow: "none",
      },
    },
    buttonGroup: {
      justifyContent: "flex-start",
      gap: "12px",
    },
    button: {
      background: palette.accent,
      color: "#ffffff",
      borderRadius: "6px",
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "500",
      border: "none",
      transition: "all 0.2s ease",
      _hover: {
        background: "#059669",
      },
    },
    secondaryButton: {
      background: "transparent",
      color: palette.subtext,
      borderRadius: "6px",
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "500",
      border: `1px solid ${palette.border}`,
      transition: "all 0.2s ease",
      _hover: {
        background: palette.muted,
        borderColor: palette.border,
        color: palette.text,
      },
    },
    tableContainer: {
      background: palette.panel,
      borderRadius: "6px",
      marginTop: "24px",
      border: `1px solid ${palette.border}`,
      overflow: "hidden",
    },
    table: {
      width: "100%",
    },
    th: {
      background: palette.tableHeader,
      color: palette.subtext,
      fontWeight: "500",
      fontSize: "12px",
      textAlign: "left",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      padding: "12px 16px",
      borderBottom: `1px solid ${palette.border}`,
    },
    td: {
      padding: "12px 16px",
      borderBottom: `1px solid ${palette.border}`,
      color: palette.text,
    },
    input: {
      background: "transparent",
      border: "none",
      color: palette.text,
      fontSize: "14px",
      width: "100%",
      padding: "4px 8px",
      borderRadius: "4px",
      transition: "background-color 0.2s ease",
      _focus: {
        outline: "none",
        background: palette.muted,
      },
    },
    controlButtons: {
      justifyContent: "flex-start",
      gap: "12px",
      marginTop: "24px",
      paddingTop: "16px",
      borderTop: "1px solid #2d2d2d",
    },
    saveButton: {
      background: palette.accent,
      color: theme === "light" ? "#ffffff" : "white",
      borderRadius: "6px",
      padding: "8px 16px",
      fontSize: "14px",
      marginRight: "16px",
      fontWeight: "500",
      border: "none",
      transition: "all 0.2s ease",
      _hover: {
        background: "#059669",
      },
    },
    cancelButton: {
      background: "transparent",
      color: palette.danger,
      borderRadius: "6px",
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "500",
      border: `1px solid ${palette.danger}`,
      transition: "all 0.2s ease",
      _hover: {
        background: palette.danger,
        color: "#ffffff",
      },
    },
  };

  const customFormStyles = {
    container: {
      background: palette.panel,
      borderRadius: "8px",
      padding: "24px",
      border: `1px solid ${palette.border}`,
    },
    heading: {
      color: palette.text,
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "8px",
      letterSpacing: "-0.025em",
    },
    inputContainer: {
      background: palette.muted,
      borderRadius: "6px",
      padding: "16px",
      border: `1px solid ${palette.border}`,
      marginBottom: "16px",
    },
    formCard: {
      color: palette.text,
      background: palette.panel,
      borderRadius: "6px",
      padding: "24px",
      marginTop: "24px",
      border: `1px solid ${palette.border}`,
    },
    formStack: {
      gap: "20px",
    },
    fieldContainer: {
      marginBottom: "20px",
    },
    fieldLabel: {
      color: "#ffffff",
      fontWeight: "500",
      marginBottom: "2px",
      fontSize: "14px",
      display: "block",
    },
    input: {
      background: "#262626",
      border: "1px solid #404040",
      borderRadius: "6px",
      color: "#ffffff",
      padding: "8px 12px",
      fontSize: "14px",
      width: "100%",
      transition: "border-color 0.2s ease",
      _focus: {
        borderColor: "#10b981",
        outline: "none",
        boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
      },
    },
    textarea: {
      background: "#262626",
      border: "1px solid #404040",
      borderRadius: "6px",
      color: "#ffffff",
      padding: "12px",
      fontSize: "14px",
      fontFamily:
        'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      width: "100%",
      minHeight: "120px",
      transition: "border-color 0.2s ease",
      _focus: {
        borderColor: "#10b981",
        outline: "none",
        boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
      },
    },
    select: {
      background: "#1a1a1a",
      border: "1px solid #404040",
      borderRadius: "6px",
      color: "#ffffff",
      fontSize: "14px",
      padding: "12px 40px 12px 12px", // Extra right padding for dropdown arrow
      width: "100%",
      transition: "border-color 0.2s ease",
      appearance: "none", // Remove default styling
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a3a3a3' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: "right 12px center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "16px",
      _focus: {
        borderColor: "#10b981",
        outline: "none",
        boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
      },
    },
    checkbox: {
      width: "16px",
      height: "16px",
      accentColor: "#10b981",
      marginRight: "8px",
      flexShrink: 0, // Prevent checkbox from shrinking
    },
    label: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#ffffff",
      fontSize: "14px",
    },
    text: {
      color: "#ffffff",
      fontSize: "14px",
    },
    button: {
      background: "#10b981",
      color: "white",
      borderRadius: "6px",
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "500",
      border: "none",
      transition: "all 0.2s ease",
      _hover: {
        background: "#059669",
      },
    },
    secondaryButton: {
      background: "transparent",
      color: "#a3a3a3",
      borderRadius: "6px",
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "500",
      border: "1px solid #404040",
      transition: "all 0.2s ease",
      _hover: {
        background: "#262626",
        borderColor: "#525252",
        color: "#ffffff",
      },
    },
    buttonGroup: {
      justifyContent: "flex-start",
      gap: "16px",
    },
    controlButtons: {
      justifyContent: "flex-start",
      gap: "16px",
      marginTop: "24px",
      paddingTop: "16px",
      borderTop: "1px solid #2d2d2d",
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
      background: "#10b981",
      color: "white",
      borderRadius: "6px",
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "500",
      border: "none",
      marginRight: "16px",
      transition: "all 0.2s ease",
      _hover: {
        background: "#059669",
      },
    },
    cancelButton: {
      background: "transparent",
      color: "#ef4444",
      borderRadius: "6px",
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "500",
      border: "1px solid #ef4444",
      transition: "all 0.2s ease",
      _hover: {
        background: "#ef4444",
        color: "white",
      },
    },
  };

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
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
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
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </Box>
          <Box
            as="a"
            href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
            target="_blank"
            rel="noreferrer"
            bg={theme === "light" ? "#f8fafc" : "#0f172a"}
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
            bg={theme === "light" ? "#eef2ff" : "#111827"}
            color={theme === "light" ? "#1e3a8a" : "#93c5fd"}
            border={`1px solid ${palette.border}`}
            borderRadius="9999px"
            px="10px"
            py="4px"
            fontSize="12px"
            fontWeight="600"
          >
            Forks: {forks ?? "—"}
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
          <Tabs.Root
            value={activeTab}
            onValueChange={(e) => setActiveTab(e.value)}
          >
            <Tabs.List
              bg={palette.muted}
              borderBottom={`1px solid ${palette.border}`}
              p={0}
            >
              <Tabs.Trigger
                value="table"
                bg="transparent"
                color={palette.subtext}
                px={5}
                py={3}
                fontSize="14px"
                fontWeight="500"
                borderRight="1px solid #2d2d2d"
                borderRadius={0}
                transition="all 0.2s ease"
                _selected={{
                  color: palette.text,
                  bg: palette.panel,
                  borderBottom: "2px solid #10b981",
                }}
                _hover={{
                  color: palette.text,
                  bg: palette.hover,
                }}
              >
                <Text fontSize="lg">📊</Text>
                <Text ml={2}>JSON to Table</Text>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="fields"
                bg="transparent"
                color={palette.subtext}
                px={5}
                py={3}
                fontSize="14px"
                fontWeight="500"
                borderRadius={0}
                transition="all 0.2s ease"
                _selected={{
                  color: palette.text,
                  bg: palette.panel,
                  borderBottom: "2px solid #10b981",
                }}
                _hover={{
                  color: palette.text,
                  bg: palette.hover,
                }}
              >
                <Text fontSize="lg">📝</Text>
                <Text ml={2}>JSON to Form Fields</Text>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="list"
                bg="transparent"
                color={palette.subtext}
                px={5}
                py={3}
                fontSize="14px"
                fontWeight="500"
                borderRadius={0}
                transition="all 0.2s ease"
                _selected={{
                  color: palette.text,
                  bg: palette.panel,
                  borderBottom: "2px solid #10b981",
                }}
                _hover={{
                  color: palette.text,
                  bg: palette.hover,
                }}
              >
                <Text fontSize="lg">📁</Text>
                <Text ml={2}>JSON to List</Text>
              </Tabs.Trigger>
            </Tabs.List>

            <Box bg={palette.panel}>
              <Tabs.Content value="table" p={6}>
                {/* Demo Controls */}
                <Box
                  mb={6}
                  p={4}
                  bg={palette.muted}
                  borderRadius="6px"
                  border={`1px solid ${palette.border}`}
                >
                  <Text
                    fontSize="16px"
                    fontWeight="600"
                    color={palette.text}
                    mb={3}
                  >
                    Demo Controls
                  </Text>
                  <Box display="flex" gap="16px" flexWrap="wrap">
                    <Box
                      as="button"
                      onClick={loadSampleTable}
                      bg={palette.accent}
                      color="#ffffff"
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
                      onClick={loadLargeSampleTable}
                      bg={palette.accent}
                      color="#ffffff"
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
                      📈 Load 57 Rows
                    </Box>
                    <Box
                      as="button"
                      onClick={() => setTableJsonInput("")}
                      bg="transparent"
                      color={palette.subtext}
                      borderRadius="6px"
                      px="16px"
                      py="8px"
                      fontSize="14px"
                      fontWeight="500"
                      border={`1px solid ${palette.border}`}
                      cursor="pointer"
                      transition="all 0.2s ease"
                      _hover={{
                        bg: palette.muted,
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    >
                      🗑️ Clear Input
                    </Box>
                  </Box>

                  {/* Pagination & Cache Controls */}
                  <Box
                    mt={4}
                    display="flex"
                    gap="16px"
                    flexWrap="wrap"
                    alignItems="center"
                  >
                    <Box display="flex" alignItems="center" gap="8px">
                      <input
                        id="tbl-pagination"
                        type="checkbox"
                        checked={tablePaginationEnabled}
                        onChange={(e) =>
                          setTablePaginationEnabled(e.target.checked)
                        }
                      />
                      <label htmlFor="tbl-pagination">Enable pagination</label>
                    </Box>
                    <Box display="flex" alignItems="center" gap="8px">
                      <input
                        id="tbl-custompager"
                        type="checkbox"
                        checked={tableUseCustomPager}
                        onChange={(e) =>
                          setTableUseCustomPager(e.target.checked)
                        }
                      />
                      <label htmlFor="tbl-custompager">Use custom pager</label>
                    </Box>
                    <Box display="flex" alignItems="center" gap="8px">
                      <label htmlFor="tbl-pagesize">Page size</label>
                      <input
                        id="tbl-pagesize"
                        type="number"
                        min={1}
                        value={tablePageSize}
                        onChange={(e) =>
                          setTablePageSize(
                            Math.max(1, parseInt(e.target.value || "1", 10))
                          )
                        }
                        style={{
                          width: 80,
                          padding: "4px 8px",
                          background: theme === "light" ? "#fff" : "#1f2937",
                          color: palette.text,
                          border: `1px solid ${palette.border}`,
                          borderRadius: 6,
                        }}
                      />
                    </Box>
                    <Box display="flex" alignItems="center" gap="8px">
                      <label htmlFor="tbl-cachesize">Cache size</label>
                      <input
                        id="tbl-cachesize"
                        type="number"
                        min={1}
                        value={tableCacheSize}
                        onChange={(e) =>
                          setTableCacheSize(
                            Math.max(1, parseInt(e.target.value || "1", 10))
                          )
                        }
                        style={{
                          width: 80,
                          padding: "4px 8px",
                          background: theme === "light" ? "#fff" : "#1f2937",
                          color: palette.text,
                          border: `1px solid ${palette.border}`,
                          borderRadius: 6,
                        }}
                      />
                    </Box>
                    <Box display="flex" alignItems="center" gap="8px">
                      <label htmlFor="tbl-initialpage">Initial page</label>
                      <input
                        id="tbl-initialpage"
                        type="number"
                        min={1}
                        value={tableInitialPage}
                        onChange={(e) =>
                          setTableInitialPage(
                            Math.max(1, parseInt(e.target.value || "1", 10))
                          )
                        }
                        style={{
                          width: 80,
                          padding: "4px 8px",
                          background: theme === "light" ? "#fff" : "#1f2937",
                          color: palette.text,
                          border: `1px solid ${palette.border}`,
                          borderRadius: 6,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Table
                  uiLibrary="chakra"
                  customStyles={customTableStyles}
                  initialJson={tableJsonInput}
                  pagination={tablePaginationEnabled}
                  pageSize={tablePageSize}
                  cacheSize={tableCacheSize}
                  initialPage={tableInitialPage}
                  onPageChange={(page) =>
                    console.log("Table onPageChange ->", page)
                  }
                  paginationRenderer={
                    tableUseCustomPager ? renderCustomPager : null
                  }
                  onSave={(nestedData) => {
                    console.log("Table data saved:", nestedData);
                  }}
                  onCancel={() => {
                    console.log("Table editing cancelled");
                  }}
                  onFieldChange={(key, value) => {
                    console.log(`Field ${key} changed to:`, value);
                  }}
                  saveButtonText="💾 Save Table"
                  cancelButtonText="🔄 Reset Table"
                />
              </Tabs.Content>

              <Tabs.Content value="list" p={6}>
                <Box
                  mb={4}
                  p={3}
                  bg={palette.muted}
                  borderRadius="6px"
                  border={`1px solid ${palette.border}`}
                >
                  <Text fontSize="14px" color={palette.subtext}>
                    Collapsible, UI-agnostic list from JSON. Hover a row to see
                    the action icon.
                  </Text>
                </Box>
                <List
                  data={sampleListData}
                  startIcon={<span style={{ fontSize: 14 }}>▦</span>}
                  parentIcon={<span style={{ fontSize: 14 }}>📁</span>}
                  childIcon={<span style={{ fontSize: 14 }}>🔗</span>}
                  hoverIcon={<span style={{ fontSize: 16 }}>⋯</span>}
                  mode={theme === "light" ? "light" : "dark"}
                  parentOpenIcon={<span style={{ fontSize: 12 }}>▼</span>}
                  parentClosedIcon={<span style={{ fontSize: 12 }}>▶</span>}
                  sections={[
                    {
                      id: "parents",
                      title: "Parent Nodes",
                      collapsible: true,
                      defaultOpen: true,
                      filter: (i) =>
                        Array.isArray(i.children) && i.children.length > 0,
                    },
                    {
                      id: "leaves",
                      title: "Leaf Nodes",
                      collapsible: true,
                      defaultOpen: true,
                      filter: (i) => !i.children || i.children.length === 0,
                    },
                  ]}
                  customStyles={{
                    container: {
                      background: palette.panel,
                      border: `1px solid ${palette.border}`,
                      borderRadius: "8px",
                    },
                    header: {
                      padding: "10px 12px",
                      color: palette.subtext,
                      background: palette.muted,
                      borderBottom: `1px solid ${palette.border}`,
                    },
                    list: { padding: "8px 8px 12px" },
                    row: { background: "transparent" },
                    parent: {},
                    child: {},
                    hoverIcon: { color: palette.subtext },
                  }}
                  onItemClick={(item) =>
                    console.log("List item clicked:", item)
                  }
                  onToggle={(item, isOpen) =>
                    console.log("Toggled", item.label, "->", isOpen)
                  }
                />
              </Tabs.Content>

              <Tabs.Content value="fields" p={6}>
                {/* Field Configuration Demo Info */}
                <Box
                  mb={6}
                  p={4}
                  bg={theme === "light" ? "#e0f2fe" : "#1e3a8a"}
                  borderRadius="6px"
                  border={`1px solid ${
                    theme === "light" ? "#93c5fd" : "#3b82f6"
                  }`}
                >
                  <Text
                    fontSize="16px"
                    fontWeight="600"
                    color={palette.text}
                    mb={2}
                  >
                    🎯 Flexible Field Configuration Demo
                  </Text>
                  <Text fontSize="14px" color={palette.subtext} mb={3}>
                    This demo showcases intelligent field type detection and
                    custom field configuration. The form automatically renders
                    appropriate input types based on your JSON data and field
                    configuration.
                  </Text>
                  <Text fontSize="12px" color={palette.subtext}>
                    <strong>Featured field types:</strong> Email, URL, Date,
                    Password, Select dropdown, Multi-select checkboxes,
                    Textarea, and more!
                  </Text>
                </Box>

                {/* Demo Controls */}
                <Box
                  mb={6}
                  p={4}
                  bg={palette.muted}
                  borderRadius="6px"
                  border={`1px solid ${palette.border}`}
                >
                  <Text
                    fontSize="16px"
                    fontWeight="600"
                    color={palette.text}
                    mb={3}
                  >
                    Demo Controls
                  </Text>
                  <Box display="flex" gap="16px" flexWrap="wrap">
                    <Box
                      as="button"
                      onClick={loadSampleForm}
                      bg={palette.accent}
                      color="#ffffff"
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
                      onClick={() => setFormJsonInput("")}
                      bg="transparent"
                      color={palette.subtext}
                      borderRadius="6px"
                      px="16px"
                      py="8px"
                      fontSize="14px"
                      fontWeight="500"
                      border={`1px solid ${palette.border}`}
                      cursor="pointer"
                      transition="all 0.2s ease"
                      _hover={{
                        bg: palette.muted,
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    >
                      🗑️ Clear Input
                    </Box>
                  </Box>
                </Box>

                <Fields
                  customStyles={customFormStyles}
                  initialJson={formJsonInput}
                  fieldConfig={sampleFieldConfig}
                  columns={2}
                  sections={[
                    {
                      id: "profile",
                      title: "Profile",
                      description: "Basic info",
                      fields: ["name", "email", "website", "role", "joinDate"],
                      collapsible: true,
                      defaultOpen: true,
                    },
                    {
                      id: "about",
                      title: "About",
                      fields: ["bio", "skills", "tags"],
                      collapsible: true,
                      defaultOpen: true,
                    },
                    {
                      id: "preferences",
                      title: "Preferences",
                      fields: [
                        "preferences.theme",
                        "preferences.notifications",
                        "isActive",
                      ],
                      collapsible: true,
                      defaultOpen: true,
                    },
                    {
                      id: "security",
                      title: "Security",
                      fields: ["password"],
                      collapsible: true,
                      defaultOpen: false,
                    },
                  ]}
                  includeUnsectioned
                  onSave={(nestedData) => {
                    console.log("Form data saved:", nestedData);
                  }}
                  onCancel={() => {
                    console.log("Form cancelled");
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
