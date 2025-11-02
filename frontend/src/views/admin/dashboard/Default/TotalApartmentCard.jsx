import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// icons
import ApartmentIcon from '@mui/icons-material/Apartment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';

// ==============================|| TOTAL APARTMENT CARD ||============================== //

export default function TotalApartmentCard({ isLoading, totalApartments = 120 }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

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
            bgcolor: 'primary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.vars.palette.primary[800],
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.vars.palette.primary[800],
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
                  bgcolor: 'primary.800',
                  mt: 1
                }}
              >
                <HomeWorkIcon fontSize="inherit" />
              </Avatar>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  bgcolor: 'primary.dark',
                  color: 'primary.200',
                  zIndex: 1
                }}
                aria-controls="menu-apartment-card"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreHorizIcon fontSize="inherit" />
              </Avatar>
            </Stack>

            {/* Menu */}
            <Menu
              id="menu-apartment-card"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              variant="selectedMenu"
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
                <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Data
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Copy Info
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Export Report
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Archive
              </MenuItem>
            </Menu>

            {/* Main content */}
            <Stack direction="row" sx={{ alignItems: 'center' }}>
              <Typography sx={{ fontSize: '2.125rem', fontWeight: 600, mr: 1, mt: 1.75, mb: 0.75 }}>
                {totalApartments}
              </Typography>
            </Stack>
            <Typography
              sx={{
                mb: 1.25,
                fontSize: '1rem',
                fontWeight: 500,
                color: 'primary.200'
              }}
            >
              Total Apartments
            </Typography>
          </Box>
        </MainCard>
      )}
    </>
  );
}

TotalApartmentCard.propTypes = {
  isLoading: PropTypes.bool,
  totalApartments: PropTypes.number
};
