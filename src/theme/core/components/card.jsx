// ----------------------------------------------------------------------

const MuiCard = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      position: 'relative',
      boxShadow: `var(--card-shadow, ${theme.vars.customShadows.card})`,
      borderRadius: `var(--card-radius, ${Number(theme.shape.borderRadius) * 2}px)`,
      zIndex: 0, // Fix Safari overflow: hidden with border radius
    }),
  },
};

const MuiCardHeader = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    titleTypographyProps: { variant: 'h6' },
    subheaderTypographyProps: { variant: 'body2', marginTop: '4px' },
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3, 3, 0),
    }),
  },
};

const MuiCardContent = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3),
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const card = {
  MuiCard,
  MuiCardHeader,
  MuiCardContent,
};
