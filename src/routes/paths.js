// ----------------------------------------------------------------------

// Adult Daycare System Routes
export const ADULT_DAYCARE_PATHS = {
  root: '/',
  dashboard: '/dashboard',
  customForm: '/custom-form',
  caregivers: {
    create: '/caregiver/create',
    list: '/caregiver/list',
    edit: '/caregiver/edit/:id'
  },
  reports: {
    dmas301: '/reports/dmas-301',
    dmas302: '/reports/dmas-302'
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
