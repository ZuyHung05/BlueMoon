// frontend/src/views/admin/adminUserManagementPage.jsx

import React, { useState, useEffect } from 'react';
import api from 'api/axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    OutlinedInput,
    Select,
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
    Snackbar,
    Alert,
    CircularProgress,
    LinearProgress,
    Backdrop
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import { Edit, Trash2, Plus, Search, Filter } from 'lucide-react';

const ROLE_MAP = {
    ADMIN: 'Quản trị viên',
    MANAGER: 'Tổ trưởng',
    ACCOUNTANT: 'Kế toán'
};

const AdminUserManagementPage = () => {
    const theme = useTheme();

    // --- 1. DATA STATE ---
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- 2. STATE ---
    const [open, setOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter Menu State
    const [anchorEl, setAnchorEl] = useState(null);
    const openFilter = Boolean(anchorEl);

    // Form states
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'MANAGER',
        phone: ''
    });

    // Form validation errors
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        phone: '',
        role: ''
    });

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState(null);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // --- VALIDATION FUNCTIONS ---
    const validateUsername = (value) => {
        if (!value || value.trim() === '') {
            return 'Tên đăng nhập không được để trống';
        }
        if (value.length < 3) {
            return 'Tên đăng nhập phải có ít nhất 3 ký tự';
        }
        if (value.length > 30) {
            return 'Tên đăng nhập không được quá 30 ký tự';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
        }
        // Check if username already exists (when creating new)
        if (!editingRecord && data.some((item) => item.username.toLowerCase() === value.toLowerCase())) {
            return 'Tên đăng nhập đã tồn tại';
        }
        return '';
    };

    const validatePassword = (value, isEditing) => {
        // Password is optional when editing
        if (isEditing && (!value || value === '')) {
            return '';
        }
        if (!isEditing && (!value || value === '')) {
            return 'Mật khẩu không được để trống';
        }
        if (value && value.length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        if (value && value.length > 50) {
            return 'Mật khẩu không được quá 50 ký tự';
        }
        // Check password strength
        if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
            return 'Mật khẩu nên có chữ hoa, chữ thường và số';
        }
        return '';
    };

    const validatePhone = (value) => {
        if (!value || value.trim() === '') {
            return 'Số điện thoại không được để trống';
        }
        // Vietnam phone number format: starts with 0, 10 digits
        if (!/^0[0-9]{9}$/.test(value)) {
            return 'Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0';
        }
        return '';
    };

    const validateRole = (value) => {
        if (!value) {
            return 'Vui lòng chọn vai trò';
        }
        return '';
    };

    const validateForm = () => {
        const newErrors = {
            username: validateUsername(formData.username),
            password: validatePassword(formData.password, !!editingRecord),
            phone: validatePhone(formData.phone),
            role: validateRole(formData.role)
        };
        setErrors(newErrors);

        // Return true if no errors
        return !Object.values(newErrors).some((error) => error !== '');
    };

    // --- 3. FETCHING DATA ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const endpoint =
                searchTerm || roleFilter !== 'ALL' ? `/api/accounts/search?query=${searchTerm}&role=${roleFilter}` : '/api/accounts';

            const response = await api.get(endpoint);
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
            setSnackbar({
                open: true,
                message: 'Lỗi khi tải dữ liệu từ server: ' + (error.response?.data?.message || error.message),
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [searchTerm, roleFilter]);

    // Use derived state for pagination mapping if needed, but data now comes from DB
    const filteredData = data;

    // --- 4. HANDLERS ---
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (role) => {
        if (role) {
            setRoleFilter(role);
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
                username: record.username,
                password: '', // Password not shown
                role: record.role,
                phone: record.phone
            });
            setErrors({ username: '', password: '', phone: '', role: '' });
        } else {
            setEditingRecord(null);
            setFormData({
                username: '',
                password: '',
                role: 'MANAGER',
                phone: ''
            });
            setErrors({ username: '', password: '', phone: '', role: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRecord(null);
        setErrors({ username: '', password: '', phone: '', role: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSave = async () => {
        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            if (editingRecord) {
                // Update
                const response = await api.put(`/api/accounts/${editingRecord.accountId}`, formData);
                if (response.data.success) {
                    setSnackbar({ open: true, message: 'Cập nhật tài khoản thành công!', severity: 'success' });
                    fetchData();
                    handleClose();
                }
            } else {
                // Create
                const response = await api.post('/api/accounts', formData);
                if (response.data.success) {
                    setSnackbar({ open: true, message: 'Tạo tài khoản mới thành công!', severity: 'success' });
                    fetchData();
                    handleClose();
                }
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Lỗi: ' + (error.response?.data?.message || error.message),
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (record) => {
        setDeletingRecord(record);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deletingRecord) {
            setLoading(true);
            try {
                const response = await api.delete(`/api/accounts/${deletingRecord.accountId}`);
                if (response.data.success) {
                    setSnackbar({ open: true, message: 'Xóa tài khoản thành công!', severity: 'success' });
                    fetchData();
                }
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'Lỗi khi xóa tài khoản: ' + (error.response?.data?.message || error.message),
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        }
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'Asia/Ho_Chi_Minh'
            });
        } catch (error) {
            return dateString;
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    // --- HELPER ---
    const getRoleChip = (role) => {
        const normalizedRole = (role || '').toUpperCase();
        let bgColor = 'rgba(100, 100, 100, 0.2)';
        let textColor = '#94a3b8';

        switch (normalizedRole) {
            case 'ADMIN':
                bgColor = 'rgba(239, 68, 68, 0.15)';
                textColor = '#f87171';
                break;
            case 'ACCOUNTANT':
                bgColor = 'rgba(34, 197, 94, 0.15)';
                textColor = '#4ade80';
                break;
            case 'MANAGER':
                bgColor = 'rgba(34, 211, 238, 0.15)';
                textColor = '#22d3ee';
                break;
            default:
                break;
        }

        const label = ROLE_MAP[normalizedRole] || role;

        return (
            <Chip
                label={label}
                size="small"
                sx={{
                    bgcolor: bgColor,
                    color: textColor,
                    fontWeight: 500,
                    border: 'none',
                    minWidth: 80,
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
                    Quản lý Tài khoản
                </Typography>

                <Tooltip title="Tạo tài khoản mới">
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

                <Tooltip title="Lọc theo vai trò">
                    <IconButton
                        onClick={handleFilterClick}
                        color={roleFilter !== 'ALL' ? 'primary' : 'inherit'}
                        sx={{
                            border: '1px solid',
                            borderColor: roleFilter !== 'ALL' ? 'primary.main' : 'divider',
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
                    placeholder="Tìm tài khoản theo tên người dùng, số điện thoại"
                    startAdornment={
                        <InputAdornment position="start">
                            <Search size={18} />
                        </InputAdornment>
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        minWidth: 380,
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
                <MenuItem onClick={() => handleFilterClose('ALL')} selected={roleFilter === 'ALL'}>
                    Tất cả vai trò
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('ADMIN')} selected={roleFilter === 'ADMIN'}>
                    {ROLE_MAP['ADMIN']}
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('MANAGER')} selected={roleFilter === 'MANAGER'}>
                    {ROLE_MAP['MANAGER']}
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('ACCOUNTANT')} selected={roleFilter === 'ACCOUNTANT'}>
                    {ROLE_MAP['ACCOUNTANT']}
                </MenuItem>
            </Menu>

            {/* LOADING SPINNER INSTEAD OF LINEAR */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}

            {/* TABLE */}
            <TableContainer>
                <Table sx={{ '& .MuiTableCell-root': { borderColor: 'divider' } }}>
                    <TableHead
                        sx={{
                            bgcolor: 'action.hover',
                            '& .MuiTableCell-root': {
                                color: 'text.primary',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }
                        }}
                    >
                        <TableRow>
                            <TableCell align="center" sx={{ width: 60 }}>
                                STT
                            </TableCell>
                            <TableCell>Tên đăng nhập</TableCell>
                            <TableCell align="center">Vai trò</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Đăng nhập lần cuối</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={row.accountId} hover>
                                <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {row.username}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">{getRoleChip(row.role)}</TableCell>
                                <TableCell>{row.phone}</TableCell>
                                <TableCell>
                                    {formatDateTime(row.lastLogin) || (
                                        <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                            Chưa đăng nhập
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Sửa">
                                        <IconButton color="primary" onClick={() => handleOpen(row)} size="small">
                                            <Edit size={18} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <IconButton color="error" onClick={() => handleDelete(row)} size="small">
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredData.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body2" sx={{ py: 3 }}>
                                        Không tìm thấy dữ liệu
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {loading && filteredData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <CircularProgress size={32} />
                                        <Typography variant="body2" color="text.secondary">
                                            Đang tải dữ liệu...
                                        </Typography>
                                    </Box>
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
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{editingRecord ? 'Sửa thông tin tài khoản' : 'Tạo tài khoản mới'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Tên đăng nhập {!editingRecord && <span style={{ color: '#ef4444' }}>*</span>}
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Nhập tên đăng nhập"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={!!editingRecord}
                                error={!!errors.username}
                                helperText={errors.username}
                                size="small"
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                {editingRecord ? 'Mật khẩu mới' : 'Mật khẩu'}{' '}
                                {!editingRecord && <span style={{ color: '#ef4444' }}>*</span>}
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder={editingRecord ? 'Bỏ trống nếu không đổi' : 'Nhập mật khẩu'}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password || (editingRecord ? '' : 'Ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số')}
                                size="small"
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Vai trò <span style={{ color: '#ef4444' }}>*</span>
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                error={!!errors.role}
                                helperText={errors.role}
                                size="small"
                            >
                                <MenuItem value="ADMIN">{ROLE_MAP['ADMIN']}</MenuItem>
                                <MenuItem value="MANAGER">{ROLE_MAP['MANAGER']}</MenuItem>
                                <MenuItem value="ACCOUNTANT">{ROLE_MAP['ACCOUNTANT']}</MenuItem>
                            </TextField>
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Số điện thoại <span style={{ color: '#ef4444' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Nhập số điện thoại (VD: 0901234567)"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={!!errors.phone}
                                helperText={errors.phone || 'Định dạng: 0xxxxxxxxx (10 chữ số)'}
                                size="small"
                            />
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleClose} color="error" disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={16} color="inherit" />}
                    >
                        {editingRecord ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ pb: 1 }}>Xác nhận xóa tài khoản</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Bạn có chắc chắn muốn xóa tài khoản <strong>{deletingRecord?.username}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                    <Button onClick={handleCancelDelete} variant="outlined" disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={16} color="inherit" />}
                    >
                        Xóa tài khoản
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

export default AdminUserManagementPage;
