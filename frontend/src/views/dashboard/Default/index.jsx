import { useEffect, useState } from 'react';
import React from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// project imports
import TotalApartmentCard from './TotalApartmentCard';
import OccupiedApartmentCard from './OccupiedApartmentCard';
import VacantApartmentCard from './VacantApartmentCard';
import PendingMaintenanceCard from './PendingMaintenanceCard';
import OccupancyTrendChart from './charts/OccupancyTrendChart';
import ApartmentStatusPieChart from './charts/ApartmentStatusPieChart';
import MaintenanceTrendChart from './charts/MaintenanceTrendChart';
import RevenueExpenseChart from './charts/RevenueExpenseChart';

import { gridSpacing } from 'store/constant';

// ==============================|| DASHBOARD PAGE ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // simulate loading delay
  }, []);

  const cards = [
    { id: 1, component: TotalApartmentCard },
    { id: 2, component: OccupiedApartmentCard },
    { id: 3, component: VacantApartmentCard },
    { id: 4, component: PendingMaintenanceCard }
  ];

  return (
    <Grid container spacing={gridSpacing}>
      {/* ==== Summary Cards Row ==== */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {cards.map(({ id, component: CardComponent }) => (
            <Grid item xs={12} sm={6} md={3} key={id}>
              <Box sx={{ height: 250, display: 'flex', alignItems: 'stretch' }}>
                <CardComponent isLoading={isLoading} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* ==== Analytics Charts Section ==== */}
      <Grid item xs={12}>
  <Grid container spacing={2}>
    {/* Row 1: Occupancy trend + pie chart */}
    <Grid item xs={12} md={8}>
      <OccupancyTrendChart />
    </Grid>
    <Grid item xs={12} md={4}>
      <ApartmentStatusPieChart />
    </Grid>

    {/* Row 2: Maintenance + Revenue */}
    <Grid item xs={12} md={6}>
      <MaintenanceTrendChart />
    </Grid>
    <Grid item xs={12} md={6}>
      <RevenueExpenseChart />
    </Grid>
  </Grid>
</Grid>
    </Grid>
  );
}
