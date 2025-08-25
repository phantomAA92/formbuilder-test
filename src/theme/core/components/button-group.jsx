import { varAlpha } from 'minimal-shared/utils';

import { buttonGroupClasses } from '@mui/material/ButtonGroup';

import { colorKeys } from '../palette';

// ----------------------------------------------------------------------

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const containedVariants = [
  {
    props: (props) => props.variant === 'contained',
    style: ({ theme }) => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
    }),
  },
  ...colorKeys.palette.map((colorKey) => ({
    props: (props) => props.variant === 'contained' && props.color === colorKey,
    style: ({ theme }) => ({
      borderColor: varAlpha(
        theme.vars.palette[colorKey].darkChannel,
        theme.vars.opacity.outlined.border
      ),
    }),
  })),
];

const textVariants = [
  {
    props: (props) => props.variant === 'text',
    style: ({ theme }) => ({
      borderColor: varAlpha('currentColor', theme.vars.opacity.outlined.border),
    }),
  },
  {
    props: (props) => props.variant === 'text' && props.color === 'inherit',
    style: ({ theme }) => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
    }),
  },
];

const softVariants = [
  {
    props: (props) => props.variant === 'soft',
    style: ({ theme }) => ({
      borderStyle: 'solid',
      borderColor: varAlpha('currentColor', theme.vars.opacity.soft.border),
    }),
  },
  {
    props: (props) => props.variant === 'soft' && props.color === 'inherit',
    style: ({ theme }) => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
    }),
  },
];

const firstButtonVariants = [
  {
    props: (props) => props.variant === 'soft' && props.orientation === 'horizontal',
    style: { borderRightWidth: 1 },
  },
  {
    props: (props) => props.variant === 'soft' && props.orientation === 'vertical',
    style: { borderBottomWidth: 1 },
  },
];

const disabledVariants = [
  {
    props: {},
    style: ({ theme }) => ({
      [`&.${buttonGroupClasses.disabled}`]: {
        borderColor: theme.vars.palette.action.disabledBackground,
      },
    }),
  },
];

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiButtonGroup = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: 'inherit',
    disableElevation: true,
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    grouped: {
      variants: [...containedVariants, ...textVariants, ...softVariants, ...disabledVariants],
    },
    firstButton: {
      variants: [...firstButtonVariants],
    },
    middleButton: {
      variants: [...firstButtonVariants],
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const buttonGroup = {
  MuiButtonGroup,
};
