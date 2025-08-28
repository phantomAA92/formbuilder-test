import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

import { Save, Preview, ArrowBack } from '@mui/icons-material';
import { Box, Alert, Button, Container, Typography } from '@mui/material';

import FormService, { mockForms } from '../../lib/form-service';
import FormBuilder from '../../components/form-builder/form-builder';

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  // Update sessionStorage whenever formData changes
  useEffect(() => {
    if (formData && formData.fields) {
      // Update sessionStorage for preview
      sessionStorage.setItem('formPreviewData', JSON.stringify(formData));
    }
  }, [formData]);

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

  const handleUpdateField = (fieldId, updates) => {
    if (fieldId === 'title' || fieldId === 'description' || fieldId === 'gridColumns') {
      setFormData(prev => ({
        ...prev,
        [fieldId]: updates
      }));
    } else if (fieldId === 'fields') {
      setFormData(prev => {
        // Update position values to reflect the new array order
        const gridColumns = prev.gridColumns || 2;
        const updatedFields = updates.map((field, index) => ({
          ...field,
          position: {
            row: Math.floor(index / gridColumns),
            col: index % gridColumns
          }
        }));
        
        return {
          ...prev,
          fields: updatedFields
        };
      });
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
    setFormData(prev => {
      const remainingFields = prev.fields.filter(field => field.id !== fieldId);
      
      // Update position values to reflect the new array order after deletion
      const gridColumns = prev.gridColumns || 2;
      const updatedFields = remainingFields.map((field, index) => ({
        ...field,
        position: {
          row: Math.floor(index / gridColumns),
          col: index % gridColumns
        }
      }));
      
      return {
        ...prev,
        fields: updatedFields
      };
    });
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
      
      // Update position values to reflect the new array order
      const gridColumns = prev.gridColumns || 2;
      const updatedFields = fields.map((field, index) => ({
        ...field,
        position: {
          row: Math.floor(index / gridColumns),
          col: index % gridColumns
        }
      }));
      
      return { ...prev, fields: updatedFields };
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
            variant="outlined"
            startIcon={<Preview />}
            onClick={() => {
              try {
                // Create a temporary form data object for preview
                const previewData = {
                  ...formData,
                  title: formData.title || 'Form Preview',
                  description: formData.description || '',
                  gridColumns: formData.gridColumns || 2
                };
                
                // Ensure all field data is serializable
                const serializableData = {
                  ...previewData,
                  fields: (previewData.fields || []).map(field => {
                    try {
                      return {
                        ...field,
                        // Ensure any complex objects are converted to strings
                        defaultValue: field.defaultValue ? String(field.defaultValue) : '',
                        options: Array.isArray(field.options) ? field.options : [],
                        columns: Array.isArray(field.columns) ? field.columns : [],
                        steps: Array.isArray(field.steps) ? field.steps : []
                      };
                    } catch (fieldError) {
                      console.warn('Error processing field:', fieldError, field);
                      // Return a safe fallback field
                      return {
                        id: field.id || `field_${Math.random().toString(36).substring(2, 11)}`,
                        type: field.type || 'text',
                        label: field.label || 'Field',
                        required: false
                      };
                    }
                  })
                };
                
                // Store in sessionStorage for preview
                sessionStorage.setItem('formPreviewData', JSON.stringify(serializableData));
                
                // Open preview in new tab
                window.open('/form-preview', '_blank');
              // eslint-disable-next-line no-shadow
              } catch (error) {
                console.error('Error preparing preview data:', String(error));
                alert('Unable to preview form. Please try again.');
              }
            }}
          >
            Preview Form
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
      
      {/* Form Builder */}
      <FormBuilder
        formData={formData}
        onUpdateField={handleUpdateField}
        onDeleteField={handleDeleteField}
        onMoveField={handleMoveField}
        onSelectField={setSelectedField}
        selectedField={selectedField}
        onSave={handleSaveForm}
        onFieldReorder={(dragIndex, hoverIndex) => {
          // Handle field reordering and update sessionStorage
          const fields = [...formData.fields];
          const draggedField = fields[dragIndex];
          fields.splice(dragIndex, 1);
          fields.splice(hoverIndex, 0, draggedField);

          const newFormData = { ...formData, fields };
          setFormData(newFormData);

          // Update sessionStorage immediately
          sessionStorage.setItem('formPreviewData', JSON.stringify(newFormData));
        }}
      />
    </Container>
  );
} 