import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Pagination
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

// MOCK DATA – replace with API
const MOCK_HOUSEHOLDS = [
  {
    id: 1,
    householdCode: "Apt 12B",
    head: "Nguyễn Văn A",
    memberCount: 4,
    phone: "0901234567",
    address: "Block A – Tầng 12 – 12B"
  },
  {
    id: 2,
    householdCode: "Apt 4A",
    head: "Trần Thị B",
    memberCount: 3,
    phone: "0987654321",
    address: "Block B – Tầng 4 – 4A"
  },
  {
    id: 3,
    householdCode: "Apt 20C",
    head: "Phạm Minh C",
    memberCount: 2,
    phone: "0912346789",
    address: "Block C – Tầng 20 – 20C"
  }
];

export default function HouseholdTable() {
  const [search, setSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState("");

  const filtered = MOCK_HOUSEHOLDS.filter((h) => {
    const matchSearch =
      search === "" ||
      h.householdCode.toLowerCase().includes(search.toLowerCase()) ||
      h.head.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase());

    const matchBlock =
      blockFilter === "" || h.address.toLowerCase().includes(blockFilter.toLowerCase());

    return matchSearch && matchBlock;
  });

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Danh sách hộ khẩu
        </Typography>

        {/* SEARCH + FILTERS */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
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

          {/* Block Filter */}
          <TextField
            select
            label="Block"
            size="small"
            sx={{ width: 150 }}
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="block a">Block A</MenuItem>
            <MenuItem value="block b">Block B</MenuItem>
            <MenuItem value="block c">Block C</MenuItem>
          </TextField>

          <Box flexGrow={1} />

          {/* Add household */}
          <Box>
            <button
              style={{
                padding: "8px 14px",
                background: "#1976d2",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}
            >
              + Thêm hộ khẩu
            </button>
          </Box>
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Hộ khẩu</strong></TableCell>
                <TableCell><strong>Chủ hộ</strong></TableCell>
                <TableCell><strong>Số thành viên</strong></TableCell>
                <TableCell><strong>SĐT</strong></TableCell>
                <TableCell><strong>Địa chỉ</strong></TableCell>
                <TableCell align="right"><strong>Hành động</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không tìm thấy hộ khẩu.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <HomeWorkIcon color="primary" />
                        {h.householdCode}
                      </Box>
                    </TableCell>

                    <TableCell>{h.head}</TableCell>
                    <TableCell>{h.memberCount}</TableCell>
                    <TableCell>{h.phone}</TableCell>
                    <TableCell>{h.address}</TableCell>

                    <TableCell align="right">
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        <Stack alignItems="center" mt={2}>
          <Pagination count={3} color="primary" />
        </Stack>
      </CardContent>
    </Card>
  );
}
