import React from 'react';
import {
  Box,
  Checkbox,
  Input,
  Text,
  Badge,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { getInputType, getNestedLevel, getDisplayName } from '../utils/jsonUtils';

/**
 * FormField Component
 * Renders a single form field based on the data type
 */
const FormField = ({ fieldKey, value, onChange }) => {
  const inputType = getInputType(value);
  const nestedLevel = getNestedLevel(fieldKey);
  const displayName = getDisplayName(fieldKey);
  
  // Handle different value types
  const handleChange = (newValue) => {
    if (inputType === 'number') {
      onChange(fieldKey, Number(newValue) || 0);
    } else if (inputType === 'checkbox') {
      onChange(fieldKey, newValue);
    } else {
      onChange(fieldKey, newValue);
    }
  };

  // Render array values as text
  const renderArrayValue = () => {
    if (!Array.isArray(value)) return null;
    
    return (
      <Box>
        <HStack gap={2} flexWrap="wrap">
          {value.map((item, index) => (
            <Badge key={index} colorPalette="blue" size="sm">
              {String(item)}
            </Badge>
          ))}
        </HStack>
        <Text fontSize="xs" color="fg.muted" mt={1}>
          Arrays are displayed as read-only
        </Text>
      </Box>
    );
  };

  // Apply nested styling
  const nestedStyles = nestedLevel > 0 ? {
    ml: nestedLevel * 6,
    pl: 4,
    borderLeftWidth: '2px',
    borderLeftColor: 'blue.200',
  } : {};

  return (
    <Box mb={4} {...nestedStyles}>
      <VStack align="start" gap={1}>
        {/* Field Label */}
        <HStack gap={2}>
          <Text fontSize="sm" fontWeight="medium" color="fg">
            {displayName}
          </Text>
          {nestedLevel > 0 && (
            <Badge size="xs" colorPalette="gray">
              {fieldKey}
            </Badge>
          )}
          <Badge size="xs" colorPalette="purple">
            {inputType}
          </Badge>
        </HStack>

        {/* Field Input */}
        {inputType === 'checkbox' ? (
          <Checkbox.Root
            checked={value}
            onCheckedChange={(e) => handleChange(e.checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
          </Checkbox.Root>
        ) : inputType === 'number' ? (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            width="full"
          />
        ) : inputType === 'array' ? (
          renderArrayValue()
        ) : inputType === 'email' ? (
          <Input
            type="email"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="email@example.com"
            width="full"
          />
        ) : inputType === 'date' ? (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            width="full"
          />
        ) : (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter text..."
            width="full"
          />
        )}
      </VStack>
    </Box>
  );
};

export default FormField;
