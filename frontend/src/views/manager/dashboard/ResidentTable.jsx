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
  Avatar,
  IconButton,
  Stack,
  Pagination
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// MOCK DATA — replace with API later
const MOCK_RESIDENTS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    gender: "Nam",
    cccd: "012345678901",
    birthday: "1990-01-12",
    phone: "0901234567",
    household: "Apt 12B",
    isHead: true,
    status: "Bình thường"
  },
  {
    id: 2,
    name: "Trần Thị B",
    gender: "Nữ",
    cccd: "023456789012",
    birthday: "1995-04-22",
    phone: "0987654321",
    household: "Apt 4A",
    isHead: false,
    status: "Tạm trú"
  },
  {
    id: 3,
    name: "Phạm Minh C",
    gender: "Nam",
    cccd: "034567890123",
    birthday: "1988-09-10",
    phone: "0912345678",
    household: "Apt 20C",
    isHead: false,
    status: "Tạm vắng"
  }
];

export default function ResidentTable() {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = MOCK_RESIDENTS.filter((r) => {
    const matchSearch =
      search === "" ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cccd.includes(search) ||
      r.household.toLowerCase().includes(search.toLowerCase());

    const matchGender = genderFilter === "" || r.gender === genderFilter;
    const matchStatus = statusFilter === "" || r.status === statusFilter;

    return matchSearch && matchGender && matchStatus;
  });

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Danh sách cư dân
        </Typography>

        {/* SEARCH + FILTERS */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>

          {/* Search bar */}
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
            label="Trạng thái"
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

          {/* Add resident */}
          <Box>
            <button
              style={{
                padding: "8px 14px",
                background: "#2E7D32",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}
            >
              + Thêm cư dân
            </button>
          </Box>
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Cư dân</strong></TableCell>
                <TableCell><strong>CCCD</strong></TableCell>
                <TableCell><strong>Giới tính</strong></TableCell>
                <TableCell><strong>Ngày sinh</strong></TableCell>
                <TableCell><strong>SĐT</strong></TableCell>
                <TableCell><strong>Hộ khẩu</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell align="right"><strong>Hành động</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không tìm thấy cư dân.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id}>

                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>{r.name.charAt(0)}</Avatar>
                        <Typography>{r.name}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>{r.cccd}</TableCell>
                    <TableCell>{r.gender}</TableCell>
                    <TableCell>{r.birthday}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell>{r.household}</TableCell>

                    <TableCell>
                      <Typography
                        color={
                          r.status === "Tạm trú"
                            ? "warning.main"
                            : r.status === "Tạm vắng"
                            ? "error.main"
                            : "success.main"
                        }
                      >
                        {r.status}
                      </Typography>
                    </TableCell>

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

        {/* Pagination */}
        <Stack alignItems="center" mt={2}>
          <Pagination count={5} color="primary" />
        </Stack>
      </CardContent>
    </Card>
  );
}
