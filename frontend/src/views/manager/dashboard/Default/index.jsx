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
import UserManagementCard from './UserManagementCard';

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

  return (
    <Grid container spacing={gridSpacing} direction="column">
      <Grid item xs={12}>
        <Grid container spacing={5} justifyContent="space-evenly" alignItems="stretch">
          {/* Total Apartments */}
          <Grid container direction="column">
            <Grid container justifyContent="space-evenly" spacing={0}>
              <Grid item xs={12} sm={6} md={3}>
                  <TotalApartmentCard isLoading={isLoading} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                  <UserManagementCard isLoading={isLoading} />
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ height: 250, display: 'flex', alignItems: 'stretch' }}>
                <OccupiedApartmentCard isLoading={isLoading} />
              </Box>
            </Grid>
          </Grid>
          {/* Vacant Apartments */}
          <Grid item xs={12} sm={6} md={3} size="grow">
              <VacantApartmentCard isLoading={isLoading} />
          </Grid>

          {/* Pending Maintenance */}
          <Grid item xs={12} sm={6} md={3} size="grow">
              <PendingMaintenanceCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
  <Grid container spacing={5} justifyContent="space-evenly">
    {/* Row 1: Occupancy trend + pie chart */}
    <Grid item xs={12} md={8} size={6}>
      <OccupancyTrendChart />
    </Grid>
    <Grid item xs={12} md={4} size="grow">
      <ApartmentStatusPieChart />
    </Grid>

    {/* Row 2: Maintenance + Revenue */}
    <Grid item xs={12} md={6} size="grow">
      <MaintenanceTrendChart />
    </Grid>

  </Grid>
</Grid>
    </Grid>
  );
}
