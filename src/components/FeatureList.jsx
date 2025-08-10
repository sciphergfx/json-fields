import React from 'react';
import { Box, Card, Heading, List, Text, Icon } from '@chakra-ui/react';

/**
 * FeatureList Component
 * Displays key features of the JSON to Form converter
 */
const FeatureList = () => {
  const features = [
    {
      title: 'Automatic Type Detection',
      description: 'Detects field types (text, number, email, checkbox, date)',
      icon: '🎯',
    },
    {
      title: 'Nested Object Support',
      description: 'Handles deeply nested objects with visual indentation',
      icon: '🏗️',
    },
    {
      title: 'Real-time Preview',
      description: 'See JSON output as you modify form values',
      icon: '⚡',
    },
    {
      title: 'Structure Preservation',
      description: 'Maintains original JSON structure when converting back',
      icon: '🔒',
    },
    {
      title: 'Sample Data',
      description: 'Quick-start with various sample JSON structures',
      icon: '📝',
    },
    {
      title: 'Export & Copy',
      description: 'Export form data as JSON or copy to clipboard',
      icon: '💾',
    },
    {
      title: 'Array Display',
      description: 'Arrays shown as badges for better visualization',
      icon: '📊',
    },
    {
      title: 'Error Handling',
      description: 'Clear error messages for invalid JSON input',
      icon: '🛡️',
    },
  ];

  return (
    <Card.Root bg="blue.50" _dark={{ bg: 'blue.900' }}>
      <Card.Body>
        <Heading size="md" mb={4} color="blue.800" _dark={{ color: 'blue.200' }}>
          Features
        </Heading>
        <List.Root variant="plain" gap={2}>
          {features.map((feature, index) => (
            <List.Item key={index}>
              <Box display="flex" alignItems="flex-start" gap={3}>
                <Text fontSize="xl" flexShrink={0}>
                  {feature.icon}
                </Text>
                <Box>
                  <Text fontWeight="medium" color="blue.800" _dark={{ color: 'blue.200' }}>
                    {feature.title}
                  </Text>
                  <Text fontSize="sm" color="blue.700" _dark={{ color: 'blue.300' }}>
                    {feature.description}
                  </Text>
                </Box>
              </Box>
            </List.Item>
          ))}
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default FeatureList;
