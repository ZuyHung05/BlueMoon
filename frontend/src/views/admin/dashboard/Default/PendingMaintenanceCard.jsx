import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ==============================|| PENDING MAINTENANCE CARD ||============================== //

const periodOptions = [
  { value: 'today', label: 'Today' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];

// Example data for apartments pending maintenance
const maintenanceSeries = [
  { name: 'Plumbing', data: [2, 3, 1, 4, 3, 2, 5, 4, 3, 2, 1, 3] },
  { name: 'Electrical', data: [1, 2, 2, 3, 1, 4, 2, 3, 3, 1, 2, 2] },
  { name: 'Cleaning', data: [4, 5, 3, 4, 6, 5, 4, 3, 4, 5, 6, 5] }
];

export default function PendingMaintenanceCard({ isLoading }) {
  const theme = useTheme();
  const {
    state: { fontFamily }
  } = useConfig();

  const [period, setPeriod] = useState('today');
  const [chartOptions, setChartOptions] = useState({});

  // chart configuration
  useEffect(() => {
    setChartOptions({
      chart: {
        type: 'bar',
        fontFamily: fontFamily,
        toolbar: { show: false },
        sparkline: { enabled: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 4
        }
      },
      colors: [
        theme.vars.palette.warning.dark,
        theme.vars.palette.error.main,
        theme.vars.palette.info.main
      ],
      dataLabels: { enabled: false },
      grid: { borderColor: theme.vars.palette.divider },
      xaxis: {
        categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        labels: { style: { colors: theme.vars.palette.text.primary } }
      },
      yaxis: {
        title: { text: 'Pending Requests' },
        labels: { style: { colors: theme.vars.palette.text.primary } }
      },
      legend: {
        position: 'top',
        labels: { colors: theme.vars.palette.text.secondary }
      },
      tooltip: { theme: 'light' }
    });
  }, [theme, fontFamily]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Stack sx={{ gap: gridSpacing }}>
            {/* Header section */}
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Pending Maintenance
                </Typography>
                <Typography variant="h3" color="warning.dark">
                  14 Requests
                </Typography>
              </Stack>

              {/* Period selector */}
              <TextField
                select
                size="small"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                {periodOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {/* Chart */}
            <Box
              sx={{
                mt: 1,
                '& .apexcharts-bar-series path:hover': {
                  filter: 'brightness(0.95)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Chart
                options={chartOptions}
                series={maintenanceSeries}
                type="bar"
                height={280}
              />
            </Box>
          </Stack>
        </MainCard>
      )}
    </>
  );
}

PendingMaintenanceCard.propTypes = { isLoading: PropTypes.bool };
