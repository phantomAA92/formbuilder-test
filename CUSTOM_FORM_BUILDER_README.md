# Custom Form Builder

A comprehensive React.js-based custom form builder that allows users to create, edit, and manage dynamic forms with drag-and-drop functionality.

## Features

### 🎯 Core Functionality
- **Visual Form Builder**: Intuitive drag-and-drop interface for building forms
- **Component Library**: Rich set of form components including text, textarea, radio, checkbox, dropdown, number, date, file upload, link, table, rich text, signature, and multi-step wizard
- **Real-time Preview**: Live preview of forms as you build them
- **Form Management**: Save, edit, clone, and delete custom forms
- **Database Integration**: Save forms to database and render them dynamically

### 🧩 Form Components

#### Basic Input Fields
- **Text Input**: Single-line text input with placeholder and validation
- **Text Area**: Multi-line text input with configurable rows
- **Number Input**: Numeric input with min/max validation
- **Date Picker**: Date selection with calendar interface

#### Choice Fields
- **Radio Buttons**: Single choice selection from multiple options
- **Checkboxes**: Multiple choice selection from options
- **Dropdown**: Select from predefined options

#### Advanced Fields
- **File Upload**: File attachment with configurable file types and multiple file support
- **Link Input**: URL input with validation
- **Table**: Dynamic table with configurable columns and rows
- **Rich Text**: Rich text editor for formatted content
- **Signature**: Digital signature capture
- **Multi-Step Wizard**: Complex forms broken into logical steps

### 🎨 User Interface
- **Three-Panel Layout**: Components panel, form builder, and properties panel
- **Drag & Drop**: Reorder form fields by dragging them
- **Responsive Design**: Works on desktop and tablet devices
- **Material-UI**: Modern, accessible UI components

### 💾 Data Management
- **Local Storage**: Forms saved locally for development/testing
- **Database Ready**: Service layer prepared for backend integration
- **Form Submissions**: Collect and store form responses
- **Export/Import**: Save forms as templates and import them

## Usage

### 1. Creating a New Form

1. Navigate to the Custom Form Builder page
2. Click "Create New Form" button
3. Enter form title and description
4. Add form components from the left panel
5. Configure field properties in the right panel
6. Save your form

### 2. Adding Form Components

- **Click to Add**: Click any component in the left panel to add it to your form
- **Drag & Drop**: Drag components from the left panel to the form area
- **Reorder Fields**: Drag existing fields to reorder them in the form

### 3. Configuring Field Properties

- **Basic Properties**: Label, required status, help text
- **Field-Specific Properties**: Placeholders, options, validation rules
- **Advanced Settings**: File types, table structure, wizard steps

### 4. Managing Forms

- **Save Forms**: Save forms with unique IDs
- **Edit Forms**: Modify existing forms
- **Clone Forms**: Create copies of existing forms
- **Delete Forms**: Remove unwanted forms
- **Export/Import**: Share forms as templates

## Technical Architecture

### Components Structure

```
src/components/form-builder/
├── enhanced-form-builder.jsx    # Main form builder with drag & drop
├── enhanced-form-field.jsx      # Enhanced field rendering
├── enhanced-field-properties.jsx # Field property editing
├── form-components-panel.jsx    # Component library panel
├── form-renderer.jsx           # Form rendering for users
├── forms-list.jsx              # Form management interface
├── form-field.jsx              # Basic field rendering
├── field-properties.jsx        # Basic field properties
└── form-preview.jsx            # Form preview component
```

### Services

```
src/services/
└── form-service.js             # Form CRUD operations
```

### Key Features

- **React Hooks**: Uses modern React patterns for state management
- **Material-UI**: Consistent, accessible UI components
- **HTML5 Drag & Drop**: Native browser drag and drop functionality
- **Form Validation**: Built-in validation with react-hook-form
- **Responsive Design**: Mobile-friendly interface

## Database Integration

### Form Storage Schema

```javascript
{
  id: "unique-form-id",
  title: "Form Title",
  description: "Form Description",
  category: "DMAS 301",
  fields: [
    {
      id: "field-id",
      type: "text",
      label: "Field Label",
      required: true,
      placeholder: "Enter text...",
      // ... other properties
    }
  ],
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

### API Endpoints

The form service is prepared for these endpoints:

- `POST /api/forms` - Create new form
- `GET /api/forms` - Get all forms
- `GET /api/forms/:id` - Get specific form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `POST /api/forms/:id/submit` - Submit form data
- `GET /api/forms/:id/submissions` - Get form submissions

## Use Cases

### Healthcare Forms
- **DMAS 301**: Initial assessment forms
- **DMAS 302**: Progress report forms
- **Patient Profiles**: Dynamic patient information forms
- **Medical Assessments**: Customizable evaluation forms

### Business Applications
- **User Profiles**: Dynamic user registration forms
- **Client Profiles**: Customer information management
- **Survey Forms**: Custom survey creation
- **Data Collection**: Flexible data gathering forms

### Report Generation
- **Dynamic Reports**: Generate reports from form data
- **Data Export**: Export form submissions to various formats
- **Analytics**: Analyze form usage and responses

## Development

### Prerequisites
- Node.js 20+
- React 19+
- Material-UI 7+

### Installation
```bash
npm install
npm run dev
```

### Building
```bash
npm run build
```

## Future Enhancements

- **Conditional Logic**: Show/hide fields based on other field values
- **Calculations**: Mathematical operations between fields
- **File Processing**: Advanced file handling and validation
- **Multi-language Support**: Internationalization
- **Advanced Validation**: Custom validation rules
- **Form Templates**: Pre-built form templates
- **Collaboration**: Multi-user form editing
- **Version Control**: Form versioning and rollback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 