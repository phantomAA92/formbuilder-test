const STORAGE_KEY = 'custom_forms';

export class LocalStorageService {
  static getForms() {
    try {
      const forms = localStorage.getItem(STORAGE_KEY);
      return forms ? JSON.parse(forms) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  static getFormById(formId) {
    try {
      const forms = this.getForms();
      return forms.find(form => form.id === formId);
    } catch (error) {
      console.error('Error getting form by ID:', error);
      return null;
    }
  }

  static saveForm(formData) {
    try {
      const forms = this.getForms();
      const newForm = {
        ...formData,
        id: formData.id || `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      forms.push(newForm);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
      
      return newForm;
    } catch (error) {
      console.error('Error saving form to localStorage:', error);
      throw error;
    }
  }

  static updateForm(formId, formData) {
    try {
      const forms = this.getForms();
      const formIndex = forms.findIndex(form => form.id === formId);
      
      if (formIndex === -1) {
        throw new Error('Form not found');
      }
      
      const updatedForm = {
        ...forms[formIndex],
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      forms[formIndex] = updatedForm;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
      
      return updatedForm;
    } catch (error) {
      console.error('Error updating form in localStorage:', error);
      throw error;
    }
  }

  static deleteForm(formId) {
    try {
      const forms = this.getForms();
      const filteredForms = forms.filter(form => form.id !== formId);
      
      if (forms.length === filteredForms.length) {
        throw new Error('Form not found');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredForms));
      
      return { success: true, message: 'Form deleted successfully' };
    } catch (error) {
      console.error('Error deleting form from localStorage:', error);
      throw error;
    }
  }

  static submitFormData(formId, formData) {
    try {
      const submissionsKey = `form_submissions_${formId}`;
      const submissions = JSON.parse(localStorage.getItem(submissionsKey) || '[]');
      
      const newSubmission = {
        id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        formId,
        data: formData,
        submittedAt: new Date().toISOString()
      };
      
      submissions.push(newSubmission);
      localStorage.setItem(submissionsKey, JSON.stringify(submissions));
      
      return newSubmission;
    } catch (error) {
      console.error('Error submitting form data to localStorage:', error);
      throw error;
    }
  }

  static getFormSubmissions(formId) {
    try {
      const submissionsKey = `form_submissions_${formId}`;
      return JSON.parse(localStorage.getItem(submissionsKey) || '[]');
    } catch (error) {
      console.error('Error getting form submissions from localStorage:', error);
      return [];
    }
  }

  static clearAllData() {
    try {
      // Clear forms
      localStorage.removeItem(STORAGE_KEY);
      
      // Clear all form submissions
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('form_submissions_')) {
          localStorage.removeItem(key);
        }
      });
      
      return { success: true, message: 'All data cleared successfully' };
    } catch (error) {
      console.error('Error clearing localStorage data:', error);
      throw error;
    }
  }

  static exportFormData(formId, format = 'json') {
    try {
      const form = this.getFormById(formId);
      if (!form) {
        throw new Error('Form not found');
      }
      
      if (format === 'json') {
        const dataStr = JSON.stringify(form, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        return dataBlob;
      } else if (format === 'csv') {
        // Simple CSV export for form fields
        const csvData = this.convertFormToCSV(form);
        const dataBlob = new Blob([csvData], { type: 'text/csv' });
        return dataBlob;
      } else {
        throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Error exporting form data:', error);
      throw error;
    }
  }

  static convertFormToCSV(form) {
    const headers = ['Field ID', 'Field Type', 'Label', 'Required', 'Options', 'Description'];
    const rows = [headers.join(',')];
    
    form.fields?.forEach(field => {
      const row = [
        field.id || '',
        field.type || '',
        field.label || '',
        field.required ? 'Yes' : 'No',
        field.options ? field.options.join(';') : '',
        field.description || ''
      ].map(cell => `"${cell}"`).join(',');
      
      rows.push(row);
    });
    
    return rows.join('\n');
  }

  static generateReport(formId, reportType, options = {}) {
    try {
      const form = this.getFormById(formId);
      const submissions = this.getFormSubmissions(formId);
      
      if (!form) {
        throw new Error('Form not found');
      }
      
      let report = {
        formId,
        reportType,
        generatedAt: new Date().toISOString(),
        formTitle: form.title,
        totalSubmissions: submissions.length,
        data: {}
      };
      
      switch (reportType) {
        case 'dmas':
          report.data = this.generateDMASReport(form, submissions, options);
          break;
        case 'summary':
          report.data = this.generateSummaryReport(form, submissions, options);
          break;
        default:
          throw new Error(`Unsupported report type: ${reportType}`);
      }
      
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  static generateDMASReport(form, submissions, options) {
    // Generate DMAS 301/302 style report
    const reportData = {
      providerInfo: {},
      serviceData: [],
      totals: {
        totalServices: 0,
        totalAmount: 0
      }
    };
    
    // Extract provider information from form fields
    form.fields?.forEach(field => {
      if (field.label?.toLowerCase().includes('provider')) {
        reportData.providerInfo[field.id] = field.label;
      }
    });
    
    // Process submissions
    submissions.forEach(submission => {
      const serviceRecord = {
        date: submission.data.serviceDate || submission.submittedAt,
        clientId: submission.data.clientId || '',
        serviceType: submission.data.serviceType || '',
        amount: parseFloat(submission.data.amount) || 0
      };
      
      reportData.serviceData.push(serviceRecord);
      reportData.totals.totalServices++;
      reportData.totals.totalAmount += serviceRecord.amount;
    });
    
    return reportData;
  }

  static generateSummaryReport(form, submissions, options) {
    const summary = {
      fieldSummaries: {},
      submissionTrends: {},
      commonValues: {}
    };
    
    // Analyze each field
    form.fields?.forEach(field => {
      const fieldData = submissions.map(sub => sub.data[field.id]).filter(Boolean);
      
      summary.fieldSummaries[field.id] = {
        label: field.label,
        type: field.type,
        totalResponses: fieldData.length,
        responseRate: (fieldData.length / submissions.length * 100).toFixed(1) + '%'
      };
      
      // Analyze field-specific data
      if (field.type === 'checkbox' || field.type === 'radio' || field.type === 'dropdown') {
        const valueCounts = {};
        fieldData.forEach(value => {
          if (Array.isArray(value)) {
            value.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
          } else {
            valueCounts[value] = (valueCounts[value] || 0) + 1;
          }
        });
        summary.commonValues[field.id] = valueCounts;
      }
    });
    
    // Analyze submission trends
    const dateGroups = {};
    submissions.forEach(sub => {
      const date = new Date(sub.submittedAt).toDateString();
      dateGroups[date] = (dateGroups[date] || 0) + 1;
    });
    summary.submissionTrends = dateGroups;
    
    return summary;
  }
}

export default LocalStorageService;
