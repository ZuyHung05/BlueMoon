import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

import HouseholdTable from "./dashboard/HouseholdTable";

export default function ManagerHouseholdsPage() {
  const [search, setSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState("");

  return (
    <Box sx={{ p: 3 }}>
      {/* PAGE TITLE */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý hộ khẩu
      </Typography>

      {/* SEARCH + FILTERS + ADD */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={2}>

            {/* Search */}
            <TextField
              label="Tìm kiếm hộ khẩu..."
              size="small"
              sx={{ width: 300 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

            {/* Block filter */}
            <TextField
              select
              label="Block"
              size="small"
              sx={{ width: 150 }}
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="A">Block A</MenuItem>
              <MenuItem value="B">Block B</MenuItem>
              <MenuItem value="C">Block C</MenuItem>
            </TextField>

            <Box flexGrow={1} />

            {/* Add household */}
            <Button
              variant="contained"
              startIcon={<HomeWorkIcon />}
              sx={{ ml: "auto" }}
            >
              Thêm hộ khẩu
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Household Table */}
      <HouseholdTable search={search} block={blockFilter} />
    </Box>
  );
}
