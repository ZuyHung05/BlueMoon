import { memo, useMemo } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
// import Chip from '@mui/material/Chip'; // Removed as it is no longer used
import Drawer from '@mui/material/Drawer';
// import Stack from '@mui/material/Stack'; // Removed as it is no longer used
import Box from '@mui/material/Box';
import MiniDrawerStyled from '../MiniDrawerStyled';
// project imports
// import MenuCard from './MenuCard'; // <--- 1. REMOVED IMPORT
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';

import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';
import SimpleBar from 'ui-component/third-party/SimpleBar';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| SIDEBAR DRAWER ||============================== //

function Sidebar() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const {
    state: { miniDrawer }
  } = useConfig();

  const logo = useMemo(
    () => (
      <Box sx={{ display: 'flex', p: 2 }}>
        <LogoSection />
      </Box>
    ),
    []
  );

  const drawer = useMemo(() => {
    // <--- 2. REMOVED drawerContent DEFINITION (It contained MenuCard and Chip)

    let drawerSX = { paddingLeft: '0px', paddingRight: '0px', marginTop: '20px' };
    if (drawerOpen) drawerSX = { paddingLeft: '16px', paddingRight: '16px', marginTop: '0px' };

    return (
      <>
        {downMD ? (
          <Box sx={drawerSX}>
            <MenuList />
            {/* Removed drawerContent rendering */}
          </Box>
        ) : (
          <SimpleBar sx={{ height: 'calc(100vh - 90px)', ...drawerSX }}>
            <MenuList />
            {/* Removed drawerContent rendering */}
          </SimpleBar>
        )}
      </>
    );
  }, [downMD, drawerOpen]);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }} aria-label="mailbox folders">
      {downMD || (miniDrawer && drawerOpen) ? (
        <Drawer
          variant={downMD ? 'temporary' : 'persistent'}
          anchor="left"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          slotProps={{
            paper: {
              sx: {
                mt: downMD ? 0 : 11,
                zIndex: 1099,
                width: drawerWidth,
                bgcolor: 'background.default',
                color: 'text.primary',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)', // Subtle border
                boxShadow: 'none'
              }
            }
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {downMD && logo}
          {drawer}
        </Drawer>
      ) : (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {logo}
          {drawer}
        </MiniDrawerStyled>
      )}
    </Box>
  );
}

export default memo(Sidebar);