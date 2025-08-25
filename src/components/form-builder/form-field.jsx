import dayjs from 'dayjs';
import { useState } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link, Create, AttachFile } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Radio,
  Table,
  Button,
  Select,
  Checkbox,
  MenuItem,
  TableRow,
  FormLabel,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  InputLabel,
  RadioGroup,
  Typography,
  FormControl,
  TableContainer,
  FormControlLabel
} from '@mui/material';

export default function FormField({ field, isPreview = false, value, onChange }) {
  const [signature, setSignature] = useState('');

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            fullWidth
            required={field.required}
            disabled={isPreview}
          />
        );
      
      case 'textarea':
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            fullWidth
            multiline
            rows={field.rows || 4}
            required={field.required}
            disabled={isPreview}
          />
        );
      
      case 'radio':
        return (
          <FormControl component="fieldset" required={field.required}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange && onChange(e.target.value)}
            >
              {field.options && field.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={isPreview}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      
      case 'checkbox':
        return (
          <FormControl component="fieldset" required={field.required}>
            <FormLabel component="legend">{field.label}</FormLabel>
            {field.options && field.options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      if (onChange) {
                        const currentValue = Array.isArray(value) ? value : [];
                        if (e.target.checked) {
                          onChange([...currentValue, option]);
                        } else {
                          onChange(currentValue.filter(item => item !== option));
                        }
                      }
                    }}
                    disabled={isPreview}
                  />
                }
                label={option}
              />
            ))}
          </FormControl>
        );
      
      case 'dropdown':
        return (
          <FormControl fullWidth required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => onChange && onChange(e.target.value)}
              disabled={isPreview}
            >
              {field.options && field.options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'number':
        return (
          <TextField
            label={field.label}
            type="number"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            fullWidth
            required={field.required}
            inputProps={{
              min: field.min,
              max: field.max
            }}
            disabled={isPreview}
          />
        );
      
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={field.label}
              value={value ? dayjs(value) : null}
              onChange={(newValue) => onChange && onChange(newValue ? newValue.format('YYYY-MM-DD') : '')}
              disabled={isPreview}
              renderInput={(params) => <TextField {...params} fullWidth required={field.required} />}
            />
          </LocalizationProvider>
        );
      
      case 'attachment':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {field.label}
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFile />}
              disabled={isPreview}
            >
              {isPreview ? 'File Upload' : 'Choose File'}
              <input
                type="file"
                hidden
                multiple={field.multiple}
                accept={field.accept}
                onChange={(e) => {
                  if (onChange && e.target.files) {
                    onChange(Array.from(e.target.files));
                  }
                }}
              />
            </Button>
            {field.multiple && (
              <Typography variant="caption" sx={{ ml: 1 }}>
                Multiple files allowed
              </Typography>
            )}
          </Box>
        );
      
      case 'link':
        return (
          <TextField
            label={field.label}
            type="url"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            fullWidth
            required={field.required}
            disabled={isPreview}
            InputProps={{
              startAdornment: <Link sx={{ mr: 1, color: 'action.active' }} />
            }}
          />
        );
      
      case 'table':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {field.label}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {field.columns && field.columns.map((column, index) => (
                      <TableCell key={index}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: field.rows || 3 }, (_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {field.columns && field.columns.map((column, colIndex) => (
                        <TableCell key={colIndex}>
                          <TextField
                            size="small"
                            placeholder={`Enter ${column}`}
                            disabled={isPreview}
                            onChange={(e) => {
                              if (onChange) {
                                const currentValue = value || {};
                                const key = `${rowIndex}-${colIndex}`;
                                onChange({
                                  ...currentValue,
                                  [key]: e.target.value
                                });
                              }
                            }}
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
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            fullWidth
            multiline
            rows={6}
            required={field.required}
            disabled={isPreview}
            helperText="Rich text editor - supports basic formatting"
          />
        );
      
      case 'signature':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {field.label}
            </Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                textAlign: 'center',
                minHeight: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isPreview ? 'default' : 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => {
                if (!isPreview && onChange) {
                  // In a real app, this would open a signature pad
                  const signatureText = prompt('Enter signature (or draw in signature pad):');
                  if (signatureText) {
                    setSignature(signatureText);
                    onChange(signatureText);
                  }
                }
              }}
            >
              {signature ? (
                <Typography variant="body1" sx={{ fontFamily: 'cursive' }}>
                  {signature}
                </Typography>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Create sx={{ fontSize: 40, color: 'action.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {isPreview ? 'No signature' : 'Click to add signature'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        );
      
      default:
        return (
          <Typography color="error">
            Unknown field type: {field.type}
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      {renderField()}
    </Box>
  );
} 