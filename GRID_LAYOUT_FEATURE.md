# Grid Layout Feature for Form Builder

## Overview
The form builder now supports an advanced grid layout system that allows form components to be positioned using multiple strategies: sequential placement for clicked components, random positioning, and precise drag-and-drop placement. The system uses a 2-column default layout with configurable columns (1-4).

## Features

### 1. Multiple Component Placement Strategies
- **Sequential Placement**: When you click components in the left panel, they are placed in logical order (first at 0,0, then sequentially)
- **Random Placement**: Components can be placed at random locations in the grid for dynamic layouts
- **Precise Placement**: Drag and drop components to exact grid cell positions
- **Component Repositioning**: Move existing components anywhere within the grid layout

### 2. Configurable Grid Columns
- The grid layout supports 1-4 columns (configurable via dropdown)
- **Default is 2 columns** for better space utilization
- You can change the number of columns at any time using the "Columns" dropdown in the Form Content panel
- Grid automatically adapts to column changes while preserving component positions

### 3. Visual Grid System
- Empty grid cells show "Drop here" placeholders
- Visual feedback during drag and drop operations
- Responsive grid layout that adapts to the number of columns
- Clear drop zones for precise component placement

### 4. Position Data Storage
- Each field now stores its position data (`{ row, col }`)
- Position data is preserved when forms are saved and loaded
- Grid configuration (`gridColumns`) is stored with form data
- Backward compatibility with existing forms that don't have position data

## How It Works

### Component Addition Strategies

#### 1. Sequential Placement (Clicking)
1. **Click**: Click any component in the left panel
2. **Sequential Logic**: First component goes to (0,0), subsequent components follow logical order
3. **Grid Filling**: Components fill from left to right, top to bottom
4. **Column Wrapping**: Move to next row when current row is full

#### 2. Random Placement
1. **Random Algorithm**: System finds random unoccupied positions in the grid
2. **Fallback Logic**: If random placement fails, uses first available position
3. **Dynamic Layout**: Creates varied, non-predictable layouts

#### 3. Precise Placement (Drag & Drop)
1. **Drag**: Drag component from left panel to specific grid cell
2. **Drop**: Component gets placed in exact cell coordinates
3. **Position Update**: Position data is set to target cell coordinates

#### 4. Component Repositioning
1. **Drag Existing**: Drag any existing component in the grid
2. **Drop Anywhere**: Drop in any grid cell (empty or occupied)
3. **Position Update**: Component's position data is updated automatically

### Grid Layout Algorithm
```javascript
// Sequential placement logic
const getSequentialPosition = (currentFields, gridColumns = 2) => {
  if (currentFields.length === 0) {
    return { row: 0, col: 0 };
  }
  
  const lastField = currentFields[currentFields.length - 1];
  if (lastField.position) {
    const { row, col } = lastField.position;
    if (col < gridColumns - 1) {
      return { row, col: col + 1 };
    } else {
      return { row: row + 1, col: 0 };
    }
  }
  
  // Fallback for fields without position data
  return { 
    row: Math.floor(currentFields.length / gridColumns), 
    col: currentFields.length % gridColumns 
  };
};
```

### Position Data Structure
Each field now includes position data:
```javascript
{
  id: "field_1234567890_abc123",
  type: "text",
  label: "Text Input",
  position: { row: 2, col: 1 }, // Grid coordinates
  // ... other field properties
}
```

Form data includes grid configuration:
```javascript
{
  id: "form_123",
  title: "My Form",
  gridColumns: 2, // Grid configuration
  fields: [
    // ... fields with position data
  ]
}
```

## Implementation Details

### Files Modified
1. **`src/components/form-builder/form-content-panel.jsx`**
   - Added grid layout rendering with configurable columns
   - Added column configuration dropdown
   - Added sequential position generation for clicked components
   - Added GridCell components with individual drop zones
   - Added EmptyDropZone for handling empty form state

2. **`src/components/form-builder/form-builder.jsx`**
   - Added sequential placement logic for clicked components
   - Updated field creation with position data
   - Integrated grid column configuration

3. **`src/components/form-builder/form-renderer.jsx`**
   - Added grid layout support for form preview/rendering
   - Maintains backward compatibility with single-column layouts
   - Uses gridColumns from form data for layout

4. **`src/pages/custom-form/index.jsx`**
   - Added gridColumns handling in form data updates
   - Ensured gridColumns is included in preview data

5. **`src/pages/form-preview/index.jsx`**
   - Added gridColumns loading from session storage
   - Ensured grid layout is preserved in preview

### Grid Configuration
- **Default Columns**: 2 (changed from 3)
- **Available Options**: 1, 2, 3, 4 columns
- **Configuration Storage**: Stored in `formData.gridColumns`
- **Session Storage**: Included in preview data for form preview page

## Usage Instructions

### Setting Up Grid Layout
1. Open the form builder
2. In the Form Content panel, use the "Columns" dropdown to select desired number of columns (default: 2)
3. The grid will automatically adjust to show the selected number of columns

### Adding Components
1. **Method 1 - Sequential**: Click components in the left panel for logical order placement
2. **Method 2 - Precise**: Drag components from the left panel to specific grid cells
3. **Method 3 - Random**: Use random placement for dynamic layouts
4. Components will automatically find available positions in the grid

### Managing Layout
- Change column count anytime using the dropdown
- Components maintain their positions when changing columns
- Empty cells show "Drop here" placeholders
- Drag existing components to reposition them

### Component Repositioning
1. Click and drag any existing component in the grid
2. Drop it in any desired grid cell
3. Component position is automatically updated
4. Visual feedback shows the new position immediately

## Benefits

1. **Better Space Utilization**: Multiple components can be displayed side by side
2. **Visual Organization**: Grid layout provides better visual structure
3. **Flexible Layouts**: Configurable columns allow for different layout preferences
4. **Multiple Placement Options**: Sequential, random, and precise placement strategies
5. **Component Repositioning**: Move components anywhere in the grid after placement
6. **Backward Compatibility**: Existing forms without position data still work
7. **Responsive Design**: Grid adapts to different screen sizes

## Technical Notes

### Performance Considerations
- Grid generation is optimized for up to 100 fields
- Sequential placement has O(1) complexity for finding next position
- Random position generation has a maximum of 100 attempts to find a position
- Fallback mechanisms ensure components are always placed

### Data Structure Changes
- New fields include `position` property with `{ row, col }` coordinates
- Form data includes `gridColumns` property for configuration
- Existing forms without position data use single-column fallback
- Session storage includes grid configuration for preview functionality

### Browser Compatibility
- Uses CSS Grid layout (modern browsers)
- Graceful degradation for older browsers
- Responsive design considerations
- Touch support for mobile devices

## Visual Examples

### 2-Column Grid Layout (Default)
```
Row 0: [Component 1] [Component 2]
Row 1: [Component 3] [Component 4]
Row 2: [Component 5] [Component 6]
Row 3: [Component 7] [Component 8]
```

### 3-Column Grid Layout
```
Row 0: [Component 1] [Component 2] [Component 3]
Row 1: [Component 4] [Component 5] [Component 6]
Row 2: [Component 7] [Component 8] [Component 9]
```

### Sequential Placement Pattern
- **First component**: Position (0,0) - top-left
- **Second component**: Position (0,1) - top-right (in 2-column grid)
- **Third component**: Position (1,0) - second row, left
- **Fourth component**: Position (1,1) - second row, right
- And so on...

## Future Enhancements

1. **Smart Positioning**: Automatic placement based on component type and relationships
2. **Custom Grid Sizes**: Support for custom grid dimensions beyond 4 columns
3. **Responsive Grid**: Automatic column adjustment based on screen size
4. **Grid Templates**: Predefined grid layouts for common form types
5. **Component Sizing**: Allow components to span multiple grid cells
6. **Auto-arrange**: Automatic component organization and alignment
7. **Grid Snap**: Snap components to grid boundaries for precise alignment
8. **Undo/Redo**: Revert component placement and repositioning changes 