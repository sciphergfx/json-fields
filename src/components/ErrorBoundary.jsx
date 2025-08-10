import React from 'react';
import {
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Alert,
  Code,
  Box,
  Card,
} from '@chakra-ui/react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Update state with error details
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // In production, you might want to log to an error reporting service
    if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true') {
      // Example: logErrorToService(error, errorInfo);
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Placeholder for error reporting service integration
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    const errorData = {
      message: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    console.log('Would send to error service:', errorData);
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
    
    // Optionally reload the page for a fresh start
    if (this.state.errorCount > 2) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxW="2xl" py={16}>
          <Card.Root>
            <Card.Body>
              <VStack gap={6} align="stretch">
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Oops! Something went wrong</Alert.Title>
                    <Alert.Description>
                      We've encountered an unexpected error. Please try refreshing the page.
                    </Alert.Description>
                  </Alert.Content>
                </Alert.Root>

                <Box>
                  <Heading size="lg" mb={3}>
                    😔 Application Error
                  </Heading>
                  <Text color="fg.muted" mb={4}>
                    Don't worry, your data is safe. This error has been logged and we'll look into it.
                  </Text>
                </Box>

                {import.meta.env.DEV && this.state.error && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Error Details (Development Only):</Text>
                    <Card.Root variant="outline" bg="red.50" _dark={{ bg: 'red.900' }}>
                      <Card.Body>
                        <Code 
                          as="pre" 
                          fontSize="xs" 
                          overflowX="auto"
                          whiteSpace="pre-wrap"
                          wordBreak="break-word"
                        >
                          {this.state.error.toString()}
                          {'\n\n'}
                          {this.state.error.stack}
                        </Code>
                      </Card.Body>
                    </Card.Root>
                  </Box>
                )}

                <VStack gap={3}>
                  <Button 
                    colorPalette="blue" 
                    onClick={this.handleReset}
                    width="full"
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                    width="full"
                  >
                    Go to Home
                  </Button>
                  {this.state.errorCount > 1 && (
                    <Button 
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => window.location.reload()}
                      width="full"
                    >
                      Reload Page (Error #{this.state.errorCount})
                    </Button>
                  )}
                </VStack>

                <Text fontSize="sm" color="fg.muted" textAlign="center">
                  If this problem persists, please contact support with the error details above.
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
