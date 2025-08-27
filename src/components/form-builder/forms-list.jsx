import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

import {
  Add,
  Edit,
  Delete,
  Download,
  Visibility
} from '@mui/icons-material';
import {
  Box,
  Card,
  Grid,
  Chip,
  Alert,
  Stack,
  Button,
  Dialog,
  Divider,
  Typography,
  IconButton,
  CardContent,
  CardActions,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';

import FormService, { mockForms } from '../../lib/form-service';

export default function FormsList() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, form: null });

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let formsData;
      console.log('✌️import.meta.env.MODE --->', import.meta.env.MODE);
      if (import.meta.env.MODE === 'development') {
        formsData = mockForms;
      } else {
        formsData = await FormService.getForms();
      }
      
             // Sanitize and validate the forms data
      //  const sanitizedForms = (formsData || []).map(form => {
      //    try {
      //      // Ensure we have a safe form object with only primitive values
      //      const safeForm = {
      //        id: String(form?.id || `form_${Math.random().toString(36).substring(2, 11)}`),
      //        title: String(form?.title || 'Untitled Form'),
      //        description: String(form?.description || ''),
      //        type: String(form?.type || 'custom'),
      //        fields: Array.isArray(form?.fields) ? form.fields : [],
      //        createdAt: String(form?.createdAt || new Date().toISOString()),
      //        updatedAt: String(form?.updatedAt || new Date().toISOString())
      //      };
           
      //      return safeForm;
      //    } catch (formError) {
      //      console.warn('Error processing form:', String(formError));
      //      // Return a safe fallback form
      //      return {
      //        id: `form_${Math.random().toString(36).substring(2, 11)}`,
      //        title: 'Corrupted Form',
      //        description: 'This form has corrupted data',
      //        type: 'custom',
      //        fields: [],
      //        createdAt: new Date().toISOString(),
      //        updatedAt: new Date().toISOString()
      //      };
      //    }
      //  });
      const sanitizedForms = []
      
      setForms(sanitizedForms);
    } catch (loadError) {
      console.error('Error loading forms:', String(loadError));
      setError('Failed to load forms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async () => {
    if (!deleteDialog.form) return;
    
    try {
      if (import.meta.env.MODE !== 'development') {
        await FormService.deleteForm(deleteDialog.form.id);
      }
      
      setForms(prev => prev.filter(form => form.id !== deleteDialog.form.id));
      setDeleteDialog({ open: false, form: null });
    } catch (deleteError) {
      console.error('Error deleting form:', String(deleteError));
      setError('Failed to delete form. Please try again.');
    }
  };

  const handleExportForm = async (formId, format = 'pdf') => {
    try {
      if (import.meta.env.MODE !== 'development') {
        const blob = await FormService.exportFormData(formId, format);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `form-${formId}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // In development, just show a message
        alert('Export functionality is available in production mode');
      }
    } catch (exportError) {
      console.error('Error exporting form:', String(exportError));
      setError('Failed to export form. Please try again.');
    }
  };



  const getFormTypeLabel = (type) => {
    switch (type) {
      case 'profile':
        return 'Profile Form';
      case 'custom':
        return 'Custom Form';
      default:
        return 'Form';
    }
  };

  const getFormTypeColor = (type) => {
    switch (type) {
      case 'profile':
        return 'secondary';
      case 'custom':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          Forms Library
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/custom-form')}
          size="large"
        >
          Create New Form
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Forms Grid */}
      {forms.length > 0 ? (
        <Grid container spacing={3}>
          {forms.map((form) => {
            try {
                             // Ensure form has all required properties with safe string conversion
               const safeForm = {
                 id: String(form?.id || `form_${Math.random().toString(36).substring(2, 11)}`),
                 title: String(form?.title || 'Untitled Form'),
                 description: String(form?.description || ''),
                 type: String(form?.type || 'custom'),
                 fields: Array.isArray(form?.fields) ? form.fields : []
               };
              
              return (
                <Grid item xs={12} sm={6} md={4} key={safeForm.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Chip
                          label={getFormTypeLabel(safeForm.type)}
                          color={getFormTypeColor(safeForm.type)}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {safeForm.fields.length || 0} fields
                        </Typography>
                      </Box>
                      
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {safeForm.title}
                      </Typography>
                      
                      {safeForm.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {safeForm.description}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {safeForm.fields.slice(0, 3).map((field, index) => {
                          try {
                            const fieldType = field?.type || 'unknown';
                            return (
                              <Chip
                                key={`${safeForm.id}_field_${index}`}
                                label={fieldType}
                                size="small"
                                variant="outlined"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            );
                                                     } catch (fieldError) {
                             console.warn('Error rendering field:', String(fieldError));
                             return (
                              <Chip
                                key={`${safeForm.id}_field_${index}`}
                                label="unknown"
                                size="small"
                                variant="outlined"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            );
                          }
                        })}
                        {safeForm.fields.length > 3 && (
                          <Chip
                            label={`+${safeForm.fields.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </CardContent>

                    <Divider />
                    
                    <CardActions sx={{ p: 2, pt: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => navigate(`/form-view/${safeForm.id}`)}
                          variant="outlined"
                          sx={{ flex: 1 }}
                        >
                          View
                        </Button>
                        
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => navigate(`/custom-form/${safeForm.id}`)}
                          variant="outlined"
                          sx={{ flex: 1 }}
                        >
                          Edit
                        </Button>
                      </Stack>
                    </CardActions>

                    <Box sx={{ p: 2, pt: 0 }}>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => handleExportForm(safeForm.id, 'pdf')}
                          title="Export as PDF"
                        >
                          <Download />
                        </IconButton>
                        

                        
                        <IconButton
                          size="small"
                          onClick={() => setDeleteDialog({ open: true, form: safeForm })}
                          color="error"
                          title="Delete Form"
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Card>
                </Grid>
              );
                         } catch (formError) {
               console.error('Error rendering form:', String(formError));
               // Return a fallback card for corrupted forms
              return (
                                 <Grid item xs={12} sm={6} md={4} key={`error_${Math.random().toString(36).substring(2, 11)}`}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                        Corrupted Form
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This form could not be displayed due to data corruption.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center' }}>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => {
                          try {
                            // Try to remove the corrupted form
                            setForms(prev => prev.filter(f => f.id !== form.id));
                                                     } catch (removeError) {
                             console.error('Error removing corrupted form:', String(removeError));
                           }
                        }}
                      >
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            }
          })}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No forms created yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start building your first custom form to create profiles and more.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/custom-form')}
            size="large"
          >
            Create Your First Form
          </Button>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, form: null })}
      >
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteDialog.form?.title || 'this form'}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, form: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteForm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 