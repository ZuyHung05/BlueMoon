import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';

// third-party
import Chart from 'react-apexcharts';

// ==============================|| OCCUPANCY TREND CHART ||============================== //

export default function OccupancyTrendChart() {
  const theme = useTheme();

  // Get theme colors for consistency
  const primary = theme.vars.palette.primary.main;
  const success = theme.vars.palette.success.main;
  const textPrimary = theme.vars.palette.text.primary;
  const divider = theme.vars.palette.divider;

  // Chart data
  const [series] = useState([
    {
      name: 'Occupancy Rate (%)',
      data: [78, 82, 85, 87, 90, 92, 93, 94, 95, 94, 92, 91]
    }
  ]);

  // Chart options
  const [options, setOptions] = useState({
    chart: {
      type: 'line',
      height: 300,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { style: { colors: textPrimary } },
      axisBorder: { color: divider }
    },
    yaxis: {
      title: { text: 'Occupancy (%)', style: { color: textPrimary } },
      labels: { style: { colors: textPrimary } }
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => `${val}%` }
    },
    colors: [success],
    grid: { borderColor: divider },
    markers: { size: 4 },
    dataLabels: { enabled: false },
    legend: {
      position: 'top',
      labels: { colors: textPrimary }
    }
  });

  // Update chart colors when theme changes
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      colors: [success],
      xaxis: { ...prev.xaxis, labels: { style: { colors: textPrimary } } },
      yaxis: { ...prev.yaxis, labels: { style: { colors: textPrimary } } },
      grid: { borderColor: divider }
    }));
  }, [success, textPrimary, divider]);

  return (
    <MainCard title="Occupancy Rate Over Time">
      <Chart options={options} series={series} type="line" height={300} />
    </MainCard>
  );
}
