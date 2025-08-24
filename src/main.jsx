import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ChakraProvider value={defaultSystem} resetCSS={false}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </ChakraProvider>,
  // </StrictMode>
)
