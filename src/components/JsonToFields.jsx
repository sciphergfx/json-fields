import React, { useState } from 'react';
import {
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Box,
  Card,
} from '@chakra-ui/react';
import JsonInput from './JsonInput';
import GeneratedForm from './GeneratedForm';
import FeatureList from './FeatureList';
import { 
  flattenObject, 
  parseJsonSafely
} from '../utils/jsonUtils';
import { DEFAULT_JSON as SAMPLE } from '../constants/sampleData';

/**
 * JsonToFields Component
 * Main component that orchestrates JSON to Form conversion
 */
const JsonToFields = () => {
  const [jsonInput, setJsonInput] = useState(SAMPLE);
  const [formData, setFormData] = useState({});
  const [parsedJson, setParsedJson] = useState(null);
  const [error, setError] = useState('');

  // Parse JSON and generate form fields
  const parseJson = () => {
    const result = parseJsonSafely(jsonInput);
    
    if (result.success) {
      setParsedJson(result.data);
      setFormData(flattenObject(result.data));
      setError('');
    } else {
      setError(result.error);
      setParsedJson(null);
      setFormData({});
    }
  };

  // Handle form field changes
  const handleFieldChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Container maxW="7xl" py={8}>
      {/* Header */}
      <Box mb={8} textAlign="center">
        <Heading size="2xl" mb={2}>
          JSON to Form Fields
        </Heading>
        <Text color="fg.muted" fontSize="lg">
          Convert JSON objects into interactive form fields with real-time preview
        </Text>
      </Box>

      {/* Main Content Grid */}
      <Grid
        templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
        gap={6}
        mb={8}
      >
        {/* JSON Input Section */}
        <GridItem>
          <Card.Root h="full">
            <Card.Body>
              <JsonInput
                jsonInput={jsonInput}
                setJsonInput={setJsonInput}
                onParse={parseJson}
                error={error}
              />
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Generated Form Section */}
        <GridItem>
          <Card.Root h="full">
            <Card.Body>
              <GeneratedForm
                formData={formData}
                onChange={handleFieldChange}
                parsedJson={parsedJson}
              />
            </Card.Body>
          </Card.Root>
        </GridItem>
      </Grid>

      {/* Features Section */}
      <FeatureList />
    </Container>
  );
};

export default JsonToFields;
