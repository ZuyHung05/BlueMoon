import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';

// third-party
import Chart from 'react-apexcharts';

// ==============================|| APARTMENT STATUS PIE CHART ||============================== //

export default function ApartmentStatusPieChart() {
  const theme = useTheme();

  // Extract theme colors
  const primary = theme.vars.palette.primary.main;
  const info = theme.vars.palette.info.main;
  const warning = theme.vars.palette.warning.main;
  const textPrimary = theme.vars.palette.text.primary;

  // Example data (replace later with real API data)
  const [series, setSeries] = useState([82, 12, 6]); // occupied, vacant, maintenance

  // Chart options
  const [options, setOptions] = useState({
    chart: {
      type: 'pie',
      height: 300
    },
    labels: ['Occupied', 'Vacant', 'Maintenance'],
    colors: [primary, info, warning],
    legend: {
      show: true,
      position: 'bottom',
      labels: {
        colors: textPrimary
      },
      markers: {
        shape: 'circle'
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => `${val} apartments`
      }
    },
    stroke: {
      show: false
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff']
      },
      formatter: (val, opts) => `${val.toFixed(1)}%`
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            width: 250
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  });

  // Update theme dynamically if color mode changes
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      colors: [primary, info, warning],
      legend: { ...prev.legend, labels: { colors: textPrimary } }
    }));
  }, [primary, info, warning, textPrimary]);

  return (
    <MainCard title="Apartment Status Breakdown">
      <Chart options={options} series={series} type="pie" height={300} />
    </MainCard>
  );
}
