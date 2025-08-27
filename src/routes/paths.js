// ----------------------------------------------------------------------

// Adult Daycare System Routes
export const ADULT_DAYCARE_PATHS = {
  root: '/',
  dashboard: '/dashboard',
  customForm: '/custom-form',
  customFormEdit: '/custom-form/:formId',
  formsList: '/forms-list',
  formView: '/form-view/:formId',
  caregivers: {
    create: '/caregiver/create',
    list: '/caregiver/list',
    edit: '/caregiver/edit/:id'
  },

  clients: {
    create: '/clients/create',
    list: '/clients/list',
    edit: '/clients/edit/:id'
  },
  coordinators: {
    create: '/coordinators/create',
    list: '/coordinators/list',
    edit: '/coordinators/edit/:id'
  }
};
