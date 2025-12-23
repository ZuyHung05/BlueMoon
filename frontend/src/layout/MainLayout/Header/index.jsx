// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import ThemeModeSection from './ThemeModeSection';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { Menu } from 'lucide-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <>
      {/* logo & toggler button */}
      <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            color: theme.vars.palette.primary.main,
            background: `${theme.vars.palette.primary.main}20`,
            border: `1px solid`,
            borderColor: 'divider',
            '&:hover': {
              color: theme.vars.palette.primary.light,
              background: `${theme.vars.palette.primary.main}35`,
              boxShadow: `0 0 8px ${theme.vars.palette.primary.main}40`
            }
          }}
          onClick={() => handlerDrawerOpen(!drawerOpen)}
        >
          <Menu strokeWidth={1.5} size="20px" />
        </Avatar>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
      </Box>

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* theme mode toggle */}
      <Box sx={{ mr: 1 }}>
        <ThemeModeSection />
      </Box>

      {/* notification */}
      <NotificationSection />

      {/* profile */}
      <ProfileSection />
    </>
  );
}

