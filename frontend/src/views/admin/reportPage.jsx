import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  InputBase,
  Select,
  MenuItem,
  Pagination,
  Chip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function ReportsPage() {
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");

  // Dummy data (replace with API data)
  const reports = [
    { id: 1, category: "Pothole", location: "361 Ngo Quyen", citizen: "LocNg", status: "Pending", engineer: "Mr Gold" },
    { id: 2, category: "Trash", location: "200 Tran Phu", citizen: "Minh", status: "Assigned", engineer: "Ms Hoa" },
    { id: 3, category: "Broken Light", location: "544 Hai Ba Trung", citizen: "An", status: "Completed", engineer: "Mr Binh" }
  ];

  const getStatusChip = (status) => {
    const colors = {
      Pending: { bg: "#FFF4CC", text: "#8A6D00" },
      Assigned: { bg: "#E0F2FF", text: "#035388" },
      "In Progress": { bg: "#FFE7D9", text: "#B93815" },
      Completed: { bg: "#D3F9D8", text: "#2B8A3E" }
    };

    return (
      <Chip
        label={status}
        sx={{
          backgroundColor: colors[status]?.bg,
          color: colors[status]?.text,
          fontWeight: 600,
          borderRadius: "8px"
        }}
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        All Reports
      </Typography>
      <Typography variant="subtitle2" sx={{ color: "#777C6D", mb: 3 }}>
        Manage all citizen-submitted issues
      </Typography>

      {/* Top Controls */}
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
              border: "1px solid #E0E0E0"
            }}
          >
            <SearchIcon sx={{ mr: 1, color: "#777C6D" }} />
            <InputBase
              placeholder="Search reports..."
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
        </Grid>

        {/* Sort Dropdown */}
        <Grid item xs={12} sm={4} md={2} sx={{ ml: "auto" }}>
          <Select
            fullWidth
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              height: "42px"
            }}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* Table Container */}
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "#FFF",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
        }}
      >
        {/* Table Header */}
        <Grid
          container
          sx={{
            fontWeight: 700,
            color: "#777C6D",
            borderBottom: "2px solid #E0E0E0",
            pb: 1,
            mb: 2
          }}
        >
          <Grid item xs={2}>Report ID</Grid>
          <Grid item xs={2}>Category</Grid>
          <Grid item xs={3}>Location</Grid>
          <Grid item xs={2}>Citizen</Grid>
          <Grid item xs={2}>Status</Grid>
          <Grid item xs={1}>Engineer</Grid>
        </Grid>

        {/* Table Rows */}
        {reports.map((row) => (
          <Grid
            container
            key={row.id}
            sx={{
              py: 2,
              borderBottom: "1px solid #EAEAEA",
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "#F7F7F7",
                cursor: "pointer"
              }
            }}
          >
            <Grid item xs={2}>{row.id}</Grid>
            <Grid item xs={2}>{row.category}</Grid>
            <Grid item xs={3}>{row.location}</Grid>
            <Grid item xs={2}>{row.citizen}</Grid>
            <Grid item xs={2}>{getStatusChip(row.status)}</Grid>
            <Grid item xs={1}>{row.engineer}</Grid>
          </Grid>
        ))}

        {/* Pagination */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination count={10} variant="outlined" shape="rounded" />
        </Box>
      </Card>
    </Box>
  );
}
