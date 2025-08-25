import { varAlpha } from 'minimal-shared/utils';

import { inputBaseClasses } from '@mui/material/InputBase';
import { filledInputClasses } from '@mui/material/FilledInput';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { inputAdornmentClasses } from '@mui/material/InputAdornment';

// ----------------------------------------------------------------------

export const INPUT_TYPOGRAPHY = {
  fontSize: { base: 15, responsive: 16 },
  lineHeight: 24,
};

export const INPUT_PADDING = {
  base: {
    small: { paddingTop: 0, paddingBottom: 4 },
    medium: { paddingTop: 4, paddingBottom: 4 },
  },
  outlined: {
    small: { paddingTop: 8, paddingBottom: 8 },
    medium: { paddingTop: 16, paddingBottom: 16 },
  },
  filled: {
    small: { paddingTop: 20 },
    medium: { paddingTop: 24 },
    smallHidden: { paddingTop: 8, paddingBottom: 8 },
    mediumHidden: { paddingTop: 16, paddingBottom: 16 },
  },
};

export function getInputTypography(theme, keys) {
  const { fontSize, lineHeight } = INPUT_TYPOGRAPHY;

  const baseStyles = {
    fontSize: theme.typography.pxToRem(fontSize.base),
    height: `${lineHeight}px`,
    lineHeight: `${lineHeight}px`,
  };

  const responsiveStyles = {
    fontSize: theme.typography.pxToRem(fontSize.responsive),
    height: `${lineHeight}px`,
    lineHeight: `${lineHeight}px`,
  };

  return {
    ...Object.fromEntries(keys.map((k) => [k, baseStyles[k]])),
    [theme.breakpoints.down('sm')]: Object.fromEntries(keys.map((k) => [k, responsiveStyles[k]])),
  };
}

/* **********************************************************************
 * 🧩 InputBase
 * **********************************************************************/
export const inputBaseStyles = {
  root: (context, theme, classes) => ({
    '--disabled-color': theme.vars.palette.action.disabled,
    ...getInputTypography(theme, ['lineHeight']),
    [`&.${classes.disabled}`]: {
      [`& .${inputAdornmentClasses.root} *`]: { color: 'var(--disabled-color)' },
      [`& .${classes.input}`]: {
        ...(context === 'standard' && { WebkitTextFillColor: 'var(--disabled-color)' }),
        ...(context === 'picker' && { '& span': { color: 'var(--disabled-color)' } }),
      },
    },
  }),
  input: (context, theme) => ({
    ...(context === 'standard' && {
      ...getInputTypography(theme, ['fontSize', 'height', 'lineHeight']),
      '&:focus': { borderRadius: 'inherit' },
      '&::placeholder, &::-webkit-input-placeholder, &::-moz-placeholder, &:-ms-input-placeholder, &::-ms-input-placeholder':
        { color: theme.vars.palette.text.disabled },
    }),
    ...(context === 'picker' && {
      ...getInputTypography(theme, ['fontSize', 'lineHeight']),
      '& span': { lineHeight: 'inherit' },
    }),
  }),
};

export const inputBaseVariants = {
  root: [
    {
      props: (props) => !!props.multiline,
      style: { ...INPUT_PADDING.base.medium },
    },
    {
      props: (props) => !!props.multiline && props.size === 'small',
      style: { ...INPUT_PADDING.base.small },
    },
  ],
  input: [
    {
      props: {},
      style: { ...INPUT_PADDING.base.medium },
    },
    {
      props: ({ size, ownerState }) => (size || ownerState?.inputSize) === 'small',
      style: { ...INPUT_PADDING.base.small },
    },
  ],
};

const multilineInputVariants = [
  {
    props: (props) => !!props.multiline,
    style: { padding: 0 },
  },
];

const MuiInputBase = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      ...inputBaseStyles.root('standard', theme, inputBaseClasses),
      variants: inputBaseVariants.root,
    }),
    input: ({ theme }) => ({
      ...inputBaseStyles.input('standard', theme),
      variants: [...inputBaseVariants.input, ...multilineInputVariants],
    }),
  },
};

/* **********************************************************************
 * 🧩 Input
 * **********************************************************************/
export const inputStyles = {
  root: (theme) => ({
    '&::before': {
      borderBottomColor: theme.vars.palette.shared.inputUnderline,
    },
    '&::after': {
      borderBottomColor: theme.vars.palette.text.primary,
    },
  }),
};

const MuiInput = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => inputStyles.root(theme),
  },
};

/* **********************************************************************
 * 🧩 OutlinedInput
 * **********************************************************************/
export const outlinedInputStyles = {
  root: (theme, classes) => ({
    [`&.${classes.focused}:not(.${classes.error})`]: {
      [`& .${classes.notchedOutline}`]: {
        borderColor: theme.vars.palette.text.primary,
      },
    },
    [`&.${classes.disabled}`]: {
      [`& .${classes.notchedOutline}`]: {
        borderColor: theme.vars.palette.action.disabledBackground,
      },
    },
  }),
  notchedOutline: (theme) => ({
    borderColor: theme.vars.palette.shared.inputOutlined,
    transition: theme.transitions.create(['border-color'], {
      duration: theme.transitions.duration.shortest,
    }),
  }),
};

export const outlinedInputVariants = {
  root: [
    {
      props: (props) => !!props.multiline,
      style: { ...INPUT_PADDING.outlined.medium },
    },
    {
      props: (props) => !!props.multiline && props.size === 'small',
      style: { ...INPUT_PADDING.outlined.small },
    },
  ],
  input: [
    {
      props: {},
      style: { ...INPUT_PADDING.outlined.medium },
    },
    {
      props: ({ size, ownerState }) => (size || ownerState?.inputSize) === 'small',
      style: { ...INPUT_PADDING.outlined.small },
    },
  ],
};

const MuiOutlinedInput = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      ...outlinedInputStyles.root(theme, outlinedInputClasses),
      variants: outlinedInputVariants.root,
    }),
    input: { variants: [...outlinedInputVariants.input, ...multilineInputVariants] },
    notchedOutline: ({ theme }) => outlinedInputStyles.notchedOutline(theme),
  },
};

/* **********************************************************************
 * 🧩 FilledInput
 * **********************************************************************/
export const filledInputStyles = {
  root: (theme, classes) => {
    const baseBg = varAlpha(theme.vars.palette.grey['500Channel'], 0.08);
    const hoverBg = varAlpha(theme.vars.palette.grey['500Channel'], 0.16);
    const errorBg = varAlpha(theme.vars.palette.error.mainChannel, 0.08);
    const errorHoverBg = varAlpha(theme.vars.palette.error.mainChannel, 0.16);
    const disabledBg = theme.vars.palette.action.disabledBackground;

    return {
      backgroundColor: baseBg,
      borderRadius: theme.shape.borderRadius,
      [`&:hover, &.${classes.focused}`]: { backgroundColor: hoverBg },
      [`&.${classes.error}`]: {
        backgroundColor: errorBg,
        [`&:hover, &.${classes.focused}`]: { backgroundColor: errorHoverBg },
      },
      [`&.${classes.disabled}`]: { backgroundColor: disabledBg },
    };
  },
};

export const filledInputVariants = {
  root: [
    {
      props: (props) => !!props.multiline,
      style: { ...INPUT_PADDING.filled.medium },
    },
    {
      props: (props) => !!props.multiline && props.size === 'small',
      style: { ...INPUT_PADDING.filled.small },
    },
    {
      props: (props) => !!props.multiline && !!props.hiddenLabel,
      style: { ...INPUT_PADDING.filled.mediumHidden },
    },
    {
      props: (props) => !!props.multiline && !!props.hiddenLabel && props.size === 'small',
      style: { ...INPUT_PADDING.filled.smallHidden },
    },
  ],
  input: [
    {
      props: {},
      style: { ...INPUT_PADDING.filled.medium },
    },
    {
      props: ({ size, ownerState }) => (size || ownerState?.inputSize) === 'small',
      style: { ...INPUT_PADDING.filled.small },
    },
    {
      props: ({ hiddenLabel }) => !!hiddenLabel,
      style: { ...INPUT_PADDING.filled.mediumHidden },
    },
    {
      props: ({ size, hiddenLabel, ownerState }) =>
        !!hiddenLabel && (size || ownerState?.inputSize) === 'small',
      style: { ...INPUT_PADDING.filled.smallHidden },
    },
  ],
};

const MuiFilledInput = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    disableUnderline: true,
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      ...filledInputStyles.root(theme, filledInputClasses),
      variants: filledInputVariants.root,
    }),
    input: {
      variants: [...filledInputVariants.input, ...multilineInputVariants],
    },
  },
};

/* **********************************************************************
 * 🧩 TextField
 * **********************************************************************/
const MuiTextField = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    variant: 'outlined',
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const textField = {
  MuiInput,
  MuiInputBase,
  MuiTextField,
  MuiFilledInput,
  MuiOutlinedInput,
};
