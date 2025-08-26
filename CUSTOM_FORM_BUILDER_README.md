# Custom Form Builder

A comprehensive React.js-based custom form builder that allows you to create, edit, and manage dynamic forms with drag-and-drop functionality.

## Features

### 🎯 Form Components

- **Text Input** - Single line text input
- **Text Area** - Multi-line text input
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

- **Drag & Drop** - Intuitive drag-and-drop interface for building forms
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
│   ├── enhanced-form-builder.jsx      # Main form builder component
│   ├── form-components-panel.jsx      # Left panel with form components
│   ├── form-content-panel.jsx         # Center panel for form content
│   ├── enhanced-field-properties.jsx  # Right panel for field properties
│   ├── draggable-field.jsx            # Draggable field component
│   ├── enhanced-form-renderer.jsx     # Form rendering component
│   └── forms-list.jsx                 # Forms list and management
├── lib/
│   ├── form-service.js                # API service for forms
│   └── local-storage-service.js       # Local storage service (dev)
└── pages/
    ├── custom-form/                    # Form builder page
    ├── form-view/                      # Form viewing page
    └── forms-list/                     # Forms management page
```

## Usage

### 1. Creating a New Form

1. Navigate to `/custom-form`
2. Use the left panel to drag form components
3. Drop components in the center content area
4. Select fields to edit properties in the right panel
5. Save your form

### 2. Building Forms

#### Adding Components

- **Click** any component in the left panel to add it instantly
- **Drag & Drop** components from left panel to content area
- Components automatically get unique IDs and default properties

#### Field Properties

Each field type has specific properties:

**Basic Properties:**

- Label, ID, Placeholder, Required, Disabled

**Type-Specific Properties:**

- **Text/Textarea**: Rows, default value
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
2. Update `enhanced-field-properties.jsx` with properties
3. Add rendering logic to `enhanced-form-renderer.jsx`
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
  fields: [
    {
      id: "field_1",
      type: "text|textarea|radio|checkbox|dropdown|number|date|attachment|link|table|richtext|signature|wizard",
      label: "Field Label",
      required: false,
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
  fields: [
    { type: "text", label: "Provider Name", required: true },
    { type: "text", label: "Provider Number", required: true },
    { type: "date", label: "Service Date", required: true },
    { type: "textarea", label: "Service Description", required: true },
    { type: "number", label: "Amount", required: true, min: 0 }
  ]
}
```

### Client Profile Form

```javascript
{
  title: "Client Profile",
  type: "profile",
  fields: [
    { type: "text", label: "Full Name", required: true },
    { type: "date", label: "Date of Birth", required: true },
    { type: "textarea", label: "Address", required: true },
    { type: "checkbox", label: "Allergies", options: ["Medication", "Food", "None"] },
    { type: "signature", label: "Client Signature", required: true }
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
