import dayjs from 'dayjs';
import { useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AttachFile, Create, Link } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';

export default function EnhancedFormField({ field, isPreview = false, value, onChange, onStepChange }) {
  const [signature, setSignature] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [fileUploads, setFileUploads] = useState({});

  const handleFileChange = (event, fieldId) => {
    const files = event.target.files;
    if (field.multiple) {
      setFileUploads(prev => ({ ...prev, [fieldId]: Array.from(files) }));
      onChange && onChange(Array.from(files));
    } else {
      setFileUploads(prev => ({ ...prev, [fieldId]: files[0] }));
      onChange && onChange(files[0]);
    }
  };

  const handleSignatureChange = (newSignature) => {
    setSignature(newSignature);
    onChange && onChange(newSignature);
  };

  const handleWizardStepChange = (step) => {
    setActiveStep(step);
    onStepChange && onStepChange(step);
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            fullWidth
            required={field.required}
            disabled={isPreview}
            size="small"
          />
        );
      
      case 'textarea':
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            fullWidth
            multiline
            rows={field.rows || 4}
            required={field.required}
            disabled={isPreview}
            size="small"
          />
        );
      
      case 'radio':
        return (
          <FormControl component="fieldset" required={field.required} size="small">
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange && onChange(e.target.value)}
            >
              {field.options && field.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio size="small" />}
                  label={option}
                  disabled={isPreview}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      
      case 'checkbox':
        return (
          <FormControl component="fieldset" required={field.required} size="small">
            <FormLabel component="legend">{field.label}</FormLabel>
            {field.options && field.options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    size="small"
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      if (onChange) {
                        const currentValue = Array.isArray(value) ? value : [];
                        if (e.target.checked) {
                          onChange([...currentValue, option]);
                        } else {
                          onChange(currentValue.filter(item => item !== option));
                        }
                      }
                    }}
                    disabled={isPreview}
                  />
                }
                label={option}
              />
            ))}
          </FormControl>
        );
      
      case 'dropdown':
        return (
          <FormControl fullWidth required={field.required} size="small">
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => onChange && onChange(e.target.value)}
              disabled={isPreview}
            >
              {field.options && field.options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'number':
        return (
          <TextField
            label={field.label}
            type="number"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            fullWidth
            required={field.required}
            disabled={isPreview}
            size="small"
            inputProps={{ min: field.min, max: field.max }}
          />
        );
      
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={field.label}
              value={value ? dayjs(value) : null}
              onChange={(newValue) => onChange && onChange(newValue ? newValue.toISOString() : null)}
              disabled={isPreview}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: field.required,
                  size: 'small'
                }
              }}
            />
          </LocalizationProvider>
        );
      
      case 'attachment':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {field.label}
              {field.required && <span style={{ color: 'error.main' }}> *</span>}
            </Typography>
            <input
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => handleFileChange(e, field.id)}
              disabled={isPreview}
              style={{ display: 'none' }}
              id={`file-upload-${field.id}`}
            />
            <label htmlFor={`file-upload-${field.id}`}>
              <Button
                variant="outlined"
                component="span"
                startIcon={<AttachFile />}
                disabled={isPreview}
                size="small"
              >
                Choose File{field.multiple ? 's' : ''}
              </Button>
            </label>
            {fileUploads[field.id] && (
              <Box sx={{ mt: 1 }}>
                {Array.isArray(fileUploads[field.id]) ? (
                  fileUploads[field.id].map((file, index) => (
                    <Chip key={index} label={file.name} size="small" sx={{ mr: 1, mb: 1 }} />
                  ))
                ) : (
                  <Chip label={fileUploads[field.id].name} size="small" />
                )}
              </Box>
            )}
          </Box>
        );
      
      case 'link':
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            fullWidth
            required={field.required}
            disabled={isPreview}
            size="small"
            InputProps={{
              startAdornment: <Link sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        );
      
      case 'table':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {field.label}
              {field.required && <span style={{ color: 'error.main' }}> *</span>}
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {field.columns && field.columns.map((column, index) => (
                      <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: field.rows || 3 }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {field.columns && field.columns.map((_, colIndex) => (
                        <TableCell key={colIndex}>
                          <TextField
                            size="small"
                            placeholder={`Row ${rowIndex + 1}, Col ${colIndex + 1}`}
                            disabled={isPreview}
                            fullWidth
                            variant="standard"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      
      case 'richtext':
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            fullWidth
            multiline
            rows={6}
            required={field.required}
            disabled={isPreview}
            size="small"
            sx={{
              '& .MuiInputBase-input': {
                fontFamily: 'monospace'
              }
            }}
          />
        );
      
      case 'signature':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {field.label}
              {field.required && <span style={{ color: 'error.main' }}> *</span>}
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                width: '100%',
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isPreview ? 'default' : 'pointer',
                backgroundColor: 'background.default',
                '&:hover': isPreview ? {} : { backgroundColor: 'action.hover' }
              }}
              onClick={() => {
                if (!isPreview) {
                  // In a real implementation, this would open a signature pad
                  const newSignature = `Signature for ${field.label}`;
                  handleSignatureChange(newSignature);
                }
              }}
            >
              {signature ? (
                <Typography variant="body2" color="primary">
                  {signature}
                </Typography>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Create sx={{ fontSize: 40, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Click to sign
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        );
      
      case 'wizard':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {field.label}
              {field.required && <span style={{ color: 'error.main' }}> *</span>}
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
              {field.steps && field.steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>
                    <Typography variant="subtitle2">{step.title}</Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 2 }}>
                      {step.fields && step.fields.length > 0 ? (
                        <Stack spacing={2}>
                          {step.fields.map((stepField, fieldIndex) => (
                            <EnhancedFormField
                              key={fieldIndex}
                              field={stepField}
                              isPreview={isPreview}
                              value={value?.[step.title]?.[stepField.id]}
                              onChange={(newValue) => {
                                if (onChange) {
                                  const currentValue = value || {};
                                  const stepValue = currentValue[step.title] || {};
                                  stepValue[stepField.id] = newValue;
                                  onChange({
                                    ...currentValue,
                                    [step.title]: stepValue
                                  });
                                }
                              }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No fields in this step
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        disabled={index === 0}
                        onClick={() => handleWizardStepChange(index - 1)}
                        size="small"
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleWizardStepChange(index + 1)}
                        disabled={index === field.steps.length - 1}
                        size="small"
                      >
                        {index === field.steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        );
      
      default:
        return (
          <Typography variant="body2" color="error">
            Unknown field type: {field.type}
          </Typography>
        );
    }
  };

  return (
    <Box>
      {renderField()}
    </Box>
  );
} 