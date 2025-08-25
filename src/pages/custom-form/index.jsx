import { useState } from 'react';

import { Box, Paper, Container, Typography } from '@mui/material';

import { FormBuilder } from '../../components/form-builder';
import FormPreview from '../../components/form-builder/form-preview';
import FormComponentsPanel from '../../components/form-builder/form-components-panel';

export default function CustomFormPage() {
  const [formData, setFormData] = useState({
    title: 'New Form',
    description: '',
    fields: []
  });

  const [selectedField, setSelectedField] = useState(null);

  const handleAddField = (type, defaultData) => {
    const newField = {
      id: Date.now().toString(),
      type,
      ...defaultData
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const handleUpdateField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
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

  const handleSaveForm = () => {
    console.log('Form saved:', formData);
    // Here you would typically save to backend
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Custom Form Builder
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 200px)' }}>
        {/* Left Panel - Form Components */}
        <Paper sx={{ width: 300, p: 2, overflow: 'auto' }}>
          <FormComponentsPanel onAddField={handleAddField} />
        </Paper>
        
        {/* Center Panel - Form Builder */}
        <Paper sx={{ flex: 1, p: 2, overflow: 'auto' }}>
          <FormBuilder
            formData={formData}
            onUpdateField={handleUpdateField}
            onDeleteField={handleDeleteField}
            onMoveField={handleMoveField}
            onSelectField={setSelectedField}
            selectedField={selectedField}
            onSave={handleSaveForm}
          />
        </Paper>
        
        {/* Right Panel - Form Preview */}
        <Paper sx={{ width: 400, p: 2, overflow: 'auto' }}>
          <FormPreview formData={formData} />
        </Paper>
      </Box>
    </Container>
  );
} 