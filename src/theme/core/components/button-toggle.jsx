import { varAlpha } from 'minimal-shared/utils';

import { toggleButtonClasses } from '@mui/material/ToggleButton';

import { colorKeys } from '../palette';

// ----------------------------------------------------------------------

const SIZES = ['small', 'medium', 'large'];
const DIMENSIONS = {
  small: { '--size': '40px', '--padding': '7px' },
  medium: { '--size': '48px', '--padding': '11px' },
  large: { '--size': '56px', '--padding': '15px' },
  group: { '--group-gap': '4px' },
};

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const colorVariants = [
  ...colorKeys.palette.map((colorKey) => ({
    props: (props) => props.color === colorKey,
    style: ({ theme }) => ({
      '&:hover': {
        borderColor: varAlpha(
          theme.vars.palette[colorKey].mainChannel,
          theme.vars.opacity.outlined.border
        ),
        backgroundColor: varAlpha(
          theme.vars.palette[colorKey].mainChannel,
          theme.vars.palette.action.hoverOpacity
        ),
      },
    }),
  })),
];

const sizeVariants = [
  ...SIZES.map((size) => ({
    props: (props) => props.size === size,
    style: { ...DIMENSIONS[size] },
  })),
];

const standaloneStateVariants = [
  {
    props: {},
    style: ({ theme }) => ({
      [`&.${toggleButtonClasses.selected}`]: {
        borderColor: 'currentColor',
        boxShadow: '0 0 0 0.75px currentColor',
      },
      [`&.${toggleButtonClasses.disabled}`]: {
        boxShadow: 'none',
        color: theme.vars.palette.action.disabled,
        borderColor: theme.vars.palette.action.disabledBackground,
        [`&.${toggleButtonClasses.selected}`]: {
          backgroundColor: theme.vars.palette.action.disabledBackground,
        },
      },
    }),
  },
];

const groupedStateVariants = [
  {
    props: {},
    style: {
      [`&.${toggleButtonClasses.selected}`]: { boxShadow: 'none' },
      [`&.${toggleButtonClasses.disabled}`]: { border: 'none' },
    },
  },
];

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiToggleButton = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      gap: 8,
      minWidth: 'var(--size)',
      minHeight: 'var(--size)',
      padding: 'var(--padding)',
      fontWeight: theme.typography.fontWeightSemiBold,
      variants: [...colorVariants, ...sizeVariants, ...standaloneStateVariants],
    }),
  },
};

const MuiToggleButtonGroup = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      ...DIMENSIONS.group,
      gap: 'var(--group-gap)',
      padding: 'var(--group-gap)',
      border: `1px solid ${theme.vars.palette.shared.paperOutlined}`,
    }),
    grouped: () => ({
      border: 'none',
      borderRadius: 'inherit',
      padding: 'calc(var(--padding) - var(--group-gap))',
      minWidth: 'calc(var(--size) - (var(--group-gap) * 2 + 2px))',
      minHeight: 'calc(var(--size) - (var(--group-gap) * 2 + 2px))',
      variants: [...groupedStateVariants],
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const toggleButton = {
  MuiToggleButton,
  MuiToggleButtonGroup,
};
