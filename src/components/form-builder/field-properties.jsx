import { useState, useEffect } from 'react';

import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Stack,
  Button,
  Switch,
  TextField,
  Typography,
  FormControlLabel
} from '@mui/material';

export default function FieldProperties({ field, onUpdate }) {
  const [properties, setProperties] = useState(field);

  useEffect(() => {
    setProperties(field);
  }, [field]);

  const handlePropertyChange = (key, value) => {
    const updatedProperties = { ...properties, [key]: value };
    setProperties(updatedProperties);
    onUpdate && onUpdate(updatedProperties);
  };

  const handleOptionAdd = () => {
    const updatedOptions = [...(properties.options || []), 'New Option'];
    handlePropertyChange('options', updatedOptions);
  };

  const handleOptionDelete = (index) => {
    const updatedOptions = properties.options.filter((_, i) => i !== index);
    handlePropertyChange('options', updatedOptions);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...(properties.options || [])];
    updatedOptions[index] = value;
    handlePropertyChange('options', updatedOptions);
  };

  const renderFieldSpecificProperties = () => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <Stack spacing={2}>
            <TextField
              label="Placeholder Text"
              value={properties.placeholder || ''}
              onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
              fullWidth
              size="small"
            />
            {field.type === 'textarea' && (
              <TextField
                label="Number of Rows"
                type="number"
                value={properties.rows || 4}
                onChange={(e) => handlePropertyChange('rows', parseInt(e.target.value))}
                fullWidth
                size="small"
                inputProps={{ min: 1, max: 20 }}
              />
            )}
          </Stack>
        );

      case 'radio':
      case 'checkbox':
      case 'dropdown':
        return (
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Options:</Typography>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={handleOptionAdd}
              >
                Add Option
              </Button>
            </Box>
            <Stack spacing={1}>
              {(properties.options || []).map((option, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    size="small"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleOptionDelete(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Stack>
          </Stack>
        );

      case 'number':
        return (
          <Stack spacing={2}>
            <TextField
              label="Minimum Value"
              type="number"
              value={properties.min || ''}
              onChange={(e) => handlePropertyChange('min', e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Maximum Value"
              type="number"
              value={properties.max || ''}
              onChange={(e) => handlePropertyChange('max', e.target.value)}
              fullWidth
              size="small"
            />
          </Stack>
        );

      case 'attachment':
        return (
          <Stack spacing={2}>
            <TextField
              label="Accepted File Types"
              value={properties.accept || ''}
              onChange={(e) => handlePropertyChange('accept', e.target.value)}
              fullWidth
              size="small"
              placeholder=".pdf,.doc,.jpg,.png"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={properties.multiple || false}
                  onChange={(e) => handlePropertyChange('multiple', e.target.checked)}
                />
              }
              label="Allow Multiple Files"
            />
          </Stack>
        );

      case 'link':
        return (
          <TextField
            label="Placeholder Text"
            value={properties.placeholder || ''}
            onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
            fullWidth
            size="small"
            placeholder="https://example.com"
          />
        );

      case 'table':
        return (
          <Stack spacing={2}>
            <TextField
              label="Number of Rows"
              type="number"
              value={properties.rows || 3}
              onChange={(e) => handlePropertyChange('rows', parseInt(e.target.value))}
              fullWidth
              size="small"
              inputProps={{ min: 1, max: 20 }}
            />
            <TextField
              label="Columns (comma-separated)"
              value={properties.columns ? properties.columns.join(', ') : ''}
              onChange={(e) => {
                const columns = e.target.value.split(',').map(col => col.trim()).filter(col => col);
                handlePropertyChange('columns', columns);
              }}
              fullWidth
              size="small"
              placeholder="Name, Age, Email"
            />
          </Stack>
        );

      case 'richtext':
        return (
          <TextField
            label="Placeholder Text"
            value={properties.placeholder || ''}
            onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
            fullWidth
            size="small"
            placeholder="Enter rich text content..."
          />
        );

      case 'wizard':
        return (
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Steps:</Typography>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={() => {
                  const updatedSteps = [...(properties.steps || []), { title: `Step ${(properties.steps || []).length + 1}`, fields: [] }];
                  handlePropertyChange('steps', updatedSteps);
                }}
              >
                Add Step
              </Button>
            </Box>
            <Stack spacing={1}>
              {(properties.steps || []).map((step, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    size="small"
                    value={step.title}
                    onChange={(e) => {
                      const updatedSteps = [...(properties.steps || [])];
                      updatedSteps[index] = { ...updatedSteps[index], title: e.target.value };
                      handlePropertyChange('steps', updatedSteps);
                    }}
                    sx={{ flex: 1 }}
                    placeholder="Step title"
                  />
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => {
                      const updatedSteps = properties.steps.filter((_, i) => i !== index);
                      handlePropertyChange('steps', updatedSteps);
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Stack>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Field Properties
      </Typography>
      
      <Stack spacing={2}>
        <TextField
          label="Field Label"
          value={properties.label || ''}
          onChange={(e) => handlePropertyChange('label', e.target.value)}
          fullWidth
          size="small"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={properties.required || false}
              onChange={(e) => handlePropertyChange('required', e.target.checked)}
            />
          }
          label="Required Field"
        />
        
        {renderFieldSpecificProperties()}
      </Stack>
    </Box>
  );
} 