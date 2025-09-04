import { useDrag } from 'react-dnd';

import { Box, List, Divider, ListItem, Typography, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { 
  Link, 
  Draw, 
  Email,
  Title, 
  Phone, 
  Subject,
  CheckBox, 
  LooksOne, 
  AttachFile,
  TableChart, 
  TextFields, 
  Description,
  ViewTimeline,
  ArrowDropDown,
  CalendarToday,
  HorizontalRule,
  RadioButtonChecked,
  Calculate
} from '@mui/icons-material';

const ItemTypes = {
  COMPONENT: 'component'
};

const formComponents = [
  { type: 'text', label: 'Text Input', icon: TextFields, description: 'Single line text input' },
  { type: 'email', label: 'Email Input', icon: Email, description: 'Email address input' },
  { type: 'phone', label: 'Phone Number', icon: Phone, description: 'Telephone input' },
  { type: 'textarea', label: 'Text Area', icon: Subject, description: 'Multi-line text input' },
  { type: 'radio', label: 'Radio Buttons', icon: RadioButtonChecked, description: 'Single choice selection' },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckBox, description: 'Multiple choice selection' },
  { type: 'dropdown', label: 'Dropdown', icon: ArrowDropDown, description: 'Select from options' },
  { type: 'number', label: 'Number Input', icon: LooksOne, description: 'Numeric input field' },
  { type: 'calculated', label: 'Calculated', icon: Calculate, description: 'Auto-calculated from other fields' },
  { type: 'date', label: 'Date Picker', icon: CalendarToday, description: 'Date selection' },
  { type: 'attachment', label: 'File Upload', icon: AttachFile, description: 'File attachment' },
  { type: 'link', label: 'Link Input', icon: Link, description: 'URL input field' },
  { type: 'table', label: 'Table', icon: TableChart, description: 'Data table input' },
  { type: 'richtext', label: 'Rich Text', icon: Description, description: 'Rich text editor' },
  { type: 'label', label: 'Label', icon: Title, description: 'Static text or heading' },
  { type: 'divider', label: 'Divider', icon: HorizontalRule, description: 'Visual separator' },
  { type: 'signature', label: 'Signature', icon: Draw, description: 'Digital signature capture' },
  { type: 'wizard', label: 'Multi-Step Wizard', icon: ViewTimeline, description: 'Multi-step form wizard' }
];

function DraggableComponent({ component, onAddField }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COMPONENT,
    item: () => {
      const defaultData = getDefaultFieldData(component.type);
      return { 
        type: ItemTypes.COMPONENT, 
        componentType: component.type, 
        defaultData 
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = () => {
    const defaultData = getDefaultFieldData(component.type);
    onAddField(component.type, defaultData);
  };

  const getDefaultFieldData = (type) => {
    switch (type) {
      case 'text':
        return { label: 'Text Input', placeholder: 'Enter text...', required: false };
      case 'email':
        return { label: 'Email Input', placeholder: 'Enter email address...', required: false };
      case 'phone':
        return { label: 'Phone Number', placeholder: 'e.g., +1 (555) 123-4567', pattern: '^\\+?[0-9\\s()-]{7,20}$', errorMessage: 'Enter a valid phone number', required: false };
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
      case 'calculated':
        return { label: 'Calculated', expression: '{field_a} + {field_b}', decimals: 2, prefix: '', suffix: '', displayType: 'number', dateFormat: 'MM/DD/YYYY', required: false };
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
      case 'label':
        return { label: 'Section Title', variant: 'h6', align: 'left', required: false };
      case 'divider':
        return { label: '', variant: 'fullWidth', textAlign: 'center', orientation: 'horizontal', lineStyle: 'dotted', lineColor: '#bdbdbd', lineThickness: 1, required: false };
      case 'signature':
        return { label: 'Signature', width: 300, height: 150, penColor: '#000000', required: false };
      case 'wizard':
        return { 
          label: 'Multi-Step Wizard', 
          steps: [
            { 
              title: 'Basic Information', 
              description: 'Provide essential personal details including name, contact information, and address. This step collects the fundamental information needed to identify and contact the caregiver.',
              fields: [] 
            },
            { 
              title: 'Professional Details', 
              description: 'Collect professional qualifications, experience, availability, and work preferences. This step gathers information about the caregiver\'s professional background and work schedule.',
              fields: [] 
            },
            { 
              title: 'Documents & Certifications', 
              description: 'Upload required documents and certifications including CV, background checks, and training certificates. This step ensures all necessary documentation is provided.',
              fields: [] 
            }
          ], 
          required: false 
        };
      default:
        return { label: 'New Field', required: false };
    }
  };

  return (
    <ListItem disablePadding>
      <ListItemButton 
        ref={drag}
        onClick={handleClick}
        sx={{ 
          borderRadius: 1, 
          mb: 1,
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
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
  );
}

export default function FormComponentsPanel({ onAddField }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Form Components
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Click to add or drag to drop components
      </Typography>
      
      <List sx={{ p: 0 }}>
        {formComponents.map((component, index) => (
          <Box key={component.type}>
            <DraggableComponent 
              component={component} 
              onAddField={onAddField} 
            />
            {index < formComponents.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Box>
  );
} 