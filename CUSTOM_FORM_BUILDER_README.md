# Custom Form Builder

A comprehensive React.js-based custom form builder that allows you to create, edit, and manage dynamic forms with advanced grid layouts and drag-and-drop functionality.

## Features

### 🎯 Form Components

- **Text Input** - Single line text input
- **Text Area** - Multi-line text input
- **Email Input** - Email input with validation
- **Radio Buttons** - Single choice selection
- **Checkboxes** - Multiple choice selection
- **Dropdown** - Select from options
- **Number Input** - Numeric input with validation
- **Date Picker** - Date selection with min/max constraints
- **File Upload** - File attachment with type restrictions
- **Link Input** - URL input field
- **Table** - Dynamic data table input
- **Rich Text** - Rich text editor
- **Signature** - Digital signature capture
- **Multi-Step Wizard** - Multi-step form wizard

### 🚀 Core Functionality

- **Advanced Grid Layout** - Multi-column grid system (1-4 columns) with configurable positioning
- **Multiple Placement Strategies**:
  - **Sequential Placement**: Click components for logical order placement (first at 0,0, then sequentially)
  - **Random Placement**: Components placed at random grid positions
  - **Precise Placement**: Drag and drop to exact grid coordinates
- **Component Repositioning** - Move existing components anywhere within the grid layout
- **Drag & Drop** - Intuitive drag-and-drop interface for building and repositioning forms
- **Real-time Preview** - See form changes as you build
- **Field Properties** - Comprehensive property editing for each field type
- **Form Validation** - Built-in validation with custom error messages
- **Responsive Design** - Works on desktop and mobile devices
- **Local Storage** - Forms saved locally in development mode
- **Database Ready** - Production-ready API integration

### 📊 Use Cases

- **DMAS Reports** - Create DMAS 301, 302, and other compliance forms
- **User Profiles** - Dynamic user and client profile forms
- **Assessment Forms** - Custom assessment and evaluation forms
- **Data Collection** - Any form-based data collection needs

## Getting Started

### Prerequisites

- Node.js 20+
- React 19+
- Material-UI 7+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd formbuilder-test

# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Structure

```
src/
├── components/form-builder/
│   ├── form-builder.jsx              # Main form builder orchestrator
│   ├── form-components-panel.jsx     # Left panel with form components
│   ├── form-content-panel.jsx        # Center panel with grid layout
│   ├── field-properties.jsx          # Right panel for field properties
│   ├── draggable-field.jsx           # Draggable field wrapper
│   ├── form-renderer.jsx             # Form rendering component
│   └── index.jsx                     # Main form builder export
├── lib/
│   ├── form-service.js               # API service for forms
│   └── local-storage-service.js      # Local storage service (dev)
└── pages/
    ├── custom-form/                   # Form builder page
    ├── form-preview/                  # Form preview page
    ├── form-view/                     # Form viewing page
    └── forms-list/                    # Forms management page
```

## Usage

### 1. Creating a New Form

1. Navigate to `/custom-form`
2. **Configure Grid Layout**: Use the "Columns" dropdown to set 1-4 columns (default: 2)
3. **Add Components** using three methods:
   - **Click**: Click components in the left panel for sequential placement
   - **Drag & Drop**: Drag components to specific grid cells for precise placement
   - **Random**: Components can be placed at random positions
4. **Reposition Components**: Drag existing components to new grid positions
5. Select fields to edit properties in the right panel
6. Save your form

### 2. Building Forms

#### Adding Components

- **Click** any component in the left panel to add it sequentially
- **Drag & Drop** components from left panel to specific grid cells
- **Random Placement** for dynamic layouts
- Components automatically get unique IDs and default properties

#### Grid Layout Management

- **Column Configuration**: Change from 1-4 columns using the dropdown
- **Component Positioning**: Each component stores its grid coordinates
- **Visual Feedback**: Clear drop zones and drag indicators
- **Responsive Design**: Grid adapts to different screen sizes

#### Field Properties

Each field type has specific properties:

**Basic Properties:**
- Label, ID, Placeholder, Required, Disabled

**Type-Specific Properties:**
- **Text/Textarea**: Rows, default value
- **Email**: Email validation patterns
- **Number**: Min, max, step values
- **Date**: Min/max date constraints
- **Options**: Add/remove options for radio/checkbox/dropdown
- **Table**: Define columns and rows
- **Wizard**: Configure steps and descriptions
- **Signature**: Width, height, pen color

**Validation Properties:**
- Min/max length
- Pattern (regex)
- Custom error messages

**Styling Properties:**
- CSS classes
- Width and height
- Custom styling

### 3. Managing Forms

#### Forms List (`/forms-list`)

- View all created forms
- Edit existing forms
- Delete forms
- Export forms (JSON/CSV)
- Generate reports

#### Form Actions

- **View**: Render the form for data entry
- **Edit**: Modify form structure and properties
- **Delete**: Remove forms permanently
- **Export**: Download form data
- **Generate Report**: Create DMAS or summary reports

### 4. Form Rendering

#### View Forms (`/form-view/:id`)

- Forms render with proper validation
- All field types supported
- Responsive design
- Form submission handling

#### Form Submission

- Client-side validation
- Data collection and storage
- Support for complex field types (signatures, tables, files)

## Advanced Features

### Grid Layout System

#### Component Placement Strategies
1. **Sequential Placement**: First component at (0,0), subsequent components follow logical order
2. **Random Placement**: Components placed at random grid positions
3. **Precise Placement**: Drag and drop to exact grid coordinates
4. **Repositioning**: Move existing components anywhere in the grid

#### Grid Configuration
- **Column Count**: Configurable from 1-4 columns (default: 2)
- **Responsive Layout**: Grid adapts to different screen sizes
- **Visual Feedback**: Clear drop zones and drag indicators
- **Position Preservation**: Component positions saved and restored

### Multi-Step Wizard Forms

1. Add a wizard component to your form
2. Configure steps with titles and descriptions
3. Add fields to each step
4. Users navigate through steps with validation

### Table Fields

1. Define column headers
2. Set number of rows
3. Users fill in table data
4. Data collected as structured arrays

### Signature Fields

1. Configure canvas dimensions
2. Set pen color and thickness
3. Users draw signatures
4. Signatures saved as base64 data

### File Uploads

1. Set accepted file types
2. Configure multiple file support
3. Set file size limits
4. Files handled securely

## Development

### Local Storage (Development Mode)

In development, forms are stored in browser localStorage:

- Forms persist between sessions
- No backend required for testing
- Easy to clear data for testing

### Production Mode

In production, forms integrate with your backend API:

- RESTful API endpoints
- Database storage
- User authentication
- Form submission tracking

### Customization

#### Adding New Field Types

1. Add component to `form-components-panel.jsx`
2. Update `field-properties.jsx` with properties
3. Add rendering logic to `form-renderer.jsx`
4. Update validation schema

#### Styling

- Material-UI theme integration
- Custom CSS classes support
- Responsive design patterns
- Dark/light theme support

## API Integration

### Form Service Endpoints

```javascript
// Forms
POST   /api/forms              # Create form
GET    /api/forms              # Get all forms
GET    /api/forms/:id          # Get form by ID
PUT    /api/forms/:id          # Update form
DELETE /api/forms/:id          # Delete form

// Submissions
POST   /api/forms/:id/submit   # Submit form data
GET    /api/forms/:id/submissions # Get form submissions

// Reports
GET    /api/forms/:id/export   # Export form data
POST   /api/forms/:id/reports  # Generate reports
```

### Data Structure

```javascript
{
  id: "form_123",
  title: "Form Title",
  description: "Form description",
  type: "report|profile|custom",
  gridColumns: 2, // Grid configuration
  fields: [
    {
      id: "field_1",
      type: "text|textarea|email|radio|checkbox|dropdown|number|date|attachment|link|table|richtext|signature|wizard",
      label: "Field Label",
      required: false,
      position: { row: 0, col: 0 }, // Grid position
      // ... type-specific properties
    }
  ],
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

## Examples

### DMAS 301 Form

```javascript
{
  title: "DMAS 301 Form",
  type: "report",
  gridColumns: 2,
  fields: [
    { type: "text", label: "Provider Name", required: true, position: { row: 0, col: 0 } },
    { type: "text", label: "Provider Number", required: true, position: { row: 0, col: 1 } },
    { type: "date", label: "Service Date", required: true, position: { row: 1, col: 0 } },
    { type: "textarea", label: "Service Description", required: true, position: { row: 1, col: 1 } },
    { type: "number", label: "Amount", required: true, min: 0, position: { row: 2, col: 0 } }
  ]
}
```

### Client Profile Form

```javascript
{
  title: "Client Profile",
  type: "profile",
  gridColumns: 2,
  fields: [
    { type: "text", label: "Full Name", required: true, position: { row: 0, col: 0 } },
    { type: "email", label: "Email Address", required: true, position: { row: 0, col: 1 } },
    { type: "date", label: "Date of Birth", required: true, position: { row: 1, col: 0 } },
    { type: "textarea", label: "Address", required: true, position: { row: 1, col: 1 } },
    { type: "checkbox", label: "Allergies", options: ["Medication", "Food", "None"], position: { row: 2, col: 0 } },
    { type: "signature", label: "Client Signature", required: true, position: { row: 2, col: 1 } }
  ]
}
```

## Troubleshooting

### Common Issues

**Drag and Drop Not Working**
- Ensure `react-dnd` is properly installed
- Check browser compatibility
- Verify drag event handlers

**Forms Not Saving**
- Check localStorage permissions
- Verify form validation
- Check console for errors

**Field Properties Not Updating**
- Ensure field selection
- Check property change handlers
- Verify state management

**Grid Layout Issues**
- Verify gridColumns setting is saved
- Check component position data
- Ensure preview page loads gridColumns

### Performance Tips

- Limit form complexity (recommended: <50 fields)
- Use appropriate field types
- Optimize validation rules
- Consider lazy loading for large forms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review example forms

---

**Built with React, Material-UI, and ❤️**
