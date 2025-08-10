import React, { useState, useEffect } from 'react';
import { getUIComponents, getUIClasses } from '../utils/uiAdapters';
import { flattenObject, unflattenObject, getInputType, parseJsonSafely, getDisplayName } from '../utils/jsonUtils';

/**
 * JsonToFields Component - UI Library Agnostic
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
 * @param {boolean} props.showJsonInput - Whether to show JSON input textarea
 * @param {number} props.columns - Number of columns for form layout (default: 1)
 * @param {Object} props.fieldConfig - Field configuration for custom input types
 */
const JsonToFields = ({
  uiLibrary = 'chakra',
  onSave,
  onCancel,
  onFieldChange,
  saveButtonText = 'Save Changes',
  cancelButtonText = 'Reset Form',
  initialJson = '',
  customStyles = {},
  showControls = true,
  showJsonInput = true,
  columns = 1,
  fieldConfig = {},
  ...props
}) => {
  const [jsonInput, setJsonInput] = useState(initialJson);
  const [formData, setFormData] = useState({});
  const [originalFormData, setOriginalFormData] = useState({});
  const [, setParsedJson] = useState(null);
  const [error, setError] = useState('');

  const UI = getUIComponents(uiLibrary);



  useEffect(() => {
    if (initialJson) {
      setJsonInput(initialJson);
      parseJson(initialJson);
    } else if (initialJson === '') {
      // Clear everything when initialJson is explicitly set to empty string
      setJsonInput('');
      setFormData({});
      setOriginalFormData({});
      setParsedJson(null);
      setError('');
    }
  }, [initialJson]); // parseJson is stable, no need to include

  const parseJson = (jsonString = jsonInput) => {
    const result = parseJsonSafely(jsonString);
    
    if (result.success) {
      setParsedJson(result.data);
      const flattened = flattenObject(result.data);
      setFormData(flattened);
      setOriginalFormData({ ...flattened });
      setError('');
    } else {
      setError(result.error);
      setParsedJson(null);
      setFormData({});
      setOriginalFormData({});
    }
  };

  const handleFieldChange = (key, value) => {
    const newFormData = {
      ...formData,
      [key]: value
    };
    setFormData(newFormData);
    
    if (onFieldChange) {
      const nestedData = unflattenObject(newFormData);
      onFieldChange(key, value, nestedData);
    }
  };

  const handleSave = () => {
    if (onSave) {
      const nestedData = unflattenObject(formData);
      onSave(nestedData, formData);
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalFormData });
    if (onCancel) {
      onCancel();
    }
  };



  const renderFormField = (key, value) => {
    const fieldTypeConfig = getInputType(value, key, fieldConfig);
    const displayName = getDisplayName(key);

    // Handle different field types based on configuration
    switch (fieldTypeConfig.type) {
      case 'checkbox':
        return renderCheckboxField(key, value, displayName, fieldTypeConfig);
      case 'select':
        return renderSelectField(key, value, displayName, fieldTypeConfig);
      case 'multi-select':
        return renderMultiSelectField(key, value, displayName, fieldTypeConfig);
      case 'textarea':
        return renderTextareaField(key, value, displayName, fieldTypeConfig);
      case 'email':
      case 'url':
      case 'date':
      case 'password':
        return renderSpecialInputField(key, value, displayName, fieldTypeConfig);
      case 'number':
        return renderNumberField(key, value, displayName, fieldTypeConfig);
      case 'array':
        return renderArrayField(key, value, displayName, fieldTypeConfig);
      case 'object':
        return renderObjectField(key, value, displayName, fieldTypeConfig);
      default:
        return renderTextInputField(key, value, displayName, fieldTypeConfig);
    }
  };

  // Checkbox field renderer
  const renderCheckboxField = (key, value, displayName, fieldTypeConfig) => {
    return (
      <UI.Box 
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label 
          className={getUIClasses(uiLibrary, 'Label')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', ...customStyles.label }}
        >
          <input
            type="checkbox"
            checked={formData[key] || false}
            onChange={(e) => handleFieldChange(key, e.target.checked)}
            className={getUIClasses(uiLibrary, 'Input', 'checkbox')}
            style={customStyles.checkbox}
          />
          <UI.Text 
            className={getUIClasses(uiLibrary, 'Text')}
            style={{ fontWeight: '500', ...customStyles.fieldLabel }}
          >
            {displayName}
          </UI.Text>
        </UI.Label>
      </UI.Box>
    );
  };

  // Select field renderer
  const renderSelectField = (key, value, displayName, fieldTypeConfig) => {
    return (
      <UI.Box 
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label 
          className={getUIClasses(uiLibrary, 'Label')}
          style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', ...customStyles.fieldLabel }}
        >
          {displayName}
        </UI.Label>
        <UI.Select
          value={formData[key] || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className={getUIClasses(uiLibrary, 'Select')}
          style={{ width: '100%', ...customStyles.select }}
        >
          <option value="">Select {displayName}</option>
          {fieldTypeConfig.options?.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </UI.Select>
      </UI.Box>
    );
  };

  // Multi-select field renderer
  const renderMultiSelectField = (key, value, displayName, fieldTypeConfig) => {
    const selectedValues = Array.isArray(formData[key]) ? formData[key] : [];
    
    return (
      <UI.Box 
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label 
          className={getUIClasses(uiLibrary, 'Label')}
          style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', ...customStyles.fieldLabel }}
        >
          {displayName}
        </UI.Label>
        <UI.Box style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {fieldTypeConfig.options?.map(option => (
            <UI.Label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={(e) => {
                  const newValues = e.target.checked 
                    ? [...selectedValues, option]
                    : selectedValues.filter(v => v !== option);
                  handleFieldChange(key, newValues);
                }}
                style={customStyles.checkbox}
              />
              <UI.Text style={{ fontSize: '14px', ...customStyles.text }}>{option}</UI.Text>
            </UI.Label>
          ))}
        </UI.Box>
      </UI.Box>
    );
  };

  // Textarea field renderer
  const renderTextareaField = (key, value, displayName, fieldTypeConfig) => {
    return (
      <UI.Box 
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label 
          className={getUIClasses(uiLibrary, 'Label')}
          style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', ...customStyles.fieldLabel }}
        >
          {displayName}
        </UI.Label>
        <UI.Textarea
          value={formData[key] || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className={getUIClasses(uiLibrary, 'Textarea')}
          style={{ 
            width: '100%',
            minHeight: `${(fieldTypeConfig.rows || 4) * 1.5}rem`,
            ...customStyles.textarea 
          }}
        />
      </UI.Box>
    );
  };

  // Special input field renderer (email, url, date, password)
  const renderSpecialInputField = (key, value, displayName, fieldTypeConfig) => {
    return (
      <UI.Box 
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label 
          className={getUIClasses(uiLibrary, 'Label')}
          style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', ...customStyles.fieldLabel }}
        >
          {displayName}
        </UI.Label>
        <UI.Input
          type={fieldTypeConfig.type}
          value={formData[key] || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className={getUIClasses(uiLibrary, 'Input')}
          style={{ width: '100%', ...customStyles.input }}
        />
      </UI.Box>
    );
  };

  // Number field renderer
  const renderNumberField = (key, value, displayName, fieldTypeConfig) => {
    return (
      <UI.Box 
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label 
          className={getUIClasses(uiLibrary, 'Label')}
          style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', ...customStyles.fieldLabel }}
        >
          {displayName}
        </UI.Label>
        <UI.Input
          type="number"
          value={formData[key] || ''}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            handleFieldChange(key, val);
          }}
          className={getUIClasses(uiLibrary, 'Input')}
          style={{ width: '100%', ...customStyles.input }}
        />
      </UI.Box>
    );
  };

  // Array field renderer
  const renderArrayField = (key, value, displayName, fieldTypeConfig) => {
    return (
      <UI.Box 
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label 
          className={getUIClasses(uiLibrary, 'Label')}
          style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', ...customStyles.fieldLabel }}
        >
          {displayName} (Array)
        </UI.Label>
        <UI.Textarea
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleFieldChange(key, parsed);
            } catch {
              // Keep the raw string value for now
              handleFieldChange(key, e.target.value);
            }
          }}
          className={getUIClasses(uiLibrary, 'Textarea')}
          style={{ 
            fontFamily: 'monospace', 
            minHeight: '100px',
            width: '100%',
            ...customStyles.textarea 
          }}
        />
      </UI.Box>
    );
  };

  // Object field renderer
  const renderObjectField = (key, value, displayName, fieldTypeConfig) => {
    return (
      <UI.Box 
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label 
          className={getUIClasses(uiLibrary, 'Label')}
          style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', ...customStyles.fieldLabel }}
        >
          {displayName} (Object)
        </UI.Label>
        <UI.Textarea
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleFieldChange(key, parsed);
            } catch {
              // Keep the raw string value for now
              handleFieldChange(key, e.target.value);
            }
          }}
          className={getUIClasses(uiLibrary, 'Textarea')}
          style={{ 
            fontFamily: 'monospace', 
            minHeight: '100px',
            width: '100%',
            ...customStyles.textarea 
          }}
        />
      </UI.Box>
    );
  };

  // Text input field renderer (default)
  const renderTextInputField = (key, value, displayName, fieldTypeConfig) => {
    return (
      <UI.Box 
        key={key}
        className={getUIClasses(uiLibrary, 'Box')}
        style={{ marginBottom: '1rem', ...customStyles.fieldContainer }}
      >
        <UI.Label 
          className={getUIClasses(uiLibrary, 'Label')}
          style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', ...customStyles.fieldLabel }}
        >
          {displayName}
        </UI.Label>
        <UI.Input
          type="text"
          value={formData[key] || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className={getUIClasses(uiLibrary, 'Input')}
          style={{ width: '100%', ...customStyles.input }}
        />
      </UI.Box>
    );
  };

  // Function to render form fields in columns
  const renderFormFields = () => {
    const formEntries = Object.entries(formData);
    
    if (columns <= 1) {
      // Single column layout (default)
      return (
        <UI.VStack 
          className={getUIClasses(uiLibrary, 'VStack')}
          style={{ gap: '1rem', ...customStyles.formStack }}
        >
          {formEntries.map(([key, value]) => renderFormField(key, value))}
        </UI.VStack>
      );
    }

    // Multi-column layout
    const fieldsPerColumn = Math.ceil(formEntries.length / columns);
    const columnGroups = [];
    
    for (let i = 0; i < columns; i++) {
      const startIndex = i * fieldsPerColumn;
      const endIndex = Math.min(startIndex + fieldsPerColumn, formEntries.length);
      columnGroups.push(formEntries.slice(startIndex, endIndex));
    }

    const gridStyles = {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '2rem',
      width: '100%',
      ...customStyles.formGrid
    };

    return (
      <UI.Box 
        className={getUIClasses(uiLibrary, 'Box')}
        style={gridStyles}
      >
        {columnGroups.map((columnFields, columnIndex) => (
          <UI.VStack 
            key={columnIndex}
            className={getUIClasses(uiLibrary, 'VStack')}
            style={{ gap: '1rem', ...customStyles.formColumn }}
          >
            {columnFields.map(([key, value]) => renderFormField(key, value))}
          </UI.VStack>
        ))}
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


        {showJsonInput && (
          <>
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


          </>
        )}

        {error && (
          <UI.Alert 
            className={getUIClasses(uiLibrary, 'Alert', 'error')}
            style={customStyles.alert}
          >
            <UI.Text style={customStyles.errorText}>{error}</UI.Text>
          </UI.Alert>
        )}

        {Object.keys(formData).length > 0 && (
          <UI.Card 
            className={getUIClasses(uiLibrary, 'Card')}
            style={{ width: '100%', padding: '1rem', ...customStyles.formCard }}
          >
            {renderFormFields()}
          </UI.Card>
        )}

        {showControls && Object.keys(formData).length > 0 && (
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

export default JsonToFields;
