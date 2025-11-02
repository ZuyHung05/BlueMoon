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
import { gridSpacing } from 'store/constant';

// ==============================|| DASHBOARD PAGE ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Define your card components in an array for clean iteration
  const cards = [
    { id: 1, component: TotalApartmentCard },
    { id: 2, component: OccupiedApartmentCard },
    { id: 3, component: VacantApartmentCard },
    { id: 4, component: PendingMaintenanceCard }
  ];

  return (
    <Grid container spacing={gridSpacing}>
      {/* Card Row */}
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

      {/* Later for additional charts / tables */}
      {/* 
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid> 
      */}
    </Grid>
  );
}
