// src/pages/Engineer/index.jsx
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import TaskTable from "ui-component/extended/TaskTable";
import TaskMap from "ui-component/extended/TaskMap";
import AssignedTasksCard from "./cards/AssignedTasksCard";
import InProgressTasksCard from "./cards/InProgressTasksCard";
import CompletedTasksCard from "./cards/CompletedTasksCard";
import AvgTimeCard from "./cards/AvgTimeCard";
import { gridSpacing } from "store/constant";

export default function EngineerDashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // simulate loading
  }, []);

  return (
    <Grid container spacing={gridSpacing} direction="column">
      {/* TOP SUMMARY CARDS */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <AssignedTasksCard isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InProgressTasksCard isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CompletedTasksCard isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AvgTimeCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

      {/* TASK TABLE */}
      <Grid item xs={12}>
        <TaskTable />
      </Grid>

      {/* MAP VIEW */}
      <Grid item xs={12}>
        <TaskMap />
      </Grid>
    </Grid>
  );
}
