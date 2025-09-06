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
  Select,
  MenuItem,
  Checkbox,
  TextField,
  Accordion,
  Typography,
  IconButton,
  FormControlLabel,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';

export default function FieldProperties({ field, onUpdate, availableFields = [] }) {
  const [localField, setLocalField] = useState(field);
  const [selectedComponentTypeByStep, setSelectedComponentTypeByStep] = useState({});

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

  // Helper: default data for components (mirrors left panel)
  const getDefaultFieldDataForType = (type) => {
    switch (type) {
      case 'text':
        return { label: 'Text Input', placeholder: 'Enter text...', required: false };
      case 'email':
        return { label: 'Email Input', placeholder: 'Enter email address...', required: false };
      case 'phone':
        return { label: 'Phone Number', placeholder: 'e.g., +1 (555) 123-4567', pattern: '^\\+?[0-9\\s()-]{7,20}$', errorMessage: 'Enter a valid phone number', required: false };
      case 'textarea':
        return { label: 'Text Area', placeholder: 'Enter text...', rows: 4, required: false };
      case 'radio':
        return { label: 'Radio Buttons', options: ['Option 1', 'Option 2', 'Option 3'], required: false };
      case 'checkbox':
        return { label: 'Checkboxes', options: ['Option 1', 'Option 2', 'Option 3'], required: false };
      case 'dropdown':
        return { label: 'Dropdown', options: ['Option 1', 'Option 2', 'Option 3'], required: false };
      case 'number':
        return { label: 'Number', placeholder: 'Enter number...', min: 0, max: 999999, required: false };
      case 'quantity':
        return { label: 'Quantity', min: 0, max: 9999, step: 1, defaultValue: 0, required: false };
      case 'calculated':
        return { label: 'Calculated', expression: '{field_a} + {field_b}', decimals: 2, prefix: '', suffix: '', displayType: 'number', dateFormat: 'MM/DD/YYYY', required: false };
      case 'date':
        return { label: 'Date', required: false };
      case 'attachment':
        return { label: 'File Upload', accept: '.pdf,.doc,.docx,.jpg,.png', multiple: false, required: false };
      case 'link':
        return { label: 'Link', placeholder: 'https://example.com', required: false };
      case 'table':
        return { label: 'Table', columns: ['Column 1', 'Column 2'], rows: 3, required: false };
      case 'richtext':
        return { label: 'Rich Text', placeholder: 'Enter rich text...', required: false };
      case 'label':
        return { label: 'Section Title', variant: 'h6', align: 'left', required: false };
      case 'divider':
        return { label: '', variant: 'fullWidth', textAlign: 'center', orientation: 'horizontal', lineStyle: 'dotted', lineColor: '#bdbdbd', lineThickness: 1, required: false };
      case 'signature':
        return { label: 'Signature', width: 300, height: 150, penColor: '#000000', required: false };
      default:
        return { label: 'New Field', required: false };
    }
  };

  const formatTypeLabel = (type) => {
    const labels = {
      text: 'Text Input',
      email: 'Email Input',
      phone: 'Phone Number',
      textarea: 'Text Area',
      radio: 'Radio Buttons',
      checkbox: 'Checkboxes',
      dropdown: 'Dropdown',
      number: 'Number Input',
      quantity: 'Quantity',
      calculated: 'Calculated',
      date: 'Date Picker',
      attachment: 'File Upload',
      link: 'Link Input',
      table: 'Table',
      richtext: 'Rich Text',
      label: 'Label',
      divider: 'Divider',
      signature: 'Signature'
    };
    return labels[type] || (type?.charAt(0).toUpperCase() + type?.slice(1));
  };

  const addFieldToStep = (stepIndex, componentType) => {
    if (!componentType || componentType === 'wizard') return; // avoid nested wizards
    const defaultData = getDefaultFieldDataForType(componentType);
    const newField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: componentType,
      gridSpan: 1,
      ...defaultData
    };

    const steps = [...(localField.steps || [])];
    const targetStep = steps[stepIndex] || { title: `Step ${stepIndex + 1}`, fields: [] };
    const stepFields = Array.isArray(targetStep.fields) ? [...targetStep.fields, newField] : [newField];
    steps[stepIndex] = { ...targetStep, fields: stepFields };
    handleChange('steps', steps);
  };

  const removeFieldFromStep = (stepIndex, fieldId) => {
    const steps = [...(localField.steps || [])];
    const targetStep = steps[stepIndex];
    if (!targetStep) return;
    const nextFields = (targetStep.fields || []).filter((f) => f.id !== fieldId);
    steps[stepIndex] = { ...targetStep, fields: nextFields };
    handleChange('steps', steps);
  };

  const updateStepField = (stepIndex, fieldId, updates) => {
    const steps = [...(localField.steps || [])];
    const targetStep = steps[stepIndex];
    if (!targetStep) return;
    const nextFields = (targetStep.fields || []).map((f) =>
      f.id === fieldId ? { ...f, ...updates } : f
    );
    steps[stepIndex] = { ...targetStep, fields: nextFields };
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


              {/* Grid Span Control */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Grid Width
                </Typography>
                <Select
                  value={localField.gridSpan || 1}
                  onChange={(e) => handleChange('gridSpan', e.target.value)}
                  size="small"
                  fullWidth
                >
                  <MenuItem value={1}>1 Column</MenuItem>
                  <MenuItem value={2}>2 Columns</MenuItem>
                  <MenuItem value={3}>3 Columns</MenuItem>
                  <MenuItem value={4}>4 Columns</MenuItem>
                </Select>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  How many grid columns this field should span
                </Typography>
              </Box>
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

      case 'quantity':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={500}>Quantity Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  label="Minimum"
                  type="number"
                  value={localField.min ?? 0}
                  onChange={(e) => handleChange('min', parseFloat(e.target.value) ?? 0)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Maximum"
                  type="number"
                  value={localField.max ?? 9999}
                  onChange={(e) => handleChange('max', parseFloat(e.target.value) ?? 9999)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Step"
                  type="number"
                  value={localField.step ?? 1}
                  onChange={(e) => handleChange('step', parseFloat(e.target.value) ?? 1)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Default Value"
                  type="number"
                  value={localField.defaultValue ?? 0}
                  onChange={(e) => handleChange('defaultValue', parseFloat(e.target.value) ?? 0)}
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
                  label="Rows"
                  type="number"
                  value={localField.rows || 3}
                  onChange={(e) => handleChange('rows', parseInt(e.target.value) || 3)}
                  fullWidth
                  size="small"
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
                {(localField.steps || []).map((step, index) => (
                  <Box key={index} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
                      <TextField
                      label={`Step ${index + 1} Title`}
                        value={step.title || ''}
                      onChange={(e) => handleWizardStepChange(index, 'title', e.target.value)}
                        fullWidth
                      size="small"
                        sx={{ mb: 1 }}
                      />
                      <TextField
                      label={`Step ${index + 1} Description`}
                        value={step.description || ''}
                      onChange={(e) => handleWizardStepChange(index, 'description', e.target.value)}
                        fullWidth
                      size="small"
                        multiline
                        rows={2}
                    />

                    {/* Step fields management */}
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Step Fields</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        {(step.fields || []).map((sf) => (
                          <Chip
                            key={sf.id}
                            size="small"
                            label={`${sf.label || formatTypeLabel(sf.type)}`}
                            onDelete={() => removeFieldFromStep(index, sf.id)}
                          />
                        ))}
                        {(!step.fields || step.fields.length === 0) && (
                          <Typography variant="caption" color="text.secondary">No fields yet</Typography>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                        <Select
                          size="small"
                          displayEmpty
                          value={selectedComponentTypeByStep[index] || ''}
                          onChange={(e) => setSelectedComponentTypeByStep((prev) => ({ ...prev, [index]: e.target.value }))}
                          sx={{ minWidth: 200 }}
                        >
                          <MenuItem value="" disabled>Select component</MenuItem>
                          {['text','email','phone','textarea','radio','checkbox','dropdown','number','quantity','calculated','date','attachment','link','table','richtext','label','divider','signature']
                            .map((type) => (
                              <MenuItem key={type} value={type}>{formatTypeLabel(type)}</MenuItem>
                            ))}
                        </Select>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => addFieldToStep(index, selectedComponentTypeByStep[index])}
                          disabled={!selectedComponentTypeByStep[index]}
                        >
                          Add
                        </Button>
                      </Box>

                      {(step.fields || []).length > 0 && (
                        <Stack spacing={1}>
                          {(step.fields || []).map((sf) => (
                            <Box key={sf.id}>
                              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, alignItems: 'center' }}>
                                <TextField
                                  label="Label"
                                  size="small"
                                  value={sf.label || ''}
                                  onChange={(e) => updateStepField(index, sf.id, { label: e.target.value })}
                                />
                                <TextField
                                  label="Field ID"
                                  size="small"
                                  value={sf.id || ''}
                                  onChange={(e) => updateStepField(index, sf.id, { id: e.target.value })}
                                  helperText="Unique identifier"
                                />
                              </Box>
                              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, alignItems: 'center', mt: 1 }}>
                                <TextField
                                  label="Placeholder"
                                  size="small"
                                  value={sf.placeholder || ''}
                                  onChange={(e) => updateStepField(index, sf.id, { placeholder: e.target.value })}
                                />
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={sf.required || false}
                                      onChange={(e) => updateStepField(index, sf.id, { required: e.target.checked })}
                                    />
                                  }
                                  label="Required"
                                />
                              </Box>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>Grid Width</Typography>
                                <Select
                                  size="small"
                                  value={sf.gridSpan || 1}
                                  onChange={(e) => updateStepField(index, sf.id, { gridSpan: e.target.value })}
                                  fullWidth
                                >
                                  <MenuItem value={1}>1 Column</MenuItem>
                                  <MenuItem value={2}>2 Columns</MenuItem>
                                  <MenuItem value={3}>3 Columns</MenuItem>
                                  <MenuItem value={4}>4 Columns</MenuItem>
                                </Select>
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button size="small" variant="outlined" startIcon={<Add />} onClick={addWizardStep}>Add Step</Button>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        );

      case 'calculated':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={500}>Calculated Field</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {/* Quick helpers: list available field IDs as chips */}
                {availableFields && availableFields.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(availableFields || []).map((f) => (
                      <Chip
                        key={f.id}
                        size="small"
                        label={`{${f.id}}`}
                        onClick={() => handleChange('expression', `${(localField.expression || '').trim()} {${f.id}}`.trim())}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                )}

                <TextField
                  label="Expression"
                  value={localField.expression || ''}
                  onChange={(e) => handleChange('expression', e.target.value)}
                  fullWidth
                  size="small"
                  helperText="Use {field_id}, or AGE({dob}), YEARS_BETWEEN(a,b), MONTHS_BETWEEN(a,b), DAYS_BETWEEN(a,b)"
                />
                
                {/* Presets */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => handleChange('expression', 'AGE({dob})')}>Age from {`{dob}`}</Button>
                  <Button size="small" variant="outlined" onClick={() => handleChange('expression', 'YEARS_BETWEEN({start_date}, {end_date})')}>Years between</Button>
                  <Button size="small" variant="outlined" onClick={() => handleChange('expression', 'MONTHS_BETWEEN({start_date}, {end_date})')}>Months between</Button>
                  <Button size="small" variant="outlined" onClick={() => handleChange('expression', 'DAYS_BETWEEN({start_date}, {end_date})')}>Days between</Button>
                  <Button size="small" variant="outlined" onClick={() => handleChange('expression', 'ADD_DAYS({base_date}, 365)')}>+1 year due</Button>
                  <Button size="small" variant="outlined" onClick={() => handleChange('expression', 'ADD_MONTHS({base_date}, 6)')}>+6 months due</Button>
                  <Button size="small" variant="outlined" onClick={() => handleChange('expression', 'ADD_DAYS({base_date}, 30)')}>+30 days due</Button>
                </Box>

                {/* Display options */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Select
                    size="small"
                    value={localField.displayType || 'number'}
                    onChange={(e) => handleChange('displayType', e.target.value)}
                    sx={{ width: 160 }}
                  >
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                  </Select>

                  <TextField
                    label="Date Format"
                    value={localField.dateFormat || 'MM/DD/YYYY'}
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                    helperText={localField.displayType === 'date' ? 'Format when displaying dates (e.g., MM/DD/YYYY)' : ''}
                  />
                </Box>

                {/* Number formatting */}
                {(!localField.displayType || localField.displayType === 'number') && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Decimals"
                      type="number"
                      value={localField.decimals ?? 2}
                      onChange={(e) => handleChange('decimals', Number.isFinite(parseInt(e.target.value)) ? parseInt(e.target.value) : 0)}
                      size="small"
                      sx={{ width: 120 }}
                      inputProps={{ min: 0, max: 10 }}
                    />
                    <TextField label="Prefix" value={localField.prefix || ''} onChange={(e) => handleChange('prefix', e.target.value)} size="small" sx={{ flex: 1 }} />
                    <TextField label="Suffix" value={localField.suffix || ''} onChange={(e) => handleChange('suffix', e.target.value)} size="small" sx={{ flex: 1 }} />
                  </Box>
                )}

                <Typography variant="caption" color="text.secondary">
                  Examples: AGE({`{dob}`})  •  YEARS_BETWEEN({`{start}`}, {`{end}`})  •  ADD_DAYS({`{date}`}, 30)
                </Typography>
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
                  label="Placeholder"
                  value={localField.placeholder || ''}
                  onChange={(e) => handleChange('placeholder', e.target.value)}
                  fullWidth
                  size="small"
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