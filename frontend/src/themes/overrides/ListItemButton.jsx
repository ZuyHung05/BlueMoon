// ==============================|| OVERRIDES - LIST ITEM BUTTON ||============================== //

export default function ListItemButton(theme) {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: theme.vars.palette.text.primary,
          paddingTop: '10px',
          paddingBottom: '10px',

          '&.Mui-selected': {
            color: theme.vars.palette.primary.main,
            backgroundColor: 'rgba(34, 211, 238, 0.1)', // Cyan translucent
            border: `1px solid ${theme.vars.palette.primary.main}40`, // Subtle border
            '&:hover': {
              backgroundColor: 'rgba(34, 211, 238, 0.2)'
            },
            '& .MuiListItemIcon-root': {
              color: theme.vars.palette.primary.main
            }
          },

          '&:hover': {
            backgroundColor: 'rgba(34, 211, 238, 0.05)', // Very subtle cyan
            color: theme.vars.palette.primary.main,
            '& .MuiListItemIcon-root': {
              color: theme.vars.palette.primary.main
            }
          }
        }
      }
    }
  };
}
