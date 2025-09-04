import { z } from 'zod';
import dayjs from 'dayjs';
import { useRef, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Save, Clear, ArrowBack, AttachFile, ArrowForward } from '@mui/icons-material';
import {
  Box,
  Step,
  Chip,
  Alert,
  Paper,
  Radio,
  Table,
  Button,
  Select,
  Stepper,
  Checkbox,
  MenuItem,
  TableRow,
  StepLabel,
  TextField,
  FormLabel,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  RadioGroup,
  InputLabel,
  FormControl,
  FormHelperText,
  TableContainer,
  CircularProgress,
  FormControlLabel,
  Divider
} from '@mui/material';

export default function FormRenderer({ formData, onSubmit, isSubmitting = false }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [signatures, setSignatures] = useState({});
  const [tableData, setTableData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);



  // Generate validation schema based on form fields
  const generateValidationSchema = (fields) => {
    const schemaObject = {};
    
    fields.forEach(field => {
      
      // Handle wizard fields specially - include all step fields in the main schema
      if (field.type === 'wizard' && field.steps) {
        field.steps.forEach((step, stepIndex) => {
          if (step.fields) {
            step.fields.forEach(stepField => {
              let fieldSchema = z.any();
              
              if (stepField.required) {
                fieldSchema = fieldSchema.refine(val => {
                  if (stepField.type === 'checkbox') {
                    return Array.isArray(val) && val.length > 0;
                  }
                  return val !== undefined && val !== null && val !== '';
                }, {
                  message: `${stepField.label} is required`
                });
              }
              
              switch (stepField.type) {
                case 'text':
                case 'textarea':
                case 'link':
                case 'richtext':
                  fieldSchema = z.string();
                  if (stepField.required) {
                    fieldSchema = fieldSchema.min(1, `${stepField.label} is required`);
                  }
                  if (stepField.minLength) {
                    fieldSchema = fieldSchema.min(stepField.minLength, `${stepField.label} must be at least ${stepField.minLength} characters`);
                  }
                  if (stepField.maxLength) {
                    fieldSchema = fieldSchema.max(stepField.maxLength, `${stepField.label} must be no more than ${stepField.maxLength} characters`);
                  }
                  if (stepField.pattern) {
                    fieldSchema = fieldSchema.regex(new RegExp(stepField.pattern), stepField.errorMessage || `${stepField.label} format is invalid`);
                  }
                  break;
                case 'email':
                  fieldSchema = z.string().email('Invalid email format');
                  if (stepField.required) {
                    fieldSchema = fieldSchema.min(1, `${stepField.label} is required`);
                  }
                  if (stepField.minLength) {
                    fieldSchema = fieldSchema.min(stepField.minLength, `${stepField.label} must be at least ${stepField.minLength} characters`);
                  }
                  if (stepField.maxLength) {
                    fieldSchema = fieldSchema.max(stepField.maxLength, `${stepField.label} must be no more than ${stepField.maxLength} characters`);
                  }
                  if (stepField.pattern) {
                    fieldSchema = fieldSchema.regex(new RegExp(stepField.pattern), stepField.errorMessage || `${stepField.label} format is invalid`);
                  }
                  break;
                case 'number':
                  fieldSchema = z.number().min(stepField.min || -Infinity).max(stepField.max || Infinity);
                  break;
                case 'date':
                  if (stepField.required) {
                    fieldSchema = z.string().min(1, `${stepField.label} is required`);
                  } else {
                    fieldSchema = z.string().optional();
                  }
                  break;
                case 'dropdown':
                  fieldSchema = z.string();
                  if (stepField.required) {
                    fieldSchema = fieldSchema.min(1, `${stepField.label} is required`);
                  }
                  break;
                case 'checkbox':
                  if (stepField.required) {
                    fieldSchema = z.array(z.string()).min(1, 'At least one option must be selected');
                  }
                  break;
                case 'signature':
                  if (stepField.required) {
                    fieldSchema = fieldSchema.refine(val => val && val.length > 0, {
                      message: `${stepField.label} is required`
                    });
                  }
                  break;
                case 'attachment':
                  if (stepField.required) {
                    fieldSchema = z.any().refine(val => {
                      if (val && val instanceof FileList) {
                        return val.length > 0;
                      }
                      return val && val !== null && val !== undefined;
                    }, {
                      message: `${stepField.label} is required`
                    });
                  } else {
                    fieldSchema = z.any().nullable();
                  }
                  break;
                default:
                  fieldSchema = z.string();
                  if (stepField.required) {
                    fieldSchema = fieldSchema.min(1, `${stepField.label} is required`);
                  }
              }
              
              if (!stepField.required) {
                fieldSchema = fieldSchema.optional();
              }
              
              schemaObject[stepField.id] = fieldSchema;
            });
          }
        });
        return; // Skip the wizard field itself
      }
      
      let fieldSchema = z.any();
      
      if (field.required) {
        fieldSchema = fieldSchema.refine(val => {
          if (field.type === 'checkbox') {
            return Array.isArray(val) && val.length > 0;
          }
          return val !== undefined && val !== null && val !== '';
        }, {
          message: `${field.label} is required`
        });
      }
      
      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'link':
        case 'richtext':
          fieldSchema = z.string();
          if (field.required) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`);
          }
          if (field.minLength) {
            fieldSchema = fieldSchema.min(field.minLength, `${field.label} must be at least ${field.minLength} characters`);
          }
          if (field.maxLength) {
            fieldSchema = fieldSchema.max(field.maxLength, `${field.label} must be no more than ${field.maxLength} characters`);
          }
          if (field.pattern) {
            fieldSchema = fieldSchema.regex(new RegExp(field.pattern), field.errorMessage || `${field.label} format is invalid`);
          }
          break;
        case 'email':
          fieldSchema = z.string().email('Invalid email format');
          if (field.required) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`);
          }
          if (field.minLength) {
            fieldSchema = fieldSchema.min(field.minLength, `${field.label} must be at least ${field.minLength} characters`);
          }
          if (field.maxLength) {
            fieldSchema = fieldSchema.max(field.maxLength, `${field.label} must be no more than ${field.maxLength} characters`);
          }
          if (field.pattern) {
            fieldSchema = fieldSchema.regex(new RegExp(field.pattern), field.errorMessage || `${field.label} format is invalid`);
          }
          break;
        case 'number':
          fieldSchema = z.number().min(field.min || -Infinity).max(field.max || Infinity);
          break;
        case 'date':
          if (field.required) {
            fieldSchema = z.string().min(1, `${field.label} is required`);
          } else {
            fieldSchema = z.string().optional();
          }
          break;
        case 'dropdown':
          fieldSchema = z.string();
          if (field.required) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`);
          }
          break;
        case 'checkbox':
          if (field.required) {
            fieldSchema = z.array(z.string()).min(1, 'At least one option must be selected');
          }
          break;
        case 'signature':
          if (field.required) {
            fieldSchema = fieldSchema.refine(val => val && val.length > 0, {
              message: `${field.label} is required`
            });
          }
          break;
        case 'attachment':
          // Handle file uploads - can be File, FileList, or null
          if (field.required) {
            fieldSchema = z.any().refine(val => {
              // Since onChange always passes FileList, we need to check if it has files
              if (val && val instanceof FileList) {
                return val.length > 0;
              }
              // Fallback for other cases
              return val && val !== null && val !== undefined;
            }, {
              message: `${field.label} is required`
            });
          } else {
            // Optional file - can be null, File, or FileList
            fieldSchema = z.any().nullable();
          }
          break;
        case 'label':
        case 'divider':
          fieldSchema = z.any();
          break;
        default:
          fieldSchema = z.string();
          if (field.required) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`);
          }
      }
      
      if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }
      
      schemaObject[field.id] = fieldSchema;
    });
    
    return z.object(schemaObject);
  };

  const [validationSchema, setValidationSchema] = useState(() => generateValidationSchema(formData.fields || []));
  
  // Regenerate validation schema when formData changes
  useEffect(() => {
    const newSchema = generateValidationSchema(formData.fields || []);
    setValidationSchema(newSchema);
  }, [formData.fields]);
  
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: formValues,
    mode: 'onSubmit' // Only validate on form submission
  });

  const { formState: { errors }, watch, setValue, trigger } = methods;

  const handleFormSubmit = async (data) => {
    try {
      // Check if there are validation errors
      if (Object.keys(errors).length > 0) {
        console.log('Form has validation errors, cannot submit');
        return;
      }

      // Check if form has fields
      if (!formData.fields || formData.fields.length === 0) {
        console.log('Form has no fields');
        return;
      }

      // Add signatures and table data to the form data
      const enrichedData = {
        ...data,
        signatures,
        tableData
      };
      
      if (onSubmit) {
        await onSubmit(enrichedData);
      }
      console.log('Form submitted:', enrichedData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFieldChange = (fieldId, value) => {
    setValue(fieldId, value);
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSignatureChange = (fieldId, signatureData) => {
    setSignatures(prev => ({ ...prev, [fieldId]: signatureData }));
  };

  const handleTableDataChange = (fieldId, data) => {
    setTableData(prev => ({ ...prev, [fieldId]: data }));
  };

  const handleNext = async () => {
    const wizardField = formData.fields?.find(field => field.type === 'wizard');
    const steps = wizardField?.steps || [];
    const currentStep = steps[activeStep];
    
    if (!currentStep) {
      console.error('Current step not found');
      return;
    }

    // Validate current step fields before proceeding
    if (currentStep.fields && currentStep.fields.length > 0) {
      try {
        // Trigger validation for all current step fields
        const fieldIds = currentStep.fields.map(field => field.id);
        const isValid = await trigger(fieldIds);
        
        if (isValid) {
          // If validation passes, proceed to next step
          if (activeStep === steps.length - 1) {
            // This is the last step, show success message
            setShowSuccess(true);
            // Reset form after showing success
            setTimeout(() => {
              setShowSuccess(false);
              setActiveStep(0);
              setFormValues({});
              setSignatures({});
              setTableData({});
              methods.reset();
            }, 3000);
          } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          }
        } else {
          // Validation failed, errors will be displayed on the fields
          console.log('Step validation failed - errors will be shown on fields');
          return;
        }
      } catch (validationError) {
        console.error('Step validation error:', validationError);
        return;
      }
    } else {
      // No fields in current step, proceed without validation
      if (activeStep === steps.length - 1) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setActiveStep(0);
          setFormValues({});
          setSignatures({});
          setTableData({});
          methods.reset();
        }, 3000);
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Helper function to organize fields for preview (2 fields per row)
  const organizeFieldsForPreview = (fields) => {
    const rows = [];
    
    for (let i = 0; i < fields.length; i += 2) {
      const row = fields.slice(i, i + 2);
      rows.push(row);
    }
    
    return rows;
  };

  // Helper function to organize fields in grid layout based on position data
  function organizeFieldsInGrid(fields, gridColumns) {
    if (!Array.isArray(fields) || fields.length === 0) return [];
    
    // Sort fields by position (row, then col)
    const sortedFields = [...fields].sort((a, b) => {
      if (a.position?.row !== b.position?.row) {
        return (a.position?.row || 0) - (b.position?.row || 0);
      }
      return (a.position?.col || 0) - (b.position?.col || 0);
    });
    
    // Group fields by row
    const rows = [];
    
    for (const field of sortedFields) {
      const fieldRow = field.position?.row || 0;
      const fieldCol = field.position?.col || 0;
      const fieldSpan = field.gridSpan || 1;
      
      // Create new rows if needed
      while (rows.length <= fieldRow) {
        rows.push(new Array(gridColumns).fill(null));
      }
      
      // Place field in the grid, respecting its span
      if (fieldCol + fieldSpan <= gridColumns) {
        rows[fieldRow][fieldCol] = field;
        
        // Mark spanned columns as occupied
        for (let i = 1; i < fieldSpan; i++) {
          if (fieldCol + i < gridColumns) {
            rows[fieldRow][fieldCol + i] = 'spanned';
          }
        }
      }
    }
    
    return rows;
  }

  // Check if form has wizard fields
  const hasWizard = formData.fields?.some(field => field.type === 'wizard');
  
  if (hasWizard) {
    return renderWizardForm();
  }

  return renderStandardForm();
  
  function renderStandardForm() {
    return (
      <FormProvider {...methods}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
              {formData.title}
            </Typography>
            
            {formData.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                {formData.description}
              </Typography>
            )}

            <Box sx={{ mb: 3 }}>
              {(() => {
                // Check if fields have position data
                const hasPositionData = formData.fields?.some(field => field.position);
                
                if (hasPositionData) {
                  // Use grid layout based on position data
                  const gridColumns = formData.gridColumns || 2;
                  const gridLayout = organizeFieldsInGrid(formData.fields, gridColumns);
                  return (
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                      gap: 3
                    }}>
                      {gridLayout.map((row, rowIndex) => 
                        row.map((cell, colIndex) => {
                          if (!cell || cell === 'spanned') {
                            return <Box key={`${rowIndex}-${colIndex}`} />;
                          }
                          
                          const field = cell;
                          const fieldSpan = field.gridSpan || 1;
                          
                          return (
                            <Box 
                              key={`${rowIndex}-${colIndex}`}
                              sx={{
                                gridColumn: fieldSpan > 1 ? `span ${fieldSpan}` : undefined,
                                mb: 3
                              }}
                            >
                              {renderField(field)}
                            </Box>
                          );
                        })
                      )}
                    </Box>
                  );
                } else {
                  // Fallback to single column layout for backward compatibility
                  return formData.fields?.map((field) => (
                    <Box key={field.id} sx={{ mb: 3 }}>
                      {renderField(field)}
                    </Box>
                  ));
                }
              })()}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                disabled={isSubmitting}
                                  onClick={async () => {
                    const fieldIds = formData.fields?.map(field => field.id) || [];
                    const isValid = await trigger(fieldIds);
                    
                    if (isValid) {
                      // If validation passes, submit the form
                      const submittedData = methods.getValues();
                      handleFormSubmit(submittedData);
                    }
                  }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </Button>
            </Box>
          </Paper>
        </LocalizationProvider>
      </FormProvider>
    );
  }

  function renderWizardForm() {
    const wizardField = formData.fields?.find(field => field.type === 'wizard');
    const steps = wizardField?.steps || [];

    return (
      <FormProvider {...methods}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
              {formData.title}
            </Typography>
            
            {formData.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                {formData.description}
              </Typography>
            )}

            <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 3 }}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {step.title}
                      </Typography>
                      {step.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          display: 'block',
                          maxWidth: 120,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {step.description}
                        </Typography>
                      )}
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Show only the active step content */}
            {steps[activeStep] && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {steps[activeStep].title}
                </Typography>
                
                {/* Step Fields with Column Layout */}
                <Box sx={{ mb: 2 }}>
                  {steps[activeStep].fields && steps[activeStep].fields.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {organizeFieldsForPreview(steps[activeStep].fields).map((rowFields, rowIndex) => (
                        <Box key={rowIndex} sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: 3
                        }}>
                          {rowFields.map((field) => (
                            <Box key={field.id}>
                              {renderField(field)}
                            </Box>
                          ))}
                          {/* Fill empty space if odd number of fields */}
                          {rowFields.length === 1 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                Empty
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No fields in this step. Add fields to see them here.
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  sx={{ mt: 1 }}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 1 }}
                startIcon={<ArrowForward />}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>

            {/* Success Message */}
            {showSuccess && (
              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  🎉 Form Completed Successfully!
                </Typography>
                <Typography variant="body2">
                  Thank you for completing the form. All your information has been submitted successfully.
                </Typography>
              </Alert>
            )}
          </Paper>
        </LocalizationProvider>
      </FormProvider>
    );
  }

  function renderField(field) {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={watch(field.id) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            fullWidth
            required={field.required}
            disabled={field.disabled}
            error={!!errors[field.id]}
            helperText={errors[field.id]?.message}
            sx={{ 
              width: field.width || '100%',
              '& .MuiOutlinedInput-root': {
                '&.Mui-error': {
                  '& fieldset': {
                    borderColor: 'error.main',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': {
                    borderColor: 'error.main'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'error.main'
                  }
                }
              }
            }}
          />
        );

      case 'textarea':
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={watch(field.id) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            fullWidth
            multiline
            rows={field.rows || 4}
            required={field.required}
            disabled={field.disabled}
            error={!!errors[field.id]}
            helperText={errors[field.id]?.message}
            sx={{ 
              width: field.width || '100%',
              '& .MuiOutlinedInput-root': {
                '&.Mui-error': {
                  '& fieldset': {
                    borderColor: 'error.main',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': {
                    borderColor: 'error.main'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'error.main'
                  }
                }
              }
            }}
          />
        );

      case 'email':
        return (
          <TextField
            label={field.label}
            type="email"
            placeholder={field.placeholder}
            value={watch(field.id) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            fullWidth
            required={field.required}
            disabled={field.disabled}
            error={!!errors[field.id]}
            helperText={errors[field.id]?.message}
            sx={{ 
              width: field.width || '100%',
              '& .MuiOutlinedInput-root': {
                '&.Mui-error': {
                  '& fieldset': {
                    borderColor: 'error.main',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': {
                    borderColor: 'error.main'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'error.main'
                  }
                }
              }
            }}
          />
        );

      case 'radio':
        return (
          <FormControl component="fieldset" required={field.required} error={!!errors[field.id]}>
            <FormLabel component="legend" sx={{ color: errors[field.id] ? 'error.main' : undefined }}>
              {field.label}
            </FormLabel>
            <RadioGroup
              value={watch(field.id) || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              sx={{
                '& .MuiFormControlLabel-root': {
                  '& .MuiRadio-root': {
                    color: errors[field.id] ? 'error.main' : undefined
                  }
                }
              }}
            >
              {(field.options || []).map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {errors[field.id] && (
              <FormHelperText error sx={{ mt: 1, fontWeight: 500 }}>
                {errors[field.id].message}
              </FormHelperText>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl component="fieldset" required={field.required} error={!!errors[field.id]}>
            <FormLabel component="legend" sx={{ color: errors[field.id] ? 'error.main' : undefined }}>
              {field.label}
            </FormLabel>
            <Box sx={{
              '& .MuiFormControlLabel-root': {
                '& .MuiCheckbox-root': {
                  color: errors[field.id] ? 'error.main' : undefined
                }
              }
            }}>
              {(field.options || []).map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={(watch(field.id) || []).includes(option)}
                      onChange={(e) => {
                        const currentValues = watch(field.id) || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter(val => val !== option);
                        handleFieldChange(field.id, newValues);
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </Box>
            {errors[field.id] && (
              <FormHelperText error sx={{ mt: 1, fontWeight: 500 }}>
                {errors[field.id].message}
              </FormHelperText>
            )}
          </FormControl>
        );

      case 'dropdown':
        return (
          <FormControl fullWidth required={field.required} error={!!errors[field.id]}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={watch(field.id) || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              label={field.label}
              disabled={field.disabled}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: errors[field.id] ? 'error.main' : undefined,
                  borderWidth: errors[field.id] ? '2px' : undefined
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: errors[field.id] ? 'error.main' : undefined
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: errors[field.id] ? 'error.main' : undefined
                }
              }}
            >
              {(field.options || []).map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors[field.id] && (
              <FormHelperText error>{errors[field.id].message}</FormHelperText>
            )}
          </FormControl>
        );

      case 'number':
        return (
          <TextField
            label={field.label}
            type="number"
            placeholder={field.placeholder}
            value={watch(field.id) || ''}
            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || '')}
            fullWidth
            required={field.required}
            disabled={field.disabled}
            error={!!errors[field.id]}
            helperText={errors[field.id]?.message}
            inputProps={{
              min: field.min,
              max: field.max,
              step: field.step
            }}
            sx={{ 
              width: field.width || '100%',
              '& .MuiOutlinedInput-root': {
                '&.Mui-error': {
                  '& fieldset': {
                    borderColor: 'error.main',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': {
                    borderColor: 'error.main'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'error.main'
                  }
                }
              }
            }}
          />
        );

      case 'date':
        return (
          <DatePicker
            label={field.label}
            value={watch(field.id) ? dayjs(watch(field.id)) : null}
            onChange={(date) => handleFieldChange(field.id, date ? date.toISOString() : '')}
            slotProps={{
              textField: {
                fullWidth: true,
                required: field.required,
                disabled: field.disabled,
                error: !!errors[field.id],
                helperText: errors[field.id]?.message,
                sx: {
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-error': {
                      '& fieldset': {
                        borderColor: 'error.main',
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: 'error.main'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'error.main'
                      }
                    }
                  }
                }
              }
            }}
            minDate={field.minDate ? dayjs(field.minDate) : undefined}
            maxDate={field.maxDate ? dayjs(field.maxDate) : undefined}
          />
        );

      case 'attachment':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label}
              {field.required && <span style={{ color: 'error.main' }}> *</span>}
            </Typography>

            <input
              type="file"
              multiple
              accept={field.accept}
              onChange={(e) => handleFieldChange(field.id, e.target.files)}
              style={{ display: 'none' }}
              id={`file-${field.id}`}
            />
            <label htmlFor={`file-${field.id}`}>
              <Box
                sx={{
                  minHeight: 120,
                  border: '2px dashed',
                  borderColor: errors[field.id] ? 'error.main' : 'grey.300',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: errors[field.id] ? 'error.50' : 'grey.50',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: errors[field.id] ? 'error.main' : 'primary.main',
                    backgroundColor: errors[field.id] ? 'error.100' : 'primary.50',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: 'primary.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <AttachFile sx={{ fontSize: 24, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: 'text.primary' }}>
                    Drop files here or click to browse
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Drag and drop your files here, or click to select files
                  </Typography>
                  {field.accept && (
                    <Typography variant="caption" sx={{ 
                      display: 'block', 
                      color: 'text.secondary',
                      backgroundColor: 'background.paper',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      Accepted: {field.accept}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    mt: 0.5,
                    color: 'success.main',
                    fontWeight: 500
                  }}>
                    ✓ Multiple files allowed
                  </Typography>
                </Box>
              </Box>
            </label>
            {watch(field.id) && watch(field.id).length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Selected Files:
                </Typography>
                {Array.from(watch(field.id)).map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => {
                      const currentFiles = Array.from(watch(field.id));
                      const newFiles = currentFiles.filter((_, i) => i !== index);
                      handleFieldChange(field.id, newFiles.length > 0 ? newFiles : null);
                    }}
                    sx={{ mr: 1, mb: 1 }}
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
            {errors[field.id] && (
              <FormHelperText error sx={{ mt: 1 }}>
                {errors[field.id].message}
              </FormHelperText>
            )}
          </Box>
        );

      case 'link':
        return (
          <TextField
            label={field.label}
            type="url"
            placeholder={field.placeholder}
            value={watch(field.id) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            fullWidth
            required={field.required}
            disabled={field.disabled}
            error={!!errors[field.id]}
            helperText={errors[field.id]?.message}
            sx={{ 
              width: field.width || '100%',
              '& .MuiOutlinedInput-root': {
                '&.Mui-error': {
                  '& fieldset': {
                    borderColor: 'error.main',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': {
                    borderColor: 'error.main'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'error.main'
                  }
                }
              }
            }}
          />
        );

      case 'table':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label}
            </Typography>
            <TableContainer 
              component={Paper} 
              variant="outlined"
              sx={{
                borderColor: errors[field.id] ? 'error.main' : undefined,
                borderWidth: errors[field.id] ? '2px' : undefined
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {(field.columns || []).map((column, index) => (
                      <TableCell key={index}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: field.rows || 3 }).map((rowItem, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {(field.columns || []).map((colItem, colIndex) => (
                        <TableCell key={colIndex}>
                          <TextField
                            size="small"
                            placeholder="Enter value"
                            value={(tableData[field.id]?.[rowIndex]?.[colIndex] || '')}
                            onChange={(e) => {
                              const currentData = tableData[field.id] || [];
                              if (!currentData[rowIndex]) currentData[rowIndex] = [];
                              currentData[rowIndex][colIndex] = e.target.value;
                              // Update both tableData state and main form values
                              handleTableDataChange(field.id, currentData);
                              // Store a string representation in main form values for validation
                              const hasData = currentData.some(row => 
                                Array.isArray(row) && row.some(cell => cell && cell.trim() !== '')
                              );
                              handleFieldChange(field.id, hasData ? 'has_data' : '');
                            }}
                            fullWidth
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {errors[field.id] && (
              <FormHelperText error sx={{ mt: 1 }}>
                {errors[field.id].message}
              </FormHelperText>
            )}
          </Box>
        );

      case 'richtext':
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={watch(field.id) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            fullWidth
            multiline
            rows={6}
            required={field.required}
            disabled={field.disabled}
            error={!!errors[field.id]}
            helperText={errors[field.id]?.message}
            sx={{ 
              width: field.width || '100%',
              '& .MuiOutlinedInput-root': {
                '&.Mui-error': {
                  '& fieldset': {
                    borderColor: 'error.main',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': {
                    borderColor: 'error.main'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'error.main'
                  }
                }
              }
            }}
          />
        );

      case 'signature':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label}
            </Typography>
            <SignatureField
              field={field}
              value={signatures[field.id]}
              onChange={(signatureData) => {
                // Update both signatures state and main form values
                handleSignatureChange(field.id, signatureData);
                handleFieldChange(field.id, signatureData);
              }}
              required={field.required}
            />
            {errors[field.id] && (
              <FormHelperText error sx={{ mt: 1 }}>
                {errors[field.id].message}
              </FormHelperText>
            )}
          </Box>
        );

      case 'label':
        return (
          <Typography variant={field.variant || 'h6'} align={field.align || 'left'} sx={{ width: field.width || '100%' }}>
            {field.label}
          </Typography>
        );

      case 'divider':
        return (
          <Divider
            textAlign={field.textAlign || 'center'}
            variant={field.variant || 'fullWidth'}
            orientation={field.orientation || 'horizontal'}
            sx={{
              my: 1,
              borderColor: field.lineColor || 'divider',
              borderStyle: field.lineStyle || 'solid',
              borderWidth: field.lineThickness ? `${field.lineThickness}px` : '1px'
            }}
          >
            {field.label || ''}
          </Divider>
        );

      default:
        return (
          <Typography color="error">
            Unknown field type: {field.type}
          </Typography>
        );
    }
  }
}

// Signature Field Component
function SignatureField({ field, value, onChange, required }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = field.penColor || '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      setContext(ctx);
    }
  }, [field.penColor]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const signatureData = canvasRef.current.toDataURL();
      onChange(signatureData);
    }
  };

  const clearSignature = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      onChange('');
    }
  };

  return (
    <Box>
      <canvas
        ref={canvasRef}
        width={field.width || 300}
        height={field.height || 150}
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'crosshair'
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={clearSignature}
          startIcon={<Clear />}
        >
          Clear
        </Button>
        {value && (
          <Chip label="Signed" color="success" size="small" />
        )}
      </Box>
    </Box>
  );
}
