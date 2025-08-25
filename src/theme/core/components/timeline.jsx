// ----------------------------------------------------------------------

const MuiTimelineDot = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      boxShadow: 'none',
    },
  },
};

const MuiTimelineConnector = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: theme.vars.palette.divider,
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const timeline = {
  MuiTimelineDot,
  MuiTimelineConnector,
};
