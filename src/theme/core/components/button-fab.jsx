import { pxToRem, varAlpha } from 'minimal-shared/utils';

import { fabClasses } from '@mui/material/Fab';

import { colorKeys } from '../palette';

// ----------------------------------------------------------------------

const baseColors = ['default', 'inherit'];
const allColors = [...baseColors, ...colorKeys.palette, ...colorKeys.common];

const VARIANTS = {
  filled: ['circular', 'extended'],
  outlined: ['outlined', 'outlinedExtended'],
  soft: ['soft', 'softExtended'],
  extended: ['extended', 'outlinedExtended', 'softExtended'],
};
const DIMENSIONS = {
  extendedSmall: {
    '--size': '36px',
    padding: '4px 8px',
    fontSize: pxToRem(13),
    lineHeight: 22 / 13,
  },
  extendedMedium: {
    '--size': '40px',
    padding: '6px 12px',
    fontSize: pxToRem(14),
    lineHeight: 24 / 14,
  },
  extendedLarge: {
    '--size': '48px',
    padding: '8px 16px',
    fontSize: pxToRem(15),
    lineHeight: 26 / 15,
  },
};

function isVariant(allowed, variant) {
  return !!variant && allowed.includes(variant);
}

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const filledVariants = [
  {
    props: (props) => isVariant(VARIANTS.filled, props.variant) && props.color === 'default',
    style: ({ theme }) => ({
      ...theme.mixins.filledStyles(theme, 'default', { hover: true }),
      boxShadow: theme.vars.customShadows.z8,
    }),
  },
  {
    props: (props) => isVariant(VARIANTS.filled, props.variant) && props.color === 'inherit',
    style: ({ theme }) => ({
      ...theme.mixins.filledStyles(theme, 'inherit', { hover: true }),
      boxShadow: theme.vars.customShadows.z8,
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props) => isVariant(VARIANTS.filled, props.variant) && props.color === colorKey,
    style: ({ theme }) => ({
      ...theme.mixins.filledStyles(theme, colorKey, { hover: true }),
      boxShadow: theme.vars.customShadows.z8,
    }),
  })),
  ...colorKeys.palette.map((colorKey) => ({
    props: (props) => isVariant(VARIANTS.filled, props.variant) && props.color === colorKey,
    style: ({ theme }) => ({
      boxShadow: theme.vars.customShadows[colorKey],
    }),
  })),
];

const outlinedVariants = [
  {
    props: (props) => isVariant(VARIANTS.outlined, props.variant),
    style: ({ theme }) => ({
      borderWidth: 1,
      boxShadow: 'none',
      borderStyle: 'solid',
      backgroundColor: 'transparent',
      borderColor: varAlpha('currentColor', theme.vars.opacity.outlined.border),
      '&:hover': {
        borderColor: 'currentColor',
        boxShadow: '0 0 0 0.75px currentColor',
        backgroundColor: varAlpha('currentColor', theme.vars.palette.action.hoverOpacity),
      },
    }),
  },
  {
    props: (props) =>
      isVariant(VARIANTS.outlined, props.variant) &&
      (props.color === 'default' || props.color === 'inherit'),
    style: ({ theme }) => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
    }),
  },
  {
    props: (props) => isVariant(VARIANTS.outlined, props.variant) && props.color === 'default',
    style: ({ theme }) => ({
      color: theme.vars.palette.action.active,
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props) => isVariant(VARIANTS.outlined, props.variant) && props.color === colorKey,
    style: ({ theme }) => ({
      color: theme.vars.palette.common[colorKey],
    }),
  })),
  ...colorKeys.palette.map((colorKey) => ({
    props: (props) => isVariant(VARIANTS.outlined, props.variant) && props.color === colorKey,
    style: ({ theme }) => ({
      color: theme.vars.palette[colorKey].main,
    }),
  })),
];

const softVariants = [
  ...allColors.map((colorKey) => ({
    props: (props) => isVariant(VARIANTS.soft, props.variant) && props.color === colorKey,
    style: ({ theme }) => ({
      ...theme.mixins.softStyles(theme, colorKey, { hover: true }),
    }),
  })),
];

const sizeVariants = [
  {
    props: (props) => isVariant(VARIANTS.extended, props.variant),
    style: ({ theme }) => ({
      width: 'auto',
      height: 'auto',
      gap: theme.spacing(1),
      minWidth: 'var(--size)',
      minHeight: 'var(--size)',
      borderRadius: 'calc(var(--size) / 2)',
    }),
  },
  {
    props: (props) => isVariant(VARIANTS.extended, props.variant) && props.size === 'small',
    style: { ...DIMENSIONS.extendedSmall },
  },
  {
    props: (props) => isVariant(VARIANTS.extended, props.variant) && props.size === 'medium',
    style: { ...DIMENSIONS.extendedMedium },
  },
  {
    props: (props) => isVariant(VARIANTS.extended, props.variant) && props.size === 'large',
    style: { ...DIMENSIONS.extendedLarge },
  },
];

const disabledVariants = [
  {
    props: (props) => isVariant(VARIANTS.outlined, props.variant),
    style: ({ theme }) => ({
      [`&.${fabClasses.disabled}`]: {
        backgroundColor: 'transparent',
        borderColor: theme.vars.palette.action.disabledBackground,
      },
    }),
  },
];

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiFab = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: 'primary',
    size: 'medium',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      '&:hover': { boxShadow: 'none' },
      variants: [
        ...filledVariants,
        ...outlinedVariants,
        ...softVariants,
        ...sizeVariants,
        ...disabledVariants,
      ],
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const fab = {
  MuiFab,
};
