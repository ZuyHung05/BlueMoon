import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate } from "react-router-dom";

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// project imports (new cards & charts for Ban Quản Lý)
import TotalReportsCard from './cards/TotalReportsCard';
import InProgressReportsCard from './cards/InProgressReportsCard';
import ResolvedReportsCard from './cards/ResolvedReportsCard';
import UrgentReportsCard from './cards/UrgentReportsCard';

import ReportsByCategoryChart from './charts/ReportsByCategoryChart';
import ReportStatusBarChart from './charts/ReportStatusBarChart';
import ReportsOverTimeChart from './charts/ReportsOverTimeChart';
import TeamPerformanceChart from './charts/TeamPerformanceChart';

import { gridSpacing } from 'store/constant';

// ==============================|| BAN QUẢN LÝ DASHBOARD PAGE ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // simulate loading delay
  }, []);

  return (
    <Grid container spacing={gridSpacing} direction="column">
      {/* ======== TOP METRIC CARDS ======== */}
      <Grid container direction="row">
        <Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="space-evenly">
              <Grid container direction="column">
                  <Grid item xs={12} sm={6} md={3}>
                    <TotalReportsCard isLoading={isLoading} />
                  </Grid>

                  {/* In Progress Reports */}
                  <Grid item xs={12} sm={6} md={3}>
                    <InProgressReportsCard isLoading={isLoading} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ResolvedReportsCard isLoading={isLoading} />
                  </Grid>

                  {/* Urgent Reports */}
                  <Grid item xs={12} sm={6} md={3}>
                    <UrgentReportsCard isLoading={isLoading} />
                  </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={3}>
            <ReportsByCategoryChart />
          </Grid>
        <Grid size="grow">
          <ReportsOverTimeChart />
        </Grid>
      </Grid>
      {/* ======== CHARTS & ANALYTICS ======== */}
      <Grid item xs={12}>
        <Grid container spacing={3} justifyContent="space-evenly">

          <Grid size={6}>
            <ReportStatusBarChart />
          </Grid>

          <Grid size="grow">
            <TeamPerformanceChart />
          </Grid>

        </Grid>
      </Grid>
    </Grid>
  );
}
