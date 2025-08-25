import { listClasses } from '@mui/material/List';

// ----------------------------------------------------------------------

const MuiPopover = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    paper: ({ theme }) => ({
      ...theme.mixins.paperStyles(theme, { dropdown: true }),
      [`& .${listClasses.root}`]: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const popover = {
  MuiPopover,
};
