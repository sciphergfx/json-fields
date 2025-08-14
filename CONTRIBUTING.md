# Contributing to JSON Tools Suite

Thank you for your interest in contributing to JSON Tools Suite! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

### Our Pledge

We are committed to providing a friendly, safe, and welcoming environment for all contributors.

### Expected Behavior

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Accept feedback gracefully

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing private information without consent
- Any conduct that could reasonably be considered inappropriate

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/jsonToTable.git
   cd jsonToTable
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/jsonToTable.git
   ```

## Development Setup

### Prerequisites

- Node.js 20.12.0 or higher
- npm 10.5.0 or higher
- Git

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

## How to Contribute

### 1. Find an Issue

- Check the [Issues](https://github.com/owner/jsonToTable/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature" # Use conventional commits
```

#### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test additions or fixes
- `chore:` Build process or auxiliary tool changes

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow ESLint rules (run `npm run lint`)
- Use meaningful variable and function names
- Keep components small and focused
- Extract reusable logic into custom hooks

### File Organization

```
src/
├── components/     # React components
│   ├── Component.jsx
│   └── Component.test.jsx (if applicable)
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── constants/     # Constants and configuration
└── assets/        # Static assets
```

### Code Style

```javascript
// Good
const processJsonData = (data) => {
  if (!data) return null

  return data.map((item) => ({
    ...item,
    processed: true,
  }))
}

// Avoid
const process = (d) => (d ? d.map((i) => ({ ...i, p: 1 })) : null)
```

### Component Structure

```jsx
import React, { useState, useEffect } from 'react'
import { Box, Text } from '@chakra-ui/react'

/**
 * ComponentName - Brief description
 * @param {Object} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const ComponentName = ({ prop1, prop2 }) => {
  // State declarations
  const [state, setState] = useState(null)

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependency])

  // Event handlers
  const handleClick = () => {
    // Handler logic
  }

  // Render
  return (
    <Box>
      <Text>{prop1}</Text>
    </Box>
  )
}

export default ComponentName
```

## Testing

### Writing Tests

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import ComponentName from './ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interaction', () => {
    render(<ComponentName />)
    fireEvent.click(screen.getByRole('button'))
    // Assert expected behavior
  })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Pull Request Process

### Before Submitting

1. **Update your branch**:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run quality checks**:

   ```bash
   npm run lint
   npm test
   npm run build
   ```

3. **Test your changes**:
   - Test all features affected by your changes
   - Test on different browsers if applicable
   - Check responsive design on mobile devices

### Submitting a PR

1. Push your changes to your fork
2. Go to the original repository
3. Click "New Pull Request"
4. Select your fork and branch
5. Fill out the PR template:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests pass

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console errors/warnings
```

### After Submitting

- Respond to code review feedback promptly
- Make requested changes in new commits
- Keep the PR updated with the main branch
- Be patient - reviewers are volunteers

## Reporting Issues

### Bug Reports

Include:

- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and OS information
- Error messages from console

**Template**:

```markdown
## Bug Description

Clear description of the bug

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Enter '...'
4. See error

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Environment

- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Node version: [e.g., 20.12.0]

## Additional Context

Any other relevant information
```

### Feature Requests

Include:

- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Mock-ups or examples (if applicable)

## Questions?

If you have questions:

1. Check the [README](README.md) and documentation
2. Search existing issues
3. Ask in discussions or create a new issue

## Recognition

Contributors will be recognized in:

- The project README
- Release notes
- Contributors page

Thank you for contributing to JSON Tools Suite! 🎉
