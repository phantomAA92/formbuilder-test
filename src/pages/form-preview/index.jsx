import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

import { ArrowBack } from '@mui/icons-material';
import { Box, Alert, Button, Container, Typography, CircularProgress } from '@mui/material';

import FormRenderer from '../../components/form-builder/form-renderer';

export default function FormPreviewPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadPreviewData();
  }, []);

  const loadPreviewData = () => {
    try {
      const previewData = sessionStorage.getItem('formPreviewData');
      if (previewData) {
        const parsedData = JSON.parse(previewData);
        
        // Validate and sanitize the parsed data
        if (parsedData && typeof parsedData === 'object') {
          const gridCols = parsedData.gridColumns || 2;
          // Build sanitized fields with non-overlapping placement
          const sanitizedFields = [];
          const occupied = new Map(); // row -> boolean[]
          const isCellFree = (row, col) => {
            const rowOcc = occupied.get(row) || [];
            return !rowOcc[col];
          };
          const markOccupied = (row, startCol, span) => {
            const rowOcc = occupied.get(row) || [];
            for (let i = 0; i < span; i += 1) {
              rowOcc[startCol + i] = true;
            }
            occupied.set(row, rowOcc);
          };
          const findPlacement = (desiredRow, desiredCol, span) => {
            let row = Math.max(0, Number.isFinite(desiredRow) ? desiredRow : 0);
            let col = Math.max(0, Number.isFinite(desiredCol) ? desiredCol : 0);
            let attempts = 0;
            const maxAttempts = 1000;
            while (attempts < maxAttempts) {
              // Clamp col within bounds for span
              if (col + span > gridCols) {
                col = 0;
                row += 1;
                attempts += 1;
                continue;
              }
              // Check overlap
              let fits = true;
              for (let i = 0; i < span; i += 1) {
                if (!isCellFree(row, col + i)) {
                  fits = false;
                  break;
                }
              }
              if (fits) {
                return { row, col };
              }
              // Try next column; if exceeds, wrap to next row
              col += 1;
              if (col + span > gridCols) {
                col = 0;
                row += 1;
              }
              attempts += 1;
            }
            // Fallback
            return { row: Math.max(0, desiredRow || 0), col: 0 };
          };

          if (Array.isArray(parsedData.fields)) {
            parsedData.fields.forEach((field, idx) => {
              const rawSpan = field?.gridSpan ?? 1;
              const safeSpan = Math.max(1, Math.min(gridCols, Number(rawSpan) || 1));
              const hasPos = field && typeof field === 'object' && field.position && typeof field.position === 'object';
              const desiredRow = hasPos && Number.isFinite(field.position.row) ? field.position.row : Math.floor(idx / gridCols);
              const desiredCol = hasPos && Number.isFinite(field.position.col) ? field.position.col : idx % gridCols;
              const { row: placedRow, col: placedCol } = findPlacement(desiredRow, desiredCol, safeSpan);
              markOccupied(placedRow, placedCol, safeSpan);

              sanitizedFields.push({
                ...field,
                id: field.id || `field_${Math.random().toString(36).substring(2, 11)}`,
                label: field.type === 'divider' ? (field.label || '') : (field.label || 'Field'),
                type: field.type || 'text',
                required: !!field.required,
                placeholder: field.placeholder || '',
                options: Array.isArray(field.options) ? field.options : [],
                columns: Array.isArray(field.columns) ? field.columns : [],
                steps: Array.isArray(field.steps) ? field.steps : [],
                gridSpan: safeSpan,
                position: { row: placedRow, col: placedCol }
              });
            });
          }

          const sanitizedData = {
            id: parsedData.id || 'preview',
            title: parsedData.title || 'Form Preview',
            description: parsedData.description || '',
            type: parsedData.type || 'custom',
            gridColumns: gridCols,
            fields: sanitizedFields
          };
          
          setFormData(sanitizedData);
        } else {
          throw new Error('Invalid preview data format');
        }
      } else {
        setError('No preview data available. Please return to the form builder.');
      }
    } catch (loadError) {
      console.error('Error loading preview data:', String(loadError));
      setError('Failed to load preview data. Please return to the form builder.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formValues) => {
    try {
      setSubmitting(true);
      setError(null);
      
      // In preview mode, just log the submission and show success
      console.log('Form preview submitted:', {
        formData: formValues,
        timestamp: new Date().toISOString()
      });
      
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Form preview submitted successfully! This is a preview - no actual data was saved.');
      
      // Clear preview data after successful submission
      sessionStorage.removeItem('formPreviewData');
      
    } catch (submitError) {
      console.error('Error submitting preview form:', String(submitError));
      setError('Failed to submit form preview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={48 } />
          <Typography variant="h6">Loading form preview...</Typography>
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
            onClick={() => navigate('/custom-form')}
            startIcon={<ArrowBack />}
          >
            Back to Form Builder
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
            No preview data available
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/custom-form')}
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Back to Form Builder
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {formData.title} - Preview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is a preview of how your form will appear to users
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/custom-form')}
        >
          Back to Builder
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
