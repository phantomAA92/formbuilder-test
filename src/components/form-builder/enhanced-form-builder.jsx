import { DndProvider } from 'react-dnd';
import { useState, useCallback, useMemo } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
  Preview,
  Save,
  Settings
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Divider
} from '@mui/material';

import FormContentPanel from './form-content-panel';
import FormComponentsPanel from './form-components-panel';
import FieldPropertiesPanel from './enhanced-field-properties';

export default function EnhancedFormBuilder({
  formData,
  onUpdateField,
  onDeleteField,
  onMoveField,
  onSelectField,
  selectedField,
  onSave
}) {
  // Ensure formData has a valid structure - use useMemo to prevent recreation on every render
  const safeFormData = useMemo(() => ({
    title: '',
    description: '',
    fields: [],
    ...formData
  }), [formData]);
  
  const [formTitle, setFormTitle] = useState(formData?.title || '');
  const [formDescription, setFormDescription] = useState(formData?.description || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTitleChange = (value) => {
    setFormTitle(value);
    onUpdateField && onUpdateField('title', value);
  };

  const handleDescriptionChange = (value) => {
    setFormDescription(value);
    onUpdateField && onUpdateField('description', value);
  };

  const handleFieldSelect = (field) => {
    onSelectField && onSelectField(field);
  };

  const handleFieldDelete = (fieldId) => {
    onDeleteField && onDeleteField(fieldId);
    if (selectedField?.id === fieldId) {
      onSelectField && onSelectField(null);
    }
  };

  const handleFieldMove = (fieldId, direction) => {
    onMoveField && onMoveField(fieldId, direction);
  };

  const handleAddField = (type, defaultData) => {
    try {
      if (!type || typeof type !== 'string') {
        console.error('Invalid field type:', String(type));
        return;
      }
      
      const newField = {
        id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        type,
        label: defaultData?.label || `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
        required: false,
        ...defaultData
      };
      
      const currentFields = safeFormData.fields || [];
      if (!Array.isArray(currentFields)) {
        console.error('Fields is not an array:', typeof currentFields);
        return;
      }
      
      const updatedFields = [...currentFields, newField];
      onUpdateField && onUpdateField('fields', updatedFields);
      
      // Auto-select the new field
      onSelectField && onSelectField(newField);
    } catch (error) {
      console.error('Error adding field:', String(error));
    }
  };

  const handleFieldReorder = useCallback((dragIndex, hoverIndex) => {
    try {
      const currentFields = safeFormData.fields || [];
      if (!Array.isArray(currentFields)) {
        console.error('Fields is not an array:', typeof currentFields);
        return;
      }
      
      if (dragIndex < 0 || dragIndex >= currentFields.length || 
          hoverIndex < 0 || hoverIndex >= currentFields.length) {
        console.error('Invalid drag or hover index:', 
          `dragIndex: ${dragIndex}, hoverIndex: ${hoverIndex}, length: ${currentFields.length}`);
        return;
      }
      
      const fields = [...currentFields];
      const draggedField = fields[dragIndex];
      
      fields.splice(dragIndex, 1);
      fields.splice(hoverIndex, 0, draggedField);
      
      onUpdateField && onUpdateField('fields', fields);
    } catch (error) {
      console.error('Error reordering fields:', String(error));
    }
  }, [safeFormData.fields, onUpdateField]);

  const handleFieldUpdate = (fieldId, updates) => {
    try {
      if (!fieldId) {
        console.error('Field ID is required');
        return;
      }
      
      if (fieldId === 'title' || fieldId === 'description') {
        onUpdateField && onUpdateField(fieldId, updates);
      } else if (fieldId === 'fields') {
        // Ensure fields is an array
        const fieldsArray = Array.isArray(updates) ? updates : [];
        onUpdateField && onUpdateField('fields', fieldsArray);
      } else {
        const currentFields = safeFormData.fields || [];
        if (!Array.isArray(currentFields)) {
          console.error('Fields is not an array:', typeof currentFields);
          return;
        }
        
        const updatedFields = currentFields.map(field => 
          field.id === fieldId ? { ...field, ...updates } : field
        );
        onUpdateField && onUpdateField('fields', updatedFields);
      }
    } catch (error) {
      console.error('Error updating field:', String(error));
    }
  };

  const handleSave = async () => {
    try {
      if (!formTitle || !formTitle.trim()) {
        setErrorMessage('Form title is required');
        setShowError(true);
        return;
      }
      
      const currentFields = safeFormData.fields || [];
      if (!Array.isArray(currentFields) || currentFields.length === 0) {
        setErrorMessage('Form must have at least one field');
        setShowError(true);
        return;
      }
      
      if (onSave) {
        await onSave();
        setShowSuccess(true);
        setShowError(false);
      }
    } catch (error) {
      console.error('Error saving form:', String(error));
      setErrorMessage('Failed to save form. Please try again.');
      setShowError(true);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Custom Form Builder
          </Typography>
          
          {/* Form Title & Description */}
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Form Details
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Form Title"
                value={formTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                fullWidth
                required
                placeholder="Enter form title..."
              />
              <TextField
                label="Form Description"
                value={formDescription}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                fullWidth
                multiline
                rows={2}
                placeholder="Describe the purpose of this form..."
              />
            </Stack>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Typography variant="body2" color="text.secondary">
               {safeFormData.fields?.length || 0} form components
             </Typography>
            <Stack direction="row" spacing={2}>
                             <Button
                 variant="outlined"
                 startIcon={<Preview />}
                                   onClick={() => {
                    try {
                      // Create a temporary form data object for preview
                      const previewData = {
                        ...safeFormData,
                        title: formTitle || safeFormData.title || 'Form Preview',
                        description: formDescription || safeFormData.description || ''
                      };
                      
                      // Ensure all field data is serializable
                      const serializableData = {
                        ...previewData,
                        fields: (previewData.fields || []).map(field => {
                          try {
                            return {
                              ...field,
                              // Ensure any complex objects are converted to strings
                              defaultValue: field.defaultValue ? String(field.defaultValue) : '',
                              options: Array.isArray(field.options) ? field.options : [],
                              columns: Array.isArray(field.columns) ? field.columns : [],
                              steps: Array.isArray(field.steps) ? field.steps : []
                            };
                          } catch (fieldError) {
                            console.warn('Error processing field:', fieldError, field);
                            // Return a safe fallback field
                                                         return {
                               id: field.id || `field_${Math.random().toString(36).substring(2, 11)}`,
                               type: field.type || 'text',
                               label: field.label || 'Field',
                               required: false
                             };
                          }
                        })
                      };
                      
                      // Store in sessionStorage for preview
                      sessionStorage.setItem('formPreviewData', JSON.stringify(serializableData));
                      
                      // Open preview in new tab
                      window.open('/form-preview', '_blank');
                        } catch (error) {
      console.error('Error preparing preview data:', String(error));
      alert('Unable to preview form. Please try again.');
    }
                  }}
               >
                 Preview Form
               </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<Save />}
                size="large"
              >
                Save Form
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Main Builder Area */}
        <Box sx={{ flex: 1, display: 'flex', gap: 2, minHeight: 0 }}>
          {/* Left Panel - Form Components */}
          <Paper sx={{ width: 320, p: 2, overflow: 'auto' }}>
            <FormComponentsPanel onAddField={handleAddField} />
          </Paper>

          {/* Center Panel - Form Content */}
          <Paper sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                         <FormContentPanel
               formData={safeFormData}
               selectedField={selectedField}
               onFieldSelect={handleFieldSelect}
               onFieldDelete={handleFieldDelete}
               onFieldMove={handleFieldMove}
               onFieldReorder={handleFieldReorder}
               onFieldUpdate={handleFieldUpdate}
             />
          </Paper>

          {/* Right Panel - Field Properties */}
          <Paper sx={{ width: 350, p: 2, overflow: 'auto' }}>
            {selectedField ? (
              <FieldPropertiesPanel
                field={selectedField}
                onUpdate={(updates) => handleFieldUpdate(selectedField.id, updates)}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Settings sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Field Properties
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select a field to edit its properties
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Success/Error Messages */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
        >
          <Alert onClose={() => setShowSuccess(false)} severity="success">
            Form saved successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={showError}
          autoHideDuration={5000}
          onClose={() => setShowError(false)}
        >
          <Alert onClose={() => setShowError(false)} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </DndProvider>
  );
} 