import { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
  Preview,
  Save
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import DraggableField from './draggable-field';
import FieldProperties from './field-properties';

export default function EnhancedFormBuilder({
  formData,
  onUpdateField,
  onDeleteField,
  onMoveField,
  onSelectField,
  selectedField,
  onSave
}) {
  const [formTitle, setFormTitle] = useState(formData.title || '');
  const [formDescription, setFormDescription] = useState(formData.description || '');
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleSave = async () => {
    try {
      await onSave && onSave();
      setShowSuccess(true);
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleDrop = useCallback((item, monitor) => {
    if (monitor.didDrop()) {
      return;
    }
    
    const { type, defaultData } = item;
    const newField = {
      id: Date.now().toString(),
      type,
      ...defaultData
    };
    
    onUpdateField && onUpdateField('fields', [...(formData.fields || []), newField]);
  }, [formData.fields, onUpdateField]);

  const handleFieldReorder = useCallback((dragIndex, hoverIndex) => {
    const fields = [...(formData.fields || [])];
    const draggedField = fields[dragIndex];
    
    fields.splice(dragIndex, 1);
    fields.splice(hoverIndex, 0, draggedField);
    
    onUpdateField && onUpdateField('fields', fields);
  }, [formData.fields, onUpdateField]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Form Builder
        </Typography>
        
        {/* Form Title & Description */}
        <Paper sx={{ p: 3, mb: 3 }}>
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

        {/* Fields List */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Form Fields ({formData.fields?.length || 0})
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<Preview />}
                onClick={() => window.open('/form-preview', '_blank')}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<Save />}
              >
                Save Form
              </Button>
            </Stack>
          </Box>

          {formData.fields && formData.fields.length > 0 ? (
            <Stack spacing={2}>
              {formData.fields.map((field, index) => (
                <DraggableField
                  key={field.id}
                  field={field}
                  index={index}
                  isSelected={selectedField?.id === field.id}
                  onSelect={() => handleFieldSelect(field)}
                  onDelete={() => handleFieldDelete(field.id)}
                  onMove={handleFieldMove}
                  onReorder={handleFieldReorder}
                  canMoveUp={index > 0}
                  canMoveDown={index < formData.fields.length - 1}
                />
              ))}
            </Stack>
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: 'action.hover'
              }}
              onDrop={(e) => {
                e.preventDefault();
                const data = e.dataTransfer.getData('text/plain');
                try {
                  const item = JSON.parse(data);
                  handleDrop(item, { didDrop: () => false });
                } catch (error) {
                  console.error('Error parsing drop data:', error);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Drop form components here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Or use the left panel to add components
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Field Properties Panel */}
        {selectedField && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Field Properties: {selectedField.label || selectedField.type}
            </Typography>
            <FieldProperties
              field={selectedField}
              onUpdate={(updates) => {
                onUpdateField && onUpdateField(selectedField.id, updates);
              }}
            />
          </Paper>
        )}

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
        >
          <Alert onClose={() => setShowSuccess(false)} severity="success">
            Form saved successfully!
          </Alert>
        </Snackbar>
      </Box>
    </DndProvider>
  );
} 