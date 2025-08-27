# Custom Form Builder - Enhanced Features

## Overview
This enhanced custom form builder provides a comprehensive solution for creating, managing, and rendering dynamic forms with advanced grid layouts. It's specifically designed for creating reports such as DMAS 301, 302, and other dynamic user and client profiles.

## Features

### 1. Form Components
The left panel includes the following form components:
- **Text Input**: Single line text input
- **Text Area**: Multi-line text input
- **Email Input**: Email input with validation
- **Radio Buttons**: Single choice selection
- **Checkboxes**: Multiple choice selection
- **Dropdown**: Select from options
- **Number Input**: Numeric input field with min/max validation
- **Date Picker**: Date selection
- **File Upload**: File attachment with configurable file types
- **Link Input**: URL input field
- **Table**: Data table input with configurable columns and rows
- **Rich Text**: Rich text editor
- **Signature**: Digital signature field
- **Multi-Step Wizard**: Multi-step form wizard with configurable steps

### 2. Advanced Grid Layout System
- **Multi-column Layout**: Configurable grid with 1-4 columns (default: 2)
- **Component Placement Strategies**:
  - **Sequential Placement**: Click components for logical order placement (first at 0,0, then sequentially)
  - **Random Placement**: Components placed at random grid positions
  - **Precise Placement**: Drag and drop to exact grid coordinates
- **Component Repositioning**: Move existing components anywhere within the grid layout
- **Visual Grid Cells**: Clear drop zones and visual feedback during drag operations
- **Position Data**: Each component stores its grid coordinates for persistence

### 3. Drag and Drop Functionality
- **Component Addition**: Drag components from the left panel to specific grid cells
- **Field Repositioning**: Drag and drop existing fields within the grid to reorder them
- **Visual Feedback**: Clear visual indicators during drag operations
- **Grid Cell Drop Zones**: Each grid cell acts as an individual drop zone

### 4. Form Builder Interface
- **Center Panel**: Main form building area with grid layout and drag and drop support
- **Field Selection**: Click on fields to select and edit properties
- **Field Management**: Move, delete, and reorder fields easily
- **Real-time Preview**: See changes as you build the form
- **Grid Configuration**: Change column count with automatic layout adaptation

### 5. Field Properties Panel
- **Dynamic Properties**: Properties change based on field type
- **Validation Rules**: Configure required fields, min/max values, etc.
- **Options Management**: Add/remove options for choice-based fields
- **Step Configuration**: Configure multi-step wizard steps

### 6. Database Integration
- **Form Persistence**: Save forms to database with grid configuration
- **Form Retrieval**: Load and edit existing forms with position data
- **Form Submissions**: Collect and store form data
- **Export Functionality**: Export forms and data in various formats

### 7. Form Rendering
- **Dynamic Rendering**: Render forms from saved database data with grid layout
- **Validation**: Automatic validation based on field configuration
- **Multi-step Support**: Handle wizard forms with step navigation
- **Responsive Design**: Forms adapt to different screen sizes
- **Grid Layout Preservation**: Maintain component positions in rendered forms

### 8. Report Generation
- **DMAS 301/302 Support**: Pre-configured templates for healthcare reporting
- **Custom Reports**: Generate reports from form data
- **Export Options**: PDF, Excel, and other export formats
- **Data Analysis**: Analyze form submissions and generate insights

## Usage

### Creating a New Form
1. Navigate to "Form Management" > "Custom Form Builder"
2. **Configure Grid Layout**: Use the "Columns" dropdown to set 1-4 columns (default: 2)
3. **Add Components** using three methods:
   - **Click**: Click components in the left panel for sequential placement
   - **Drag & Drop**: Drag components to specific grid cells for precise placement
   - **Random**: Components can be placed at random positions
4. **Reposition Components**: Drag existing components to new grid positions
5. Configure field properties in the right panel
6. Save the form

### Editing Existing Forms
1. Go to "Form Management" > "Forms Library"
2. Click "Edit" on any form
3. Make changes and save updates
4. Grid layout and component positions are preserved

### Viewing and Filling Forms
1. Navigate to "Form Management" > "Forms Library"
2. Click "View" on any form
3. Fill out the form and submit
4. Grid layout is maintained in the rendered form

### Managing Forms
- **Forms Library**: View all saved forms
- **Form Categories**: Organize forms by type (reports, surveys, etc.)
- **Form Templates**: Use pre-built templates for common use cases
- **Form Sharing**: Share forms with team members

## Technical Implementation

### Dependencies
- `react-dnd`: Drag and drop functionality
- `react-dnd-html5-backend`: HTML5 drag and drop backend
- `react-hook-form`: Form state management and validation
- `@mui/material`: UI components
- `zod`: Schema validation

### File Structure
```
src/
├── components/
│   └── form-builder/
│       ├── form-builder.jsx           # Main form builder orchestrator
│       ├── form-components-panel.jsx  # Left panel with components
│       ├── form-content-panel.jsx     # Center panel with grid layout
│       ├── draggable-field.jsx        # Draggable field wrapper
│       ├── field-properties.jsx       # Field properties editor
│       ├── form-renderer.jsx          # Form rendering component
│       └── index.jsx                  # Main form builder export
├── lib/
│   └── form-service.js                # Database operations
├── pages/
│   ├── custom-form/                   # Form builder page
│   ├── form-preview/                  # Form preview page
│   ├── forms-list/                    # Forms library
│   └── form-view/                     # Form viewing/filling
└── routes/
    └── sections/
        └── adult-daycare.jsx          # Route configuration
```

### Key Components

#### FormBuilder
- Main form building interface
- Handles drag and drop operations
- Manages form state and field operations
- Orchestrates grid layout and component placement

#### FormContentPanel
- Center panel with grid layout system
- Manages grid cells and drop zones
- Handles component positioning and repositioning
- Provides visual feedback during drag operations

#### DraggableField
- Wraps form fields with drag and drop functionality
- Handles field selection and repositioning
- Provides visual feedback during drag operations
- Supports both new component drops and field repositioning

#### FormRenderer
- Renders forms from saved data with grid layout
- Handles form submission
- Supports both standard and wizard forms
- Maintains component positions in rendered output

#### FormService
- Manages database operations
- Handles form CRUD operations
- Provides export and report generation
- Stores and retrieves grid configuration data

## Configuration

### Environment Variables
```bash
REACT_APP_API_URL=http://localhost:3001/api
```

### Backend API Endpoints
The form service expects the following endpoints:
- `POST /api/forms` - Create new form
- `GET /api/forms` - Get all forms
- `GET /api/forms/:id` - Get form by ID
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `POST /api/forms/:id/submit` - Submit form data
- `GET /api/forms/:id/export` - Export form data
- `POST /api/forms/:id/reports` - Generate reports

## Development

### Running the Application
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

### Code Quality
```bash
npm run lint
npm run lint:fix
npm run fm:fix
```

## Grid Layout System

### Component Placement Strategies

#### 1. Sequential Placement
- **Trigger**: Clicking component in left panel
- **Logic**: First component at (0,0), subsequent components follow logical order
- **Grid**: Uses current column configuration
- **Result**: Components fill grid systematically from left to right, top to bottom

#### 2. Random Placement
- **Trigger**: Random positioning algorithm
- **Logic**: Finds random unoccupied positions in grid
- **Grid**: Uses current column configuration
- **Result**: Components appear at random locations for dynamic layouts

#### 3. Precise Placement
- **Trigger**: Drag from left panel to specific cell
- **Logic**: Exact cell positioning based on drop location
- **Grid**: User-selected cell location
- **Result**: Component appears exactly where dropped

#### 4. Component Repositioning
- **Trigger**: Drag existing component to new position
- **Logic**: Updates component's position data
- **Grid**: Any valid grid cell
- **Result**: Component moves to new position

### Grid Configuration
- **Default Columns**: 2 (configurable 1-4)
- **Position Data**: Each field stores `{ row, col }` coordinates
- **Visual Feedback**: Clear drop zones and drag indicators
- **Responsive Design**: Grid adapts to different screen sizes

## Future Enhancements

### Planned Features
- **Form Templates**: Pre-built templates for common use cases
- **Advanced Validation**: Custom validation rules and conditional logic
- **Form Analytics**: Track form usage and completion rates
- **Multi-language Support**: Internationalization for forms
- **Advanced Field Types**: File upload with preview, signature pad
- **Form Versioning**: Track changes and rollback to previous versions
- **Collaborative Editing**: Multiple users can edit forms simultaneously
- **Form Scheduling**: Schedule forms to be available at specific times

### Integration Opportunities
- **Authentication**: User management and role-based access
- **Workflow Engine**: Multi-step approval processes
- **Notification System**: Email/SMS notifications for form submissions
- **Data Integration**: Connect with external systems and databases
- **Mobile App**: Native mobile application for form filling

### Advanced Grid Features
- **Component Resizing**: Allow components to span multiple grid cells
- **Nested Grids**: Support for complex nested layouts
- **Auto-layout**: Automatic component positioning algorithms
- **Responsive Grid**: Dynamic column adjustment based on screen size
- **Grid Templates**: Predefined grid arrangements for common form types

## Support

For questions or issues:
1. Check the documentation
2. Review the code examples
3. Check the issue tracker
4. Contact the development team

## License

This project is licensed under the MIT License. 