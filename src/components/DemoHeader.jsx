import { Box, Text } from '@chakra-ui/react'

export default function DemoHeader({ theme, setTheme, palette, repoOwner, repoName, forks }) {
  return (
    <Box
      bg={palette.panel}
      borderBottom={`1px solid ${palette.border}`}
      px={6}
      py={4}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap="16px"
    >
      <Box>
        <Text fontSize="28px" fontWeight="700" color={palette.text} letterSpacing="-0.025em" mb={1}>
          JsonFields Demo
        </Text>
        <Text fontSize="16px" color={palette.subtext} fontWeight="400">
          Component for converting JSON to form fields
        </Text>
      </Box>
      <Box display="flex" alignItems="center" gap="12px">
        <Box
          as="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          bg="#111827"
          color="#ffffff"
          border={`1px solid ${palette.border}`}
          borderRadius="6px"
          px="12px"
          py="6px"
          fontSize="14px"
          fontWeight="600"
          cursor="pointer"
          _hover={{ background: '#0f172a' }}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </Box>
        <Box
          as="a"
          href={`https://github.com/${repoOwner}/${repoName}`}
          target="_blank"
          rel="noreferrer"
          bg="#111827"
          color="#ffffff"
          border={`1px solid ${palette.border}`}
          borderRadius="6px"
          px="12px"
          py="6px"
          fontSize="14px"
          fontWeight="600"
          _hover={{ background: '#0f172a', borderColor: palette.border }}
        >
          GitHub ↗
        </Box>
        <Box
          bg={ '#111827'} 
          border={`1px solid ${palette.border}`}
          borderRadius="6px"
        px="12px"
          py="6px"
          fontSize="14px"
          fontWeight="600"
          color="#ffffff"
        >
          Forks: {forks ?? '—'}
        </Box>
      </Box>
    </Box>
  )
}
