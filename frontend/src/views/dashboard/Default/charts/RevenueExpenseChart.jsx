import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';

// third-party
import Chart from 'react-apexcharts';

// ==============================|| REVENUE VS EXPENSE CHART ||============================== //

export default function RevenueExpenseChart() {
  const theme = useTheme();

  // Theme colors for chart styling
  const success = theme.vars.palette.success.main;
  const error = theme.vars.palette.error.main;
  const textPrimary = theme.vars.palette.text.primary;
  const divider = theme.vars.palette.divider;

  // Example monthly data
  const [series] = useState([
    { name: 'Revenue', data: [5000, 5200, 5400, 6000, 6300, 6100, 6500, 6700, 6900, 7000, 7200, 7500] },
    { name: 'Expenses', data: [3200, 3100, 3300, 3500, 4000, 3700, 4200, 4500, 4400, 4700, 4900, 5000] }
  ]);

  // Chart options
  const [options, setOptions] = useState({
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    dataLabels: { enabled: false },
    colors: [success, error],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { style: { colors: textPrimary } },
      axisBorder: { color: divider }
    },
    yaxis: {
      title: { text: 'Amount ($)', style: { color: textPrimary } },
      labels: { style: { colors: textPrimary } }
    },
    grid: { borderColor: divider },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => `$${val.toLocaleString()}` }
    },
    legend: {
      show: true,
      position: 'bottom',
      labels: { colors: textPrimary },
      itemMargin: { horizontal: 10, vertical: 5 }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    }
  });

  // Update chart colors when theme changes
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      colors: [success, error],
      xaxis: { ...prev.xaxis, labels: { style: { colors: textPrimary } } },
      yaxis: { ...prev.yaxis, labels: { style: { colors: textPrimary } } },
      legend: { ...prev.legend, labels: { colors: textPrimary } },
      grid: { borderColor: divider }
    }));
  }, [success, error, textPrimary, divider]);

  return (
    <MainCard title="Revenue vs Expenses">
      <Chart options={options} series={series} type="area" height={300} />
    </MainCard>
  );
}
