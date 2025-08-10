import React, { useState, useEffect } from 'react';
import { getUIComponents, getUIClasses } from '../utils/uiAdapters';
import { getDisplayName } from '../utils/jsonUtils';

/**
 * JsonToTable Component - UI Library Agnostic
 * @param {Object} props - Component props
 * @param {string} props.uiLibrary - UI library to use ("chakra", "tailwind", "shadcn")
 * @param {Function} props.onSave - Callback when save is triggered (nestedData, flatData) => void
 * @param {Function} props.onCancel - Callback when cancel is triggered () => void
 * @param {Function} props.onFieldChange - Callback when field changes (key, value, fullData) => void
 * @param {string} props.saveButtonText - Text for save button
 * @param {string} props.cancelButtonText - Text for cancel button
 * @param {string} props.initialJson - Initial JSON string
 * @param {Object} props.customStyles - Custom styles object
 * @param {boolean} props.showControls - Whether to show save/cancel buttons
 */
const JsonToTable = ({
  uiLibrary = 'chakra',
  onSave,
  onCancel,
  onFieldChange,
  saveButtonText = 'Save Changes',
  cancelButtonText = 'Reset Form',
  initialJson = '',
  customStyles = {},
  showControls = true,
  ...props
}) => {
  const [jsonInput, setJsonInput] = useState(initialJson);
  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState('');
  const [editableData, setEditableData] = useState(null);

  const UI = getUIComponents(uiLibrary);

  const sampleJson = JSON.stringify([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Developer", salary: 75000 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer", salary: 68000 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Manager", salary: 85000 },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Developer", salary: 72000 },
  ], null, 2);

  useEffect(() => {
    if (initialJson) {
      setJsonInput(initialJson);
      parseJson(initialJson);
    }
  }, [initialJson]); // parseJson is stable, no need to include

  const parseJson = (jsonString = jsonInput) => {
    setError('');
    setTableData(null);
    
    if (!jsonString.trim()) {
      setError('Please enter some JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          setError('The JSON array is empty');
          return;
        }
        setTableData(parsed);
        setEditableData([...parsed]);
      } else if (typeof parsed === 'object' && parsed !== null) {
        const arrayData = [parsed];
        setTableData(arrayData);
        setEditableData([...arrayData]);
      } else {
        setError('JSON must be an object or array of objects');
        return;
      }
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleCellEdit = (rowIndex, key, value) => {
    const newData = [...editableData];
    newData[rowIndex][key] = value;
    setEditableData(newData);
    
    if (onFieldChange) {
      onFieldChange(key, value, newData);
    }
  };

  const handleSave = () => {
    if (onSave && editableData) {
      const flatData = editableData.map(row => ({ ...row }));
      onSave(editableData, flatData);
    }
  };

  const handleCancel = () => {
    if (tableData) {
      setEditableData([...tableData]);
    }
    if (onCancel) {
      onCancel();
    }
  };

  const loadSample = () => {
    setJsonInput(sampleJson);
    parseJson(sampleJson);
  };

  const getColumns = () => {
    if (!tableData || tableData.length === 0) return [];
    
    const allKeys = new Set();
    tableData.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    
    return Array.from(allKeys);
  };

  const renderTable = () => {
    if (!editableData || editableData.length === 0) return null;

    const columns = getColumns();

    return (
      <UI.Box 
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ overflowX: 'auto', ...customStyles.tableContainer }}
      >
        <UI.Table 
          className={getUIClasses(uiLibrary, 'Table')}
          style={customStyles.table}
        >
          <UI.Thead className={getUIClasses(uiLibrary, 'Thead')}>
            <UI.Tr className={getUIClasses(uiLibrary, 'Tr')}>
              {columns.map(column => (
                <UI.Th 
                  key={column}
                  className={getUIClasses(uiLibrary, 'Th')}
                  style={customStyles.th}
                >
                  {getDisplayName(column)}
                </UI.Th>
              ))}
            </UI.Tr>
          </UI.Thead>
          <UI.Tbody className={getUIClasses(uiLibrary, 'Tbody')}>
            {editableData.map((row, rowIndex) => (
              <UI.Tr 
                key={rowIndex}
                className={getUIClasses(uiLibrary, 'Tr')}
              >
                {columns.map(column => (
                  <UI.Td 
                    key={column}
                    className={getUIClasses(uiLibrary, 'Td')}
                    style={customStyles.td}
                  >
                    <UI.Input
                      type="text"
                      value={row[column] || ''}
                      onChange={(e) => handleCellEdit(rowIndex, column, e.target.value)}
                      className={getUIClasses(uiLibrary, 'Input')}
                      style={{ 
                        border: 'none', 
                        background: 'transparent',
                        ...customStyles.input 
                      }}
                    />
                  </UI.Td>
                ))}
              </UI.Tr>
            ))}
          </UI.Tbody>
        </UI.Table>
      </UI.Box>
    );
  };

  return (
    <UI.Container 
      className={getUIClasses(uiLibrary, 'Container')}
      style={customStyles.container}
      {...props}
    >
      <UI.VStack 
        className={getUIClasses(uiLibrary, 'VStack')}
        style={{ gap: '1rem', ...customStyles.stack }}
      >
        <UI.Heading 
          className={getUIClasses(uiLibrary, 'Heading')}
          style={customStyles.heading}
        >
          JSON to Table Converter
        </UI.Heading>

        <UI.Box 
          className={getUIClasses(uiLibrary, 'Box')}
          style={{ width: '100%', ...customStyles.inputContainer }}
        >
          <UI.Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON data here..."
            className={getUIClasses(uiLibrary, 'Textarea')}
            style={{ 
              minHeight: '150px', 
              fontFamily: 'monospace',
              ...customStyles.textarea 
            }}
          />
        </UI.Box>

        <UI.HStack 
          className={getUIClasses(uiLibrary, 'HStack')}
          style={{ gap: '0.5rem', ...customStyles.buttonGroup }}
        >
          <UI.Button
            onClick={() => parseJson()}
            className={getUIClasses(uiLibrary, 'Button', 'default')}
            style={customStyles.button}
          >
            Generate Table
          </UI.Button>
          <UI.Button
            onClick={loadSample}
            className={getUIClasses(uiLibrary, 'Button', 'secondary')}
            style={customStyles.secondaryButton}
          >
            Load Sample
          </UI.Button>
        </UI.HStack>

        {error && (
          <UI.Alert 
            className={getUIClasses(uiLibrary, 'Alert', 'error')}
            style={customStyles.alert}
          >
            <UI.Text style={customStyles.errorText}>{error}</UI.Text>
          </UI.Alert>
        )}

        {renderTable()}

        {showControls && editableData && (
          <UI.HStack 
            className={getUIClasses(uiLibrary, 'HStack')}
            style={{ gap: '0.5rem', marginTop: '1rem', ...customStyles.controlButtons }}
          >
            <UI.Button
              onClick={handleSave}
              className={getUIClasses(uiLibrary, 'Button', 'default')}
              style={customStyles.saveButton}
            >
              {saveButtonText}
            </UI.Button>
            <UI.Button
              onClick={handleCancel}
              className={getUIClasses(uiLibrary, 'Button', 'secondary')}
              style={customStyles.cancelButton}
            >
              {cancelButtonText}
            </UI.Button>
          </UI.HStack>
        )}
      </UI.VStack>
    </UI.Container>
  );
};

export default JsonToTable;
