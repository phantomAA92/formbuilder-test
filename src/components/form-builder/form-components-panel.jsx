import { Box, List, Divider, ListItem, Typography, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { 
  Link, 
  Create, 
  Subject, 
  CheckBox, 
  LooksOne, 
  AttachFile, 
  TableChart, 
  TextFields, 
  Description, 
  ArrowDropDown, 
  CalendarToday, 
  RadioButtonChecked 
} from '@mui/icons-material';

const formComponents = [
  { type: 'text', label: 'Text Input', icon: TextFields, description: 'Single line text input' },
  { type: 'textarea', label: 'Text Area', icon: Subject, description: 'Multi-line text input' },
  { type: 'radio', label: 'Radio Buttons', icon: RadioButtonChecked, description: 'Single choice selection' },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckBox, description: 'Multiple choice selection' },
  { type: 'dropdown', label: 'Dropdown', icon: ArrowDropDown, description: 'Select from options' },
  { type: 'number', label: 'Number Input', icon: LooksOne, description: 'Numeric input field' },
  { type: 'date', label: 'Date Picker', icon: CalendarToday, description: 'Date selection' },
  { type: 'attachment', label: 'File Upload', icon: AttachFile, description: 'File attachment' },
  { type: 'link', label: 'Link Input', icon: Link, description: 'URL input field' },
  { type: 'table', label: 'Table', icon: TableChart, description: 'Data table input' },
  { type: 'richtext', label: 'Rich Text', icon: Description, description: 'Rich text editor' },
  { type: 'signature', label: 'Signature', icon: Create, description: 'Digital signature' }
];

export default function FormComponentsPanel({ onAddField }) {
  const handleAddComponent = (componentType) => {
    const defaultData = getDefaultFieldData(componentType);
    onAddField(componentType, defaultData);
  };

  const getDefaultFieldData = (type) => {
    switch (type) {
      case 'text':
        return { label: 'Text Input', placeholder: 'Enter text...', required: false };
      case 'textarea':
        return { label: 'Text Area', placeholder: 'Enter text...', rows: 4, required: false };
      case 'radio':
        return { label: 'Radio Buttons', options: ['Option 1', 'Option 2', 'Option 3'], required: false };
      case 'checkbox':
        return { label: 'Checkboxes', options: ['Option 1', 'Option 2', 'Option 3'], required: false };
      case 'dropdown':
        return { label: 'Dropdown', options: ['Option 1', 'Option 2', 'Option 3'], required: false };
      case 'number':
        return { label: 'Number', placeholder: 'Enter number...', min: 0, max: 999999, required: false };
      case 'date':
        return { label: 'Date', required: false };
      case 'attachment':
        return { label: 'File Upload', accept: '.pdf,.doc,.docx,.jpg,.png', multiple: false, required: false };
      case 'link':
        return { label: 'Link', placeholder: 'https://example.com', required: false };
      case 'table':
        return { label: 'Table', columns: ['Column 1', 'Column 2'], rows: 3, required: false };
      case 'richtext':
        return { label: 'Rich Text', placeholder: 'Enter rich text...', required: false };
      case 'signature':
        return { label: 'Signature', required: false };
      default:
        return { label: 'New Field', required: false };
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Form Components
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Click to add components to your form
      </Typography>
      
      <List sx={{ p: 0 }}>
        {formComponents.map((component, index) => (
          <Box key={component.type}>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleAddComponent(component.type)}
                sx={{ 
                  borderRadius: 1, 
                  mb: 1,
                  '&:hover': { 
                    backgroundColor: 'primary.light', 
                    color: 'primary.contrastText' 
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <component.icon />
                </ListItemIcon>
                <ListItemText 
                  primary={component.label}
                  secondary={component.description}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItemButton>
            </ListItem>
            {index < formComponents.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Box>
  );
} 