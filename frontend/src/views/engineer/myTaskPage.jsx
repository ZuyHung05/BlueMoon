import { useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Button,
  InputBase,
  Pagination,
  MenuItem,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function TechnicianMyTasksPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Example data — later from API
  const myTasks = [
    {
      id: "R101",
      category: "Rác thải",
      location: "Phường 3",
      deadline: "12/11",
      status: "in_progress",
    },
    {
      id: "R102",
      category: "Ổ gà",
      location: "Quận 10",
      deadline: "13/11",
      status: "assigned",
    },
    {
      id: "R103",
      category: "Đèn hỏng",
      location: "Phường 5",
      deadline: "10/11",
      status: "completed",
    },
  ];

  const statusChip = (status) => {
    switch (status) {
      case "assigned":
        return <Chip label="Assigned" color="info" size="small" />;
      case "in_progress":
        return <Chip label="In Progress" color="warning" size="small" />;
      case "completed":
        return <Chip label="Completed" color="success" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  const actionButton = (status) => {
    if (status === "assigned")
      return (
        <Button variant="contained" color="primary" size="small">
          Start Task
        </Button>
      );
    if (status === "in_progress")
      return (
        <Button variant="contained" color="warning" size="small">
          Update
        </Button>
      );
    if (status === "completed")
      return (
        <Button variant="outlined" size="small" disabled>
          Done
        </Button>
      );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        My Tasks
      </Typography>
      <Typography variant="subtitle2" sx={{ color: "#777C6D", mb: 3 }}>
        Tasks assigned to you
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Search */}
        <Grid item xs={12} sm={8} md={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              px: 2,
              py: 1,
              border: "1px solid #E0E0E0",
            }}
          >
            <SearchIcon sx={{ mr: 1, color: "#777C6D" }} />
            <InputBase
              placeholder="Search task..."
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} sm={4} md={2} sx={{ ml: "auto" }}>
          <TextField
            select
            fullWidth
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              height: "42px",
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="assigned">Assigned</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Task List */}
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "#F7F7F7",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header */}
        <Grid
          container
          sx={{
            fontWeight: 600,
            color: "#777C6D",
            mb: 2,
            justifyContent: "space-around",
          }}
        >
          <Grid item xs={2}>
            ID
          </Grid>
          <Grid item xs={2}>
            Category
          </Grid>
          <Grid item xs={2}>
            Location
          </Grid>
          <Grid item xs={2}>
            Status
          </Grid>
          <Grid item xs={2}>
            Deadline
          </Grid>
          <Grid item xs={2}>
            Action
          </Grid>
        </Grid>

        {/* Rows */}
        {myTasks.map((task, idx) => (
          <Grid
            key={idx}
            container
            sx={{
              py: 2,
              borderBottom: "1px solid #E0E0E0",
              justifyContent: "space-around",
            }}
          >
            <Grid item xs={2}>
              {task.id}
            </Grid>
            <Grid item xs={2}>
              {task.category}
            </Grid>
            <Grid item xs={2}>
              {task.location}
            </Grid>
            <Grid item xs={2}>
              {statusChip(task.status)}
            </Grid>
            <Grid item xs={2}>
              {task.deadline}
            </Grid>
            <Grid item xs={2}>{actionButton(task.status)}</Grid>
          </Grid>
        ))}

        {/* Pagination */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Pagination count={10} variant="outlined" shape="rounded" />
        </Box>
      </Card>
    </Box>
  );
}
