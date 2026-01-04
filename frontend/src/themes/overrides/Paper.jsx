// ==============================|| OVERRIDES - PAPER ||============================== //

export default function Paper(borderRadius) {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.12)', // Subtle border for dark theme
          boxShadow: 'none', // Flat look preferred with border
          '&.MuiPaper-rounded': {
             borderRadius: '12px'
          }
        }
      }
    }
  };
}
