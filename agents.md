# Agents Guide: Building Advanced Forms with json-fields

This document teaches an LLM (or any agent) how to use this package to generate rich, editable forms from JSON with fine-grained renderer control.

## Core Concept
- Import `Fields` from the package and render it with:
  - `initialJson`: the JSON (string) to edit
  - `fieldConfig`: per-field type hints and options
  - Optional: sections, styling, and custom renderers for full control

```jsx
import { Fields } from '@sciphergfx/json-fields'

<Fields
  initialJson={JSON.stringify({ name: 'Jane', email: 'jane@example.com' })}
  fieldConfig={{ email: { type: 'email' } }}
  saveButtonText="Save"
  cancelButtonText="Reset"
/>
```

## Quickstart

Copy–pasteable minimal usage with sections and common field types:

```jsx
import React from 'react'
import { Fields } from '@sciphergfx/json-fields'

export default function SimpleJsonForm() {
  const initialData = { /* ...your object... */ }
  const fieldConfig = { /* ...your config... */ }
  const sections = [ /* ...your sections... */ ]

  return (
    <Fields
      initialJson={JSON.stringify(initialData)}
      fieldConfig={fieldConfig}
      sections={sections}
      includeUnsectioned
      onSave={(nested, flat) => console.log('save', nested, flat)}
      onCancel={() => console.log('cancel')}
      onFieldChange={(k, v) => console.log('change', k, v)}
      saveButtonText="Save Changes"
      cancelButtonText="Reset Form"
    />
  )
}
```

## Important Props for Agents
- `initialJson` string: the data to load. The component manages a flat state internally and emits nested data on save.
- `fieldConfig` object: per-field overrides: `{ [key]: { type, ...options } }`.
- `sections`: structure fields into groups: `[{ id?, title, description?, fields: string[], collapsible?, defaultOpen? }]`.
- `inlineLabels`: show label and control on one line.
- `columns`: number of columns used for layout.
- `customStyles`: style hooks for headless primitives (labels, inputs, etc.).
- `renderers`: override headless primitives: `{ Container, Box, Button, Input, Select, Textarea, Text, Heading, VStack, HStack, Card, Alert, Label }`.
- `onSave(nested, flat)`: called when user saves.
- `onCancel()`: called when user resets.
- `onFieldChange(key, value, nestedData)`: live updates for each field.

## Type System (fieldConfig.type)
If not specified, types are inferred from the value. Set `type` to control the UI:
- `text` (default)
- `email`, `url`, `date`, `password`
- `number`, `slider` (use `min`, `max`, `step`)
- `select` (use `options: string[]`)
- `multi-select` (use `options: string[]`)
- `textarea` (use `rows`)
- `tags` (array of strings with chip editor)
- `key-value-list` (table-like editor; `columns?: string[]`, `showHeader?: boolean`)
- `array` (generic array; strings become tags editor)
- `object` (nested object editor)
- `segment` (segmented single-select; `options: string[]`)

Additional metadata:
- `description?: string`
- `descriptionPlacement?: 'label' | 'input'` (where to render description)

## Renderer Overrides (for custom UI/logic)
You can override rendering at three levels, in this order of precedence:
1) `customFieldRenderers[key]` — full control for a specific field
2) `customInputRenderers[type]` — full node override for a type
3) `customControlRenderers[key|type]` — override only the control (label and wrappers remain standard)

Each renderer receives a `RendererContext`:
```ts
{
  key: string
  value: any
  displayName: string
  fieldTypeConfig: Record<string, any>
  formData: Record<string, any>
  onChange: (value: any) => void
  UI: Record<string, React.ElementType> // headless primitives
  props: FieldsProps // original props passed to Fields
}
```

### Example: Type-level custom control (segment)
```jsx
const customControlRenderers = {
  segment: ({ UI, value, onChange, fieldTypeConfig }) => (
    <UI.HStack style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(fieldTypeConfig?.options || []).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          style={{ padding: '6px 10px', borderRadius: 8 }}
        >
          {opt}
        </button>
      ))}
    </UI.HStack>
  ),
}

<Fields initialJson={json} fieldConfig={{ status: { type: 'segment', options: ['draft','review','published'] } }} customControlRenderers={customControlRenderers} />
```

### Example: Field-level override (custom image uploader)
```jsx
const customFieldRenderers = {
  avatarUrl: ({ UI, key, value, onChange }) => (
    <UI.Box>
      {/* Your custom uploader; call onChange(urlOrFileList) */}
    </UI.Box>
  ),
}

<Fields initialJson={json} customFieldRenderers={customFieldRenderers} />
```

## Headless Primitives and Styling
- By default the component renders semantic HTML elements. Provide `renderers` to map to your design system.
- Use `customStyles` for spacing/visual tweaks: keys include `fieldContainer`, `fieldLabel`, `input`, `textarea`, `select`, `checkbox`, `label`, `text`, and control button styles.

## Sections
Group fields and control visibility/density:
```js
const sections = [
  {
    id: 'profile',
    title: 'Profile',
    description: 'Basic information',
    fields: ['name','email','status'],
    collapsible: true,
    defaultOpen: true,
  },
]

<Fields initialJson={json} fieldConfig={cfg} sections={sections} includeUnsectioned />
```

## Data Flow for Agents
- Provide `initialJson` as a string; the component parses and flattens it.
- On each change, use `onFieldChange` to capture deltas or side-effects (validation, remote suggestions, etc.).
- On save, consume `nestedData` as the authoritative payload.

## Recommended Patterns for LLMs
- **Be explicit with `fieldConfig`** to ensure correct widgets and options.
- **Use type-level overrides** (`customControlRenderers` / `customInputRenderers`) for consistent UX across similar fields.
- **Use field-level overrides** for highly bespoke fields (e.g., map picker, media uploader).
- **Explain choices via `description`**; place at `label` to give context above the control.
- **Sections** keep long forms navigable; mark some as `collapsible`.

## Minimal Recipe
1. Generate `fieldConfig` from a schema or example object.
2. Provide `sections` (optional) and `initialJson` (stringified data).
3. Attach `onSave` to emit final nested JSON and persist it.
4. Add render overrides only where needed.

## See Also
- Source: `lib/components/JsonToFields.jsx`
- Demo wiring: `src/components/PreviewPanel.jsx`
- Demo config: `src/constants/demoData.js`
