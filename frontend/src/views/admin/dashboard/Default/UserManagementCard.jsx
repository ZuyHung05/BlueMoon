import PropTypes from 'prop-types';
<<<<<<< HEAD:frontend/src/views/dashboard/Default/UserManagementCard.jsx
import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
=======
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Stack, Typography, Menu, MenuItem } from '@mui/material';
>>>>>>> 4517065e2d2b7bf617bae4d00424420a12086999:frontend/src/views/admin/dashboard/Default/UserManagementCard.jsx

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
<<<<<<< HEAD:frontend/src/views/dashboard/Default/UserManagementCard.jsx
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
=======
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';

// ==============================|| USER MANAGEMENT CARD ||============================== //

export default function UserManagementCard({ isLoading, totalAccounts = 58, activeUsers = 42, lastLogin = 'Nov 2, 2025 - 09:41 AM' }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
>>>>>>> 4517065e2d2b7bf617bae4d00424420a12086999:frontend/src/views/admin/dashboard/Default/UserManagementCard.jsx

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
<<<<<<< HEAD:frontend/src/views/dashboard/Default/UserManagementCard.jsx
            {/* Header */}
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
=======
            {/* Header icons */}
            <Stack direction="row" justifyContent="space-between">
>>>>>>> 4517065e2d2b7bf617bae4d00424420a12086999:frontend/src/views/admin/dashboard/Default/UserManagementCard.jsx
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
<<<<<<< HEAD:frontend/src/views/dashboard/Default/UserManagementCard.jsx

=======
>>>>>>> 4517065e2d2b7bf617bae4d00424420a12086999:frontend/src/views/admin/dashboard/Default/UserManagementCard.jsx
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

<<<<<<< HEAD:frontend/src/views/dashboard/Default/UserManagementCard.jsx
            {/* Action Menu */}
=======
            {/* Options Menu */}
>>>>>>> 4517065e2d2b7bf617bae4d00424420a12086999:frontend/src/views/admin/dashboard/Default/UserManagementCard.jsx
            <Menu
              id="menu-user-card"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
<<<<<<< HEAD:frontend/src/views/dashboard/Default/UserManagementCard.jsx
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
=======
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem onClick={handleClose}>
                <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Users
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Copy Info
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Export Report
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Archive
>>>>>>> 4517065e2d2b7bf617bae4d00424420a12086999:frontend/src/views/admin/dashboard/Default/UserManagementCard.jsx
              </MenuItem>
            </Menu>

            {/* Main Content */}
<<<<<<< HEAD:frontend/src/views/dashboard/Default/UserManagementCard.jsx
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
=======
            <Stack direction="row" alignItems="center">
              <Typography sx={{ fontSize: '2.125rem', fontWeight: 600, mr: 1, mt: 1.75, mb: 0.75 }}>
                {totalAccounts}
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'secondary.200', mb: 1 }}>
              Total Accounts
            </Typography>

            {/* Subtext */}
            <Typography sx={{ fontSize: '0.75rem', color: 'secondary.100' }}>
              Active Users: {activeUsers}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'secondary.100' }}>
>>>>>>> 4517065e2d2b7bf617bae4d00424420a12086999:frontend/src/views/admin/dashboard/Default/UserManagementCard.jsx
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
<<<<<<< HEAD:frontend/src/views/dashboard/Default/UserManagementCard.jsx
  totalUsers: PropTypes.number,
=======
  totalAccounts: PropTypes.number,
>>>>>>> 4517065e2d2b7bf617bae4d00424420a12086999:frontend/src/views/admin/dashboard/Default/UserManagementCard.jsx
  activeUsers: PropTypes.number,
  lastLogin: PropTypes.string
};
