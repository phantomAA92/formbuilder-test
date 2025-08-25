// ----------------------------------------------------------------------

const MuiPaper = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    elevation: 0,
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      backgroundImage: 'none',
      variants: [
        {
          props: (props) => props.variant === 'outlined',
          style: ({ theme }) => ({
            borderColor: theme.vars.palette.shared.paperOutlined,
          }),
        },
      ],
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const paper = {
  MuiPaper,
};
