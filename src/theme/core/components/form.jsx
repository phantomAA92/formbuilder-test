import { formLabelClasses } from '@mui/material/FormLabel';
import { inputLabelClasses } from '@mui/material/InputLabel';

import { getInputTypography } from './text-field';

// ----------------------------------------------------------------------

const MuiFormControl = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    variant: 'outlined',
  },
};

/**
 * Applies label styles to TextField and Select.
 */
const MuiInputLabel = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      variants: [
        {
          props: (props) => !props.shrink,
          style: {
            ...getInputTypography(theme, ['fontSize', 'lineHeight']),
            color: theme.vars.palette.text.disabled,
          },
        },
        {
          props: (props) => !!props.shrink,
          style: {
            fontWeight: theme.typography.fontWeightSemiBold,
            [`&.${inputLabelClasses.focused}:not(.${inputLabelClasses.error})`]: {
              color: 'inherit',
            },
          },
        },
        {
          props: (props) => !!props.shrink && props.variant === 'filled' && props.size === 'medium',
          style: {
            transform: 'translate(12px, 6px) scale(0.75)',
          },
        },
      ],
    }),
  },
};

/**
 * Applies label styles to Checkbox, RadioGroup, Switch.
 */
const MuiFormLabel = {
  //   // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      [`&.${formLabelClasses.disabled}`]: {
        color: theme.vars.palette.action.disabled,
      },
      variants: [
        {
          props: (props) => !props.error,
          style: {
            [`&.${formLabelClasses.focused}`]: {
              color: theme.vars.palette.text.secondary,
            },
          },
        },
      ],
    }),
  },
};

const MuiFormControlLabel = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    label: ({ theme }) => ({
      ...theme.typography.body2,
    }),
  },
};

const MuiFormHelperText = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    component: 'div',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.5),
      margin: theme.spacing(0.75, 1.5, 0, 1.5),
      '& > svg': { width: 16, height: 16 },
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const form = {
  MuiFormLabel,
  MuiInputLabel,
  MuiFormControl,
  MuiFormHelperText,
  MuiFormControlLabel,
};
