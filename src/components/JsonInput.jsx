import React from 'react';
import {
  Box,
  Button,
  Textarea,
  VStack,
  HStack,
  Heading,
  Alert,
  Text,
} from '@chakra-ui/react';
import { SAMPLE_JSON } from '../constants/sampleData';
import { formatJson } from '../utils/jsonUtils';

/**
 * JsonInput Component
 * Handles JSON input, validation, and sample data loading
 */
const JsonInput = ({ jsonInput, setJsonInput, onParse, error }) => {
  
  // Load sample data
  const loadSample = (sampleKey) => {
    if (sampleKey && typeof sampleKey === 'string' && SAMPLE_JSON[sampleKey]) {
      const sampleData = SAMPLE_JSON[sampleKey].data;
      setJsonInput(formatJson(sampleData));
    }
  };

  // Prettify JSON
  const prettifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(formatJson(parsed));
    } catch {
      // If parsing fails, don't change the input
    }
  };

  // Clear input
  const clearInput = () => {
    setJsonInput('');
  };

  return (
    <VStack align="stretch" gap={4}>
      <Heading size="lg">JSON Input</Heading>
      
      {/* Sample Data Selector */}
      <Box>
        <Text fontSize="sm" mb={2} color="fg.muted">
          Load sample data:
        </Text>
        <Box>
          <select
            onChange={(e) => e.target.value && loadSample(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            defaultValue=""
          >
            <option value="" disabled>Choose a sample...</option>
            <option value="simple">Simple Object</option>
            <option value="nested">Nested Object</option>
            <option value="complex">Complex Data</option>
            <option value="array">Array Data</option>
          </select>
        </Box>
      </Box>

      {/* JSON Textarea */}
      <Textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Enter your JSON here..."
        rows={12}
        fontFamily="mono"
        fontSize="sm"
        bg="gray.50"
        _dark={{ bg: 'gray.800' }}
      />

      {/* Action Buttons */}
      <HStack gap={2}>
        <Button 
          onClick={onParse} 
          colorPalette="blue"
          flex={1}
        >
          Generate Form Fields
        </Button>
        <Button 
          onClick={prettifyJson}
          variant="outline"
        >
          Prettify
        </Button>
        <Button 
          onClick={clearInput}
          variant="outline"
          colorPalette="red"
        >
          Clear
        </Button>
      </HStack>

      {/* Error Display */}
      {error && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Invalid JSON</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </VStack>
  );
};

export default JsonInput;
