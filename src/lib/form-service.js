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
  }
];

export default FormService; 