// project imports
import { extendPaletteWithChannels } from 'utils/colorUtils';

// assets
import defaultColor from 'assets/scss/_themes-vars.module.scss';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export function buildPalette(presetColor) {
  let colors;
  switch (presetColor) {
    case 'default':
    default:
      colors = defaultColor;
  }

  // Neon Dark Theme Colors
  const neonDarkColors = {
    primary: {
      light: '#67e8f9', // Cyan 300
      main: '#22d3ee', // Cyan 400
      dark: '#06b6d4', // Cyan 500
      200: '#a5f3fc',
      800: '#0891b2'
    },
    secondary: {
      light: '#a78bfa',
      main: '#8b5cf6', // Violet
      dark: '#7c3aed',
      200: '#ddd6fe',
      800: '#5b21b6'
    },
    error: {
      light: '#fca5a5',
      main: '#ef4444',
      dark: '#b91c1c'
    },
    orange: {
      light: '#fdba74',
      main: '#f97316',
      dark: '#c2410c'
    },
    warning: {
      light: '#fde047',
      main: '#eab308',
      dark: '#a16207',
      contrastText: '#1e293b' // Dark text for contrast
    },
    success: {
      light: '#86efac',
      200: '#bbf7d0',
      main: '#22c55e',
      dark: '#15803d'
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      900: '#0f172a'
    },
    dark: {
      light: '#e2e8f0',
      main: '#94a3b8',
      dark: '#64748b',
      800: '#1e293b',
      900: '#0f172a'
    },
    text: {
      primary: '#f1f5f9', // Slate 100
      secondary: '#94a3b8', // Slate 400
      dark: '#e2e8f0',
      hint: '#64748b',
      heading: '#f8fafc'
    },
    divider: 'rgba(255, 255, 255, 0.12)', // Subtle light border
    background: {
      paper: '#0f172a', // Slate 900
      default: '#020617' // Slate 950 (Very dark blue)
    }
  };

  return {
    mode: 'dark', // Force dark mode
    common: {
      black: '#000',
      white: '#fff'
    },
    ...neonDarkColors
  };
}
