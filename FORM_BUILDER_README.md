# Custom Form Builder - Enhanced Features

## Overview
This enhanced custom form builder provides a comprehensive solution for creating, managing, and rendering dynamic forms. It's specifically designed for creating reports such as DMAS 301, 302, and other dynamic user and client profiles.

## Features

### 1. Form Components
The left panel includes the following form components:
- **Text Input**: Single line text input
- **Text Area**: Multi-line text input
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

### 2. Drag and Drop Functionality
- **Component Addition**: Drag components from the left panel to the form builder
- **Field Reordering**: Drag and drop fields within the form to reorder them
- **Visual Feedback**: Clear visual indicators during drag operations

### 3. Form Builder Interface
- **Center Panel**: Main form building area with drag and drop support
- **Field Selection**: Click on fields to select and edit properties
- **Field Management**: Move, delete, and reorder fields easily
- **Real-time Preview**: See changes as you build the form

### 4. Field Properties Panel
- **Dynamic Properties**: Properties change based on field type
- **Validation Rules**: Configure required fields, min/max values, etc.
- **Options Management**: Add/remove options for choice-based fields
- **Step Configuration**: Configure multi-step wizard steps

### 5. Database Integration
- **Form Persistence**: Save forms to database
- **Form Retrieval**: Load and edit existing forms
- **Form Submissions**: Collect and store form data
- **Export Functionality**: Export forms and data in various formats

### 6. Form Rendering
- **Dynamic Rendering**: Render forms from saved database data
- **Validation**: Automatic validation based on field configuration
- **Multi-step Support**: Handle wizard forms with step navigation
- **Responsive Design**: Forms adapt to different screen sizes

### 7. Report Generation
- **DMAS 301/302 Support**: Pre-configured templates for healthcare reporting
- **Custom Reports**: Generate reports from form data
- **Export Options**: PDF, Excel, and other export formats
- **Data Analysis**: Analyze form submissions and generate insights

## Usage

### Creating a New Form
1. Navigate to "Form Management" > "Custom Form Builder"
2. Add form components by dragging from the left panel or clicking
3. Configure field properties in the right panel
4. Save the form

### Editing Existing Forms
1. Go to "Form Management" > "Forms Library"
2. Click "Edit" on any form
3. Make changes and save updates

### Viewing and Filling Forms
1. Navigate to "Form Management" > "Forms Library"
2. Click "View" on any form
3. Fill out the form and submit

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
│       ├── index.jsx              # Main form builder
│       ├── form-components-panel.jsx # Left panel with components
│       ├── draggable-field.jsx    # Draggable field wrapper
│       ├── form-field.jsx         # Individual field components
│       ├── field-properties.jsx   # Field properties editor
│       ├── form-renderer.jsx      # Form rendering component
│       └── form-preview.jsx       # Form preview
├── lib/
│   └── form-service.js            # Database operations
├── pages/
│   ├── custom-form/               # Form builder page
│   ├── forms-list/                # Forms library
│   └── form-view/                 # Form viewing/filling
└── routes/
    └── sections/
        └── adult-daycare.jsx      # Route configuration
```

### Key Components

#### FormBuilder
- Main form building interface
- Handles drag and drop operations
- Manages form state and field operations

#### DraggableField
- Wraps form fields with drag and drop functionality
- Handles field selection and reordering
- Provides visual feedback during drag operations

#### FormRenderer
- Renders forms from saved data
- Handles form submission
- Supports both standard and wizard forms

#### FormService
- Manages database operations
- Handles form CRUD operations
- Provides export and report generation

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

## Support

For questions or issues:
1. Check the documentation
2. Review the code examples
3. Check the issue tracker
4. Contact the development team

## License

This project is licensed under the MIT License. 