// frontend/src/views/admin/household/HouseholdManagement.jsx

import React, { useState } from 'react';

// material-ui
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    OutlinedInput,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Tooltip,
    Typography,
    Stack,
    Select,
    FormControl,
    InputLabel,
    Tabs,
    Tab,
    Autocomplete,
    Snackbar,
    Alert
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import { Edit, Trash2, Plus, Search, Filter, Home, Users, UserPlus } from 'lucide-react';

const HouseholdManagement = () => {
    // --- 1. MOCK DATA ---
    const MOCK_APARTMENTS = [
        { id: 101, room_number: 'A101', area: 75, status: 1 },
        { id: 102, room_number: 'A102', area: 80, status: 1 },
        { id: 205, room_number: 'B205', area: 65, status: 0 }
    ];

    const MOCK_RESIDENTS = [
        { id: 1, full_name: 'Nguyễn Văn A', id_number: '001090000001', phone: '0901000001', gender: 'Nam' },
        { id: 2, full_name: 'Trần Thị B', id_number: '001090000002', phone: '0901000002', gender: 'Nữ' },
        { id: 3, full_name: 'Lê Văn C', id_number: '001090000003', phone: '0901000003', gender: 'Nam' },
        { id: 4, full_name: 'Phạm Thị D', id_number: '001090000004', phone: '0901000004', gender: 'Nữ' }
    ];

    const [households, setHouseholds] = useState([
        {
            household_id: 1,
            apartment_id: 101,
            head_of_household: 1,
            status: 1,
            start_day: '2020-01-15',
            members: [
                { id: 1, full_name: 'Nguyễn Văn A', role: 'Chủ hộ', id_number: '001090000001' },
                { id: 2, full_name: 'Trần Thị B', role: 'Vợ', id_number: '001090000002' }
            ]
        },
        {
            household_id: 2,
            apartment_id: 102,
            head_of_household: 3,
            status: 1,
            start_day: '2021-05-20',
            members: [{ id: 3, full_name: 'Lê Văn C', role: 'Chủ hộ', id_number: '001090000003' }]
        }
    ]);

    // --- 2. STATE ---
    const [open, setOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    // Filter Menu State
    const [anchorEl, setAnchorEl] = useState(null);
    const openFilter = Boolean(anchorEl);

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        apartment_id: '',
        head_of_household: '',
        status: 1,
        start_day: ''
    });

    // Tab state
    const [tabValue, setTabValue] = useState(0);

    // Members state
    const [currentMembers, setCurrentMembers] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState('');

    // Snackbar state
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // --- 3. FILTERING ---
    const filteredData = households.filter((item) => {
        const apartment = MOCK_APARTMENTS.find((a) => a.id === item.apartment_id);
        const head = MOCK_RESIDENTS.find((r) => r.id === item.head_of_household);

        const matchSearch =
            (head && head.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (head && head.id_number.includes(searchTerm)) ||
            (apartment && apartment.room_number.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchStatus = statusFilter === 'ALL' || item.status === parseInt(statusFilter);

        return matchSearch && matchStatus;
    });

    // --- 4. HANDLERS ---
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (status) => {
        if (status !== null && status !== undefined) {
            setStatusFilter(status);
            setPage(0);
        }
        setAnchorEl(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpen = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                apartment_id: record.apartment_id,
                head_of_household: record.head_of_household,
                status: record.status,
                start_day: record.start_day
            });
            setCurrentMembers([...record.members]);
        } else {
            setEditingRecord(null);
            setFormData({
                apartment_id: '',
                head_of_household: '',
                status: 1,
                start_day: new Date().toISOString().split('T')[0]
            });
            setCurrentMembers([]);
        }
        setTabValue(0);
        setSelectedMemberId('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRecord(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Validate required fields
        if (!formData.apartment_id) {
            setSnackbar({ open: true, message: 'Vui lòng chọn căn hộ!', severity: 'warning' });
            setTabValue(0); // Switch to general info tab
            return;
        }
        if (!formData.head_of_household) {
            setSnackbar({ open: true, message: 'Vui lòng chọn chủ hộ!', severity: 'warning' });
            setTabValue(0);
            return;
        }
        if (!formData.start_day) {
            setSnackbar({ open: true, message: 'Vui lòng chọn ngày chuyển đến!', severity: 'warning' });
            setTabValue(0);
            return;
        }

        if (currentMembers.length === 0) {
            setSnackbar({ open: true, message: 'Hộ khẩu phải có ít nhất 1 thành viên!', severity: 'error' });
            setTabValue(1); // Switch to members tab
            return;
        }

        if (editingRecord) {
            const updatedData = households.map((item) =>
                item.household_id === editingRecord.household_id 
                    ? { ...item, ...formData, members: currentMembers } 
                    : item
            );
            setHouseholds(updatedData);
            setSnackbar({ open: true, message: 'Cập nhật hộ khẩu thành công!', severity: 'success' });
        } else {
            const newId = households.length > 0 ? Math.max(...households.map((d) => d.household_id)) + 1 : 1;
            
            let finalMembers = [...currentMembers];
            const headInfo = MOCK_RESIDENTS.find((r) => r.id === formData.head_of_household);
            if (headInfo && !finalMembers.some((m) => m.id === headInfo.id)) {
                finalMembers.push({ ...headInfo, role: 'Chủ hộ' });
            }

            setHouseholds([
                ...households,
                { household_id: newId, ...formData, members: finalMembers }
            ]);
            setSnackbar({ open: true, message: 'Tạo hộ khẩu mới thành công!', severity: 'success' });
        }
        handleClose();
    };

    const handleDelete = (record) => {
        setDeletingRecord(record);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingRecord) {
            setHouseholds(households.filter((item) => item.household_id !== deletingRecord.household_id));
            setSnackbar({ open: true, message: 'Xóa hộ khẩu thành công!', severity: 'success' });
        }
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    // Member handlers
    const handleAddMember = () => {
        if (!selectedMemberId) return;

        const resident = MOCK_RESIDENTS.find((r) => r.id === parseInt(selectedMemberId));
        if (!resident) return;

        if (currentMembers.some((m) => m.id === resident.id)) {
            return;
        }

        const newMember = { ...resident, role: 'Thành viên' };
        setCurrentMembers([...currentMembers, newMember]);
        setSelectedMemberId('');
    };

    const handleRemoveMember = (memberId) => {
        if (memberId === formData.head_of_household) {
            return;
        }
        setCurrentMembers(currentMembers.filter((m) => m.id !== memberId));
    };

    // --- HELPER ---
    const getApartmentName = (id) => MOCK_APARTMENTS.find((a) => a.id === id)?.room_number || '---';
    const getHeadName = (id) => MOCK_RESIDENTS.find((r) => r.id === id)?.full_name || '---';

    const getStatusChip = (status) => {
        if (status === 1) {
            return (
                <Chip 
                    label="Đang ở" 
                    size="small" 
                    sx={{ 
                        bgcolor: 'rgba(34, 197, 94, 0.15)', 
                        color: '#4ade80',
                        fontWeight: 500,
                        border: 'none',
                        minWidth: 70,
                        justifyContent: 'center'
                    }} 
                />
            );
        }
        return (
            <Chip 
                label="Đã đi" 
                size="small" 
                sx={{ 
                    bgcolor: 'rgba(100, 100, 100, 0.2)', 
                    color: '#94a3b8',
                    fontWeight: 500,
                    border: 'none',
                    minWidth: 70,
                    justifyContent: 'center'
                }} 
            />
        );
    };

    const getMemberCountChip = (count) => {
        return (
            <Chip 
                label={`${count} người`} 
                size="small" 
                sx={{ 
                    bgcolor: 'rgba(139, 92, 246, 0.15)', 
                    color: '#a78bfa',
                    fontWeight: 500,
                    border: 'none',
                    minWidth: 70,
                    justifyContent: 'center'
                }} 
            />
        );
    };

    const getHouseholdIdChip = (id) => {
        return (
            <Chip 
                label={`H${id}`} 
                size="small" 
                sx={{ 
                    bgcolor: 'rgba(59, 130, 246, 0.15)', 
                    color: '#60a5fa',
                    fontWeight: 500,
                    border: 'none',
                    minWidth: 50,
                    justifyContent: 'center'
                }} 
            />
        );
    };

    // Header action buttons for the top right corner
    return (
        <MainCard contentSX={{ pt: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>
                    Quản lý Hộ khẩu
                </Typography>

                <Tooltip title="Tạo hộ khẩu mới">
                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={() => handleOpen()}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            minWidth: 'auto',
                            px: 2,
                            height: 40
                        }}
                    >
                        Thêm
                    </Button>
                </Tooltip>

                <Tooltip title="Lọc theo trạng thái">
                    <IconButton 
                        onClick={handleFilterClick}
                        color={statusFilter !== 'ALL' ? 'primary' : 'inherit'}
                        sx={{ 
                            border: '1px solid',
                            borderColor: statusFilter !== 'ALL' ? 'primary.main' : 'divider',
                            borderRadius: '12px',
                            padding: '8px',
                            height: 40,
                            width: 40
                        }}
                    >
                        <Filter size={20} />
                    </IconButton>
                </Tooltip>

                <OutlinedInput
                    placeholder="Tìm hộ khẩu theo Tên chủ hộ, CCCD, Số phòng"
                    startAdornment={
                        <InputAdornment position="start">
                            <Search size={18} />
                        </InputAdornment>
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ 
                        minWidth: 340,
                        borderRadius: '12px',
                        height: 40
                    }}
                    size="small"
                />
            </Box>

            {/* FILTER MENU */}
            <Menu
                anchorEl={anchorEl}
                open={openFilter}
                onClose={() => handleFilterClose(null)}
                PaperProps={{
                    sx: {
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '12px',
                        marginTop: 1,
                        minWidth: 160
                    }
                }}
            >
                <MenuItem onClick={() => handleFilterClose('ALL')} selected={statusFilter === 'ALL'}>
                    Tất cả trạng thái
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('1')} selected={statusFilter === '1'}>
                    Đang sinh sống
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('0')} selected={statusFilter === '0'}>
                    Đã chuyển đi
                </MenuItem>
            </Menu>
            {/* TABLE */}
            <TableContainer>
                <Table sx={{ '& .MuiTableCell-root': { borderColor: 'divider' } }}>
                    <TableHead sx={{ 
                        bgcolor: 'action.hover',
                        '& .MuiTableCell-root': { 
                            color: 'text.primary', 
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }
                    }}>
                        <TableRow>
                            <TableCell align="center" sx={{ width: 60 }}>STT</TableCell>
                            <TableCell>Phòng</TableCell>
                            <TableCell>Chủ hộ</TableCell>
                            <TableCell align="center">Số thành viên</TableCell>
                            <TableCell>Ngày vào</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={row.household_id} hover>
                                <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Home size={16} style={{ color: '#64748b' }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {getApartmentName(row.apartment_id)}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{getHeadName(row.head_of_household)}</TableCell>
                                <TableCell align="center">{getMemberCountChip(row.members.length)}</TableCell>
                                <TableCell>
                                    {new Date(row.start_day).toLocaleDateString('vi-VN')}
                                </TableCell>
                                <TableCell align="center">{getStatusChip(row.status)}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Sửa">
                                        <IconButton 
                                            color="primary" 
                                            onClick={() => handleOpen(row)}
                                            size="small"
                                        >
                                            <Edit size={18} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <IconButton 
                                            color="error" 
                                            onClick={() => handleDelete(row)}
                                            size="small"
                                        >
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body2" sx={{ py: 3 }}>
                                        Không tìm thấy dữ liệu
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số hàng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
                sx={{
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    '.MuiTablePagination-toolbar': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pl: 1,
                        '&::after': {
                            content: '""',
                            flex: 1,
                            order: 10
                        }
                    },
                    '.MuiTablePagination-spacer': {
                        display: 'block',
                        flex: 1,
                        order: 2
                    },
                    '.MuiTablePagination-selectLabel': {
                        margin: 0,
                        lineHeight: 'inherit',
                        order: 0
                    },
                    '.MuiTablePagination-select': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '2px',
                        order: 1
                    },
                    '.MuiTablePagination-displayedRows': {
                        margin: '0 16px',
                        lineHeight: 'inherit',
                        fontWeight: 600,
                        color: 'primary.main',
                        order: 4
                    },
                    '.MuiTablePagination-actions': {
                        display: 'contents',
                        '& .MuiIconButton-root': {
                            borderRadius: '8px',
                            margin: '0 2px',
                            bgcolor: 'action.hover',
                            '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white'
                            },
                            '&.Mui-disabled': {
                                opacity: 0.3
                            }
                        },
                        '& .MuiIconButton-root:nth-of-type(1)': {
                            order: 3
                        },
                        '& .MuiIconButton-root:nth-of-type(2)': {
                            order: 5
                        }
                    }
                }}
            />

            {/* DIALOG (MODAL) */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
                <DialogTitle>
                    {editingRecord ? 'Cập nhật Hộ khẩu' : 'Tạo Hộ khẩu mới'}
                </DialogTitle>
                <DialogContent>
                    <Tabs 
                        value={tabValue} 
                        onChange={(e, newValue) => setTabValue(newValue)}
                        centered
                        sx={{ 
                            borderBottom: 1, 
                            borderColor: 'divider', 
                            mb: 2
                        }}
                    >
                        <Tab icon={<Home size={16} />} iconPosition="start" label="Thông tin chung" />
                        <Tab icon={<Users size={16} />} iconPosition="start" label={`Thành viên (${currentMembers.length})`} />
                    </Tabs>

                    {tabValue === 0 && (
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Stack direction="row" spacing={2}>
                                <Autocomplete
                                    fullWidth
                                    options={MOCK_APARTMENTS}
                                    getOptionLabel={(option) => `${option.room_number} (${option.area}m²)`}
                                    filterOptions={(options, { inputValue }) => {
                                        const searchTerm = inputValue.toLowerCase();
                                        return options.filter((option) =>
                                            option.room_number.toLowerCase().includes(searchTerm)
                                        );
                                    }}
                                    value={MOCK_APARTMENTS.find((a) => a.id === formData.apartment_id) || null}
                                    onChange={(event, newValue) => {
                                        setFormData({ ...formData, apartment_id: newValue ? newValue.id : '' });
                                    }}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            <Stack direction="row" justifyContent="space-between" width="100%">
                                                <Typography variant="body1" fontWeight={500}>
                                                    {option.room_number}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {option.area}m² - {option.status ? 'Đang ở' : 'Trống'}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tìm căn hộ (Số phòng)"
                                            placeholder="Nhập số phòng..."
                                        />
                                    )}
                                    noOptionsText="Không tìm thấy căn hộ"
                                />
                                <Autocomplete
                                    fullWidth
                                    options={MOCK_RESIDENTS}
                                    getOptionLabel={(option) => option.full_name}
                                    filterOptions={(options, { inputValue }) => {
                                        const searchTerm = inputValue.toLowerCase();
                                        return options.filter((option) =>
                                            option.full_name.toLowerCase().includes(searchTerm) ||
                                            option.id_number.includes(searchTerm) ||
                                            option.phone.includes(searchTerm)
                                        );
                                    }}
                                    value={MOCK_RESIDENTS.find((r) => r.id === formData.head_of_household) || null}
                                    onChange={(event, newValue) => {
                                        setFormData({ ...formData, head_of_household: newValue ? newValue.id : '' });
                                    }}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            <Stack>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {option.full_name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    CCCD: {option.id_number} | SĐT: {option.phone}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tìm chủ hộ (Tên, CCCD, SĐT)"
                                            placeholder="Nhập để tìm..."
                                        />
                                    )}
                                    noOptionsText="Không tìm thấy cư dân"
                                />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Ngày chuyển đến"
                                    name="start_day"
                                    type="date"
                                    value={formData.start_day}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        label="Trạng thái"
                                    >
                                        <MenuItem value={1}>Đang sinh sống</MenuItem>
                                        <MenuItem value={0}>Đã chuyển đi</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Stack>
                    )}

                    {tabValue === 1 && (
                        <Box sx={{ mt: 2 }}>
                            {/* Add member section */}
                            <Stack 
                                direction="row" 
                                spacing={2} 
                                sx={{ 
                                    mb: 2, 
                                    p: 2, 
                                    bgcolor: 'action.hover', 
                                    borderRadius: 2 
                                }}
                            >
                                <Autocomplete
                                    sx={{ flex: 1 }}
                                    options={MOCK_RESIDENTS.filter((r) => !currentMembers.some((m) => m.id === r.id))}
                                    getOptionLabel={(option) => `${option.full_name} - ${option.id_number}`}
                                    filterOptions={(options, { inputValue }) => {
                                        const searchTerm = inputValue.toLowerCase();
                                        return options.filter((option) =>
                                            option.full_name.toLowerCase().includes(searchTerm) ||
                                            option.id_number.includes(searchTerm) ||
                                            option.phone.includes(searchTerm)
                                        );
                                    }}
                                    value={MOCK_RESIDENTS.find((r) => r.id === selectedMemberId) || null}
                                    onChange={(event, newValue) => {
                                        setSelectedMemberId(newValue ? newValue.id : '');
                                    }}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            <Stack>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {option.full_name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    CCCD: {option.id_number} | SĐT: {option.phone}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tìm kiếm cư dân (Tên, CCCD, SĐT)"
                                            placeholder="Nhập để tìm kiếm..."
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <Search size={18} />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                    noOptionsText="Không tìm thấy cư dân"
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<UserPlus size={18} />}
                                    onClick={handleAddMember}
                                    disabled={!selectedMemberId}
                                >
                                    Thêm
                                </Button>
                            </Stack>

                            {/* Members table */}
                            <TableContainer>
                                <Table size="small" sx={{ '& .MuiTableCell-root': { borderColor: 'divider' } }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Họ tên</TableCell>
                                            <TableCell>CCCD</TableCell>
                                            <TableCell>Vai trò</TableCell>
                                            <TableCell align="center">Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentMembers.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell>{member.full_name}</TableCell>
                                                <TableCell>{member.id_number}</TableCell>
                                                <TableCell>
                                                    {member.id === formData.head_of_household ? (
                                                        <Chip 
                                                            label="Chủ hộ" 
                                                            size="small" 
                                                            sx={{ 
                                                                bgcolor: 'rgba(234, 179, 8, 0.15)', 
                                                                color: '#fbbf24',
                                                                fontWeight: 500,
                                                                minWidth: 80,
                                                                justifyContent: 'center'
                                                            }} 
                                                        />
                                                    ) : (
                                                        <Chip 
                                                            label={member.role || 'Thành viên'} 
                                                            size="small" 
                                                            sx={{ 
                                                                bgcolor: 'rgba(100, 116, 139, 0.15)', 
                                                                color: '#94a3b8',
                                                                fontWeight: 500,
                                                                minWidth: 80,
                                                                justifyContent: 'center'
                                                            }} 
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={member.id === formData.head_of_household ? "Không thể xóa chủ hộ" : "Xóa khỏi hộ"}>
                                                        <span>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleRemoveMember(member.id)}
                                                                disabled={member.id === formData.head_of_household}
                                                                sx={{
                                                                    color: member.id === formData.head_of_household ? 'text.disabled' : '#ef4444',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                                        color: '#dc2626'
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 size={18} />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {currentMembers.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">
                                                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                                        Chưa có thành viên nào
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleClose} color="error">Hủy</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        {editingRecord ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog 
                open={deleteDialogOpen} 
                onClose={handleCancelDelete}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1 }}>
                    Xác nhận xóa hộ khẩu
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Bạn có chắc chắn muốn xóa hộ khẩu{' '}
                        <strong>H{deletingRecord?.household_id}</strong> (Phòng {getApartmentName(deletingRecord?.apartment_id)})?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                    <Button onClick={handleCancelDelete} variant="outlined">
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        variant="contained" 
                        color="error"
                    >
                        Xóa hộ khẩu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SNACKBAR */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    variant="filled"
                    sx={{ 
                        width: '100%',
                        alignItems: 'center',
                        '& .MuiAlert-action': {
                            pt: 0,
                            alignItems: 'center'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

export default HouseholdManagement;
