// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme) {
  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: theme.vars.palette.divider,
          color: theme.vars.palette.text.primary,

          '&.MuiTableCell-head': {
            fontSize: '0.875rem',
            color: theme.vars.palette.text.primary,
            fontWeight: 600
          },
          '&.MuiTableCell-body': {
            color: theme.vars.palette.text.primary
          }
        }
      }
    }
  };
}
