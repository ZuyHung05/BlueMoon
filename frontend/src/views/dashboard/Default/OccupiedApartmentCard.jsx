import PropTypes from 'prop-types';
import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// icons
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// chart data (customized)
const monthlyData = [{ data: [72, 74, 76, 78, 80, 81, 82, 84] }];
const yearlyData = [{ data: [60, 65, 70, 72, 75, 77, 80, 82] }];

const chartOptions = {
  chart: {
    type: 'line',
    sparkline: { enabled: true }
  },
  stroke: { curve: 'smooth', width: 3 },
  colors: ['#66bb6a'], // green tone
  tooltip: { enabled: false },
  grid: { show: false },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] },
  yaxis: { show: false }
};

// ==============================|| OCCUPIED APARTMENT CARD ||============================== //

export default function OccupiedApartmentCard({ isLoading }) {
  const theme = useTheme();
  const [timeValue, setTimeValue] = React.useState(false);
  const [series, setSeries] = useState(yearlyData);

  const handleChangeTime = (_event, newValue) => {
    setTimeValue(newValue);
    setSeries(newValue ? monthlyData : yearlyData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'success.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&>div': { position: 'relative', zIndex: 5 },
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.vars.palette.success[800],
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.vars.palette.success[800],
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
                  bgcolor: 'success.800',
                  color: 'common.white',
                  mt: 1
                }}
              >
                <HomeWorkIcon fontSize="inherit" />
              </Avatar>

              {/* Time toggle buttons */}
              <Box>
                <Button
                  disableElevation
                  variant={timeValue ? 'contained' : 'text'}
                  size="small"
                  sx={{ color: 'inherit' }}
                  onClick={(e) => handleChangeTime(e, true)}
                >
                  Month
                </Button>
                <Button
                  disableElevation
                  variant={!timeValue ? 'contained' : 'text'}
                  size="small"
                  sx={{ color: 'inherit' }}
                  onClick={(e) => handleChangeTime(e, false)}
                >
                  Year
                </Button>
              </Box>
            </Stack>

            {/* Body */}
            <Grid sx={{ mb: 0.75 }}>
              <Grid container sx={{ alignItems: 'center' }}>
                <Grid item xs={6}>
                  <Box>
                    <Stack direction="row" sx={{ alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                        {timeValue ? '84' : '82'}
                      </Typography>
                      <Avatar sx={{ ...theme.typography.smallAvatar, bgcolor: 'success.200', color: 'success.dark' }}>
                        <ArrowUpwardIcon
                          fontSize="inherit"
                          sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }}
                        />
                      </Avatar>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: 'success.200'
                      }}
                    >
                      Occupied Apartments
                    </Typography>
                  </Box>
                </Grid>

                {/* Chart */}
                <Grid item xs={6}>
                  <Chart options={chartOptions} series={series} type="line" height={90} />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

OccupiedApartmentCard.propTypes = { isLoading: PropTypes.bool };
