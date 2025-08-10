import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        body: { value: "system-ui, sans-serif" },
        heading: { value: "system-ui, sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          value: { _light: "blue.600", _dark: "blue.400" },
        },
      },
    },
  },
})
