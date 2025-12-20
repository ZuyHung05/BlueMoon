// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';

// assets
import { Building2 } from 'lucide-react';

// ==============================|| LOGO IMAGE ||============================== //

export default function Logo() {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Building2 size={32} color={theme.palette.primary.main} strokeWidth={2} />
      <Typography
        variant="h3"
        sx={{
          color: theme.palette.primary.main, // Cyan 400
          fontWeight: 700,
          textShadow: `0 0 10px ${theme.palette.primary.main}80` // Neon text glow
        }}
      >
        BlueMoon
      </Typography>
    </Stack>
  );
}