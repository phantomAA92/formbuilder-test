import { useState } from 'react';

import { Save, PlayArrow } from '@mui/icons-material';
import { Box, Paper, Stack, Button, Switch, Typography } from '@mui/material';

import FormField from './form-field';

export default function FormPreview({ formData }) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formValues, setFormValues] = useState({});

  const handleFieldChange = (fieldLabel, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldLabel]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formValues);
    // Here you would submit the form data
  };

  const handleReset = () => {
    setFormValues({});
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Form Preview
      </Typography>
      
      {/* Preview Mode Toggle */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            Preview Mode
          </Typography>
          <Switch
            checked={isPreviewMode}
            onChange={(e) => setIsPreviewMode(e.target.checked)}
          />
        </Box>
      </Paper>

      {/* Form Display */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          {formData.title || 'Untitled Form'}
        </Typography>
        
        {formData.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {formData.description}
          </Typography>
        )}

        {formData.fields && formData.fields.length > 0 ? (
          <Stack spacing={3}>
            {formData.fields.map((field, index) => (
              <Box key={field.id || index}>
                <FormField
                  field={field}
                  value={formValues[field.label] || ''}
                  onChange={(value) => handleFieldChange(field.label, value)}
                  isPreview={!isPreviewMode}
                />
              </Box>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No fields added yet. Add form components from the left panel.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Form Actions */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit}
            disabled={!isPreviewMode}
          >
            Submit Form
          </Button>
          <Button
            variant="outlined"
            startIcon={<PlayArrow />}
            onClick={handleReset}
            disabled={!isPreviewMode}
          >
            Reset Form
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 