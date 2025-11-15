import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  InputBase,
  Button,
  Chip,
  Pagination
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function EngineersPage() {
  const [search, setSearch] = useState("");

  const engineers = [
    { name: "Hoa", email: "hoa@x.com", status: "Active", tasks: 3 },
    { name: "Binh", email: "binh@x.com", status: "Busy", tasks: 1 },
    { name: "Minh", email: "minh@x.com", status: "Active", tasks: 0 }
  ];

  const getStatusChip = (status) => {
    const colors = {
      Active: { bg: "#D3F9D8", text: "#2B8A3E" },
      Busy: { bg: "#FFE7D9", text: "#B93815" },
      Offline: { bg: "#E0E0E0", text: "#555" }
    };

    return (
      <Chip
        label={status}
        sx={{
          backgroundColor: colors[status].bg,
          color: colors[status].text,
          fontWeight: 600,
          borderRadius: "8px"
        }}
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Engineers
      </Typography>
      <Typography variant="subtitle2" sx={{ color: "#777C6D", mb: 3 }}>
        Manage engineers and workloads
      </Typography>

      {/* Search + Add Button */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
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
              placeholder="Search engineer..."
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} md={2} sx={{ ml: "auto" }}>
          <Button variant="contained" fullWidth sx={{ height: "42px" }}>
            Add Engineer
          </Button>
        </Grid>
      </Grid>

      {/* Table */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        {/* Header */}
        <Grid container sx={{ fontWeight: 700, color: "#777C6D", pb: 1, borderBottom: "2px solid #E0E0E0" }}>
          <Grid item xs={3}>Name</Grid>
          <Grid item xs={3}>Email</Grid>
          <Grid item xs={2}>Status</Grid>
          <Grid item xs={2}>Active Tasks</Grid>
          <Grid item xs={2}>Action</Grid>
        </Grid>

        {/* Rows */}
        {engineers.map((eng, idx) => (
          <Grid
            key={idx}
            container
            sx={{
              py: 2,
              borderBottom: "1px solid #EEE",
              "&:hover": { backgroundColor: "#F7F7F7", cursor: "pointer" }
            }}
          >
            <Grid item xs={3}>{eng.name}</Grid>
            <Grid item xs={3}>{eng.email}</Grid>
            <Grid item xs={2}>{getStatusChip(eng.status)}</Grid>
            <Grid item xs={2}>{eng.tasks}</Grid>
            <Grid item xs={2}>
              <Button size="small" variant="outlined">View</Button>
            </Grid>
          </Grid>
        ))}

        {/* Pagination */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination count={5} variant="outlined" shape="rounded" />
        </Box>
      </Card>
    </Box>
  );
}
