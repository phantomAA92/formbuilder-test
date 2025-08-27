# Adult Daycare Management System

A comprehensive form builder and management system designed specifically for adult daycare facilities. This system allows you to create dynamic forms with advanced grid layouts, manage caregiver and client profiles, and generate DMAS reports efficiently.

## Features

### 🏗️ Advanced Custom Form Builder
- **Grid Layout System**: Multi-column grid layout (1-4 columns) with configurable positioning
- **Drag & Drop Interface**: Intuitive form building with visual components and precise positioning
- **Component Placement Options**: 
  - **Sequential Placement**: Click components to place them in logical order (first at 0,0, then sequentially)
  - **Random Placement**: Components placed at random positions for dynamic layouts
  - **Precise Placement**: Drag and drop components to exact grid positions
- **Component Repositioning**: Move existing components anywhere within the grid layout
- **Multiple Field Types**: Support for text, textarea, radio buttons, checkboxes, dropdowns, numbers, dates, file uploads, links, tables, rich text, signatures, and email inputs
- **Form Templates**: Save and reuse form configurations
- **Real-time Preview**: See how your forms will look to users as you build them
- **Grid Configuration**: Change column count (1-4) with automatic layout adaptation

### 👥 Caregiver Management
- **Registration Wizard**: Multi-step form wizard for caregiver registration
- **Profile Management**: Comprehensive caregiver profiles with qualifications and specializations
- **Document Management**: Upload and track certifications and background checks
- **Availability Tracking**: Manage caregiver schedules and preferences

### 👤 Client Management
- **Client Profiles**: Detailed client information and care requirements
- **Care Plans**: Create and manage individualized care plans
- **Service History**: Track all services provided to clients
- **Assessment Forms**: Dynamic assessment forms using the custom form builder

### 🎯 Coordinator Management
- **Case Management**: Assign and track care cases
- **Performance Monitoring**: Track caregiver and service performance
- **Assignment Tracking**: Manage client-caregiver assignments

## System Architecture

```
src/
├── components/
│   └── form-builder/           # Form building components
│       ├── form-builder.jsx           # Main form builder orchestrator
│       ├── form-components-panel.jsx  # Available form components (left panel)
│       ├── form-content-panel.jsx     # Grid layout and drag-drop area (center)
│       ├── field-properties.jsx       # Field configuration panel (right)
│       ├── draggable-field.jsx        # Draggable field wrapper
│       ├── form-renderer.jsx          # Form rendering for preview/submission
│       └── index.jsx                  # Main form builder export
├── pages/
│   ├── custom-form/            # Custom form builder page
│   ├── form-preview/           # Form preview page
│   ├── form-view/              # Form viewing/filling page
│   ├── forms-list/             # Forms management page
│   ├── caregiver/              # Caregiver management
│   └── dashboard/              # Main dashboard
├── lib/
│   ├── form-service.js         # API service for forms
│   └── local-storage-service.js # Local storage service (dev)
└── routes/
    └── paths.js                # Application routing
```

## Getting Started

### Prerequisites
- Node.js 20+
- Yarn or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd form-builder
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Start the development server:
```bash
yarn dev
# or
npm run dev
```

4. Open your browser and navigate to `http://localhost:3031`

## Usage

### Creating Custom Forms with Grid Layout

1. Navigate to the **Custom Form Builder** from the main dashboard
2. **Configure Grid Layout**: Use the "Columns" dropdown to set 1-4 columns (default: 2)
3. **Add Components** using three methods:
   - **Click**: Click components in the left panel for sequential placement
   - **Drag & Drop**: Drag components to specific grid cells for precise placement
   - **Random**: Components can be placed at random positions for dynamic layouts
4. **Reposition Components**: Drag existing components to new grid positions
5. **Configure Properties**: Select fields to edit properties in the right panel
6. **Preview**: Use the "Preview Form" button to see the final result
7. **Save**: Save your form configuration

### Grid Layout Features

#### Component Placement Strategies
- **Sequential Placement**: First component at (0,0), subsequent components follow logical order
- **Random Placement**: Components placed at random grid positions
- **Precise Placement**: Drag and drop to exact grid coordinates
- **Repositioning**: Move existing components anywhere in the grid

#### Grid Configuration
- **Column Count**: Configurable from 1-4 columns (default: 2)
- **Responsive Layout**: Grid adapts to different screen sizes
- **Visual Feedback**: Clear drop zones and drag indicators
- **Position Preservation**: Component positions saved and restored

### Registering Caregivers

1. Go to **Caregiver Management** → **Register New Caregiver**
2. Complete the multi-step registration wizard:
   - Personal Information
   - Professional Information
   - Availability & Preferences
   - References & Background
3. Submit the registration

## Form Field Types

| Field Type | Description | Use Case |
|------------|-------------|----------|
| Text | Single line text input | Names, IDs, short answers |
| Textarea | Multi-line text input | Descriptions, notes, long answers |
| Email | Email input with validation | Contact information |
| Radio Buttons | Single choice selection | Service types, preferences |
| Checkboxes | Multiple choice selection | Specializations, availability |
| Dropdown | Select from options | Categories, statuses |
| Number | Numeric input | Ages, quantities, rates |
| Date | Date selection | Birth dates, service dates |
| File Upload | Document attachment | Certifications, photos |
| Link | URL input | Website links, references |
| Table | Data table input | References, service lists |
| Rich Text | Formatted text | Care plans, detailed notes |
| Signature | Digital signature | Consent forms, agreements |

## Advanced Features

### Grid Layout System
- **Multi-column Layout**: Support for 1-4 columns with automatic adaptation
- **Component Positioning**: Precise control over component placement
- **Drag-and-Drop Repositioning**: Move components anywhere in the grid
- **Visual Grid Cells**: Clear drop zones and visual feedback
- **Position Data**: Each component stores its grid coordinates

### Form Building Workflow
1. **Grid Configuration**: Set desired column count
2. **Component Addition**: Use click, drag, or random placement
3. **Component Repositioning**: Drag existing components to new positions
4. **Property Configuration**: Edit field properties in real-time
5. **Preview and Save**: Test form and save configuration

### Data Synchronization
- **Grid Columns**: Synchronized between builder and preview
- **Component Positions**: Preserved across form saves and loads
- **Session Storage**: Temporary data storage for preview functionality
- **Backward Compatibility**: Support for forms without position data

## Technology Stack

- **Frontend**: React 19, Material-UI 7
- **State Management**: React Hooks
- **Form Handling**: React Hook Form
- **Drag & Drop**: React DnD with HTML5 backend
- **Routing**: React Router 7
- **Build Tool**: Vite 6
- **Styling**: Emotion, Material-UI System
- **Validation**: Zod schema validation

## Development

### Key Dependencies
```json
{
  "react": "^19.0.0",
  "react-dnd": "^16.0.1",
  "react-dnd-html5-backend": "^16.0.1",
  "react-hook-form": "^7.50.0",
  "@mui/material": "^7.0.0",
  "zod": "^3.23.0"
}
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This system is designed for adult daycare facilities and healthcare providers. Ensure compliance with local healthcare regulations and data privacy laws when implementing in production environments.
