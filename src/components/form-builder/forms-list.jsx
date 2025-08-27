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
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
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
      const sanitizedForms = (formsData || []).map(form => {
        try {
          // Ensure we have a safe form object with only primitive values
          const safeForm = {
            id: String(form?.id || `form_${Math.random().toString(36).substring(2, 11)}`),
            title: String(form?.title || 'Untitled Form'),
            description: String(form?.description || ''),
            type: String(form?.type || 'custom'),
            fields: Array.isArray(form?.fields) ? form.fields : [],
            createdAt: String(form?.createdAt || new Date().toISOString()),
            updatedAt: String(form?.updatedAt || new Date().toISOString())
          };
           
          return safeForm;
        } catch (formError) {
          console.warn('Error processing form:', String(formError));
          // Return a safe fallback form
          return {
            id: `form_${Math.random().toString(36).substring(2, 11)}`,
            title: 'Corrupted Form',
            description: 'This form has corrupted data',
            type: 'custom',
            fields: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      });
      
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

      {/* Forms Table */}
      {forms.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Form Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fields</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forms.map((form) => {
                try {
                  // Ensure form has all required properties with safe string conversion
                  const safeForm = {
                    id: String(form?.id || `form_${Math.random().toString(36).substring(2, 11)}`),
                    title: String(form?.title || 'Untitled Form'),
                    description: String(form?.description || ''),
                    type: String(form?.type || 'custom'),
                    fields: Array.isArray(form?.fields) ? form.fields : [],
                    createdAt: String(form?.createdAt || new Date().toISOString())
                  };
                  
                  return (
                    <TableRow key={safeForm.id} hover>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {safeForm.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getFormTypeLabel(safeForm.type)}
                          color={getFormTypeColor(safeForm.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                          {safeForm.description || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {safeForm.fields.length || 0} fields
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(safeForm.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/form-view/${safeForm.id}`)}
                            color="primary"
                            title="View Form"
                          >
                            <Visibility />
                          </IconButton>
                          
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/custom-form/${safeForm.id}`)}
                            color="primary"
                            title="Edit Form"
                          >
                            <Edit />
                          </IconButton>
                          
                          <IconButton
                            size="small"
                            onClick={() => handleExportForm(safeForm.id, 'pdf')}
                            color="primary"
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
                      </TableCell>
                    </TableRow>
                  );
                } catch (formError) {
                  console.error('Error rendering form:', String(formError));
                  // Return a fallback row for corrupted forms
                  return (
                    <TableRow key={`error_${Math.random().toString(36).substring(2, 11)}`}>
                      <TableCell colSpan={6}>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                            Corrupted Form
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            This form could not be displayed due to data corruption.
                          </Typography>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ ml: 2 }}
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
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
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