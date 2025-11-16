// src/pages/Manager/index.jsx
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

// Manager cards (you will create these similar to admin cards)
import TempStayCard from "./cards/TempStayCard";
import TotalHouseholdsCard from "./cards/TotalHouseHoldsCard";
import TotalResidentsCard from "./cards/TotalResidentsCard";

// Manager tables & components
import HouseholdTable from "./HouseholdTable";
import ResidentTable from "./ResidentTable";
import AreaMap from "./AreaMap";

import { gridSpacing } from "store/constant";

export default function ManagerDashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <Grid container spacing={gridSpacing} direction="column">
      
      {/* TOP SUMMARY CARDS */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TotalHouseholdsCard isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TotalResidentsCard isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TempStayCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

      {/* HOUSEHOLD TABLE */}
      <Grid item xs={12}>
        <HouseholdTable />
      </Grid>

      {/* RESIDENT TABLE */}
      <Grid item xs={12}>
        <ResidentTable />
      </Grid>

      {/* MAP VIEW (optional) */}
      <Grid item xs={12}>
        <AreaMap />
      </Grid>
    </Grid>
  );
}
