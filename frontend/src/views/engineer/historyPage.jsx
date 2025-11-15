import { useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  MenuItem,
  InputBase,
  Chip,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function TechnicianHistoryPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Example Task History (later fetch from API)
  const historyData = [
    {
      id: "R101",
      category: "Rác thải",
      location: "Phường 3",
      status: "completed",
      date: "12/11",
    },
    {
      id: "R102",
      category: "Ổ gà",
      location: "Quận 10",
      status: "in_progress",
      date: "13/11",
    },
    {
      id: "R103",
      category: "Đèn hỏng",
      location: "Phường 5",
      status: "completed",
      date: "10/11",
    },
  ];

  const statusChip = (status) => {
    if (status === "completed")
      return <Chip label="Completed" color="success" size="small" />;
    if (status === "in_progress")
      return <Chip label="In Progress" color="warning" size="small" />;
    return <Chip label="Pending" color="default" size="small" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        Task History
      </Typography>
      <Typography variant="subtitle2" sx={{ color: "#777C6D", mb: 3 }}>
        All tasks you have updated
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Search Bar */}
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
              placeholder="Search by ID, category, location..."
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
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* History Table */}
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
            Report ID
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
            Date
          </Grid>
        </Grid>

        {/* Rows */}
        {historyData.map((task, index) => (
          <Grid
            key={index}
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
              {task.date}
            </Grid>
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
