import { useState, useEffect } from 'react';

import {
  Add,
  Delete,
  ExpandMore,
  DragIndicator
} from '@mui/icons-material';
import {
  Box,
  Stack,
  Switch,
  Button,
  TextField,
  Accordion,
  Typography,
  IconButton,
  FormControlLabel,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  Checkbox
} from '@mui/material';

export default function EnhancedFieldProperties({ field, onUpdate }) {
  const [localField, setLocalField] = useState(field);

  useEffect(() => {
    setLocalField(field);
  }, [field]);

  const handleChange = (property, value) => {
    const updatedField = { ...localField, [property]: value };
    setLocalField(updatedField);
    onUpdate(updatedField);
  };

  const handleOptionChange = (index, value) => {
    const options = [...(localField.options || [])];
    options[index] = value;
    handleChange('options', options);
  };

  const addOption = () => {
    const options = [...(localField.options || []), `Option ${(localField.options?.length || 0) + 1}`];
    handleChange('options', options);
  };

  const removeOption = (index) => {
    const options = (localField.options || []).filter((_, i) => i !== index);
    handleChange('options', options);
  };

  const handleTableColumnChange = (index, value) => {
    const columns = [...(localField.columns || [])];
    columns[index] = value;
    handleChange('columns', columns);
  };

  const addTableColumn = () => {
    const columns = [...(localField.columns || []), `Column ${(localField.columns?.length || 0) + 1}`];
    handleChange('columns', columns);
  };

  const removeTableColumn = (index) => {
    const columns = (localField.columns || []).filter((_, i) => i !== index);
    handleChange('columns', columns);
  };

  const handleWizardStepChange = (stepIndex, property, value) => {
    const steps = [...(localField.steps || [])];
    steps[stepIndex] = { ...steps[stepIndex], [property]: value };
    handleChange('steps', steps);
  };

  const addWizardStep = () => {
    const steps = [...(localField.steps || []), { title: `Step ${(localField.steps?.length || 0) + 1}`, fields: [] }];
    handleChange('steps', steps);
  };

  const removeWizardStep = (stepIndex) => {
    const steps = (localField.steps || []).filter((_, i) => i !== stepIndex);
    handleChange('steps', steps);
  };

  if (!field) return null;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Field Properties
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {field.type.charAt(0).toUpperCase() + field.type.slice(1)} Component
      </Typography>

      <Stack spacing={3}>
        {/* Basic Properties */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight={500}>Basic Properties</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label="Field Label"
                value={localField.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                fullWidth
                size="small"
              />
              
              <TextField
                label="Field ID"
                value={localField.id || ''}
                onChange={(e) => handleChange('id', e.target.value)}
                fullWidth
                size="small"
                helperText="Unique identifier for this field"
              />

              <TextField
                label="Placeholder"
                value={localField.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                fullWidth
                size="small"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={localField.required || false}
                    onChange={(e) => handleChange('required', e.target.checked)}
                  />
                }
                label="Required Field"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={localField.disabled || false}
                    onChange={(e) => handleChange('disabled', e.target.checked)}
                  />
                }
                label="Disabled"
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Type-Specific Properties */}
        {renderTypeSpecificProperties()}

        {/* Validation Properties */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight={500}>Validation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label="Min Length"
                type="number"
                value={localField.minLength || ''}
                onChange={(e) => handleChange('minLength', parseInt(e.target.value) || undefined)}
                fullWidth
                size="small"
              />
              
              <TextField
                label="Max Length"
                type="number"
                value={localField.maxLength || ''}
                onChange={(e) => handleChange('maxLength', parseInt(e.target.value) || undefined)}
                fullWidth
                size="small"
              />

              <TextField
                label="Pattern (Regex)"
                value={localField.pattern || ''}
                onChange={(e) => handleChange('pattern', e.target.value)}
                fullWidth
                size="small"
                helperText="Regular expression for validation"
              />

              <TextField
                label="Error Message"
                value={localField.errorMessage || ''}
                onChange={(e) => handleChange('errorMessage', e.target.value)}
                fullWidth
                size="small"
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Styling Properties */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight={500}>Styling</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label="CSS Class"
                value={localField.className || ''}
                onChange={(e) => handleChange('className', e.target.value)}
                fullWidth
                size="small"
              />
              
              <TextField
                label="Width"
                value={localField.width || ''}
                onChange={(e) => handleChange('width', e.target.value)}
                fullWidth
                size="small"
                placeholder="e.g., 100%, 200px"
              />

              <TextField
                label="Height"
                value={localField.height || ''}
                onChange={(e) => handleChange('height', e.target.value)}
                fullWidth
                size="small"
                placeholder="e.g., 40px, 100px"
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Box>
  );

  function renderTypeSpecificProperties() {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={500}>Text Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {field.type === 'textarea' && (
                  <TextField
                    label="Rows"
                    type="number"
                    value={localField.rows || 4}
                    onChange={(e) => handleChange('rows', parseInt(e.target.value) || 4)}
                    fullWidth
                    size="small"
                    inputProps={{ min: 1, max: 20 }}
                  />
                )}
                
                <TextField
                  label="Default Value"
                  value={localField.defaultValue || ''}
                  onChange={(e) => handleChange('defaultValue', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        );

      case 'number':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={500}>Number Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  label="Minimum Value"
                  type="number"
                  value={localField.min || ''}
                  onChange={(e) => handleChange('min', parseFloat(e.target.value) || undefined)}
                  fullWidth
                  size="small"
                />
                
                <TextField
                  label="Maximum Value"
                  type="number"
                  value={localField.max || ''}
                  onChange={(e) => handleChange('max', parseFloat(e.target.value) || undefined)}
                  fullWidth
                  size="small"
                />
                
                <TextField
                  label="Step"
                  type="number"
                  value={localField.step || ''}
                  onChange={(e) => handleChange('step', parseFloat(e.target.value) || undefined)}
                  fullWidth
                  size="small"
                  placeholder="e.g., 0.1, 1"
                />
                
                <TextField
                  label="Default Value"
                  type="number"
                  value={localField.defaultValue || ''}
                  onChange={(e) => handleChange('defaultValue', parseFloat(e.target.value) || undefined)}
                  fullWidth
                  size="small"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        );

      case 'date':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={500}>Date Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  label="Min Date"
                  type="date"
                  value={localField.minDate || ''}
                  onChange={(e) => handleChange('minDate', e.target.value)}
                  fullWidth
                  size="small"
                />
                
                <TextField
                  label="Max Date"
                  type="date"
                  value={localField.maxDate || ''}
                  onChange={(e) => handleChange('maxDate', e.target.value)}
                  fullWidth
                  size="small"
                />
                
                <TextField
                  label="Default Date"
                  type="date"
                  value={localField.defaultValue || ''}
                  onChange={(e) => handleChange('defaultValue', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        );

      case 'radio':
      case 'checkbox':
      case 'dropdown':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={500}>Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2">Options</Typography>
                  <Button
                    startIcon={<Add />}
                    onClick={addOption}
                    size="small"
                    variant="outlined"
                  >
                    Add Option
                  </Button>
                </Box>
                
                <Stack spacing={1}>
                  {(localField.options || []).map((option, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DragIndicator sx={{ color: 'text.secondary' }} />
                      <TextField
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeOption(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
                
                {field.type === 'dropdown' && (
                  <TextField
                    label="Default Selected Option"
                    value={localField.defaultValue || ''}
                    onChange={(e) => handleChange('defaultValue', e.target.value)}
                    fullWidth
                    size="small"
                  />
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        );

      case 'attachment':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={500}>File Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  label="Accepted File Types"
                  value={localField.accept || ''}
                  onChange={(e) => handleChange('accept', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder=".pdf,.doc,.docx,.jpg,.png"
                />
                
                <TextField
                  label="Max File Size (MB)"
                  type="number"
                  value={localField.maxSize || ''}
                  onChange={(e) => handleChange('maxSize', parseInt(e.target.value) || undefined)}
                  fullWidth
                  size="small"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={localField.multiple || false}
                      onChange={(e) => handleChange('multiple', e.target.checked)}
                    />
                  }
                  label="Allow Multiple Files"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        );

      case 'table':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={500}>Table Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2">Columns</Typography>
                  <Button
                    startIcon={<Add />}
                    onClick={addTableColumn}
                    size="small"
                    variant="outlined"
                  >
                    Add Column
                  </Button>
                </Box>
                
                <Stack spacing={1}>
                  {(localField.columns || []).map((column, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DragIndicator sx={{ color: 'text.secondary' }} />
                      <TextField
                        value={column}
                        onChange={(e) => handleTableColumnChange(index, e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeTableColumn(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
                
                <TextField
                  label="Number of Rows"
                  type="number"
                  value={localField.rows || 3}
                  onChange={(e) => handleChange('rows', parseInt(e.target.value) || 3)}
                  fullWidth
                  size="small"
                  inputProps={{ min: 1, max: 20 }}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        );

      case 'wizard':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={500}>Wizard Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'info.50', 
                  borderRadius: 1, 
                  border: '1px solid',
                  borderColor: 'info.200'
                }}>
                  <Typography variant="body2" color="info.700" sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    '&::before': {
                      content: '"💡 "',
                      mr: 1
                    }
                  }}>
                    <strong>Tip:</strong> Write clear, descriptive step descriptions to help users understand what information they need to provide in each step. Good descriptions improve user experience and reduce form abandonment.
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2">Steps</Typography>
                  <Button
                    startIcon={<Add />}
                    onClick={addWizardStep}
                    size="small"
                    variant="outlined"
                  >
                    Add Step
                  </Button>
                </Box>
                
                <Stack spacing={2}>
                  {(localField.steps || []).map((step, stepIndex) => (
                    <Box key={stepIndex} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">Step {stepIndex + 1}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeWizardStep(stepIndex)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        Configure the title and description for this step. The description will be displayed to users to help them understand what information to provide.
                      </Typography>
                      
                      <TextField
                        label="Step Title"
                        value={step.title || ''}
                        onChange={(e) => handleWizardStepChange(stepIndex, 'title', e.target.value)}
                        size="small"
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                      
                      <TextField
                        label="Step Description"
                        value={step.description || ''}
                        onChange={(e) => handleWizardStepChange(stepIndex, 'description', e.target.value)}
                        size="small"
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mb: 2 }}
                        helperText="Describe what information will be collected in this step. This helps users understand what to expect."
                        placeholder="e.g., Provide essential personal details including name, contact information, and address."
                      />

                      {/* Column Layout Configuration */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Column Layout</Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ minWidth: 80 }}>Columns:</Typography>
                          <Select
                            size="small"
                            value={step.columns || 1}
                            onChange={(e) => handleWizardStepChange(stepIndex, 'columns', e.target.value)}
                            sx={{ minWidth: 80 }}
                          >
                            <MenuItem value={1}>1 Column</MenuItem>
                            <MenuItem value={2}>2 Columns</MenuItem>
                            <MenuItem value={3}>3 Columns</MenuItem>
                            <MenuItem value={4}>4 Columns</MenuItem>
                          </Select>
                        </Box>
                      </Box>

                      {/* Step Fields Management */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">Step Fields</Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              const newField = {
                                id: `step_${stepIndex}_field_${Date.now()}`,
                                type: 'text',
                                label: 'New Field',
                                required: false,
                                column: 0
                              };
                              const updatedFields = [...(step.fields || []), newField];
                              handleWizardStepChange(stepIndex, 'fields', updatedFields);
                            }}
                          >
                            Add Field
                          </Button>
                        </Box>
                        
                        {step.fields && step.fields.length > 0 ? (
                          <Stack spacing={1}>
                            {step.fields.map((stepField, fieldIndex) => (
                              <Box key={fieldIndex} sx={{ 
                                border: '1px solid', 
                                borderColor: 'divider', 
                                borderRadius: 1, 
                                p: 1
                              }}>
                                {/* Field Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                                    {stepField.label || `Field ${fieldIndex + 1}`}
                                  </Typography>
                                  <Select
                                    size="small"
                                    value={stepField.type || 'text'}
                                    onChange={(e) => {
                                      const updatedFields = [...(step.fields || [])];
                                      updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], type: e.target.value };
                                      handleWizardStepChange(stepIndex, 'fields', updatedFields);
                                    }}
                                    sx={{ minWidth: 120 }}
                                  >
                                    <MenuItem value="text">Text Input</MenuItem>
                                    <MenuItem value="textarea">Text Area</MenuItem>
                                    <MenuItem value="email">Email</MenuItem>
                                    <MenuItem value="number">Number</MenuItem>
                                    <MenuItem value="date">Date</MenuItem>
                                    <MenuItem value="radio">Radio Buttons</MenuItem>
                                    <MenuItem value="checkbox">Checkboxes</MenuItem>
                                    <MenuItem value="dropdown">Dropdown</MenuItem>
                                    <MenuItem value="attachment">File Upload</MenuItem>
                                  </Select>
                                  <Select
                                    size="small"
                                    value={stepField.column || 0}
                                    onChange={(e) => {
                                      const updatedFields = [...(step.fields || [])];
                                      updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], column: e.target.value };
                                      handleWizardStepChange(stepIndex, 'fields', updatedFields);
                                    }}
                                    sx={{ minWidth: 100 }}
                                  >
                                    {Array.from({ length: step.columns || 1 }).map((_, colIndex) => (
                                      <MenuItem key={colIndex} value={colIndex}>
                                        Column {colIndex + 1}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={stepField.required || false}
                                        onChange={(e) => {
                                          const updatedFields = [...(step.fields || [])];
                                          updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], required: e.target.checked };
                                          handleWizardStepChange(stepIndex, 'fields', updatedFields);
                                        }}
                                      />
                                    }
                                    label="Required"
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      const updatedFields = step.fields.filter((_, i) => i !== fieldIndex);
                                      handleWizardStepChange(stepIndex, 'fields', updatedFields);
                                    }}
                                    color="error"
                                  >
                                    <Delete />
                                  </IconButton>
                                </Box>
                                
                                {/* Expandable Field Properties */}
                                <Accordion size="small" sx={{ '&:before': { display: 'none' } }}>
                                  <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="caption" color="text.secondary">
                                      Field Properties
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Stack spacing={2}>
                                      {/* Basic Properties */}
                                      <TextField
                                        size="small"
                                        label="Field Label"
                                        value={stepField.label || ''}
                                        onChange={(e) => {
                                          const updatedFields = [...(step.fields || [])];
                                          updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], label: e.target.value };
                                          handleWizardStepChange(stepIndex, 'fields', updatedFields);
                                        }}
                                        fullWidth
                                      />
                                      
                                      <TextField
                                        size="small"
                                        label="Field ID"
                                        value={stepField.id || ''}
                                        onChange={(e) => {
                                          const updatedFields = [...(step.fields || [])];
                                          updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], id: e.target.value };
                                          handleWizardStepChange(stepIndex, 'fields', updatedFields);
                                        }}
                                        fullWidth
                                        helperText="Unique identifier for this field"
                                      />
                                      
                                      <TextField
                                        size="small"
                                        label="Placeholder"
                                        value={stepField.placeholder || ''}
                                        onChange={(e) => {
                                          const updatedFields = [...(step.fields || [])];
                                          updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], placeholder: e.target.value };
                                          handleWizardStepChange(stepIndex, 'fields', updatedFields);
                                        }}
                                        fullWidth
                                      />
                                      
                                      {/* Field Type Specific Properties */}
                                      {(stepField.type === 'number' || stepField.type === 'textarea') && (
                                        <>
                                          <TextField
                                            size="small"
                                            label="Min Value"
                                            type="number"
                                            value={stepField.min || ''}
                                            onChange={(e) => {
                                              const updatedFields = [...(step.fields || [])];
                                              updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], min: e.target.value };
                                              handleWizardStepChange(stepIndex, 'fields', updatedFields);
                                            }}
                                            fullWidth
                                          />
                                          
                                          <TextField
                                            size="small"
                                            label="Max Value"
                                            type="number"
                                            value={stepField.max || ''}
                                            onChange={(e) => {
                                              const updatedFields = [...(step.fields || [])];
                                              updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], max: e.target.value };
                                              handleWizardStepChange(stepIndex, 'fields', updatedFields);
                                            }}
                                            fullWidth
                                          />
                                        </>
                                      )}
                                      
                                      {stepField.type === 'textarea' && (
                                        <TextField
                                          size="small"
                                          label="Rows"
                                          type="number"
                                                                                      value={stepField.rows || 4}
                                          onChange={(e) => {
                                            const updatedFields = [...(step.fields || [])];
                                            updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], rows: parseInt(e.target.value) || 4 };
                                            handleWizardStepChange(stepIndex, 'fields', updatedFields);
                                          }}
                                          fullWidth
                                          inputProps={{ min: 1, max: 20 }}
                                        />
                                      )}
                                      
                                      {(stepField.type === 'radio' || stepField.type === 'checkbox' || stepField.type === 'dropdown') && (
                                        <TextField
                                          size="small"
                                          label="Options (comma-separated)"
                                          value={stepField.options ? stepField.options.join(', ') : ''}
                                          onChange={(e) => {
                                            const options = e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt);
                                            const updatedFields = [...(step.fields || [])];
                                            updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], options };
                                            handleWizardStepChange(stepIndex, 'fields', updatedFields);
                                          }}
                                          fullWidth
                                          helperText="Enter options separated by commas"
                                        />
                                      )}
                                    </Stack>
                                  </AccordionDetails>
                                </Accordion>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                            No fields in this step. Click &quot;Add Field&quot; to get started.
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>
        );

      case 'richtext':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={500}>Rich Text Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  label="Default Content"
                  value={localField.defaultValue || ''}
                  onChange={(e) => handleChange('defaultValue', e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                  rows={4}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={localField.allowImages || false}
                      onChange={(e) => handleChange('allowImages', e.target.checked)}
                    />
                  }
                  label="Allow Images"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={localField.allowTables || false}
                      onChange={(e) => handleChange('allowTables', e.target.checked)}
                    />
                  }
                  label="Allow Tables"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        );

      case 'signature':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={500}>Signature Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  label="Signature Width"
                  type="number"
                  value={localField.width || 300}
                  onChange={(e) => handleChange('width', parseInt(e.target.value) || 300)}
                  fullWidth
                  size="small"
                  inputProps={{ min: 100, max: 800 }}
                />
                
                <TextField
                  label="Signature Height"
                  type="number"
                  value={localField.height || 150}
                  onChange={(e) => handleChange('height', parseInt(e.target.value) || 150)}
                  fullWidth
                  size="small"
                  inputProps={{ min: 50, max: 400 }}
                />
                
                <TextField
                  label="Pen Color"
                  value={localField.penColor || '#000000'}
                  onChange={(e) => handleChange('penColor', e.target.value)}
                  fullWidth
                  size="small"
                  type="color"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        );

      default:
        return null;
    }
  }
} 