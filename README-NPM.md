# @sciphergfx/json-to-table

UI-agnostic React components for JSON to Table and JSON to Form Fields conversion with support for Chakra UI, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 **UI Library Agnostic** - Works with Chakra UI, Tailwind CSS, shadcn/ui, or plain HTML
- 📊 **JSON to Table** - Convert JSON arrays to editable tables
- 📝 **JSON to Form Fields** - Generate form fields from JSON objects
- 🔄 **Real-time Updates** - Get callbacks on field changes
- 💾 **Save/Cancel Actions** - Built-in save and cancel functionality
- 🎯 **TypeScript Support** - Full TypeScript definitions included
- 📱 **Responsive** - Works on all screen sizes

## Installation

```bash
npm install @sciphergfx/json-to-table
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

### JsonToTable Component

```jsx
import { JsonToTable } from '@sciphergfx/json-to-table';

const MyApp = () => {
  const handleSave = (nestedData, flatData) => {
    console.log('Saved data:', nestedData);
  };

  const handleFieldChange = (key, value, fullData) => {
    console.log(`Field ${key} changed to:`, value);
  };

  return (
    <JsonToTable
      uiLibrary="tailwind" // "chakra" | "tailwind" | "shadcn"
      onSave={handleSave}
      onCancel={() => console.log('Cancelled')}
      onFieldChange={handleFieldChange}
      saveButtonText="Save Changes"
      cancelButtonText="Reset Form"
      initialJson={JSON.stringify([
        { id: 1, name: "John", email: "john@example.com" },
        { id: 2, name: "Jane", email: "jane@example.com" }
      ])}
    />
  );
};
```

### JsonToFields Component

```jsx
import { JsonToFields } from '@sciphergfx/json-to-table';

const MyForm = () => {
  const handleSave = (nestedData, flatData) => {
    console.log('Form data:', nestedData);
  };

  return (
    <JsonToFields
      uiLibrary="shadcn"
      onSave={handleSave}
      onCancel={() => console.log('Form cancelled')}
      onFieldChange={(key, value, fullData) => {
        console.log(`Field ${key} changed:`, value);
      }}
      initialJson={JSON.stringify({
        user: {
          name: "John Doe",
          email: "john@example.com",
          preferences: {
            theme: "dark",
            notifications: true
          }
        }
      })}
      showJsonInput={false} // Hide JSON input, show only form
    />
  );
};
```

### Multi-Column Form Layout

The `JsonToFields` component supports multi-column layouts using the `columns` prop:

```jsx
import { JsonToFields } from '@sciphergfx/json-to-table';

const MultiColumnForm = () => {
  return (
    <JsonToFields
      uiLibrary="chakra"
      columns={3} // Creates a 3-column form layout
      onSave={(nestedData, flatData) => {
        console.log('Form data:', nestedData);
      }}
      initialJson={JSON.stringify({
        firstName: "John",
        lastName: "Doe", 
        email: "john@example.com",
        phone: "+1234567890",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      })}
    />
  );
};
```

**Column Layout Examples:**
- `columns={1}` - Single column (default)
- `columns={2}` - Two-column layout
- `columns={3}` - Three-column layout
- `columns={4}` - Four-column layout

The fields are automatically distributed evenly across the specified number of columns.

## API Reference

### JsonToTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `uiLibrary` | `'chakra' \| 'tailwind' \| 'shadcn'` | `'chakra'` | UI library to use for styling |
| `onSave` | `(nestedData, flatData) => void` | - | Callback when save button is clicked |
| `onCancel` | `() => void` | - | Callback when cancel button is clicked |
| `onFieldChange` | `(key, value, fullData) => void` | - | Callback when any field changes |
| `saveButtonText` | `string` | `'Save Changes'` | Text for the save button |
| `cancelButtonText` | `string` | `'Reset Form'` | Text for the cancel button |
| `initialJson` | `string` | `''` | Initial JSON string to load |
| `customStyles` | `object` | `{}` | Custom styles object |
| `showControls` | `boolean` | `true` | Whether to show save/cancel buttons |

### JsonToFields Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `uiLibrary` | `'chakra' \| 'tailwind' \| 'shadcn'` | `'chakra'` | UI library to use for styling |
| `onSave` | `(nestedData, flatData) => void` | - | Callback when save button is clicked |
| `onCancel` | `() => void` | - | Callback when cancel button is clicked |
| `onFieldChange` | `(key, value, fullData) => void` | - | Callback when any field changes |
| `saveButtonText` | `string` | `'Save Changes'` | Text for the save button |
| `cancelButtonText` | `string` | `'Reset Form'` | Text for the cancel button |
| `initialJson` | `string` | `''` | Initial JSON string to load |
| `customStyles` | `object` | `{}` | Custom styles object |
| `showControls` | `boolean` | `true` | Whether to show save/cancel buttons |
| `showJsonInput` | `boolean` | `true` | Whether to show JSON input textarea |
| `columns` | `number` | `1` | Number of columns for form layout |

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
<JsonToTable
  customStyles={{
    container: { maxWidth: '800px' },
    table: { fontSize: '14px' },
    button: { backgroundColor: '#007bff' }
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
  getInputType 
} from '@sciphergfx/json-to-table';

// Flatten nested objects
const flat = flattenObject({ user: { name: 'John' } });
// Result: { 'user.name': 'John' }

// Unflatten back to nested
const nested = unflattenObject({ 'user.name': 'John' });
// Result: { user: { name: 'John' } }

// Safe JSON parsing
const result = parseJsonSafely('{"name": "John"}');
// Result: { success: true, data: { name: 'John' } }
```

## TypeScript Support

The package includes full TypeScript definitions:

```typescript
import { JsonToTableProps, JsonToFieldsProps } from '@sciphergfx/json-to-table';

const MyComponent: React.FC<JsonToTableProps> = (props) => {
  // Your component logic
};
```

## Examples

### With Custom Styling

```jsx
<JsonToFields
  uiLibrary="tailwind"
  customStyles={{
    container: { padding: '2rem' },
    formCard: { border: '2px solid #e2e8f0' },
    input: { borderRadius: '8px' },
    button: { backgroundColor: '#3b82f6' }
  }}
  onSave={(data) => console.log('Saved:', data)}
/>
```

### Headless Usage (No UI Library)

```jsx
<JsonToTable
  uiLibrary="tailwind"
  showControls={false}
  onFieldChange={(key, value, data) => {
    // Handle changes in your own way
    updateMyState(data);
  }}
/>
```

## Author

**Seyi K. Ogunbowale**

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
