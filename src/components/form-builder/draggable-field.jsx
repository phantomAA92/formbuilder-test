import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import {
  Box,
  Paper,
  Tooltip,
  IconButton,
  Typography
} from '@mui/material';
import {
  Delete,
  ArrowUpward,
  ArrowDownward,
  DragIndicator
} from '@mui/icons-material';

import FormField from './form-field';

const ItemTypes = {
  FIELD: 'field'
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

  const [, drop] = useDrop({
    accept: ItemTypes.FIELD,
    hover(item, monitor) {
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
  });

  const [{ isDragging: isDraggingField }, drag] = useDrag({
    type: ItemTypes.FIELD,
    item: () => ({ id: field.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleFieldSelect = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const handleFieldDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const handleFieldMove = (e, direction) => {
    e.stopPropagation();
    onMove(field.id, direction);
  };

  return (
    <Paper
      ref={ref}
      variant="outlined"
      sx={{
        p: 2,
        cursor: 'pointer',
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        opacity: isDraggingField ? 0.5 : 1,
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover'
        },
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={handleFieldSelect}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <DragIndicator 
          color="action" 
          sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
        />
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          {field.label || `Field ${index + 1}`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Move Up">
            <IconButton
              size="small"
              onClick={handleFieldMove}
              disabled={!canMoveUp}
            >
              <ArrowUpward />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move Down">
            <IconButton
              size="small"
              onClick={handleFieldMove}
              disabled={!canMoveDown}
            >
              <ArrowDownward />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Field">
            <IconButton
              size="small"
              color="error"
              onClick={handleFieldDelete}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box sx={{ ml: 3 }}>
        <FormField field={field} isPreview />
      </Box>
    </Paper>
  );
} 