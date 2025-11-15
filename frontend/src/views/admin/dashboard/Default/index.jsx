import React, { useEffect, useState } from 'react';

// Material-UI
import { Grid, Box } from '@mui/material';

// Project imports (cards & charts)
import TotalApartmentCard from './TotalApartmentCard';
import OccupiedApartmentCard from './OccupiedApartmentCard';
import VacantApartmentCard from './VacantApartmentCard';
import PendingMaintenanceCard from './PendingMaintenanceCard';
import UserManagementCard from './UserManagementCard';
<<<<<<< HEAD:frontend/src/views/dashboard/Default/index.jsx
=======

>>>>>>> 4517065e2d2b7bf617bae4d00424420a12086999:frontend/src/views/admin/dashboard/Default/index.jsx
import OccupancyTrendChart from './charts/OccupancyTrendChart';
import ApartmentStatusPieChart from './charts/ApartmentStatusPieChart';
import MaintenanceTrendChart from './charts/MaintenanceTrendChart';
import RevenueExpenseChart from './charts/RevenueExpenseChart';
  
// Constants
import { gridSpacing } from 'store/constant';

// ==============================|| DASHBOARD PAGE ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Grid container spacing={gridSpacing} direction="column">
<<<<<<< HEAD:frontend/src/views/dashboard/Default/index.jsx
      {/* ===================== TOP KPI SECTION ===================== */}
      <Grid item xs={12}>
        <Grid container justifyContent="space-evenly" spacing={2}>
          
          {/* Left column: stacked cards */}
          <Grid item>
            <Grid container direction="column" spacing={2}>
              <Grid container justifyContent="space-evenly" alignContent="center">
                <Grid size="6">
                  <UserManagementCard isLoading={isLoading} />
                </Grid>
                <Grid size="grow">
                  <TotalApartmentCard isLoading={isLoading} />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <OccupiedApartmentCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>

          {/* Right column: two cards side by side */}
          <Grid item>
            <Grid container spacing={5} justifyContent="space-evenly">
              <Grid item xs={12} sm={6} md={3}>
                <VacantApartmentCard isLoading={isLoading} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <PendingMaintenanceCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Grid>

      <Grid>
        <Grid
            container
            direction="row"
            sx={{
              justifyContent: "space-evenly",
              alignItems: "center",
            }} spacing={1}
          >

          <Grid>
            <ApartmentStatusPieChart />
          </Grid>

          {/* Row 2: Maintenance & revenue comparison */}
          <Grid>
            <MaintenanceTrendChart />
          </Grid>
          <Grid>
            <RevenueExpenseChart />
          </Grid>
        </Grid>
      </Grid>
      
=======
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
>>>>>>> 4517065e2d2b7bf617bae4d00424420a12086999:frontend/src/views/admin/dashboard/Default/index.jsx
    </Grid>
  );
}
