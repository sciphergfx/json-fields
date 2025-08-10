import { useState, useEffect } from "react";
import { Box, Container, Tabs, Text } from "@chakra-ui/react";
import JsonToTable from "./components/JsonToTable";
import JsonToFields from "./components/JsonToFields"; 
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "./utils/storage";

function App() {
  // Load saved tab preference
  const [activeTab, setActiveTab] = useState(() =>
    getStorageItem(STORAGE_KEYS.TAB_PREFERENCE, "table")
  );

  // Save tab preference when it changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.TAB_PREFERENCE, activeTab);
  }, [activeTab]);

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Container maxW="8xl" py={4}>
        <Tabs.Root
          value={activeTab}
          onValueChange={(e) => setActiveTab(e.value)}
          variant="enclosed"
        >
          <Tabs.List>
            <Tabs.Trigger value="table">
              <Text fontSize="lg">📊</Text>
              <Text ml={2}>JSON to Table</Text>
            </Tabs.Trigger>
            <Tabs.Trigger value="fields">
              <Text fontSize="lg">📝</Text>
              <Text ml={2}>JSON to Form Fields</Text>
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="table">
            <JsonToTable />
          </Tabs.Content>

          <Tabs.Content value="fields">
            <JsonToFields />
          </Tabs.Content>
        </Tabs.Root>
      </Container>
    </Box>
  );
}

export default App;
