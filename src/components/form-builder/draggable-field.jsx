import { useState } from 'react';
import { useDrag } from 'react-dnd';

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
  KeyboardArrowLeft,
  KeyboardArrowRight,
  RadioButtonChecked,
  Title,
  HorizontalRule,
  Phone,
  Calculate
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
  calculated: Calculate,
  date: CalendarToday,
  attachment: AttachFile,
  link: Link,
  table: TableChart,
  richtext: Description,
  signature: Draw,
  wizard: ViewTimeline,
  label: Title,
  divider: HorizontalRule,
  phone: Phone
};

function getFallbackTitleByType(type) {
  const titles = {
    text: 'Text Input',
    email: 'Email Input',
    phone: 'Phone Number',
    textarea: 'Text Area',
    radio: 'Radio Buttons',
    checkbox: 'Checkboxes',
    dropdown: 'Dropdown',
    number: 'Number',
    calculated: 'Calculated',
    date: 'Date',
    attachment: 'File Upload',
    link: 'Link',
    table: 'Table',
    richtext: 'Rich Text',
    signature: 'Signature',
    wizard: 'Multi-Step Wizard',
    label: 'Label',
    divider: 'Divider'
  };
  return titles[type] || 'Untitled Field';
}

export default function DraggableField({
  field,
  index,
  isSelected,
  onSelect,
  onDelete,
  onMove,
  canMoveUp,
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  onResize,
  gridColumns,
  maxGridSpan
}) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartSpan, setResizeStartSpan] = useState(0);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FIELD,
    item: () => ({ 
        type: ItemTypes.FIELD, 
        index, 
        fieldId: field.id,
        field // Include the full field object for reference
      }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Removed drop functionality - GridCell handles the drop for repositioning
  const isOver = false; // We don't need hover state for repositioning

  const handleSelect = (e) => {
    // Only select if not dragging
    if (!isDragging) {
      onSelect(field);
    }
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

  const handleMoveLeft = (e) => {
    e.stopPropagation();
    onMove(field.id, 'left');
  };

  const handleMoveRight = (e) => {
    e.stopPropagation();
    onMove(field.id, 'right');
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    console.log('Resize started for field:', field.id, 'current span:', field.gridSpan);
    setIsResizing(true);
    setResizeStartX(e.clientX);
    setResizeStartSpan(field.gridSpan || 1);
    
    // Add global event listeners
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStartX;
    const cellWidth = 200; // Approximate cell width
    const deltaSpan = Math.round(deltaX / cellWidth);
    
    // Calculate new span with constraints
    let newSpan = Math.max(1, Math.min(maxGridSpan || gridColumns, resizeStartSpan + deltaSpan));
    
    // Ensure the field doesn't extend beyond grid boundaries
    if (field.position && field.position.col + newSpan > gridColumns) {
      newSpan = Math.max(1, gridColumns - field.position.col);
    }
    
    // Update the field's grid span in real-time
    if (onResize && newSpan !== field.gridSpan) {
      console.log('Resizing field:', field.id, 'from', field.gridSpan, 'to', newSpan);
      onResize(field.id, newSpan);
    }
  };

  const handleResizeEnd = () => {
    console.log('=== RESIZE END ===');
    console.log('Resize ended for field:', field.id, 'final span:', field.gridSpan);
    console.log('Resize start span was:', resizeStartSpan);
    setIsResizing(false);
    
    // Remove global event listeners
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  const FieldIcon = fieldIcons[field.type] || TextFields;

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
        return (
          <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>
              {field.label || 'Text Input'}
            </Typography>
            <Box
              sx={{
                height: 32,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              {field.placeholder || 'Enter text...'}
            </Box>
          </Box>
        );

      case 'email':
        return (
          <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>
              {field.label || 'Email Input'}
            </Typography>
            <Box
              sx={{
                height: 32,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              {field.placeholder || 'Enter email address...'}
            </Box>
          </Box>
        );

      case 'phone':
        return (
          <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>
              {field.label || 'Phone Number'}
            </Typography>
            <Box
              sx={{
                height: 32,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              {field.placeholder || 'e.g., +1 (555) 123-4567'}
            </Box>
          </Box>
        );

      case 'textarea':
        return (
          <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>
              {field.label || 'Text Area'}
            </Typography>
            <Box
              sx={{
                height: Math.min((field.rows || 3) * 16, 48),
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1,
                py: 0.5,
                color: 'text.secondary',
                fontSize: '0.75rem'
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

      case 'calculated':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Calculated'}
            </Typography>
            <Box
              sx={{
                height: 40,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                fontStyle: 'italic'
              }}
            >
              Auto-calculated: {field.expression || '{field_a} + {field_b}'}
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
            <Box sx={{ height: 96, border: '1px dashed', borderColor: 'divider', borderRadius: 1, px: 2, py: 1, color: 'text.secondary' }}>
              Rich text editor...
            </Box>
          </Box>
        );

      case 'signature':
        return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.label || 'Signature'}
            </Typography>
            <Box sx={{ height: 120, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }} />
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

      case 'label':
        return (
          <Box sx={{ p: 1 }}>
            <Typography variant={field.variant || 'h6'} align={field.align || 'left'}>
              {field.label || 'Section Title'}
            </Typography>
          </Box>
        );

      case 'divider':
        return (
          <Box sx={{ p: 1 }}>
            <Divider />
          </Box>
        );

      default:
        return (
          <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>
              {getFallbackTitleByType(field.type)}
            </Typography>
            <Box sx={{ height: 32, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }} />
          </Box>
        );
    }
  };

  return (
    <Paper
      ref={drag}
      onClick={handleSelect}
      variant="outlined"
      sx={{
        p: 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderWidth: isSelected ? 2 : 1,
        backgroundColor: isDragging ? 'action.hover' : 'background.paper',
        opacity: isDragging ? 0.6 : 1,
        position: 'relative',
        cursor: 'move'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <FieldIcon fontSize="small" />
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {field.label || getFallbackTitleByType(field.type)}
        </Typography>
      </Box>

      {renderFieldPreview()}

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={handleMoveUp} disabled={!canMoveUp}>
            <KeyboardArrowUp />
          </IconButton>
          <IconButton size="small" onClick={handleMoveDown} disabled={!canMoveDown}>
            <KeyboardArrowDown />
          </IconButton>
          <IconButton size="small" onClick={handleMoveLeft} disabled={!canMoveLeft}>
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton size="small" onClick={handleMoveRight} disabled={!canMoveRight}>
            <KeyboardArrowRight />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip size="small" label={`span ${field.gridSpan || 1}`} />
          <Box
            onMouseDown={handleResizeStart}
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0.5,
              bgcolor: 'action.active',
              cursor: 'ew-resize'
            }}
          />
          <IconButton size="small" color="error" onClick={handleDelete}>
            <Delete />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
} 