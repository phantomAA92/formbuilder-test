import { parseCssVar } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

const MuiStepConnector = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      [parseCssVar(theme.vars.palette.StepConnector.border)]: theme.vars.palette.divider,
    }),
  },
};

const MuiStepContent = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      [parseCssVar(theme.vars.palette.StepContent.border)]: theme.vars.palette.divider,
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const stepper = {
  MuiStepConnector,
  MuiStepContent,
};
