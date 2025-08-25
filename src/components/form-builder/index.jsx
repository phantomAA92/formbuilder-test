import { useState } from 'react';

import {
  Delete,
  Settings,
  ArrowUpward,
  ArrowDownward,
  DragIndicator
} from '@mui/icons-material';
import {
  Box,
  Paper,
  Stack,
  Button,
  Tooltip,
  TextField,
  IconButton,
  Typography
} from '@mui/material';

import FormField from './form-field';
import FieldProperties from './field-properties';

export default function FormBuilder({
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
  };

  const handleFieldMove = (fieldId, direction) => {
    onMoveField && onMoveField(fieldId, direction);
  };

  const handleSave = () => {
    onSave && onSave();
  };

  return (
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
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<Settings />}
          >
            Save Form
          </Button>
        </Box>

        {formData.fields && formData.fields.length > 0 ? (
          <Stack spacing={2}>
            {formData.fields.map((field, index) => (
              <Paper
                key={field.id}
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: selectedField?.id === field.id ? '2px solid' : '1px solid',
                  borderColor: selectedField?.id === field.id ? 'primary.main' : 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover'
                  }
                }}
                onClick={() => handleFieldSelect(field)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DragIndicator color="action" />
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    {field.label || `Field ${index + 1}`}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Move Up">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldMove(field.id, 'up');
                        }}
                        disabled={index === 0}
                      >
                        <ArrowUpward />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Move Down">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldMove(field.id, 'down');
                        }}
                        disabled={index === formData.fields.length - 1}
                      >
                        <ArrowDownward />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Field">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldDelete(field.id);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Box sx={{ ml: 3 }}>
                  <FormField field={field} isPreview />
                </Box>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No fields added yet. Use the left panel to add form components.
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
    </Box>
  );
} 