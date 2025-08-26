import axios from './axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class FormService {
  // Save form to database
  static async saveForm(formData) {
    try {
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

  // Generate report from form data
  static async generateReport(formId, reportType, options = {}) {
    try {
      const response = await axios.post(`${API_BASE_URL}/forms/${formId}/reports`, {
        reportType,
        options
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

// Mock data for development (remove in production)
export const mockForms = [
  {
    id: '1',
    title: 'DMAS 301 Form',
    description: 'Virginia Department of Medical Assistance Services Form 301',
    type: 'report',
    fields: [
      {
        id: '1',
        type: 'text',
        label: 'Provider Name',
        required: true
      },
      {
        id: '2',
        type: 'text',
        label: 'Provider Number',
        required: true
      },
      {
        id: '3',
        type: 'date',
        label: 'Service Date',
        required: true
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'DMAS 302 Form',
    description: 'Virginia Department of Medical Assistance Services Form 302',
    type: 'report',
    fields: [
      {
        id: '1',
        type: 'text',
        label: 'Client Name',
        required: true
      },
      {
        id: '2',
        type: 'text',
        label: 'Client ID',
        required: true
      },
      {
        id: '3',
        type: 'textarea',
        label: 'Service Description',
        required: true
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

export default FormService; 