import PropTypes from 'prop-types';
import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Menu, MenuItem, Stack, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

export default function UserManagementCard({
  isLoading,
  totalUsers = 58,
  activeUsers = 42,
  lastLogin = 'Nov 2, 2025 - 09:41 AM'
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'secondary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.vars.palette.secondary[800],
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.vars.palette.secondary[800],
              borderRadius: '50%',
              top: { xs: -125 },
              right: { xs: -15 },
              opacity: 0.5
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            {/* Header */}
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.largeAvatar,
                  borderRadius: 2,
                  bgcolor: 'secondary.800',
                  mt: 1
                }}
              >
                <PeopleAltIcon fontSize="inherit" />
              </Avatar>

              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  bgcolor: 'secondary.dark',
                  color: 'secondary.200',
                  zIndex: 1
                }}
                aria-controls="menu-user-card"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreHorizIcon fontSize="inherit" />
              </Avatar>
            </Stack>

            {/* Action Menu */}
            <Menu
              id="menu-user-card"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              variant="selectedMenu"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleClose}>
                <ManageAccountsIcon sx={{ mr: 1.75 }} /> Manage Roles
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <GroupAddIcon sx={{ mr: 1.75 }} /> Add User
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <CloudDownloadIcon sx={{ mr: 1.75 }} /> Export User Data
              </MenuItem>
            </Menu>

            {/* Main Content */}
            <Stack direction="row" sx={{ alignItems: 'center' }}>
              <Typography
                sx={{
                  fontSize: '2.125rem',
                  fontWeight: 600,
                  mr: 1,
                  mt: 1.75,
                  mb: 0.75
                }}
              >
                {totalUsers}
              </Typography>
            </Stack>
            <Typography
              sx={{
                mb: 0.5,
                fontSize: '1rem',
                fontWeight: 500,
                color: 'secondary.200'
              }}
            >
              Total Accounts
            </Typography>

            {/* Stats Row */}
            <Typography variant="subtitle2" sx={{ color: 'grey.200' }}>
              Active Users: {activeUsers}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'grey.400' }}>
              Last Login: {lastLogin}
            </Typography>
          </Box>
        </MainCard>
      )}
    </>
  );
}

UserManagementCard.propTypes = {
  isLoading: PropTypes.bool,
  totalUsers: PropTypes.number,
  activeUsers: PropTypes.number,
  lastLogin: PropTypes.string
};
