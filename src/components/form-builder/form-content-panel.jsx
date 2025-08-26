import { useCallback } from 'react';
import { useDrop } from 'react-dnd';

import {
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import {
  Delete,
  KeyboardArrowUp,
  KeyboardArrowDown,
  DragIndicator
} from '@mui/icons-material';

import DraggableField from './draggable-field';

const ItemTypes = {
  FIELD: 'field',
  COMPONENT: 'component'
};

export default function FormContentPanel({
  formData,
  selectedField,
  onFieldSelect,
  onFieldDelete,
  onFieldMove,
  onFieldReorder,
  onFieldUpdate
}) {
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.FIELD, ItemTypes.COMPONENT],
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      
      if (item.type === ItemTypes.COMPONENT) {
        // Handle new component drop
        const newField = {
          id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: item.componentType,
          ...item.defaultData
        };
        
        const updatedFields = [...(formData.fields || []), newField];
        onFieldUpdate('fields', updatedFields);
        onFieldSelect(newField);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const handleFieldReorder = useCallback((dragIndex, hoverIndex) => {
    onFieldReorder(dragIndex, hoverIndex);
  }, [onFieldReorder]);

  const handleFieldSelect = (field) => {
    onFieldSelect(field);
  };

  const handleFieldDelete = (fieldId) => {
    onFieldDelete(fieldId);
  };

  const handleFieldMove = (fieldId, direction) => {
    onFieldMove(fieldId, direction);
  };

  const fields = formData.fields || [];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Form Content
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Drag and drop components here to build your form
      </Typography>

      {/* Drop Zone */}
      <Box
        ref={drop}
        sx={{
          flex: 1,
          minHeight: 200,
          border: '2px dashed',
          borderColor: isOver ? 'primary.main' : 'divider',
          borderRadius: 2,
          backgroundColor: isOver ? 'primary.light' : 'action.hover',
          transition: 'all 0.2s ease',
          p: 2,
          overflow: 'auto'
        }}
      >
        {fields.length > 0 ? (
          <Stack spacing={2}>
            {fields.map((field, index) => (
              <Box key={field.id}>
                <DraggableField
                  field={field}
                  index={index}
                  isSelected={selectedField?.id === field.id}
                  onSelect={() => handleFieldSelect(field)}
                  onDelete={() => handleFieldDelete(field.id)}
                  onMove={handleFieldMove}
                  onReorder={handleFieldReorder}
                  canMoveUp={index > 0}
                  canMoveDown={index < fields.length - 1}
                />
                {index < fields.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Stack>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            color: 'text.secondary'
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              No form components yet
            </Typography>
            <Typography variant="body2">
              Drag components from the left panel to start building your form
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
