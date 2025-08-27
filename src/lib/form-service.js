import axios from './axios';
import LocalStorageService from './local-storage-service';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USE_LOCAL_STORAGE = import.meta.env.MODE === 'development';

export class FormService {
  // Save form to database
  static async saveForm(formData) {
    try {
      if (USE_LOCAL_STORAGE) {
        return LocalStorageService.saveForm(formData);
      }
      
      const response = await axios.post(`${API_BASE_URL}/forms`, formData);
      return response.data;
    } catch (error) {
      console.error('Error saving form:', error);
      throw error;
    }
  }

  // Get all forms
  static async getForms() {
    try {
      if (USE_LOCAL_STORAGE) {
        const forms = LocalStorageService.getForms();
        // Ensure we return an array even if localStorage returns null/undefined
        return Array.isArray(forms) ? forms : [];
      }
      
      const response = await axios.get(`${API_BASE_URL}/forms`);
      return response.data;
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw error;
    }
  }

  // Get form by ID
  static async getFormById(formId) {
    try {
      if (USE_LOCAL_STORAGE) {
        return LocalStorageService.getFormById(formId);
      }
      
      const response = await axios.get(`${API_BASE_URL}/forms/${formId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching form:', error);
      throw error;
    }
  }

  // Update form
  static async updateForm(formId, formData) {
    try {
      if (USE_LOCAL_STORAGE) {
        return LocalStorageService.updateForm(formId, formData);
      }
      
      const response = await axios.put(`${API_BASE_URL}/forms/${formId}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating form:', error);
      throw error;
    }
  }

  // Delete form
  static async deleteForm(formId) {
    try {
      if (USE_LOCAL_STORAGE) {
        return LocalStorageService.deleteForm(formId);
      }
      
      const response = await axios.delete(`${API_BASE_URL}/forms/${formId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting form:', error);
      throw error;
    }
  }

  // Submit form data
  static async submitFormData(formId, formData) {
    try {
      if (USE_LOCAL_STORAGE) {
        return LocalStorageService.submitFormData(formId, formData);
      }
      
      const response = await axios.post(`${API_BASE_URL}/forms/${formId}/submit`, formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting form data:', error);
      throw error;
    }
  }

  // Get form submissions
  static async getFormSubmissions(formId) {
    try {
      if (USE_LOCAL_STORAGE) {
        return LocalStorageService.getFormSubmissions(formId);
      }
      
      const response = await axios.get(`${API_BASE_URL}/forms/${formId}/submissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching form submissions:', error);
      throw error;
    }
  }

  // Export form data (for reports like DMAS 301, 302)
  static async exportFormData(formId, format = 'pdf') {
    try {
      if (USE_LOCAL_STORAGE) {
        return LocalStorageService.exportFormData(formId, format);
      }
      
      const response = await axios.get(`${API_BASE_URL}/forms/${formId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting form data:', error);
      throw error;
    }
  }



  // Clear all local storage data (development only)
  static clearLocalData() {
    if (USE_LOCAL_STORAGE) {
      return LocalStorageService.clearAllData();
    }
    throw new Error('Local storage clearing is only available in development mode');
  }
}

// Mock data for development (remove in production)
export const mockForms = [
  {
    id: '1',
    title: 'Client Profile Form',
    description: 'Comprehensive client information and assessment form',
    type: 'profile',
    fields: [
      {
        id: 'field_1',
        type: 'text',
        label: 'Full Name',
        required: true,
        placeholder: 'Enter full name'
      },
      {
        id: 'field_2',
        type: 'date',
        label: 'Date of Birth',
        required: true
      },
      {
        id: 'field_3',
        type: 'text',
        label: 'Address',
        required: true,
        placeholder: 'Enter full address'
      },
      {
        id: 'field_4',
        type: 'text',
        label: 'Phone Number',
        required: true,
        placeholder: 'Enter phone number'
      },
      {
        id: 'field_5',
        type: 'text',
        label: 'Emergency Contact',
        required: false,
        placeholder: 'Enter emergency contact name and number'
      },
      {
        id: 'field_6',
        type: 'textarea',
        label: 'Medical History',
        required: false,
        placeholder: 'Enter relevant medical history',
        rows: 6
      },
      {
        id: 'field_7',
        type: 'checkbox',
        label: 'Allergies',
        required: false,
        options: ['Medication', 'Food', 'Environmental', 'None']
      },
      {
        id: 'field_8',
        type: 'signature',
        label: 'Client Signature',
        required: true,
        width: 300,
        height: 150
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Caregiver Registration',
    description: 'Multi-step registration form for new caregivers',
    type: 'custom',
    fields: [
      {
        id: 'field_1',
        type: 'text',
        label: 'First Name',
        required: true,
        placeholder: 'Enter first name'
      },
      {
        id: 'field_2',
        type: 'text',
        label: 'Last Name',
        required: true,
        placeholder: 'Enter last name'
      },
      {
        id: 'field_3',
        type: 'text',
        label: 'Email Address',
        required: true,
        placeholder: 'Enter email address'
      },
      {
        id: 'field_4',
        type: 'text',
        label: 'Phone Number',
        required: true,
        placeholder: 'Enter phone number'
      },
      {
        id: 'field_5',
        type: 'dropdown',
        label: 'Experience Level',
        required: true,
        options: ['Beginner (0-1 years)', 'Intermediate (2-5 years)', 'Advanced (5+ years)']
      },
      {
        id: 'field_6',
        type: 'checkbox',
        label: 'Certifications',
        required: false,
        options: ['CPR Certified', 'First Aid Certified', 'Nursing License', 'CNA License', 'Other']
      },
      {
        id: 'field_7',
        type: 'textarea',
        label: 'Why do you want to be a caregiver?',
        required: true,
        placeholder: 'Please describe your motivation and goals',
        rows: 4
      },
      {
        id: 'field_8',
        type: 'attachment',
        label: 'Resume/CV',
        required: true,
        accept: '.pdf,.doc,.docx',
        multiple: false
      }
    ],
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '3',
    title: 'Daily Activity Log',
    description: 'Track daily activities and client interactions',
    type: 'custom',
    fields: [
      {
        id: 'field_1',
        type: 'date',
        label: 'Date',
        required: true
      },
      {
        id: 'field_2',
        type: 'text',
        label: 'Client Name',
        required: true,
        placeholder: 'Enter client name'
      },
      {
        id: 'field_3',
        type: 'dropdown',
        label: 'Activity Type',
        required: true,
        options: ['Personal Care', 'Meal Preparation', 'Medication Reminder', 'Exercise', 'Social Activity', 'Medical Appointment', 'Other']
      },
      {
        id: 'field_4',
        type: 'textarea',
        label: 'Activity Description',
        required: true,
        placeholder: 'Describe the activity in detail',
        rows: 4
      },
      {
        id: 'field_5',
        type: 'number',
        label: 'Duration (minutes)',
        required: true,
        placeholder: 'Enter duration',
        min: 1,
        max: 480
      },
      {
        id: 'field_6',
        type: 'radio',
        label: 'Client Mood',
        required: true,
        options: ['Excellent', 'Good', 'Fair', 'Poor']
      },
      {
        id: 'field_7',
        type: 'textarea',
        label: 'Notes',
        required: false,
        placeholder: 'Additional notes or observations',
        rows: 3
      }
    ],
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    title: 'Incident Report Form',
    description: 'Document and report incidents or accidents',
    type: 'custom',
    fields: [
      {
        id: 'field_1',
        type: 'date',
        label: 'Incident Date',
        required: true
      },
      {
        id: 'field_2',
        type: 'text',
        label: 'Time of Incident',
        required: true,
        placeholder: 'Enter time (e.g., 2:30 PM)'
      },
      {
        id: 'field_3',
        type: 'text',
        label: 'Location',
        required: true,
        placeholder: 'Where did the incident occur?'
      },
      {
        id: 'field_4',
        type: 'text',
        label: 'Person(s) Involved',
        required: true,
        placeholder: 'Names of people involved'
      },
      {
        id: 'field_5',
        type: 'textarea',
        label: 'Description of Incident',
        required: true,
        placeholder: 'Provide a detailed description of what happened',
        rows: 6
      },
      {
        id: 'field_6',
        type: 'dropdown',
        label: 'Severity Level',
        required: true,
        options: ['Minor', 'Moderate', 'Major', 'Critical']
      },
      {
        id: 'field_7',
        type: 'checkbox',
        label: 'Actions Taken',
        required: true,
        options: ['First Aid Administered', 'Medical Attention Sought', 'Family Notified', 'Supervisor Notified', 'Documentation Completed']
      },
      {
        id: 'field_8',
        type: 'textarea',
        label: 'Preventive Measures',
        required: false,
        placeholder: 'What can be done to prevent similar incidents?',
        rows: 4
      },
      {
        id: 'field_9',
        type: 'attachment',
        label: 'Supporting Documents',
        required: false,
        accept: '.pdf,.jpg,.png,.doc,.docx',
        multiple: true,
        maxSize: 10
      }
    ],
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z'
  },
  {
    id: '5',
    title: 'Medication Management',
    description: 'Track medication administration and schedules',
    type: 'custom',
    fields: [
      {
        id: 'field_1',
        type: 'text',
        label: 'Client Name',
        required: true,
        placeholder: 'Enter client name'
      },
      {
        id: 'field_2',
        type: 'text',
        label: 'Medication Name',
        required: true,
        placeholder: 'Enter medication name'
      },
      {
        id: 'field_3',
        type: 'text',
        label: 'Dosage',
        required: true,
        placeholder: 'Enter dosage (e.g., 10mg)'
      },
      {
        id: 'field_4',
        type: 'dropdown',
        label: 'Frequency',
        required: true,
        options: ['Once daily', 'Twice daily', 'Three times daily', 'As needed', 'Other']
      },
      {
        id: 'field_5',
        type: 'date',
        label: 'Start Date',
        required: true
      },
      {
        id: 'field_6',
        type: 'date',
        label: 'End Date',
        required: false
      },
      {
        id: 'field_7',
        type: 'textarea',
        label: 'Special Instructions',
        required: false,
        placeholder: 'Any special instructions or side effects to watch for',
        rows: 3
      },
      {
        id: 'field_8',
        type: 'checkbox',
        label: 'Administration Times',
        required: true,
        options: ['Morning', 'Afternoon', 'Evening', 'Bedtime']
      }
    ],
    createdAt: '2024-01-19T16:20:00Z',
    updatedAt: '2024-01-19T16:20:00Z'
  }
];

export default FormService; 