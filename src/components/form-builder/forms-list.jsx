import { useState, useEffect } from 'react';

import {
  Add,
  ContentCopy,
  Delete,
  Download,
  Edit,
  Search
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

import { LocalFormService } from '../../services/form-service';

export default function FormsList({ onEditForm, onViewForm, onDeleteForm }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, form: null });

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const formsData = LocalFormService.getForms();
      setForms(formsData);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryFilter = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handleDeleteClick = (form) => {
    setDeleteDialog({ open: true, form });
  };

  const handleDeleteConfirm = async () => {
    try {
      await LocalFormService.deleteForm(deleteDialog.form.id);
      setForms(forms.filter(f => f.id !== deleteDialog.form.id));
      setDeleteDialog({ open: false, form: null });
      if (onDeleteForm) {
        onDeleteForm(deleteDialog.form.id);
      }
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  const handleCloneForm = async (form) => {
    try {
      const clonedForm = {
        ...form,
        title: `${form.title} (Copy)`,
        description: `${form.description} - Cloned from original`
      };
      
      const savedForm = LocalFormService.saveForm(clonedForm);
      setForms([...forms, savedForm]);
    } catch (error) {
      console.error('Error cloning form:', error);
    }
  };

  const handleExportForm = (form) => {
    try {
      const formData = JSON.stringify(form, null, 2);
      const blob = new Blob([formData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.title.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting form:', error);
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || form.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(forms.map(form => form.category).filter(Boolean))];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Custom Forms
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => onEditForm && onEditForm()}
        >
          Create New Form
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search forms..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ flex: 1 }}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={handleCategoryFilter}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Forms Table */}
      {filteredForms.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Form Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Fields</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {form.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                      {form.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {form.category && (
                      <Chip label={form.category} size="small" color="primary" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {form.fields ? form.fields.length : 0} fields
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Form">
                        <IconButton
                          size="small"
                          onClick={() => onViewForm && onViewForm(form)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Form">
                        <IconButton
                          size="small"
                          onClick={() => onEditForm && onEditForm(form)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Clone Form">
                        <IconButton
                          size="small"
                          onClick={() => handleCloneForm(form)}
                        >
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Export Form">
                        <IconButton
                          size="small"
                          onClick={() => handleExportForm(form)}
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Form">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(form)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No forms found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search criteria or filters.'
              : 'Create your first custom form to get started.'}
          </Typography>
          {!searchTerm && categoryFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => onEditForm && onEditForm()}
            >
              Create New Form
            </Button>
          )}
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, form: null })}>
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.form?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, form: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 