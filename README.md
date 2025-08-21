# @sciphergfx/json-fields

[![npm version](https://img.shields.io/npm/v/@sciphergfx/json-fields.svg)](https://www.npmjs.com/package/@sciphergfx/json-fields)
[![npm downloads](https://img.shields.io/npm/dm/@sciphergfx/json-fields.svg)](https://www.npmjs.com/package/@sciphergfx/json-fields)

UI-agnostic React component for JSON → Form Fields, with support for Chakra UI, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 **UI Library Agnostic** - Works with Chakra UI, Tailwind CSS, shadcn/ui, or plain HTML
- 📝 **JSON to Form Fields** - Generate form fields from JSON objects
- 🔄 **Real-time Updates** - Get callbacks on field changes
- 💾 **Save/Cancel Actions** - Built-in save and cancel functionality
- 🎯 **TypeScript Support** - Full TypeScript definitions included
- 📱 **Responsive** - Works on all screen sizes
- 🧩 **Sections** - Group form fields into collapsible sections
- 🏷️ **Array chips** - Arrays of strings render as pill chips with add/delete
- 🌓 **Per-component light/dark** - Switch `mode` per component (works with Chakra)

## Headless Core (Lightweight)

This package now provides a headless core with no UI library dependency. You style via `classNames` and `styles`, or override primitives with `renderers`.

- `classNames`: slot-to-class mapping, e.g. `{ container, heading, sectionHeader, fieldLabel, input, textarea, chip, chipClose, button, secondaryButton, list, row, icon, label }`.
- `styles`: per-slot inline styles, same keys as `classNames`.
- `renderers`: override primitives like `{ Container, Box, Button, Input, Select, Textarea, Text, Heading, VStack, HStack, Card, Alert, Label }`.

Chakra/shadcn/Tailwind can be used externally by supplying classes or renderers. The previous `uiLibrary` prop is deprecated for the core path.

## Installation

```bash
npm install @sciphergfx/json-fields
```

### Peer Dependencies

```bash
npm install react react-dom
```

### Optional UI Library Dependencies

For Chakra UI support:

```bash
npm install @chakra-ui/react @emotion/react
```

## Quick Start

### Fields Component

```jsx
import { Fields } from '@sciphergfx/json-fields'

const MyForm = () => {
  const handleSave = (nestedData, flatData) => {
    console.log('Form data:', nestedData)
  }

  return (
    <Fields
      uiLibrary="shadcn"
      // Group fields into collapsible sections (optional)
      sections={[
        {
          id: 'profile',
          title: 'Profile',
          description: 'Basic info',
          fields: ['name', 'email', 'website', 'role', 'joinDate'],
          collapsible: true,
          defaultOpen: true,
        },
        {
          id: 'preferences',
          title: 'Preferences',
          fields: ['preferences.theme', 'preferences.notifications', 'isActive'],
          collapsible: true,
          defaultOpen: true,
        },
        {
          id: 'security',
          title: 'Security',
          fields: ['password'],
          collapsible: true,
          defaultOpen: false,
        },
        {
          id: 'about',
          title: 'About',
          fields: ['bio', 'skills', 'tags'],
          collapsible: true,
          defaultOpen: true,
        },
      ]}
      includeUnsectioned
      onSave={handleSave}
      onCancel={() => console.log('Form cancelled')}
      onFieldChange={(key, value, fullData) => {
        console.log(`Field ${key} changed:`, value)
      }}
      initialJson={JSON.stringify({
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
        skills: ['React', 'TypeScript'],
        tags: ['dev', 'ui'], // Arrays of strings render as pill chips with add/delete
      })}
      showJsonInput={false} // Hide JSON input, show only form
    />
  )
}
```

## API Reference

### Fields Props

| Prop                 | Type                                                                                | Default          | Description                                          |
| -------------------- | ----------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------- |
| `uiLibrary`          | `'chakra' \| 'tailwind' \| 'shadcn'`                                                | `'chakra'`       | UI library to use for styling                        |
| `onSave`             | `(nestedData, flatData) => void`                                                    | -                | Callback when save button is clicked                 |
| `onCancel`           | `() => void`                                                                        | -                | Callback when cancel button is clicked               |
| `onFieldChange`      | `(key, value, fullData) => void`                                                    | -                | Callback when any field changes                      |
| `saveButtonText`     | `string`                                                                            | `'Save Changes'` | Text for the save button                             |
| `cancelButtonText`   | `string`                                                                            | `'Reset Form'`   | Text for the cancel button                           |
| `initialJson`        | `string`                                                                            | `''`             | Initial JSON string to load                          |
| `customStyles`       | `object`                                                                            | `{}`             | Custom styles object                                 |
| `showControls`       | `boolean`                                                                           | `true`           | Whether to show save/cancel buttons                  |
| `showJsonInput`      | `boolean`                                                                           | `true`           | Whether to show JSON input textarea                  |
| `sections`           | `Array<{ id?, title, description?, fields: string[], collapsible?, defaultOpen? }>` | `null`           | Group fields into sections                           |
| `includeUnsectioned` | `boolean`                                                                           | `false`          | Show fields not in sections under an "Other" section |
| `unsectionedTitle`   | `string`                                                                            | `'Other'`        | Title for unsectioned fields section                 |

<!-- List component has been removed; Fields is the sole component. -->

## Styling

### Tailwind CSS

When using `uiLibrary="tailwind"`, the components will apply Tailwind classes. Make sure you have Tailwind CSS configured in your project.

### Chakra UI

When using `uiLibrary="chakra"`, the components will use Chakra UI components. Make sure you have Chakra UI set up with your theme provider.

### shadcn/ui

When using `uiLibrary="shadcn"`, the components will apply shadcn/ui compatible classes.

### Custom Styles

You can override styles using the `customStyles` prop:

```jsx
<Fields
  uiLibrary="tailwind"
  customStyles={{
    container: { maxWidth: '800px' },
    input: { borderRadius: '8px' },
    button: { backgroundColor: '#007bff' },
  }}
/>
```

## Utility Functions

The package also exports utility functions for working with JSON:

```jsx
import {
  flattenObject,
  unflattenObject,
  parseJsonSafely,
  getInputType,
} from '@sciphergfx/json-fields'

// Flatten nested objects
const flat = flattenObject({ user: { name: 'John' } })
// Result: { 'user.name': 'John' }

// Unflatten back to nested
const nested = unflattenObject({ 'user.name': 'John' })
// Result: { user: { name: 'John' } }

// Safe JSON parsing
const result = parseJsonSafely('{"name": "John"}')
// Result: { success: true, data: { name: 'John' } }
```

## TypeScript Support

The package includes full TypeScript definitions:

```typescript
import { FieldsProps } from '@sciphergfx/json-fields'

const MyComponent: React.FC<FieldsProps> = (props) => {
  // Your component logic
}
```

## Examples

### With Custom Styling

```jsx
<Fields
  uiLibrary="tailwind"
  customStyles={{
    container: { padding: '2rem' },
    formCard: { border: '2px solid #e2e8f0' },
    input: { borderRadius: '8px' },
    button: { backgroundColor: '#3b82f6' },
  }}
  onSave={(data) => console.log('Saved:', data)}
/>
```

<!-- Table/List components have been removed in this package. -->

## Author

**Seyi K. Ogunbowale**

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
