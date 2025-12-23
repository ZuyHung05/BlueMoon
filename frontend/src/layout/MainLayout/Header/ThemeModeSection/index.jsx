import { useColorScheme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { Sun, Moon } from 'lucide-react';

// ==============================|| THEME MODE TOGGLE ||============================== //

export default function ThemeModeSection() {
  const theme = useTheme();
  const { mode, setMode } = useColorScheme();
  
  const isDark = mode === 'dark';

  const handleToggle = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  return (
    <Tooltip title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}>
      <Avatar
        variant="rounded"
        sx={{
          ...theme.typography.commonAvatar,
          ...theme.typography.mediumAvatar,
          overflow: 'hidden',
          transition: 'all .2s ease-in-out',
          color: theme.vars.palette.primary.main,
          background: 'action.hover',
          border: `1px solid`,
          borderColor: 'divider',
          cursor: 'pointer',
          '&:hover': {
            color: theme.vars.palette.primary.light,
            background: 'action.selected',
            boxShadow: `0 0 8px ${theme.vars.palette.primary.main}40`
          }
        }}
        onClick={handleToggle}
      >
        {isDark ? <Sun strokeWidth={1.5} size="20px" /> : <Moon strokeWidth={1.5} size="20px" />}
      </Avatar>
    </Tooltip>
  );
}
