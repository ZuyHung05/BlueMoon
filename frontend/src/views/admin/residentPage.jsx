import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  TableContainer,
  Paper,
  Pagination,
  Button,
  Stack
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Mock data — replace with API data later
const MOCK_RESIDENTS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    gender: "Nam",
    isHead: true,
    household: "Apt 12B",
    cccd: "012345678901",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0987654321",
    gender: "Nữ",
    isHead: false,
    household: "Apt 4A",
    cccd: "023456789012",
  },
  {
    id: 3,
    name: "Phạm Minh C",
    phone: "0912345678",
    gender: "Nam",
    isHead: false,
    household: "Apt 20C",
    cccd: "034567890123",
  }
];

export default function AdminResidentsPage() {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [headFilter, setHeadFilter] = useState("");

  // Filter logic
  const filteredResidents = MOCK_RESIDENTS.filter((r) => {
    const matchSearch =
      search === "" ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.household.toLowerCase().includes(search.toLowerCase()) ||
      r.cccd.includes(search);

    const matchGender = genderFilter === "" || r.gender === genderFilter;
    const matchHead =
      headFilter === "" ||
      (headFilter === "yes" && r.isHead) ||
      (headFilter === "no" && !r.isHead);

    return matchSearch && matchGender && matchHead;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý cư dân
      </Typography>

      {/* Search + Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={2}>
            
            {/* Search */}
            <TextField
              label="Tìm kiếm cư dân..."
              size="small"
              fullWidth
              sx={{ maxWidth: 320 }}
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
              sx={{ width: 180 }}
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
            </TextField>

            {/* Head of household filter */}
            <TextField
              select
              label="Chủ hộ"
              size="small"
              sx={{ width: 180 }}
              value={headFilter}
              onChange={(e) => setHeadFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="yes">Là chủ hộ</MenuItem>
              <MenuItem value="no">Không</MenuItem>
            </TextField>

            {/* Create resident */}
            <Box flexGrow={1} />
            <Button variant="contained" color="primary">
              + Thêm cư dân
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Residents Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cư dân</TableCell>
                  <TableCell>SĐT</TableCell>
                  <TableCell>CCCD</TableCell>
                  <TableCell>Giới tính</TableCell>
                  <TableCell>Hộ khẩu</TableCell>
                  <TableCell>Chủ hộ</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredResidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Không tìm thấy cư dân.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResidents.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar>{r.name.charAt(0)}</Avatar>
                          <Typography>{r.name}</Typography>
                        </Box>
                      </TableCell>

                      <TableCell>{r.phone}</TableCell>
                      <TableCell>{r.cccd}</TableCell>
                      <TableCell>{r.gender}</TableCell>
                      <TableCell>{r.household}</TableCell>

                      <TableCell>
                        {r.isHead ? (
                          <Typography color="primary">Chủ hộ</Typography>
                        ) : (
                          "-"
                        )}
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
    </Box>
  );
}
