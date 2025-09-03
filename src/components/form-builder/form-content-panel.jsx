import { useState } from 'react';
import { useDrop } from 'react-dnd';

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

const ItemTypes = {
  FIELD: 'field',
  COMPONENT: 'component'
};



// Grid Cell Component with Drop Zone for repositioning fields
function GridCell({ row, col, field, onFieldUpdate, fields, gridColumns, selectedField, onFieldSelect, onFieldDelete, onFieldMove, handleFieldResize }) {
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.FIELD, ItemTypes.COMPONENT],
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      
      if (item.type === ItemTypes.FIELD) {
        // Handle field repositioning
        const draggedField = fields.find(f => f.id === item.fieldId);
        if (draggedField) {
          // Update the dragged field's position
          const updatedFields = fields.map(f => 
            f.id === item.fieldId 
              ? { ...f, position: { row, col } }
              : f
          );
          onFieldUpdate('fields', updatedFields);
        }
      } else if (item.type === ItemTypes.COMPONENT) {
        // Handle new component drop from left panel
        const newField = {
          id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: item.componentType,
          position: { row, col },
          gridSpan: 1,
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

  if (field) {
    // This cell contains a field - render the field
    return (
      <Box 
        sx={{
          gridColumn: field.gridSpan > 1 ? `span ${field.gridSpan}` : undefined,
          minHeight: 80
        }}
      >
        <DraggableField
          field={field}
          index={fields.findIndex(f => f.id === field.id)}
          isSelected={selectedField?.id === field.id}
          onSelect={() => onFieldSelect(field)}
          onDelete={() => onFieldDelete(field.id)}
          onMove={onFieldMove}
          canMoveUp={field.position && field.position.row > 0}
          canMoveDown
          canMoveLeft={field.position && field.position.col > 0}
          canMoveRight={field.position && field.position.col < (gridColumns - 1)}
          onResize={handleFieldResize}
          gridColumns={gridColumns}
          maxGridSpan={gridColumns}
        />
      </Box>
    );
  }

  // Empty cell - show drop zone
  return (
    <Box 
      ref={drop}
      sx={{
        minHeight: 80,
        border: '1px dashed',
        borderColor: isOver ? 'primary.main' : 'divider',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isOver ? 'primary.light' : 'action.hover',
        opacity: isOver ? 1 : 0.5,
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {isOver ? 'Drop here' : 'Drop here'}
      </Typography>
    </Box>
  );
}

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
          gridSpan: 1,
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

  const handleFieldResize = (fieldId, newGridSpan) => {
    onFieldUpdate(fieldId, { gridSpan: newGridSpan });
  };

  const handleGridColumnsChange = (event) => {
    const newColumns = event.target.value;
    setGridColumns(newColumns);
    
    // Update grid columns setting
    onFieldUpdate && onFieldUpdate('gridColumns', newColumns);
    
    // Note: We don't reposition fields when grid columns change
    // This preserves the user's drag-and-drop positioning
  };

  const fields = formData.fields || [];
  
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
          p: 1,
          overflow: 'auto'
        }}
      >
        {fields.length > 0 ? (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: 1,
            minHeight: 200
          }}>
            {(() => {
              // Calculate the maximum row from field positions
              const maxRow = Math.max(...fields.map(f => f.position?.row || 0), 0);
              const totalRows = Math.max(maxRow + 1, Math.ceil((fields.length + 2) / gridColumns), 3);
              
              // Create a grid layout that respects grid spans
              const gridLayout = [];
              
              for (let row = 0; row < totalRows; row++) {
                const rowFields = [];
                let col = 0;
                
                // Find fields for this row
                const rowFieldList = fields.filter(f => f.position && f.position.row === row);
                
                // Sort fields by column position
                rowFieldList.sort((a, b) => (a.position?.col || 0) - (b.position?.col || 0));
                
                for (const field of rowFieldList) {
                  const fieldCol = field.position?.col || 0;
                  const fieldSpan = field.gridSpan || 1;
                  
                  // Add empty cells if needed
                  while (col < fieldCol) {
                    rowFields.push(null);
                    col++;
                  }
                  
                  // Add the field with its span
                  rowFields.push({
                    field,
                    col,
                    span: fieldSpan
                  });
                  
                  col += fieldSpan;
                }
                
                // Fill remaining columns with empty cells
                while (col < gridColumns) {
                  rowFields.push(null);
                  col++;
                }
                
                gridLayout.push(rowFields);
              }
              
              return gridLayout.map((row, rowIndex) => 
                row.map((cell, colIndex) => {
                  if (!cell) {
                    // Empty cell - show drop zone
                    return (
                      <GridCell
                        key={`${rowIndex}-${colIndex}`}
                        row={rowIndex}
                        col={colIndex}
                        field={null}
                        onFieldUpdate={onFieldUpdate}
                        fields={fields}
                        gridColumns={gridColumns}
                        selectedField={selectedField}
                        onFieldSelect={onFieldSelect}
                        onFieldDelete={onFieldDelete}
                        onFieldMove={onFieldMove}
                        handleFieldResize={handleFieldResize}
                      />
                    );
                  }
                  
                  // Field cell
                  const { field } = cell;
                  return (
                    <GridCell
                      key={`${rowIndex}-${colIndex}`}
                      row={rowIndex}
                      col={colIndex}
                      field={field}
                      onFieldUpdate={onFieldUpdate}
                      fields={fields}
                      gridColumns={gridColumns}
                      selectedField={selectedField}
                      onFieldSelect={onFieldSelect}
                      onFieldDelete={onFieldDelete}
                      onFieldMove={onFieldMove}
                      handleFieldResize={handleFieldResize}
                    />
                  );
                })
              );
            })()}
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
