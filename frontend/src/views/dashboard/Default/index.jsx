import React, { useEffect, useState } from 'react';

// Material-UI
import { Grid, Box } from '@mui/material';

// Project imports (cards & charts)
import TotalApartmentCard from './TotalApartmentCard';
import OccupiedApartmentCard from './OccupiedApartmentCard';
import VacantApartmentCard from './VacantApartmentCard';
import PendingMaintenanceCard from './PendingMaintenanceCard';
import UserManagementCard from './UserManagementCard';
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
      
    </Grid>
  );
}
