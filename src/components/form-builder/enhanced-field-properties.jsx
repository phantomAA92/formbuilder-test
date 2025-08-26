import { useState, useEffect } from 'react';

import { Add, Delete, DragIndicator, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';

export default function EnhancedFieldProperties({ field, onUpdate }) {
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

  const handleWizardStepAdd = () => {
    const newStep = { title: `Step ${(properties.steps?.length || 0) + 1}`, fields: [] };
    const updatedSteps = [...(properties.steps || []), newStep];
    handlePropertyChange('steps', updatedSteps);
  };

  const handleWizardStepDelete = (index) => {
    const updatedSteps = properties.steps.filter((_, i) => i !== index);
    handlePropertyChange('steps', updatedSteps);
  };

  const handleWizardStepChange = (index, key, value) => {
    const updatedSteps = [...(properties.steps || [])];
    updatedSteps[index] = { ...updatedSteps[index], [key]: value };
    handlePropertyChange('steps', updatedSteps);
  };

  const renderBasicProperties = () => (
    <Stack spacing={2}>
      <TextField
        label="Field Label"
        value={properties.label || ''}
        onChange={(e) => handlePropertyChange('label', e.target.value)}
        fullWidth
        size="small"
        required
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
      {properties.helpText && (
        <TextField
          label="Help Text"
          value={properties.helpText || ''}
          onChange={(e) => handlePropertyChange('helpText', e.target.value)}
          fullWidth
          size="small"
          multiline
          rows={2}
        />
      )}
    </Stack>
  );

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
            <TextField
              label="Help Text"
              value={properties.helpText || ''}
              onChange={(e) => handlePropertyChange('helpText', e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
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
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleOptionDelete(index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Stack>
            <TextField
              label="Help Text"
              value={properties.helpText || ''}
              onChange={(e) => handlePropertyChange('helpText', e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Stack>
        );

      case 'number':
        return (
          <Stack spacing={2}>
            <TextField
              label="Placeholder Text"
              value={properties.placeholder || ''}
              onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
              fullWidth
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Minimum Value"
                type="number"
                value={properties.min || 0}
                onChange={(e) => handlePropertyChange('min', parseInt(e.target.value))}
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Maximum Value"
                type="number"
                value={properties.max || 999999}
                onChange={(e) => handlePropertyChange('max', parseInt(e.target.value))}
                size="small"
                sx={{ flex: 1 }}
              />
            </Box>
            <TextField
              label="Help Text"
              value={properties.helpText || ''}
              onChange={(e) => handlePropertyChange('helpText', e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Stack>
        );

      case 'date':
        return (
          <Stack spacing={2}>
            <TextField
              label="Help Text"
              value={properties.helpText || ''}
              onChange={(e) => handlePropertyChange('helpText', e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Stack>
        );

      case 'attachment':
        return (
          <Stack spacing={2}>
            <TextField
              label="Accepted File Types"
              value={properties.accept || '.pdf,.doc,.docx,.jpg,.png'}
              onChange={(e) => handlePropertyChange('accept', e.target.value)}
              fullWidth
              size="small"
              placeholder=".pdf,.doc,.docx,.jpg,.png"
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
            <TextField
              label="Help Text"
              value={properties.helpText || ''}
              onChange={(e) => handlePropertyChange('helpText', e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Stack>
        );

      case 'link':
        return (
          <Stack spacing={2}>
            <TextField
              label="Placeholder Text"
              value={properties.placeholder || ''}
              onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Help Text"
              value={properties.helpText || ''}
              onChange={(e) => handlePropertyChange('helpText', e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Stack>
        );

      case 'table':
        return (
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Columns:</Typography>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={() => {
                  const newColumns = [...(properties.columns || []), `Column ${(properties.columns?.length || 0) + 1}`];
                  handlePropertyChange('columns', newColumns);
                }}
              >
                Add Column
              </Button>
            </Box>
            <Stack spacing={1}>
              {(properties.columns || []).map((column, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    size="small"
                    value={column}
                    onChange={(e) => {
                      const newColumns = [...(properties.columns || [])];
                      newColumns[index] = e.target.value;
                      handlePropertyChange('columns', newColumns);
                    }}
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      const newColumns = properties.columns.filter((_, i) => i !== index);
                      handlePropertyChange('columns', newColumns);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Stack>
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
              label="Help Text"
              value={properties.helpText || ''}
              onChange={(e) => handlePropertyChange('helpText', e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Stack>
        );

      case 'richtext':
        return (
          <Stack spacing={2}>
            <TextField
              label="Placeholder Text"
              value={properties.placeholder || ''}
              onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Help Text"
              value={properties.helpText || ''}
              onChange={(e) => handlePropertyChange('helpText', e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Stack>
        );

      case 'signature':
        return (
          <Stack spacing={2}>
            <TextField
              label="Help Text"
              value={properties.helpText || ''}
              onChange={(e) => handlePropertyChange('helpText', e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Stack>
        );

      case 'wizard':
        return (
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Steps:</Typography>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={handleWizardStepAdd}
              >
                Add Step
              </Button>
            </Box>
            <Stack spacing={2}>
              {(properties.steps || []).map((step, index) => (
                <Accordion key={index} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                      <DragIndicator color="action" />
                      <Typography variant="subtitle2">{step.title}</Typography>
                      <Chip label={`${step.fields?.length || 0} fields`} size="small" />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <TextField
                        label="Step Title"
                        value={step.title}
                        onChange={(e) => handleWizardStepChange(index, 'title', e.target.value)}
                        fullWidth
                        size="small"
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">Fields:</Typography>
                        <Button
                          size="small"
                          startIcon={<Add />}
                          onClick={() => {
                            const newField = {
                              id: Date.now().toString(),
                              type: 'text',
                              label: 'New Field',
                              required: false
                            };
                            const newFields = [...(step.fields || []), newField];
                            handleWizardStepChange(index, 'fields', newFields);
                          }}
                        >
                          Add Field
                        </Button>
                      </Box>
                      <Stack spacing={1}>
                        {(step.fields || []).map((stepField, fieldIndex) => (
                          <Box key={fieldIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                              size="small"
                              value={stepField.label}
                              onChange={(e) => {
                                const newFields = [...(step.fields || [])];
                                newFields[fieldIndex] = { ...newFields[fieldIndex], label: e.target.value };
                                handleWizardStepChange(index, 'fields', newFields);
                              }}
                              sx={{ flex: 1 }}
                            />
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                const newFields = step.fields.filter((_, i) => i !== fieldIndex);
                                handleWizardStepChange(index, 'fields', newFields);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleWizardStepDelete(index)}
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight="bold">
              Basic Properties
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderBasicProperties()}
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight="bold">
              Field Specific Properties
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderFieldSpecificProperties()}
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Box>
  );
} 