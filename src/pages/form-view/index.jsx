import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

import { ArrowBack } from '@mui/icons-material';
import { Box, Alert, Button, Container, Typography, CircularProgress } from '@mui/material';

import FormService, { mockForms } from '../../lib/form-service';
import FormRenderer from '../../components/form-builder/form-renderer';

export default function FormViewPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  const loadForm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let form;
      if (import.meta.env.MODE === 'development') {
        form = mockForms.find(f => f.id === formId);
        if (!form) {
          throw new Error('Form not found');
        }
      } else {
        form = await FormService.getFormById(formId);
      }
      

      
      setFormData(form);
    } catch (loadError) {
      console.error('Error loading form:', loadError);
      setError('Failed to load form. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formValues) => {
    try {
      setSubmitting(true);
      setError(null);
      
      if (import.meta.env.MODE === 'development') {
        // In development, just log the submission
        console.log('Form submitted:', {
          formId,
          formData: formValues,
          timestamp: new Date().toISOString()
        });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // In production, submit to the API
        await FormService.submitFormData(formId, formValues);
      }
      
      setSuccess(true);
      setSuccess('Form submitted successfully!');
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/forms-list');
      }, 2000);
      
    } catch (submitError) {
      console.error('Error submitting form:', submitError);
      setError('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={48} />
          <Typography variant="h6">Loading form...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/forms-list')}
            startIcon={<ArrowBack />}
          >
            Back to Forms
          </Button>
        </Box>
      </Container>
    );
  }

  if (!formData) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Form not found
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/forms-list')}
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Back to Forms
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {formData.title}
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/forms-list')}
        >
          Back to Forms
        </Button>
      </Box>

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Form Renderer */}
      <FormRenderer
        formData={formData}
        onSubmit={handleFormSubmit}
        isSubmitting={submitting}
      />
    </Container>
  );
} 