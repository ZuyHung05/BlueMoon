// ==============================|| OVERRIDES - OUTLINED INPUT ||============================== //

export default function OutlinedInput(theme, borderRadius, outlinedFilled) {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: outlinedFilled ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          borderRadius: `${borderRadius}px`,

          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.15)'
          },

          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.primary.main
          },

          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.primary.main,
            boxShadow: `0 0 8px ${theme.vars.palette.primary.main}40` // Neon subtle glow
          },

          '&.MuiInputBase-multiline': {
            padding: 1
          }
        },
        input: {
          fontWeight: 500,
          background: outlinedFilled ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          padding: '15.5px 14px',
          borderRadius: `${borderRadius}px`,

          '&.MuiInputBase-inputSizeSmall': {
            padding: '10px 14px',

            '&.MuiInputBase-inputAdornedStart': {
              paddingLeft: 0
            }
          }
        },
        inputAdornedStart: {
          paddingLeft: 4
        },
        notchedOutline: {
          borderRadius: `${borderRadius}px`
        }
      }
    }
  };
}
