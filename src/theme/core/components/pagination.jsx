import { varAlpha } from 'minimal-shared/utils';

import { paginationItemClasses } from '@mui/material/PaginationItem';

import { colorKeys } from '../palette';

// ----------------------------------------------------------------------

const baseColors = ['standard'];
const allColors = [...baseColors, ...colorKeys.palette];

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const textVariants = [
  {
    props: (props) => props.variant === 'text' && props.color === 'standard',
    style: ({ theme }) => ({
      [`&.${paginationItemClasses.selected}`]: {
        ...theme.mixins.filledStyles(theme, 'inherit', { hover: true }),
      },
    }),
  },
];

const outlinedVariants = [
  {
    props: (props) => props.variant === 'outlined',
    style: ({ theme }) => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
      [`&.${paginationItemClasses.selected}`]: {
        borderColor: 'currentColor',
        backgroundColor: varAlpha('currentColor', theme.vars.palette.action.selectedOpacity),
        '&:hover': {
          backgroundColor: varAlpha(
            'currentColor',
            `calc(${theme.vars.palette.action.selectedOpacity} * 2)`
          ),
        },
      },
    }),
  },
  {
    props: (props) => props.variant === 'outlined' && props.color === 'standard',
    style: ({ theme }) => ({
      [`&.${paginationItemClasses.selected}`]: {
        backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
        '&:hover': {
          backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
        },
      },
    }),
  },
];

const softVariants = [
  ...allColors.map((colorKey) => ({
    props: (props) => props.variant === 'soft' && props.color === colorKey,
    style: ({ theme }) => {
      const currentColor = colorKey === 'standard' ? 'inherit' : colorKey;

      return {
        [`&.${paginationItemClasses.selected}`]: {
          ...theme.mixins.softStyles(theme, currentColor, { hover: true }),
        },
      };
    },
  })),
];

const disabledVariants = [
  {
    props: {},
    style: ({ theme }) => ({
      [`&.${paginationItemClasses.disabled}`]: {
        [`&.${paginationItemClasses.selected}`]: {
          backgroundColor: theme.vars.palette.action.disabledBackground,
        },
      },
    }),
  },
];

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiPaginationItem = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      [`&.${paginationItemClasses.selected}`]: {
        fontWeight: theme.typography.fontWeightSemiBold,
      },
      variants: [...textVariants, ...outlinedVariants, ...softVariants, ...disabledVariants],
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const pagination = {
  MuiPaginationItem,
};
