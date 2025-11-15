import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';

// third-party
import Chart from 'react-apexcharts';

// ==============================|| MAINTENANCE TREND CHART ||============================== //

export default function MaintenanceTrendChart() {
  const theme = useTheme();

  // Get theme colors
  const primary = theme.vars.palette.primary.main;
  const warning = theme.vars.palette.warning.main;
  const error = theme.vars.palette.error.main;
  const textPrimary = theme.vars.palette.text.primary;
  const divider = theme.vars.palette.divider;

  // Example data (replace later with backend API)
  const [series] = useState([
    { name: 'Plumbing', data: [5, 7, 6, 9, 8, 10, 12, 11, 9, 7, 6, 5] },
    { name: 'Electrical', data: [3, 5, 4, 6, 7, 6, 8, 9, 7, 6, 5, 4] },
    { name: 'Cleaning', data: [4, 6, 5, 8, 9, 7, 10, 11, 8, 7, 5, 6] }
  ]);

  // Chart configuration
  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 4
      }
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    colors: [primary, warning, error],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { style: { colors: textPrimary } },
      axisBorder: { color: divider }
    },
    yaxis: {
      title: {
        text: 'Number of Requests',
        style: { color: textPrimary }
      },
      labels: { style: { colors: textPrimary } }
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => `${val} requests` }
    },
    legend: {
      show: true,
      position: 'bottom',
      labels: { colors: textPrimary },
      itemMargin: { horizontal: 10, vertical: 5 }
    },
    grid: { borderColor: divider }
  });

  // Re-apply theme colors on mode switch (light/dark)
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      colors: [primary, warning, error],
      xaxis: {
        ...prev.xaxis,
        labels: { style: { colors: textPrimary } },
        axisBorder: { color: divider }
      },
      yaxis: {
        ...prev.yaxis,
        labels: { style: { colors: textPrimary } },
        title: { ...prev.yaxis.title, style: { color: textPrimary } }
      },
      legend: { ...prev.legend, labels: { colors: textPrimary } },
      grid: { borderColor: divider }
    }));
  }, [primary, warning, error, textPrimary, divider]);

  return (
    <MainCard title="Maintenance Requests Trend">
      <Chart options={options} series={series} type="bar" height={300} />
    </MainCard>
  );
}
