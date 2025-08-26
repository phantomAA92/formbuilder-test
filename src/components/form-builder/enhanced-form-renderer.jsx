import { z } from 'zod';
import { useState, useRef, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { Save, ArrowBack, ArrowForward, Clear } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepContent,
  StepLabel,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function EnhancedFormRenderer({ formData, onSubmit, isSubmitting = false }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [signatures, setSignatures] = useState({});
  const [tableData, setTableData] = useState({});

  // Generate validation schema based on form fields
  const generateValidationSchema = (fields) => {
    const schemaObject = {};
    
    fields.forEach(field => {
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
        case 'email':
          fieldSchema = z.string().email('Invalid email format');
          break;
        case 'number':
          fieldSchema = z.number().min(field.min || -Infinity).max(field.max || Infinity);
          break;
        case 'date':
          fieldSchema = z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date');
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
        default:
          fieldSchema = z.string();
      }
      
      if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }
      
      schemaObject[field.id] = fieldSchema;
    });
    
    return z.object(schemaObject);
  };

  const validationSchema = generateValidationSchema(formData.fields || []);
  
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: formValues
  });

  const { handleSubmit, formState: { errors }, watch, setValue } = methods;

  const handleFormSubmit = async (data) => {
    try {
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormValues({});
    setSignatures({});
    setTableData({});
    methods.reset();
  };

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

            <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
              <Box sx={{ mb: 3 }}>
                {formData.fields?.map((field) => (
                  <Box key={field.id} sx={{ mb: 3 }}>
                    {renderField(field)}
                    {errors[field.id] && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {errors[field.id].message}
                      </Alert>
                    )}
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Form'}
                </Button>
              </Box>
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

            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step.title}</StepLabel>
                  <StepContent>
                    {step.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ mb: 2 }}>
                      {step.fields?.map((field) => (
                        <Box key={field.id} sx={{ mb: 3 }}>
                          {renderField(field)}
                          {errors[field.id] && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                              {errors[field.id].message}
                            </Alert>
                          )}
                        </Box>
                      ))}
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                        startIcon={<ArrowForward />}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                        startIcon={<ArrowBack />}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} variant="contained">
                  Reset
                </Button>
              </Paper>
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
            sx={{ width: field.width || '100%' }}
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
            sx={{ width: field.width || '100%' }}
          />
        );

      case 'radio':
        return (
          <FormControl component="fieldset" required={field.required} error={!!errors[field.id]}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={watch(field.id) || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
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
              <Typography color="error" variant="caption">
                {errors[field.id].message}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl component="fieldset" required={field.required} error={!!errors[field.id]}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <Box>
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
              <Typography color="error" variant="caption">
                {errors[field.id].message}
              </Typography>
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
            >
              {(field.options || []).map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors[field.id] && (
              <Typography color="error" variant="caption">
                {errors[field.id].message}
              </Typography>
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
            sx={{ width: field.width || '100%' }}
          />
        );

      case 'date':
        return (
          <DatePicker
            label={field.label}
            value={watch(field.id) ? dayjs(watch(field.id)) : null}
            onChange={(date) => handleFieldChange(field.id, date ? date.toISOString() : '')}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                required={field.required}
                disabled={field.disabled}
                error={!!errors[field.id]}
                helperText={errors[field.id]?.message}
              />
            )}
            minDate={field.minDate ? dayjs(field.minDate) : undefined}
            maxDate={field.maxDate ? dayjs(field.maxDate) : undefined}
          />
        );

      case 'attachment':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label}
            </Typography>
            <input
              type="file"
              multiple={field.multiple}
              accept={field.accept}
              onChange={(e) => handleFieldChange(field.id, e.target.files)}
              style={{ display: 'none' }}
              id={`file-${field.id}`}
            />
            <label htmlFor={`file-${field.id}`}>
              <Button variant="outlined" component="span" fullWidth>
                Choose Files
              </Button>
            </label>
            {watch(field.id) && (
              <Box sx={{ mt: 1 }}>
                {Array.from(watch(field.id)).map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => handleFieldChange(field.id, null)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
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
            sx={{ width: field.width || '100%' }}
          />
        );

      case 'table':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label}
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    {(field.columns || []).map((column, index) => (
                      <TableCell key={index}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: field.rows || 3 }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {(field.columns || []).map((_, colIndex) => (
                        <TableCell key={colIndex}>
                          <TextField
                            size="small"
                            placeholder="Enter value"
                            value={(tableData[field.id]?.[rowIndex]?.[colIndex] || '')}
                            onChange={(e) => {
                              const currentData = tableData[field.id] || [];
                              if (!currentData[rowIndex]) currentData[rowIndex] = [];
                              currentData[rowIndex][colIndex] = e.target.value;
                              handleTableDataChange(field.id, currentData);
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
            sx={{ width: field.width || '100%' }}
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
              onChange={(signatureData) => handleSignatureChange(field.id, signatureData)}
              required={field.required}
            />
          </Box>
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
