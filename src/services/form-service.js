import axios from '../lib/axios';

// Form service for handling database operations
export class FormService {
  // Save a new form or update existing form
  static async saveForm(formData) {
    try {
      if (formData.id) {
        // Update existing form
        const response = await axios.put(`/api/forms/${formData.id}`, formData);
        return response.data;
      } else {
        // Create new form
        const response = await axios.post('/api/forms', formData);
        return response.data;
      }
    } catch (error) {
      console.error('Error saving form:', error);
      throw new Error('Failed to save form');
    }
  }

  // Get all forms
  static async getForms() {
    try {
      const response = await axios.get('/api/forms');
      return response.data;
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw new Error('Failed to fetch forms');
    }
  }

  // Get a specific form by ID
  static async getFormById(formId) {
    try {
      const response = await axios.get(`/api/forms/${formId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching form:', error);
      throw new Error('Failed to fetch form');
    }
  }

  // Delete a form
  static async deleteForm(formId) {
    try {
      await axios.delete(`/api/forms/${formId}`);
      return true;
    } catch (error) {
      console.error('Error deleting form:', error);
      throw new Error('Failed to delete form');
    }
  }

  // Submit form data
  static async submitFormData(formId, formData) {
    try {
      const response = await axios.post(`/api/forms/${formId}/submit`, formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw new Error('Failed to submit form');
    }
  }

  // Get form submissions
  static async getFormSubmissions(formId) {
    try {
      const response = await axios.get(`/api/forms/${formId}/submissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching form submissions:', error);
      throw new Error('Failed to fetch form submissions');
    }
  }

  // Search forms by criteria
  static async searchForms(searchCriteria) {
    try {
      const response = await axios.get('/api/forms/search', { params: searchCriteria });
      return response.data;
    } catch (error) {
      console.error('Error searching forms:', error);
      throw new Error('Failed to search forms');
    }
  }

  // Get forms by category (e.g., DMAS 301, DMAS 302, etc.)
  static async getFormsByCategory(category) {
    try {
      const response = await axios.get(`/api/forms/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching forms by category:', error);
      throw new Error('Failed to fetch forms by category');
    }
  }

  // Clone an existing form
  static async cloneForm(formId, newTitle) {
    try {
      const response = await axios.post(`/api/forms/${formId}/clone`, { title: newTitle });
      return response.data;
    } catch (error) {
      console.error('Error cloning form:', error);
      throw new Error('Failed to clone form');
    }
  }

  // Export form as template
  static async exportFormTemplate(formId) {
    try {
      const response = await axios.get(`/api/forms/${formId}/export`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting form template:', error);
      throw new Error('Failed to export form template');
    }
  }

  // Import form from template
  static async importFormTemplate(templateFile) {
    try {
      const formData = new FormData();
      formData.append('template', templateFile);
      
      const response = await axios.post('/api/forms/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing form template:', error);
      throw new Error('Failed to import form template');
    }
  }
}

// Mock data for development/testing
export const mockForms = [
  {
    id: '1',
    title: 'DMAS 301 - Initial Assessment',
    description: 'Initial assessment form for adult daycare services',
    category: 'DMAS 301',
    fields: [
      {
        id: 'field1',
        type: 'text',
        label: 'Client Name',
        required: true,
        placeholder: 'Enter client full name'
      },
      {
        id: 'field2',
        type: 'date',
        label: 'Assessment Date',
        required: true
      },
      {
        id: 'field3',
        type: 'textarea',
        label: 'Assessment Notes',
        required: false,
        rows: 4,
        placeholder: 'Enter assessment observations and notes'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'DMAS 302 - Progress Report',
    description: 'Progress report form for tracking client improvement',
    category: 'DMAS 302',
    fields: [
      {
        id: 'field1',
        type: 'text',
        label: 'Client Name',
        required: true,
        placeholder: 'Enter client full name'
      },
      {
        id: 'field2',
        type: 'date',
        label: 'Report Date',
        required: true
      },
      {
        id: 'field3',
        type: 'wizard',
        label: 'Progress Assessment',
        required: true,
        steps: [
          {
            title: 'Physical Health',
            fields: [
              {
                id: 'physical1',
                type: 'radio',
                label: 'Mobility Status',
                required: true,
                options: ['Independent', 'Assisted', 'Dependent']
              },
              {
                id: 'physical2',
                type: 'textarea',
                label: 'Physical Health Notes',
                required: false,
                rows: 3
              }
            ]
          },
          {
            title: 'Mental Health',
            fields: [
              {
                id: 'mental1',
                type: 'checkbox',
                label: 'Mental Health Concerns',
                required: false,
                options: ['Depression', 'Anxiety', 'Memory Issues', 'Behavioral Issues']
              },
              {
                id: 'mental2',
                type: 'textarea',
                label: 'Mental Health Notes',
                required: false,
                rows: 3
              }
            ]
          },
          {
            title: 'Social Engagement',
            fields: [
              {
                id: 'social1',
                type: 'radio',
                label: 'Social Participation Level',
                required: true,
                options: ['High', 'Medium', 'Low']
              },
              {
                id: 'social2',
                type: 'textarea',
                label: 'Social Engagement Notes',
                required: false,
                rows: 3
              }
            ]
          }
        ]
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

// Local storage service for development/testing
export class LocalFormService {
  static STORAGE_KEY = 'custom_forms';

  static saveForm(formData) {
    try {
      const forms = this.getForms();
      
      if (formData.id) {
        // Update existing form
        const index = forms.findIndex(form => form.id === formData.id);
        if (index !== -1) {
          forms[index] = { ...formData, updatedAt: new Date().toISOString() };
        }
      } else {
        // Create new form
        const newForm = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        forms.push(newForm);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(forms));
      return formData.id ? formData : { ...formData, id: Date.now().toString() };
    } catch (error) {
      console.error('Error saving form to local storage:', error);
      throw new Error('Failed to save form');
    }
  }

  static getForms() {
    try {
      const forms = localStorage.getItem(this.STORAGE_KEY);
      return forms ? JSON.parse(forms) : [];
    } catch (error) {
      console.error('Error reading forms from local storage:', error);
      return [];
    }
  }

  static getFormById(formId) {
    try {
      const forms = this.getForms();
      return forms.find(form => form.id === formId);
    } catch (error) {
      console.error('Error reading form from local storage:', error);
      return null;
    }
  }

  static deleteForm(formId) {
    try {
      const forms = this.getForms();
      const filteredForms = forms.filter(form => form.id !== formId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredForms));
      return true;
    } catch (error) {
      console.error('Error deleting form from local storage:', error);
      throw new Error('Failed to delete form');
    }
  }

  static submitFormData(formId, formData) {
    try {
      const submissions = JSON.parse(localStorage.getItem('form_submissions') || '{}');
      if (!submissions[formId]) {
        submissions[formId] = [];
      }
      
      const submission = {
        id: Date.now().toString(),
        formId,
        data: formData,
        submittedAt: new Date().toISOString()
      };
      
      submissions[formId].push(submission);
      localStorage.setItem('form_submissions', JSON.stringify(submissions));
      
      return submission;
    } catch (error) {
      console.error('Error submitting form data to local storage:', error);
      throw new Error('Failed to submit form data');
    }
  }

  static getFormSubmissions(formId) {
    try {
      const submissions = JSON.parse(localStorage.getItem('form_submissions') || '{}');
      return submissions[formId] || [];
    } catch (error) {
      console.error('Error reading form submissions from local storage:', error);
      return [];
    }
  }
} 