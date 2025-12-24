// frontend/src/views/admin/residentmanager/ResidentManagement.jsx

import React, { useState, useEffect } from 'react';

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
    TextField,
    Tooltip,
    Typography,
    Stack,
    Snackbar,
    Alert,
    Divider,
    TablePagination
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import { Edit, Trash2, Plus, Search, Filter } from 'lucide-react';

const ResidentManagement = () => {
    // --- 1. DATA STATE ---
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);





    // --- 2. STATE QUẢN LÝ UI ---
    const [open, setOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter states
    const [genderFilter, setGenderFilter] = useState('ALL');
    const [householdFilter, setHouseholdFilter] = useState('ALL');
    const [roleFilter, setRoleFilter] = useState('ALL');

    // Filter menu anchor
    const [anchorEl, setAnchorEl] = useState(null);
    const openFilter = Boolean(anchorEl);

    // Form states
    const [formData, setFormData] = useState({
        full_name: '',
        gender: 'male',
        date_of_birth: '',
        phone_number: '',
        id_number: '',
        family_role: 'Thành viên khác',
        job: '',
        household_id: ''
    });

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState(null);

    // Snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // Confirm Dialog State for Role Change
    const [confirmRoleDialog, setConfirmRoleDialog] = useState(false);
    const [pendingRoleValue, setPendingRoleValue] = useState(null);
    const [conflictingHeadName, setConflictingHeadName] = useState('');

    // Check if any filter is active
    const isFilterActive = genderFilter !== 'ALL' || householdFilter !== 'ALL' || roleFilter !== 'ALL';

    // Pagination Handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };





    // --- 3. FETCH DATA FROM BACKEND ---
    const fetchResidents = async () => {
        setLoading(true);
        try {
            // Map frontend filter values to backend format
            const requestBody = {
                searchKeyword: searchTerm || null,
                gender: genderFilter === 'ALL' ? null : (genderFilter === 'male' ? 'M' : 'F'),
                hasHousehold: householdFilter === 'ALL' ? null : (householdFilter === 'HAS_HOUSEHOLD' ? true : false),
                familyRole: roleFilter === 'ALL' ? null : (roleFilter === 'OWNER' ? 'Head of Household' : null),
                page: page + 1,
                pageSize: rowsPerPage
            };

            const response = await fetch('http://localhost:8080/resident/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch residents');
            }

            const result = await response.json();
            const pageResponse = result.result;

            // Map backend response to frontend format
            const roleMapping = {
                'Head of Household': 'Chủ hộ',
                'Wife': 'Vợ',
                'Husband': 'Chồng',
                'Child': 'Con',
                'Son': 'Con',
                'Daughter': 'Con',
                'Parent': 'Bố mẹ',
                'Father': 'Bố mẹ',
                'Mother': 'Bố mẹ',
                'Member': 'Thành viên khác',
                'Other': 'Khác'
            };

            const mappedData = pageResponse.data.map((item) => ({
                id: item.residentId,
                full_name: item.fullName,
                gender: item.gender === 'M' ? 'male' : 'female',
                date_of_birth: item.dateOfBirth,
                phone_number: item.phoneNumber,
                id_number: item.idNumber,
                family_role: roleMapping[item.familyRole] || item.familyRole,
                job: item.job,
                household_id: item.householdId || ''
            }));

            setData(mappedData);
            setTotalCount(pageResponse.totalElements);
        } catch (error) {
            console.error('Error fetching residents:', error);
            setSnackbar({ open: true, message: 'Lỗi khi tải dữ liệu cư dân!', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when component mounts or filters/pagination change
    useEffect(() => {
        fetchResidents();
    }, [searchTerm, genderFilter, householdFilter, roleFilter, page, rowsPerPage]);

    // Reset page to 0 when filters change, to avoid empty results on non-existent pages
    useEffect(() => {
        setPage(0);
    }, [searchTerm, genderFilter, householdFilter, roleFilter]);

    // Use data directly (no client-side filtering needed)
    const filteredData = data;

    // --- 4. HANDLERS ---
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleResetFilters = () => {
        setGenderFilter('ALL');
        setHouseholdFilter('ALL');
        setRoleFilter('ALL');
        setAnchorEl(null);
    };

    const handleOpen = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                full_name: record.full_name,
                gender: record.gender,
                date_of_birth: record.date_of_birth,
                phone_number: record.phone_number,
                id_number: record.id_number,
                family_role: record.family_role,
                job: record.job,
                household_id: record.household_id || ''
            });
        } else {
            setEditingRecord(null);
            setFormData({
                full_name: '',
                gender: 'male',
                date_of_birth: '',
                phone_number: '',
                id_number: '',
                family_role: 'Thành viên khác',
                job: '',
                household_id: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRecord(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Logic check trùng chủ hộ khi chọn "Chủ hộ"
        if (name === 'family_role' && value === 'Chủ hộ') {
            // Chỉ check nếu đã nhập household_id
            if (formData.household_id) {
                const currentHead = data.find(item =>
                    // So sánh household_id (chú ý type string/number)
                    String(item.household_id) === String(formData.household_id) &&
                    item.family_role === 'Chủ hộ' &&
                    item.id !== editingRecord?.id // Không check chính mình
                );

                if (currentHead) {
                    setConflictingHeadName(currentHead.full_name);
                    setPendingRoleValue(value);
                    setConfirmRoleDialog(true);
                    return; // Chưa update state vội
                }
            }
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleConfirmRoleChange = () => {
        setFormData({ ...formData, family_role: pendingRoleValue });
        setConfirmRoleDialog(false);
        setConflictingHeadName('');
        setPendingRoleValue(null);
    };

    const handleCancelRoleChange = () => {
        setConfirmRoleDialog(false);
        setPendingRoleValue(null);
        setConflictingHeadName('');
    };

    const handleSave = async () => {
        // Validate required fields
        if (!formData.full_name) {
            setSnackbar({ open: true, message: 'Vui lòng nhập họ tên!', severity: 'warning' });
            return;
        }
        if (!formData.date_of_birth) {
            setSnackbar({ open: true, message: 'Vui lòng chọn ngày sinh!', severity: 'warning' });
            return;
        }
        if (!formData.id_number) {
            setSnackbar({ open: true, message: 'Vui lòng nhập số CCCD!', severity: 'warning' });
            return;
        }
        if (!formData.phone_number) {
            setSnackbar({ open: true, message: 'Vui lòng nhập số điện thoại!', severity: 'warning' });
            return;
        }

        try {
            const apiData = {
                fullName: formData.full_name,
                gender: formData.gender === 'male' ? 'M' : 'F',
                dateOfBirth: formData.date_of_birth,
                phoneNumber: formData.phone_number,
                idNumber: formData.id_number,
                familyRole: formData.family_role,
                job: formData.job,
                householdId: (formData.household_id && String(formData.household_id).trim() !== "")
                    ? formData.household_id
                    : null
            };

            let response;
            if (editingRecord) {
                response = await fetch(`http://localhost:8080/resident/update/${editingRecord.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(apiData)
                });
            } else {
                response = await fetch(`http://localhost:8080/resident/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(apiData)
                });
            }

            // Xử lý response lỗi từ server
            if (!response.ok) {
                const errorData = await response.json();
                // Ưu tiên hiển thị message từ backend trả về
                throw new Error(errorData.message || (errorData.error ? errorData.error : 'Lỗi khi lưu dữ liệu'));
            }

            setSnackbar({ open: true, message: editingRecord ? 'Cập nhật cư dân thành công!' : 'Thêm cư dân mới thành công!', severity: 'success' });
            handleClose();
            fetchResidents(); // Reload list
        } catch (error) {
            console.error("Save error:", error);
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        }
    };

    const handleDelete = (record) => {
        setDeletingRecord(record);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deletingRecord) {
            if (deletingRecord.family_role === 'Chủ hộ') {
                setSnackbar({ open: true, message: 'Không thể xóa cư dân đang là Chủ hộ! Hãy đổi chủ hộ trước.', severity: 'error' });
                setDeleteDialogOpen(false);
                setDeletingRecord(null);
                return;
            }

            try {
                // Call API to delete
                const response = await fetch('http://localhost:8080/resident/delete1', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ residentId: deletingRecord.id }),
                });

                if (response.ok) {
                    setData(data.filter((item) => item.id !== deletingRecord.id));
                    setSnackbar({ open: true, message: 'Đã xóa cư dân thành công!', severity: 'success' });
                    // Refresh data from server
                    await fetchResidents();
                } else {
                    const errorData = await response.json();
                    setSnackbar({ open: true, message: errorData.message || 'Lỗi khi xóa cư dân!', severity: 'error' });
                }
            } catch (error) {
                console.error("Error deleting resident:", error);
                setSnackbar({ open: true, message: 'Lỗi kết nối server!', severity: 'error' });
            }
        }
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    // --- 5. HELPER FUNCTIONS ---
    const getGenderChip = (gender) => {
        return gender === 'male' ? (
            <Chip label="Nam" size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 500, minWidth: 60, justifyContent: 'center' }} />
        ) : (
            <Chip label="Nữ" size="small" sx={{ bgcolor: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', fontWeight: 500, minWidth: 60, justifyContent: 'center' }} />
        );
    };

    const getHouseholdChip = (householdId) => {
        return householdId ? (
            <Chip label={householdId} size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 500, minWidth: 70, justifyContent: 'center' }} />
        ) : (
            <Chip label="Chưa có" size="small" sx={{ bgcolor: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', fontWeight: 500, minWidth: 70, justifyContent: 'center' }} />
        );
    };

    const getRoleChip = (role) => {
        if (role === 'Chủ hộ') {
            return <Chip label="Chủ hộ" size="small" sx={{ bgcolor: 'rgba(234, 179, 8, 0.15)', color: '#fbbf24', fontWeight: 600, minWidth: 80, justifyContent: 'center' }} />;
        }
        return <Chip label={role} size="small" sx={{ bgcolor: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', fontWeight: 500, minWidth: 80, justifyContent: 'center' }} />;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
    };

    // --- HEADER ACTIONS (Top Right) ---
    const headerActions = (
        <Stack direction="row" spacing={1.5} alignItems="center">
            {/* SEARCH BAR */}
            <OutlinedInput
                placeholder="Tìm tên, SĐT, CCCD..."
                startAdornment={
                    <InputAdornment position="start">
                        <Search size={18} />
                    </InputAdornment>
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                    minWidth: 280,
                    borderRadius: '12px'
                }}
                size="small"
            />

            {/* FILTER BUTTON */}
            <Tooltip title="Lọc theo điều kiện">
                <IconButton
                    onClick={handleFilterClick}
                    color={isFilterActive ? 'primary' : 'inherit'}
                    sx={{
                        border: '1px solid',
                        borderColor: isFilterActive ? 'primary.main' : 'divider',
                        borderRadius: '12px',
                        padding: '10px'
                    }}
                >
                    <Filter size={20} />
                </IconButton>
            </Tooltip>

            {/* FILTER MENU */}
            <Menu
                anchorEl={anchorEl}
                open={openFilter}
                onClose={handleFilterClose}
                PaperProps={{
                    sx: {
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '12px',
                        marginTop: 1,
                        minWidth: 200
                    }
                }}
            >
                <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', display: 'block' }}>
                    Giới tính
                </Typography>
                <MenuItem onClick={() => setGenderFilter('ALL')} selected={genderFilter === 'ALL'}>
                    Tất cả
                </MenuItem>
                <MenuItem onClick={() => setGenderFilter('male')} selected={genderFilter === 'male'}>
                    Nam
                </MenuItem>
                <MenuItem onClick={() => setGenderFilter('female')} selected={genderFilter === 'female'}>
                    Nữ
                </MenuItem>
                <Divider />
                <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', display: 'block' }}>
                    Hộ khẩu
                </Typography>
                <MenuItem onClick={() => setHouseholdFilter('ALL')} selected={householdFilter === 'ALL'}>
                    Tất cả
                </MenuItem>
                <MenuItem onClick={() => setHouseholdFilter('HAS_HOUSEHOLD')} selected={householdFilter === 'HAS_HOUSEHOLD'}>
                    Đã có hộ
                </MenuItem>
                <MenuItem onClick={() => setHouseholdFilter('NO_HOUSEHOLD')} selected={householdFilter === 'NO_HOUSEHOLD'}>
                    Chưa có hộ
                </MenuItem>
                <Divider />
                <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', display: 'block' }}>
                    Vai trò
                </Typography>
                <MenuItem onClick={() => setRoleFilter('ALL')} selected={roleFilter === 'ALL'}>
                    Tất cả
                </MenuItem>
                <MenuItem onClick={() => setRoleFilter('OWNER')} selected={roleFilter === 'OWNER'}>
                    Chỉ Chủ hộ
                </MenuItem>
                {isFilterActive && (
                    <>
                        <Divider />
                        <MenuItem onClick={handleResetFilters} sx={{ color: 'error.main' }}>
                            Xóa bộ lọc
                        </MenuItem>
                    </>
                )}
            </Menu>

            {/* ADD BUTTON */}
            <Tooltip title="Thêm cư dân mới">
                <Button
                    variant="contained"
                    onClick={() => handleOpen()}
                    sx={{
                        minWidth: 48,
                        width: 48,
                        height: 44,
                        borderRadius: '12px',
                        padding: 0
                    }}
                >
                    <Plus size={22} />
                </Button>
            </Tooltip>
        </Stack>
    );

    return (
        <MainCard title="Quản lý Cư dân" secondary={headerActions} contentSX={{ pt: 0 }}>
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
                            <TableCell>STT</TableCell>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell align="center">Giới tính</TableCell>
                            <TableCell>Ngày sinh</TableCell>
                            <TableCell>SĐT</TableCell>
                            <TableCell>CCCD</TableCell>
                            <TableCell align="center">Mã hộ</TableCell>
                            <TableCell>Quan hệ</TableCell>
                            <TableCell>Công việc</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => (
                            <TableRow key={row.id} hover>
                                <TableCell>{(page * rowsPerPage) + index + 1}</TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {row.full_name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">{getGenderChip(row.gender)}</TableCell>
                                <TableCell>{formatDate(row.date_of_birth)}</TableCell>
                                <TableCell>{row.phone_number}</TableCell>
                                <TableCell>{row.id_number}</TableCell>
                                <TableCell align="center">{getHouseholdChip(row.household_id)}</TableCell>
                                <TableCell>{getRoleChip(row.family_role)}</TableCell>
                                <TableCell>{row.job}</TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                        <Tooltip title="Sửa thông tin">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpen(row)}
                                                size="small"
                                            >
                                                <Edit size={18} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa cư dân">
                                            <IconButton
                                                sx={{
                                                    color: '#ef4444',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                        color: '#dc2626'
                                                    }
                                                }}
                                                onClick={() => handleDelete(row)}
                                                size="small"
                                            >
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    <Typography variant="body2" sx={{ py: 3, color: 'text.secondary' }}>
                                        Không tìm thấy dữ liệu
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count}`}
                    sx={{
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                        px: 2,
                        py: 1,
                        boxShadow: '0 -1px 6px rgba(0,0,0,0.04)',

                        '& .MuiTablePagination-selectLabel': {
                            fontWeight: 500,
                            color: 'text.secondary',
                            fontSize: 14
                        },

                        '& .MuiTablePagination-displayedRows': {
                            fontWeight: 600,
                            color: 'text.primary'
                        },

                        '& .MuiIconButton-root': {
                            borderRadius: 8,
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            }
                        }
                    }}

                />
            </TableContainer>

            {/* ADD/EDIT DIALOG */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>
                    {editingRecord ? 'Cập nhật thông tin cư dân' : 'Thêm cư dân mới'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        {/* Row 1: Họ tên & Ngày sinh */}
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Họ và tên <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập họ và tên"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Ngày sinh <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        </Stack>

                        {/* Row 2: Giới tính & SĐT */}
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Giới tính <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    size="small"
                                >
                                    <MenuItem value="male">Nam</MenuItem>
                                    <MenuItem value="female">Nữ</MenuItem>
                                </TextField>
                            </Box>
                            <Box sx={{ flex: 2 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Số điện thoại <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập số điện thoại"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                        </Stack>

                        {/* Row 3: CCCD & Mã hộ */}
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Số CCCD <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập số CCCD"
                                    name="id_number"
                                    value={formData.id_number}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Mã hộ gia đình (Tùy chọn)
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="VD: H001 (Bỏ trống nếu chưa có)"
                                    name="household_id"
                                    value={formData.household_id}
                                    onChange={handleChange}
                                    size="small"
                                // Đảm bảo KHÔNG CÓ dòng: required
                                />
                            </Box>
                        </Stack>

                        {/* Row 4: Quan hệ & Công việc */}
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Quan hệ với chủ hộ <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    name="family_role"
                                    value={formData.family_role}
                                    onChange={handleChange}
                                    size="small"
                                >
                                    <MenuItem value="Chủ hộ">Chủ hộ</MenuItem>
                                    <MenuItem value="Vợ">Vợ</MenuItem>
                                    <MenuItem value="Chồng">Chồng</MenuItem>
                                    <MenuItem value="Con">Con</MenuItem>
                                    <MenuItem value="Bố mẹ">Bố mẹ</MenuItem>
                                    <MenuItem value="Thành viên khác">Thành viên khác</MenuItem>
                                    <MenuItem value="Khác">Khác (Ở ghép/Tạm trú)</MenuItem>
                                </TextField>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Công việc <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập công việc hiện tại"
                                    name="job"
                                    value={formData.job}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleClose} color="error">Hủy</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        {editingRecord ? 'Cập nhật' : 'Thêm mới'}
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
                    Xác nhận xóa cư dân
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Bạn có chắc chắn muốn xóa cư dân <strong>{deletingRecord?.full_name}</strong>?
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
                        Xóa cư dân
                    </Button>
                </DialogActions>
            </Dialog>

            {/* CONFIRM SWITCH ROLE DIALOG */}
            <Dialog
                open={confirmRoleDialog}
                onClose={handleCancelRoleChange}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1, color: 'warning.main' }}>
                    ⚠️ Xác nhận thay đổi Chủ hộ
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Hộ gia đình này hiện đã có chủ hộ là ông/bà <strong>{conflictingHeadName}</strong>.
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        Bạn có chắc chắn muốn chuyển quyền chủ hộ sang cho người này không?
                        <strong>{conflictingHeadName}</strong> sẽ được chuyển thành thành viên.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                    <Button onClick={handleCancelRoleChange} variant="outlined">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmRoleChange}
                        variant="contained"
                        color="warning"
                    >
                        Đồng ý chuyển đổi
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
        </MainCard >
    );
};

export default ResidentManagement;