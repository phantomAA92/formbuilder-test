import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

const MuiSkeleton = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    animation: 'wave',
    variant: 'rounded',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey['400Channel'], 0.12),
    }),
    rounded: ({ theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 2,
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const skeleton = {
  MuiSkeleton,
};
