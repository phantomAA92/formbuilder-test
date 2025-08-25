import { varAlpha } from 'minimal-shared/utils';

import { linearProgressClasses } from '@mui/material/LinearProgress';

import { colorKeys } from '../palette';

// ----------------------------------------------------------------------

const baseColors = ['inherit'];
const allColors = [...baseColors, ...colorKeys.palette];

const LINEAR_OPACITY = { track: 0.24, dashed: 0.48 };

function getColorStyle(theme, colorKey) {
  if (colorKey === 'inherit') {
    return {
      '&::before': { opacity: LINEAR_OPACITY.track },
      [`& .${linearProgressClasses.bar2}`]: { opacity: 1 },
    };
  }

  return {
    backgroundColor: varAlpha(theme.vars.palette[colorKey].mainChannel, LINEAR_OPACITY.track),
  };
}

function getBufferStyle(theme, colorKey) {
  const isInherit = colorKey === 'inherit';

  const gradientColor = isInherit ? 'currentColor' : theme.vars.palette[colorKey].mainChannel;
  const backgroundColor = isInherit
    ? 'currentColor'
    : varAlpha(theme.vars.palette[colorKey].mainChannel, LINEAR_OPACITY.track);

  return {
    [`& .${linearProgressClasses.bar2}`]: {
      backgroundColor,
      ...(isInherit && { opacity: LINEAR_OPACITY.track }),
    },
    [`& .${linearProgressClasses.dashed}`]: {
      backgroundImage: `radial-gradient(${varAlpha(gradientColor, LINEAR_OPACITY.dashed)} 0%, ${varAlpha(gradientColor, LINEAR_OPACITY.dashed)} 16%, transparent 42%)`,
    },
  };
}

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const colorVariants = [
  ...allColors.map((colorKey) => ({
    props: (props) => props.color === colorKey && props.variant !== 'buffer',
    style: ({ theme }) => getColorStyle(theme, colorKey),
  })),
  ...allColors.map((colorKey) => ({
    props: (props) => props.color === colorKey && props.variant === 'buffer',
    style: ({ theme }) => getBufferStyle(theme, colorKey),
  })),
];

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiCircularProgress = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: 'inherit',
  },
};

const MuiLinearProgress = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: 'inherit',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      borderRadius: 16,
      variants: [...colorVariants],
    },
    bar: {
      borderRadius: 'inherit',
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const progress = {
  MuiLinearProgress,
  MuiCircularProgress,
};
