import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Avatar,
  IconButton,
  Button,
  Stack,
  Pagination
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Mock data — replace with your API later
const MOCK_USERS = [
  {
    id: 1,
    name: "Lê Văn Admin",
    email: "admin@bluemoon.com",
    phone: "0901000001",
    role: "Admin",
    status: "Active"
  },
  {
    id: 2,
    name: "Tran Thuy Kế toán",
    email: "ketoan1@bluemoon.com",
    phone: "0901000234",
    role: "Kế toán",
    status: "Active"
  },
  {
    id: 3,
    name: "Nguyen Dinh Tổ trưởng",
    email: "toto1@bluemoon.com",
    phone: "0905000333",
    role: "Tổ trưởng",
    status: "Inactive"
  }
];

export default function AdminUserManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filtering logic
  const filteredUsers = MOCK_USERS.filter((u) => {
    const matchSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = roleFilter === "" || u.role === roleFilter;
    const matchStatus = statusFilter === "" || u.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* PAGE TITLE */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý tài khoản
      </Typography>

      {/* SEARCH + FILTERS + CREATE BUTTON */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={2}>
            
            {/* Search */}
            <TextField
              label="Tìm kiếm tài khoản..."
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

            {/* Role filter */}
            <TextField
              select
              label="Vai trò"
              size="small"
              sx={{ width: 180 }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Kế toán">Kế toán</MenuItem>
              <MenuItem value="Tổ trưởng">Tổ trưởng</MenuItem>
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
              <MenuItem value="Active">Hoạt động</MenuItem>
              <MenuItem value="Inactive">Ngưng hoạt động</MenuItem>
            </TextField>

            <Box flexGrow={1} />

            {/* Add new user */}
            <Button variant="contained" color="primary">
              + Tạo tài khoản
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* USER TABLE */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tài khoản</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>SĐT</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không tìm thấy tài khoản nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar>{u.name.charAt(0)}</Avatar>
                          <Typography>{u.name}</Typography>
                        </Box>
                      </TableCell>

                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phone}</TableCell>

                      <TableCell>
                        <Typography
                          color={
                            u.role === "Admin"
                              ? "primary"
                              : u.role === "Kế toán"
                              ? "success.main"
                              : "warning.main"
                          }
                        >
                          {u.role}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          color={
                            u.status === "Active"
                              ? "success.main"
                              : "error.main"
                          }
                        >
                          {u.status === "Active" ? "Hoạt động" : "Ngưng"}
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
            <Pagination count={3} color="primary" />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
