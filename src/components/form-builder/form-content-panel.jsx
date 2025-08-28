import { useDrop } from 'react-dnd';
import { useState, useCallback } from 'react';

import {
  GridView
} from '@mui/icons-material';
import {
  Box,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  FormControl
} from '@mui/material';

import DraggableField from './draggable-field';

// Empty Drop Zone Component for when no fields exist
function EmptyDropZone({ onFieldUpdate, fields, gridColumns }) {
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.FIELD, ItemTypes.COMPONENT],
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      
      if (item.type === ItemTypes.COMPONENT) {
        // Handle new component drop from left panel
        // If no fields exist, place in first position (0,0)
        // If fields exist, place after the last component
        let position;
        if (fields.length === 0) {
          position = { row: 0, col: 0 };
        } else {
          // Find the last placed component and place after it
          const lastField = fields[fields.length - 1];
          if (lastField.position) {
            const { row, col } = lastField.position;
            if (col < gridColumns - 1) {
              // Move to next column in same row
              position = { row, col: col + 1 };
            } else {
              // Move to first column of next row
              position = { row: row + 1, col: 0 };
            }
          } else {
            // Fallback: place after the last field in sequence
            position = { row: Math.floor(fields.length / gridColumns), col: fields.length % gridColumns };
          }
        }
        
        const newField = {
          id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: item.componentType,
          position,
          ...item.defaultData
        };
        
        const updatedFields = [...fields, newField];
        onFieldUpdate('fields', updatedFields);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <Box 
      ref={drop}
      sx={{ 
        textAlign: 'center', 
        py: 8,
        color: 'text.secondary',
        border: '2px dashed',
        borderColor: isOver ? 'primary.main' : 'divider',
        borderRadius: 2,
        backgroundColor: isOver ? 'primary.light' : 'transparent',
        transition: 'all 0.2s ease',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        No form components yet
      </Typography>
      <Typography variant="body2">
        Drag components from the left panel to start building your form
      </Typography>
    </Box>
  );
}

// Grid Cell Component for individual drop zones
function GridCell({
  row,
  col,
  field,
  fields,
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
      
      if (item.type === ItemTypes.FIELD) {
        // Handle field repositioning
        const fieldId = item.fieldId;
        
        // Update the field's position
        const updatedFields = fields.map(f => 
          f.id === fieldId 
            ? { ...f, position: { row, col } }
            : f
        );
        
        // Update the fields using the callback
        onFieldUpdate('fields', updatedFields);
      } else if (item.type === ItemTypes.COMPONENT) {
        // Handle new component drop from left panel
        const newField = {
          id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: item.componentType,
          position: { row, col },
          ...item.defaultData
        };
        
        const updatedFields = [...fields, newField];
        onFieldUpdate('fields', updatedFields);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <Box 
      ref={drop}
      sx={{ 
        minHeight: 100,
        border: isOver ? '2px dashed' : '1px dashed',
        borderColor: isOver ? 'primary.main' : 'divider',
        borderRadius: 1,
        backgroundColor: isOver ? 'primary.light' : 'transparent',
        transition: 'all 0.2s ease',
        p: 1
      }}
    >
      {field ? (
        <DraggableField
          field={field}
          index={fields.findIndex(f => f.id === field.id)}
          isSelected={selectedField?.id === field.id}
          onSelect={() => onFieldSelect(field)}
          onDelete={() => onFieldDelete(field.id)}
          onMove={onFieldMove}
          onReorder={onFieldReorder}
          canMoveUp
          canMoveDown
        />
      ) : (
        <Box sx={{ 
          height: 100, 
          border: '1px dashed', 
          borderColor: 'divider',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'action.hover',
          opacity: 0.5
        }}>
          <Typography variant="caption" color="text.secondary">
            Drop here
          </Typography>
        </Box>
      )}
    </Box>
  );
}

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
  const [gridColumns, setGridColumns] = useState(formData.gridColumns || 2);

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

  const handleGridColumnsChange = (event) => {
    const newColumns = event.target.value;
    const oldColumns = gridColumns;
    setGridColumns(newColumns);
    
    // Reposition all fields when grid columns change
    if (fields.length > 0) {
      const updatedFields = fields.map((field, index) => {
        // Calculate new position based on index and new column count
        const newRow = Math.floor(index / newColumns);
        const newCol = index % newColumns;
        
        return {
          ...field,
          position: { row: newRow, col: newCol }
        };
      });
      
      // Update both grid columns and repositioned fields
      onFieldUpdate && onFieldUpdate('gridColumns', newColumns);
      onFieldUpdate && onFieldUpdate('fields', updatedFields);
    } else {
      // Just update grid columns if no fields exist
      onFieldUpdate && onFieldUpdate('gridColumns', newColumns);
    }
  };

  const fields = formData.fields || [];
  
  // Organize fields into grid layout
  const organizeFieldsInGrid = (fieldList, columns = 2) => {
    const grid = [];
    const maxRows = Math.max(1, Math.ceil(fieldList.length / columns));
    
    // Initialize grid
    for (let row = 0; row < maxRows; row++) {
      grid[row] = [];
      for (let col = 0; col < columns; col++) {
        grid[row][col] = null;
      }
    }
    
    // Place fields in their positions
    fieldList.forEach((field, index) => {
      if (field.position) {
        const { row, col } = field.position;
        if (row < maxRows && col < columns) {
          grid[row][col] = field;
        } else {
          // If position is invalid, calculate a fallback position
          const fallbackRow = Math.floor(index / columns);
          const fallbackCol = index % columns;
          if (fallbackRow < maxRows && fallbackCol < columns) {
            grid[fallbackRow][fallbackCol] = field;
          }
        }
      } else {
        // If no position exists, calculate based on index
        const fallbackRow = Math.floor(index / columns);
        const fallbackCol = index % columns;
        if (fallbackRow < maxRows && fallbackCol < columns) {
          grid[fallbackRow][fallbackCol] = field;
        }
      }
    });
    
    return grid;
  };
  
  const gridLayout = organizeFieldsInGrid(fields, gridColumns);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Form Content
        </Typography>
        
        {/* Grid Columns Configuration */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GridView sx={{ fontSize: 20, color: 'text.secondary' }} />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Columns</InputLabel>
            <Select
              value={gridColumns}
              label="Columns"
              onChange={handleGridColumnsChange}
            >
              <MenuItem value={1}>1 Column</MenuItem>
              <MenuItem value={2}>2 Columns</MenuItem>
              <MenuItem value={3}>3 Columns</MenuItem>
              <MenuItem value={4}>4 Columns</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Drag and drop components here to build your form
      </Typography>

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 200,
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          backgroundColor: 'action.hover',
          transition: 'all 0.2s ease',
          p: 2,
          overflow: 'auto'
        }}
      >
        {fields.length > 0 ? (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: 2,
            minHeight: '100%'
          }}>
            {gridLayout.map((row, rowIndex) => 
              row.map((field, colIndex) => (
                <GridCell
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  field={field}
                  fields={fields}
                  selectedField={selectedField}
                  onFieldSelect={handleFieldSelect}
                  onFieldDelete={handleFieldDelete}
                  onFieldMove={handleFieldMove}
                  onFieldReorder={handleFieldReorder}
                  onFieldUpdate={onFieldUpdate}
                />
              ))
            )}
          </Box>
        ) : (
          <EmptyDropZone 
            onFieldUpdate={onFieldUpdate}
            fields={fields}
            gridColumns={gridColumns}
          />
        )}
      </Box>
    </Box>
  );
}
