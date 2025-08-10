# JSON Tools Suite

A comprehensive React application featuring two powerful JSON utilities: **JSON to Table** converter and **JSON to Form Fields** generator, built with Chakra UI v3.

## 🌐 Demo

[Live Demo](https://json-to-table-ten.vercel.app) - Try the application online

## 🚀 Features

### JSON to Table Converter

- 📊 **Table Generation**: Convert JSON arrays or objects into formatted tables
- 🎨 **Beautiful UI**: Modern, accessible interface with Chakra UI v3
- ✨ **JSON Prettification**: Format JSON with proper indentation
- 📝 **Sample Data**: Quick-start with example JSON
- 🔍 **Error Handling**: Clear error messages for invalid JSON
- 🎯 **Smart Formatting**:
  - `null` and `undefined` values displayed clearly
  - Booleans shown as colored badges
  - Nested objects as JSON strings
  - Numbers in monospace font
- 💾 **Export**: Download table data as JSON
- 🔄 **Responsive Tables**: Horizontal scrolling for wide data

### JSON to Form Fields

- 📝 **Dynamic Form Generation**: Convert JSON objects into interactive form fields
- 🎯 **Automatic Type Detection**:
  - Text, number, email, checkbox, date inputs
  - Array visualization as badges
- 🏗️ **Nested Object Support**: Visual indentation for nested structures
- ⚡ **Real-time Preview**: See JSON output as you modify values
- 🔒 **Structure Preservation**: Maintains original JSON structure
- 📋 **Copy & Export**: Copy to clipboard or download as JSON
- 🎨 **Multiple Sample Data**: Various complexity levels to test

## Getting Started

### Prerequisites

- Node.js (v20.12.0 or higher)
- npm (v10.5.0 or higher)

### Installation

1. Clone the repository:

```bash
cd jsonToTable
```

1. Install dependencies:

```bash
npm install
```

1. Start the development server:

```bash
npm run dev
```

1. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Load Sample Data**: Click the "Load Sample" button to see example JSON data
2. **Paste Your JSON**: Paste any valid JSON (array of objects or single object) into the text area
3. **Prettify**: Click "Prettify" to format your JSON with proper indentation
4. **Convert**: Click "Convert to Table" to generate the table
5. **Export**: Use the "Export JSON" button to download the table data as JSON

## Supported JSON Formats

### Array of Objects (Recommended)

```json
[
  { "id": 1, "name": "John", "active": true },
  { "id": 2, "name": "Jane", "active": false }
]
```

### Single Object

```json
{ "id": 1, "name": "John", "email": "john@example.com" }
```

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Chakra UI v3** - Component library
- **Emotion** - CSS-in-JS styling

## Project Structure

```
jsonToTable/
├── src/
│   ├── components/
│   │   ├── JsonToTable.jsx      # Table converter component
│   │   ├── JsonToFields.jsx     # Form fields generator main component
│   │   ├── JsonInput.jsx        # JSON input with validation
│   │   ├── GeneratedForm.jsx    # Dynamic form display
│   │   ├── FormField.jsx        # Individual form field renderer
│   │   └── FeatureList.jsx      # Features showcase
│   ├── utils/
│   │   └── jsonUtils.js         # JSON manipulation utilities
│   ├── constants/
│   │   └── sampleData.js        # Sample JSON data
│   ├── App.jsx                  # Main app with navigation
│   ├── main.jsx                 # Application entry point
│   └── system.js                # Chakra UI theme configuration
├── public/
├── index.html
├── package.json
└── README.md
```

## 🔒 Security Features

- **Input Validation**: JSON size limits and depth validation
- **Sanitization**: Input sanitization to prevent XSS
- **Error Boundaries**: Graceful error handling
- **Safe Parsing**: Protected JSON parsing with error recovery
- **localStorage Safety**: Fallback for restricted environments

## 🚀 Performance

- **Optimized Rendering**: React memo and efficient re-renders
- **Debounced Input**: Prevents excessive parsing
- **Lazy Loading**: Components loaded on demand
- **Production Build**: Minified and optimized bundle

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [License](LICENSE) - MIT License

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of conduct
- Development setup
- Submitting pull requests
- Reporting issues

## 📝 Changelog

### Version 1.0.0 (2024)

- Initial release
- JSON to Table converter
- JSON to Form Fields generator
- Error boundaries for production
- localStorage persistence
- Input validation and sanitization
- Export functionality
- Sample data sets
- Responsive design

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI powered by [Chakra UI v3](https://www.chakra-ui.com/)
- Bundled with [Vite](https://vitejs.dev/)
- Icons from [Emoji](https://emojipedia.org/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: sheyie2008@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/json-to-table/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/json-to-table/discussions)

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Author:** Seyi K. Ogunbowale
