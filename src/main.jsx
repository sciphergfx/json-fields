import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ChakraProvider value={defaultSystem}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </ChakraProvider>
  // </StrictMode>
);
