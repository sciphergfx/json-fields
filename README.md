### List Component

```jsx
import { List } from '@sciphergfx/json-to-table';

const items = [
  { label: 'Main', children: [{ label: 'Sample' }, { label: 'Flow 2' }] },
  { label: 'Workflow Type', children: [] },
  { label: 'Sample', children: [{ label: 'Sample' }, { label: 'Flow 2' }] },
  { label: 'Flow 2' },
];

export const MyList = () => (
  <List
    uiLibrary="chakra"
    mode="light" // or 'dark'
    startIcon={<span style={{ fontSize: 14 }}>▦</span>}
    parentOpenIcon={<span>▼</span>}
    parentClosedIcon={<span>▶</span>}
    parentIcon={<span>📁</span>}
    childIcon={<span>🔗</span>}
    hoverIcon={<span>⋯</span>}
    // Option A: Sections with filters
    sections={[
      { id: 'parents', title: 'Parent Nodes', filter: (i) => Array.isArray(i.children) && i.children.length > 0, collapsible: true, defaultOpen: true },
      { id: 'leaves', title: 'Leaf Nodes', filter: (i) => !i.children || i.children.length === 0, collapsible: true, defaultOpen: true },
    ]}
    // Option B: Group by function (alternative to sections)
    // groupBy={(i) => i.label?.[0]?.toUpperCase() || 'Other'}
    // sectionOrder={["A","B","C","Other"]}
    onItemClick={(item) => console.log('Clicked:', item)}
    onToggle={(item, isOpen) => console.log('Toggled', item.label, '->', isOpen)}
  />
);
```
# @sciphergfx/json-to-table

UI-agnostic React components for JSON → Table, JSON → Form Fields, and JSON → List, with support for Chakra UI, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 **UI Library Agnostic** - Works with Chakra UI, Tailwind CSS, shadcn/ui, or plain HTML
- 📊 **JSON to Table** - Convert JSON arrays to editable tables
- 📝 **JSON to Form Fields** - Generate form fields from JSON objects
- 📁 **JSON to List** - Collapsible tree/list from JSON with hover actions and icons
- 🔄 **Real-time Updates** - Get callbacks on field changes
- 💾 **Save/Cancel Actions** - Built-in save and cancel functionality
- 🎯 **TypeScript Support** - Full TypeScript definitions included
- 📱 **Responsive** - Works on all screen sizes
- 🧩 **Sections** - Group form fields and list items into collapsible sections
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

### Table Component

```jsx
import { Table } from '@sciphergfx/json-to-table';

const MyApp = () => {
  const handleSave = (nestedData, flatData) => {
    console.log('Saved data:', nestedData);
  };

  const handleFieldChange = (key, value, fullData) => {
    console.log(`Field ${key} changed to:`, value);
  };

  return (
    <Table
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

### Fields Component

```jsx
import { Fields } from '@sciphergfx/json-to-table';

const MyForm = () => {
  const handleSave = (nestedData, flatData) => {
    console.log('Form data:', nestedData);
  };

  return (
    <Fields
      uiLibrary="shadcn"
      // Group fields into collapsible sections (optional)
      sections={[
        { id: 'profile', title: 'Profile', description: 'Basic info', fields: ['name','email','website','role','joinDate'], collapsible: true, defaultOpen: true },
        { id: 'preferences', title: 'Preferences', fields: ['preferences.theme','preferences.notifications','isActive'], collapsible: true, defaultOpen: true },
        { id: 'security', title: 'Security', fields: ['password'], collapsible: true, defaultOpen: false },
        { id: 'about', title: 'About', fields: ['bio','skills','tags'], collapsible: true, defaultOpen: true },
      ]}
      includeUnsectioned
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
        },
        skills: ["React", "TypeScript"],
        tags: ["dev","ui"], // Arrays of strings render as pill chips with add/delete
      })}
      showJsonInput={false} // Hide JSON input, show only form
    />
  );
};
```

## API Reference

### Table Props

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

### Fields Props

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
| `sections` | `Array<{ id?, title, description?, fields: string[], collapsible?, defaultOpen? }>` | `null` | Group fields into sections |
| `includeUnsectioned` | `boolean` | `false` | Show fields not in sections under an "Other" section |
| `unsectionedTitle` | `string` | `'Other'` | Title for unsectioned fields section |

### List Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `uiLibrary` | `'chakra' \| 'tailwind' \| 'shadcn'` | `'chakra'` | UI library to use |
| `mode` | `'light' \| 'dark'` | `'dark'` | Per-component color mode |
| `startIcon` | `ReactNode` | `null` | Icon near header title |
| `headerTitle` | `ReactNode` | `'Projects'` | Header title |
| `headerDescription` | `ReactNode` | `null` | Header description text |
| `parentOpenIcon` | `ReactNode` | `▼` | Icon for open parent rows |
| `parentClosedIcon` | `ReactNode` | `▶` | Icon for closed parent rows |
| `parentIcon` | `ReactNode` | `📁` | Item icon for parent rows (legacy) |
| `childIcon` | `ReactNode` | `🗂️` | Item icon for child rows |
| `hoverIcon` | `ReactNode` | `…` | Hover action icon at row end |
| `sections` | `Array<{ id?, title, description?, collapsible?, defaultOpen?, filter?: (item) => boolean }>` | `null` | Explicit sections with filters |
| `groupBy` | `(item) => string` | `null` | Auto sections by group key |
| `sectionOrder` | `string[]` | `null` | Ordering for groupBy sections |
| `onItemClick` | `(item) => void` | `() => {}` | Click handler |
| `onToggle` | `(item, isOpen) => void` | `() => {}` | Parent toggle handler |

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
<Table
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
import { TableProps, FieldsProps } from '@sciphergfx/json-to-table';

const MyComponent: React.FC<TableProps> = (props) => {
  // Your component logic
};
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
    button: { backgroundColor: '#3b82f6' }
  }}
  onSave={(data) => console.log('Saved:', data)}
/>
```

### Headless Usage (No UI Library)

```jsx
<Table
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
