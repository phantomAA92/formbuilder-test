import { z } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { Save, ArrowBack, ArrowForward } from '@mui/icons-material';
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
  Typography
} from '@mui/material';

import FormField from './form-field';

export default function FormRenderer({ formData, onSubmit, isSubmitting = false }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({});

  // Generate validation schema based on form fields
  const generateValidationSchema = (fields) => {
    const schemaObject = {};
    
    fields.forEach(field => {
      let fieldSchema = z.any();
      
      if (field.required) {
        fieldSchema = fieldSchema.refine(val => val !== undefined && val !== null && val !== '', {
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
        case 'attachment':
          // Handle file uploads - can be File, FileList, or null
          if (field.required) {
            fieldSchema = z.any().refine(val => {
              if (field.multiple) {
                // Multiple files - check if FileList has files
                return val && val.length > 0;
              } else {
                // Single file - check if File object exists
                return val && val instanceof File;
              }
            }, {
              message: `${field.label} is required`
            });
          } else {
            // Optional file - can be null, File, or FileList
            fieldSchema = z.any().nullable();
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
      if (onSubmit) {
        await onSubmit(data);
      }
      console.log('Form submitted:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFieldChange = (fieldId, value) => {
    setValue(fieldId, value);
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
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
                  <FormField
                    field={field}
                    value={watch(field.id)}
                    onChange={(value) => handleFieldChange(field.id, value)}
                  />
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
      </FormProvider>
    );
  }

  function renderWizardForm() {
    const wizardField = formData.fields?.find(field => field.type === 'wizard');
    const steps = wizardField?.steps || [];

    return (
      <FormProvider {...methods}>
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
                  <Box sx={{ mb: 2 }}>
                    {step.fields?.map((field) => (
                      <Box key={field.id} sx={{ mb: 3 }}>
                        <FormField
                          field={field}
                          value={watch(field.id)}
                          onChange={(value) => handleFieldChange(field.id, value)}
                        />
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
      </FormProvider>
    );
  }
} 