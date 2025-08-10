import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Table,
  Textarea,
  Text,
  Alert,
  Card,
  HStack,
  Badge,
} from '@chakra-ui/react';

function JsonToTable() {
  const [jsonInput, setJsonInput] = useState('');
  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState('');

  const sampleJson = JSON.stringify([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Developer", salary: 75000 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer", salary: 68000 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Manager", salary: 85000 },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Developer", salary: 72000 },
  ], null, 2);

  const parseJson = () => {
    setError('');
    setTableData(null);
    
    if (!jsonInput.trim()) {
      setError('Please enter some JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      
      // Check if it's an array
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          setError('The JSON array is empty');
          return;
        }
        setTableData(parsed);
      } 
      // If it's an object, wrap it in an array
      else if (typeof parsed === 'object' && parsed !== null) {
        setTableData([parsed]);
      } 
      else {
        setError('JSON must be an array or object');
      }
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
    }
  };

  const clearAll = () => {
    setJsonInput('');
    setTableData(null);
    setError('');
  };

  const loadSample = () => {
    setJsonInput(sampleJson);
    setError('');
    setTableData(null);
  };

  const prettifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch {
      setError('Cannot prettify invalid JSON');
    }
  };

  const getTableHeaders = (data) => {
    if (!data || data.length === 0) return [];
    
    // Get all unique keys from all objects
    const allKeys = new Set();
    data.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => allKeys.add(key));
      }
    });
    
    return Array.from(allKeys);
  };

  const formatCellValue = (value) => {
    if (value === null) return <Text color="fg.muted">null</Text>;
    if (value === undefined) return <Text color="fg.muted">-</Text>;
    if (typeof value === 'boolean') {
      return (
        <Badge colorPalette={value ? 'green' : 'red'} size="sm">
          {value.toString()}
        </Badge>
      );
    }
    if (typeof value === 'object') {
      return (
        <Text fontSize="xs" fontFamily="mono">
          {JSON.stringify(value)}
        </Text>
      );
    }
    if (typeof value === 'number') {
      return <Text fontFamily="mono">{value}</Text>;
    }
    return value.toString();
  };

  return (
    <Container maxW="6xl" py={8}>
      <Stack gap={6}>
        <Box>
          <Heading size="2xl" mb={2}>JSON to Table Converter</Heading>
          <Text color="fg.muted">
            Convert your JSON data into a beautiful, readable table
          </Text>
        </Box>

        <Card.Root>
          <Card.Body>
            <Stack gap={4}>
              <Flex justify="space-between" align="center">
                <Heading size="md">Input JSON</Heading>
                <HStack>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={loadSample}
                  >
                    Load Sample
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={prettifyJson}
                    disabled={!jsonInput}
                  >
                    Prettify
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    colorPalette="red"
                    onClick={clearAll}
                    disabled={!jsonInput && !tableData}
                  >
                    Clear All
                  </Button>
                </HStack>
              </Flex>

              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON here... It can be an array of objects or a single object."
                rows={10}
                fontFamily="mono"
                fontSize="sm"
              />

              {error && (
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Error</Alert.Title>
                    <Alert.Description>{error}</Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              )}

              <Button 
                colorPalette="blue"
                onClick={parseJson}
                disabled={!jsonInput}
                size="lg"
              >
                Convert to Table
              </Button>
            </Stack>
          </Card.Body>
        </Card.Root>

        {tableData && (
          <Card.Root>
            <Card.Body>
              <Stack gap={4}>
                <Flex justify="space-between" align="center">
                  <Heading size="md">Result Table</Heading>
                  <Badge colorPalette="green" size="lg">
                    {tableData.length} row{tableData.length !== 1 ? 's' : ''}
                  </Badge>
                </Flex>

                <Table.ScrollArea borderWidth="1px" rounded="md" maxH="500px">
                  <Table.Root size="sm" variant="outline" striped>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>#</Table.ColumnHeader>
                        {getTableHeaders(tableData).map((header) => (
                          <Table.ColumnHeader key={header}>
                            {header}
                          </Table.ColumnHeader>
                        ))}
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {tableData.map((row, rowIndex) => (
                        <Table.Row key={rowIndex}>
                          <Table.Cell fontWeight="medium">
                            {rowIndex + 1}
                          </Table.Cell>
                          {getTableHeaders(tableData).map((header) => (
                            <Table.Cell key={`${rowIndex}-${header}`}>
                              {formatCellValue(row[header])}
                            </Table.Cell>
                          ))}
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Table.ScrollArea>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="fg.muted">
                    Tip: The table supports horizontal scrolling for wide data
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const dataStr = JSON.stringify(tableData, null, 2);
                      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                      const exportFileDefaultName = 'table_data.json';
                      
                      const linkElement = document.createElement('a');
                      linkElement.setAttribute('href', dataUri);
                      linkElement.setAttribute('download', exportFileDefaultName);
                      linkElement.click();
                    }}
                  >
                    Export JSON
                  </Button>
                </HStack>
              </Stack>
            </Card.Body>
          </Card.Root>
        )}
      </Stack>
    </Container>
  );
}

export default JsonToTable;
