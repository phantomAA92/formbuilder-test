import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

import { ArrowBack, Save } from '@mui/icons-material';
import { Alert, Box, Button, Container, Paper, Typography } from '@mui/material';

import FormService, { mockForms } from '../../lib/form-service';
import EnhancedFormBuilder from '../../components/form-builder/enhanced-form-builder';

export default function CustomFormPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: 'New Form',
    description: '',
    fields: []
  });
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (formId) {
      loadExistingForm();
    }
  }, [formId]);

  const loadExistingForm = async () => {
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
      setIsEditing(true);
    } catch (loadError) {
      console.error('Error loading form:', loadError);
      setError('Failed to load form. Creating new form instead.');
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = (type, defaultData) => {
    const newField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      ...defaultData
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const handleUpdateField = (fieldId, updates) => {
    if (fieldId === 'title' || fieldId === 'description') {
      setFormData(prev => ({
        ...prev,
        [fieldId]: updates
      }));
    } else if (fieldId === 'fields') {
      setFormData(prev => ({
        ...prev,
        fields: updates
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        fields: prev.fields.map(field => 
          field.id === fieldId ? { ...field, ...updates } : field
        )
      }));
    }
  };

  const handleDeleteField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const handleMoveField = (fieldId, direction) => {
    setFormData(prev => {
      const fields = [...prev.fields];
      const currentIndex = fields.findIndex(field => field.id === fieldId);
      
      if (direction === 'up' && currentIndex > 0) {
        [fields[currentIndex], fields[currentIndex - 1]] = [fields[currentIndex - 1], fields[currentIndex]];
      } else if (direction === 'down' && currentIndex < fields.length - 1) {
        [fields[currentIndex], fields[currentIndex + 1]] = [fields[currentIndex + 1], fields[currentIndex]];
      }
      
      return { ...prev, fields };
    });
  };

  const handleSaveForm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!formData.title.trim()) {
        setError('Form title is required');
        return;
      }
      
      if (formData.fields.length === 0) {
        setError('Form must have at least one field');
        return;
      }
      
      let savedForm;
      if (isEditing) {
        if (import.meta.env.MODE !== 'development') {
          savedForm = await FormService.updateForm(formId, formData);
        } else {
          savedForm = { ...formData, id: formId };
        }
      } else {
        if (import.meta.env.MODE !== 'development') {
          savedForm = await FormService.saveForm(formData);
        } else {
          savedForm = { ...formData, id: Date.now().toString() };
        }
      }
      
      console.log('Form saved:', savedForm);
      
      // Redirect to forms list or show success message
      if (!isEditing) {
        navigate('/forms-list');
      } else {
        setError('Form updated successfully!');
        setTimeout(() => setError(null), 3000);
      }
      
    } catch (saveError) {
      console.error('Error saving form:', saveError);
      setError('Failed to save form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography>Loading form...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3">
          {isEditing ? 'Edit Form' : 'Custom Form Builder'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/forms-list')}
          >
            Back to Forms
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveForm}
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Form' : 'Save Form')}
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert 
          severity={error.includes('successfully') ? 'success' : 'error'} 
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      {/* Enhanced Form Builder */}
      <EnhancedFormBuilder
        formData={formData}
        onUpdateField={handleUpdateField}
        onDeleteField={handleDeleteField}
        onMoveField={handleMoveField}
        onSelectField={setSelectedField}
        selectedField={selectedField}
        onSave={handleSaveForm}
      />
    </Container>
  );
} 