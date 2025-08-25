import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

const MuiBackdrop = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      variants: [
        {
          props: (props) => !props.invisible,
          style: {
            backgroundColor: varAlpha(theme.vars.palette.grey['800Channel'], 0.48),
          },
        },
      ],
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const backdrop = {
  MuiBackdrop,
};
