# Adult Daycare Management System

A comprehensive form builder and management system designed specifically for adult daycare facilities. This system allows you to create dynamic forms, manage caregiver and client profiles, and generate DMAS reports efficiently.

## Features

### 🏗️ Custom Form Builder
- **Drag & Drop Interface**: Intuitive form building with visual components
- **Multiple Field Types**: Support for text, textarea, radio buttons, checkboxes, dropdowns, numbers, dates, file uploads, links, tables, rich text, and signatures
- **Form Templates**: Save and reuse form configurations
- **Real-time Preview**: See how your forms will look to users as you build them

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
│       ├── form-components-panel.jsx    # Available form components
│       ├── form-field.jsx              # Individual field rendering
│       ├── field-properties.jsx        # Field configuration panel
│       ├── form-preview.jsx            # Form preview component
│       └── index.jsx                   # Main form builder
├── pages/
│   ├── custom-form/            # Custom form builder page
│   ├── caregiver/              # Caregiver management
│   └── dashboard/              # Main dashboard
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

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating Custom Forms

1. Navigate to the **Custom Form Builder** from the main dashboard
2. Use the left panel to add form components (text fields, checkboxes, etc.)
3. Configure field properties in the right panel
4. Preview your form in real-time
5. Save your form configuration

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

## Technology Stack

- **Frontend**: React 19, Material-UI 7
- **State Management**: React Hooks
- **Form Handling**: React Hook Form
- **Routing**: React Router 7
- **Build Tool**: Vite 6
- **Styling**: Emotion, Material-UI System

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
