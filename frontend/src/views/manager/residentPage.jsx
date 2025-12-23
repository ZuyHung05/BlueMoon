import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  MenuItem,
  Button
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import ResidentTable from "./dashboard/ResidentTable";

export default function ManagerResidentsPage() {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý cư dân
      </Typography>

      {/* Search + Filters + Add Button */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={2}>

            {/* Search */}
            <TextField
              label="Tìm kiếm cư dân..."
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

            {/* Gender filter */}
            <TextField
              select
              label="Giới tính"
              size="small"
              sx={{ width: 150 }}
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
            </TextField>

            {/* Status filter */}
            <TextField
              select
              label="Tình trạng cư trú"
              size="small"
              sx={{ width: 180 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Bình thường">Bình thường</MenuItem>
              <MenuItem value="Tạm trú">Tạm trú</MenuItem>
              <MenuItem value="Tạm vắng">Tạm vắng</MenuItem>
            </TextField>

            <Box flexGrow={1} />

            {/* Add new resident */}
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{ ml: "auto" }}
            >
              Thêm cư dân
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Residents Table */}
      <ResidentTable search={search} gender={genderFilter} status={statusFilter} />
    </Box>
  );
}
