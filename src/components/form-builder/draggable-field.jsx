import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import {
  Box,
  Chip,
  Paper,
  Stack,
  Divider,
  Typography,
  IconButton
} from '@mui/material';
import {
  Link,
  Draw,
  Delete,
  Subject,
  CheckBox,
  LooksOne,
  TextFields,
  AttachFile,
  TableChart,
  Description,
  ViewTimeline,
  DragIndicator,
  ArrowDropDown,
  CalendarToday,
  KeyboardArrowUp,
  KeyboardArrowDown,
  RadioButtonChecked
} from '@mui/icons-material';

const ItemTypes = {
  FIELD: 'field'
};

const fieldIcons = {
  text: TextFields,
  textarea: Subject,
  radio: RadioButtonChecked,
  checkbox: CheckBox,
  dropdown: ArrowDropDown,
  number: LooksOne,
  date: CalendarToday,
  attachment: AttachFile,
  link: Link,
  table: TableChart,
  richtext: Description,
  signature: Draw,
  wizard: ViewTimeline
};

export default function DraggableField({
  field,
  index,
  isSelected,
  onSelect,
  onDelete,
  onMove,
  onReorder,
  canMoveUp,
  canMoveDown
}) {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FIELD,
    item: { type: ItemTypes.FIELD, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.FIELD,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onReorder(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleSelect = () => {
    onSelect(field);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(field.id);
  };

  const handleMoveUp = (e) => {
    e.stopPropagation();
    onMove(field.id, 'up');
  };

  const handleMoveDown = (e) => {
    e.stopPropagation();
    onMove(field.id, 'down');
  };

  const FieldIcon = fieldIcons[field.type] || TextFields;

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Text Input'}
            </Typography>
            <Box
              sx={{
                height: 40,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary'
              }}
            >
              {field.placeholder || 'Enter text...'}
            </Box>
          </Box>
        );

      case 'textarea':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Text Area'}
            </Typography>
            <Box
              sx={{
                height: (field.rows || 4) * 20,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 2,
                py: 1,
                color: 'text.secondary'
              }}
            >
              {field.placeholder || 'Enter text...'}
            </Box>
          </Box>
        );

      case 'radio':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Radio Buttons'}
            </Typography>
            <Stack spacing={1}>
              {(field.options || ['Option 1', 'Option 2', 'Option 3']).map((option, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid', borderColor: 'primary.main' }} />
                  <Typography variant="body2">{option}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        );

      case 'checkbox':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Checkboxes'}
            </Typography>
            <Stack spacing={1}>
              {(field.options || ['Option 1', 'Option 2', 'Option 3']).map((option, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, border: '2px solid', borderColor: 'primary.main' }} />
                  <Typography variant="body2">{option}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        );

      case 'dropdown':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Dropdown'}
            </Typography>
            <Box
              sx={{
                height: 40,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'text.secondary'
              }}
            >
              <span>Select an option...</span>
              <ArrowDropDown />
            </Box>
          </Box>
        );

      case 'number':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Number'}
            </Typography>
            <Box
              sx={{
                height: 40,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary'
              }}
            >
              {field.placeholder || 'Enter number...'}
            </Box>
          </Box>
        );

      case 'date':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Date'}
            </Typography>
            <Box
              sx={{
                height: 40,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary'
              }}
            >
              Select date...
            </Box>
          </Box>
        );

      case 'attachment':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'File Upload'}
            </Typography>
            <Box
              sx={{
                minHeight: 100,
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                backgroundColor: 'grey.50',
                p: 2
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'primary.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1
                  }}
                >
                  <AttachFile sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  Drop files here or click to browse
                </Typography>
                {field.accept && (
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    mt: 0.5,
                    color: 'text.secondary',
                    backgroundColor: 'background.paper',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    {field.accept}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        );

      case 'link':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Link'}
            </Typography>
            <Box
              sx={{
                height: 40,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary'
              }}
            >
              {field.placeholder || 'https://example.com'}
            </Box>
          </Box>
        );

      case 'table':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Table'}
            </Typography>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${(field.columns || ['Column 1', 'Column 2']).length}, 1fr)`, bgcolor: 'grey.100' }}>
                {(field.columns || ['Column 1', 'Column 2']).map((col, idx) => (
                  <Box key={idx} sx={{ p: 1, borderRight: idx < (field.columns?.length || 2) - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                    <Typography variant="caption" fontWeight={500}>{col}</Typography>
                  </Box>
                ))}
              </Box>
              {Array.from({ length: Math.min(field.rows || 3, 3) }).map((rowItem, rowIdx) => (
                <Box key={rowIdx} sx={{ display: 'grid', gridTemplateColumns: `repeat(${(field.columns || ['Column 1', 'Column 2']).length}, 1fr)`, borderTop: '1px solid', borderColor: 'divider' }}>
                  {(field.columns || ['Column 1', 'Column 2']).map((colItem, colIdx) => (
                    <Box key={colIdx} sx={{ p: 1, borderRight: colIdx < (field.columns?.length || 2) - 1 ? '1px solid' : 'none', borderColor: 'divider', height: 32 }} />
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        );

      case 'richtext':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Rich Text'}
            </Typography>
            <Box
              sx={{
                height: 80,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1,
                color: 'text.secondary'
              }}
            >
              {field.placeholder || 'Enter rich text...'}
            </Box>
          </Box>
        );

      case 'signature':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Signature'}
            </Typography>
            <Box
              sx={{
                width: field.width || 300,
                height: field.height || 150,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                bgcolor: 'grey.50'
              }}
            >
              <Draw sx={{ fontSize: 32, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ ml: 1 }}>Click to sign</Typography>
            </Box>
          </Box>
        );

      case 'wizard':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Multi-Step Wizard'}
            </Typography>
            <Stack spacing={1}>
              {(field.steps || ['Step 1', 'Step 2', 'Step 3']).map((step, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{idx + 1}</Typography>
                  </Box>
                  <Typography variant="body2">{typeof step === 'string' ? step : step.title}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        );

      default:
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Unknown field type: {field.type}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <div ref={drop}>
      <Paper
        ref={drag}
        sx={{
          p: 2,
          cursor: 'grab',
          opacity: isDragging ? 0.5 : 1,
          border: '2px solid',
          borderColor: isSelected ? 'primary.main' : isOver ? 'primary.light' : 'transparent',
          bgcolor: isSelected ? 'primary.light' : 'background.paper',
          '&:active': { cursor: 'grabbing' },
          transition: 'all 0.2s ease'
        }}
        onClick={handleSelect}
      >
        {/* Field Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIndicator sx={{ color: 'text.secondary', cursor: 'grab' }} />
            <FieldIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle2" fontWeight={500}>
              {field.label || 'Untitled Field'}
            </Typography>
            <Chip 
              label={field.type} 
              size="small" 
              variant="outlined" 
              sx={{ textTransform: 'capitalize' }}
            />
            {field.required && (
              <Chip 
                label="Required" 
                size="small" 
                color="error" 
                variant="outlined"
              />
            )}
          </Box>
          
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={handleMoveUp}
              disabled={!canMoveUp}
              sx={{ opacity: canMoveUp ? 1 : 0.3 }}
            >
              <KeyboardArrowUp />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleMoveDown}
              disabled={!canMoveDown}
              sx={{ opacity: canMoveDown ? 1 : 0.3 }}
            >
              <KeyboardArrowDown />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDelete}
              color="error"
            >
              <Delete />
            </IconButton>
          </Stack>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Field Preview */}
        {renderFieldPreview()}
      </Paper>
    </div>
  );
} 