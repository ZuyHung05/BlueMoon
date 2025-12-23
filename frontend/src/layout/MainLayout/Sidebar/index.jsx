import { memo, useMemo } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { Menu } from 'lucide-react';

// project imports
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';

import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';
import SimpleBar from 'ui-component/third-party/SimpleBar';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| SIDEBAR DRAWER - YOUTUBE STYLE ||============================== //

function Sidebar() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const {
    state: { miniDrawer }
  } = useConfig();

  const header = useMemo(
    () => (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 2 }}>
        <IconButton 
          onClick={() => handlerDrawerOpen(false)}
          sx={{ 
            color: 'text.primary',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Menu size={22} />
        </IconButton>
        <LogoSection />
      </Stack>
    ),
    []
  );

  const drawer = useMemo(() => {
    let drawerSX = { paddingLeft: '16px', paddingRight: '16px', marginTop: '0px' };

    return (
      <SimpleBar sx={{ height: 'calc(100vh - 90px)', ...drawerSX }}>
        <MenuList />
      </SimpleBar>
    );
  }, []);

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={drawerOpen}
      onClose={() => handlerDrawerOpen(false)}
      slotProps={{
        paper: {
          sx: {
            mt: 0,
            zIndex: 1200,
            width: drawerWidth,
            bgcolor: 'background.default',
            color: 'text.primary',
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: (theme) => theme.palette.mode === 'dark' ? '4px 0 20px rgba(0, 0, 0, 0.3)' : '4px 0 20px rgba(0, 0, 0, 0.1)'
          }
        }
      }}
      ModalProps={{ 
        keepMounted: true,
        BackdropProps: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }}
      color="inherit"
    >
      {header}
      {drawer}
    </Drawer>
  );
}

export default memo(Sidebar);