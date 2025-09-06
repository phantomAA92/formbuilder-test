import { DndProvider } from 'react-dnd';
import { useMemo, useState, useCallback } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
  Close,
  Settings
} from '@mui/icons-material';
import {
  Box,
  Alert,
  Paper,
  Stack,
  Drawer,
  Snackbar,
  TextField,
  Typography,
  IconButton
} from '@mui/material';

import FormContentPanel from './form-content-panel';
import FieldPropertiesPanel from './field-properties';
import FormComponentsPanel from './form-components-panel';

export default function FormBuilder({
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
  // eslint-disable-next-line no-unused-vars
  const [errorMessage, setErrorMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    setDrawerOpen(true);
  };

  const handleFieldDelete = (fieldId) => {
    onDeleteField && onDeleteField(fieldId);
    if (selectedField?.id === fieldId) {
      onSelectField && onSelectField(null);
      setDrawerOpen(false);
    }
  };

  const handleFieldMove = (fieldId, direction) => {
    onMoveField && onMoveField(fieldId, direction);
  };

  const handleAddField = (componentType, defaultData = {}) => {
    const currentFields = safeFormData.fields || [];
    
    // Generate sequential position for clicked components
    let position;
    const gridColumns = safeFormData.gridColumns || 2;
    
    if (currentFields.length === 0) {
      position = { row: 0, col: 0 };
    } else {
      const lastField = currentFields[currentFields.length - 1];
      if (lastField.position) {
        const { row, col } = lastField.position;
        if (col < gridColumns - 1) {
          position = { row, col: col + 1 };
        } else {
          position = { row: row + 1, col: 0 };
        }
      } else {
        position = { 
          row: Math.floor(currentFields.length / gridColumns), 
          col: currentFields.length % gridColumns 
        };
      }
    }
    
    const newField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: componentType,
      position,
      gridSpan: 1, // Default to 1 column span
      ...defaultData
    };
    
    // If a wizard is added, switch grid to a single column
    if (componentType === 'wizard') {
      onUpdateField && onUpdateField('gridColumns', 1);
    }
    
    const updatedFields = [...currentFields, newField];
    onUpdateField && onUpdateField('fields', updatedFields);
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
      const targetField = fields[hoverIndex];
      
      // Swap positions between the dragged field and target field
      if (draggedField.position && targetField.position) {
        const tempPosition = draggedField.position;
        draggedField.position = targetField.position;
        targetField.position = tempPosition;
      }
      
      // Swap array positions
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
      
      if (fieldId === 'title' || fieldId === 'description' || fieldId === 'gridColumns') {
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
        
        const existingField = currentFields.find((f) => f.id === fieldId);
        if (!existingField) {
          console.error('Field not found for update:', fieldId);
          return;
        }
        const updatedField = { ...existingField, ...updates };
        const updatedFields = currentFields.map((field) =>
          field.id === fieldId ? updatedField : field
        );
        onUpdateField && onUpdateField('fields', updatedFields);

        // If the field id changed, update the selected field reference so further edits apply
        if (updates && typeof updates === 'object' && 'id' in updates && updates.id && updates.id !== fieldId) {
          onSelectField && onSelectField(updatedField);
        }
      }
    } catch (error) {
      console.error('Error updating field:', String(error));
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    onSelectField && onSelectField(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
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
        </Box>

        {/* Field Properties Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleCloseDrawer}
          sx={{
            '& .MuiDrawer-paper': {
              width: selectedField?.type === 'wizard' ? 600 : 400,
              maxWidth: '90vw'
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600}>
                Field Properties
              </Typography>
              <IconButton onClick={handleCloseDrawer} size="small">
                <Close />
              </IconButton>
            </Box>
            {selectedField && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedField.type.charAt(0).toUpperCase() + selectedField.type.slice(1)} Component
              </Typography>
            )}
          </Box>
          
          <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
            {selectedField ? (
              <FieldPropertiesPanel
                field={selectedField}
                availableFields={safeFormData.fields}
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
          </Box>
        </Drawer>

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