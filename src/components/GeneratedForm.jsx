import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Code,
  Text,
  Card,
  Button,
  HStack,
  Badge,
} from '@chakra-ui/react';
import FormField from './FormField';
import { unflattenObject, formatJson } from '../utils/jsonUtils';

/**
 * GeneratedForm Component
 * Displays generated form fields and JSON preview
 */
const GeneratedForm = ({ formData, onChange, parsedJson }) => {
  if (!parsedJson) {
    return (
      <Card.Root variant="outline">
        <Card.Body>
          <VStack py={8}>
            <Text color="fg.muted">
              Enter JSON and click "Generate Form Fields" to see the form
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  const fieldCount = Object.keys(formData).length;
  const nestedData = unflattenObject(formData);

  // Export current form data as JSON
  const exportJson = () => {
    const dataStr = formatJson(nestedData);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'form_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Copy JSON to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatJson(nestedData));
  };

  return (
    <VStack align="stretch" gap={4}>
      <HStack justify="space-between">
        <Heading size="lg">Generated Form</Heading>
        <Badge colorPalette="green" size="lg">
          {fieldCount} field{fieldCount !== 1 ? 's' : ''}
        </Badge>
      </HStack>

      {/* Form Fields */}
      <Card.Root variant="outline">
        <Card.Body>
          <Box maxH="400px" overflowY="auto" pr={2}>
            {Object.entries(formData).map(([key, value]) => (
              <FormField
                key={key}
                fieldKey={key}
                value={value}
                onChange={onChange}
              />
            ))}
          </Box>
        </Card.Body>
      </Card.Root>

      {/* JSON Preview */}
      <Card.Root>
        <Card.Header>
          <HStack justify="space-between">
            <Heading size="md">Current Values (JSON)</Heading>
            <HStack>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
              >
                Copy JSON
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorPalette="blue"
                onClick={exportJson}
              >
                Export JSON
              </Button>
            </HStack>
          </HStack>
        </Card.Header>
        <Card.Body>
          <Box
            as="pre"
            p={4}
            bg="gray.900"
            color="green.400"
            rounded="md"
            fontSize="xs"
            overflowX="auto"
            maxH="300px"
            overflowY="auto"
          >
            <Code color="inherit" bg="transparent">
              {formatJson(nestedData)}
            </Code>
          </Box>
        </Card.Body>
      </Card.Root>
    </VStack>
  );
};

export default GeneratedForm;
