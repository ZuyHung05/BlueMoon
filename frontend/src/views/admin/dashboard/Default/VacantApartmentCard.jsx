import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// icons
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

export default function VacantApartmentCard({ isLoading }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Stack sx={{ gap: gridSpacing }}>
              {/* Header */}
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">Vacant Apartments</Typography>
                <IconButton size="small" sx={{ mt: -0.625 }}>
                  <MoreHorizOutlinedIcon
                    fontSize="small"
                    sx={{ cursor: 'pointer' }}
                    aria-controls="menu-vacant-card"
                    aria-haspopup="true"
                    onClick={handleClick}
                  />
                </IconButton>
              </Stack>

              {/* Menu */}
              <Menu
                id="menu-vacant-card"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                variant="selectedMenu"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleClose}> Today </MenuItem>
                <MenuItem onClick={handleClose}> This Month </MenuItem>
                <MenuItem onClick={handleClose}> This Year </MenuItem>
              </Menu>

              {/* Apartment List */}
              <Box>
                {/* Block A */}
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                    Block A
                  </Typography>
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                      12 vacant
                    </Typography>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '5px',
                        bgcolor: 'error.light',
                        color: 'error.dark',
                        ml: 2
                      }}
                    >
                      <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                    </Avatar>
                  </Stack>
                </Stack>
                <Typography variant="subtitle2" sx={{ color: 'error.dark' }}>
                  +3 new vacancies
                </Typography>
                <Divider sx={{ my: 1.5 }} />

                {/* Block B */}
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                    Block B
                  </Typography>
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                      8 vacant
                    </Typography>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '5px',
                        bgcolor: 'success.light',
                        color: 'success.dark',
                        ml: 2
                      }}
                    >
                      <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
                    </Avatar>
                  </Stack>
                </Stack>
                <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                  2 units occupied
                </Typography>
                <Divider sx={{ my: 1.5 }} />

                {/* Block C */}
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                    Block C
                  </Typography>
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                      5 vacant
                    </Typography>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '5px',
                        bgcolor: 'error.light',
                        color: 'error.dark',
                        ml: 2
                      }}
                    >
                      <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                    </Avatar>
                  </Stack>
                </Stack>
                <Typography variant="subtitle2" sx={{ color: 'error.dark' }}>
                  +1 new vacancy
                </Typography>
                <Divider sx={{ my: 1.5 }} />

                {/* Block D */}
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                    Block D
                  </Typography>
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                      9 vacant
                    </Typography>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '5px',
                        bgcolor: 'success.light',
                        color: 'success.dark',
                        ml: 2
                      }}
                    >
                      <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
                    </Avatar>
                  </Stack>
                </Stack>
                <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                  1 unit occupied
                </Typography>
              </Box>
            </Stack>
          </CardContent>

          {/* Footer */}
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              View Details <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}

VacantApartmentCard.propTypes = { isLoading: PropTypes.bool };
