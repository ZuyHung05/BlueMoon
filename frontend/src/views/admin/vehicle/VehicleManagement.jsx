import React, { useState, useEffect } from 'react';

// material-ui
import {
    Box,
    Button,
    Chip,
    CircularProgress,
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
    Snackbar,
    Alert,
    Divider
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ParkingMap from './ParkingMapDialog';

// API service
import { getAllVehicles, addVehicle, updateVehicle, deleteVehicle } from 'api/vehicleService';

// assets
import { Edit, Trash2, Plus, Search, Filter, Car, Bike, Map } from 'lucide-react';

const VehicleManagement = () => {
    // --- DATA STATE ---
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [households, setHouseholds] = useState([]);

    // --- UI STATE ---
    const [open, setOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter menu
    const [anchorEl, setAnchorEl] = useState(null);
    const openFilter = Boolean(anchorEl);

    // Form state
    const [formData, setFormData] = useState({
        householdId: '',
        plateNumber: '',
        type: 'bike',
        basementFloor: 1,
        location: ''
    });

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState(null);

    // Snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // Filter active check
    const isFilterActive = typeFilter !== 'ALL';

    // --- FETCH DATA ON MOUNT ---
    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await getAllVehicles();
            if (response.success && response.data) {
                // Map backend fields to frontend format
                const mappedData = response.data.map(item => ({
                    vehicleId: item.vehicleId,
                    householdId: item.householdId,
                    plateNumber: item.plateNumber,
                    type: item.type,
                    basementFloor: item.basementFloor,
                    location: item.location
                }));
                setData(mappedData);

                // Extract unique households from vehicles
                const uniqueHouseholds = [...new Set(response.data.map(v => v.householdId))];
                setHouseholds(uniqueHouseholds.map(id => ({ id, name: `Hộ ${id}` })));
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setSnackbar({
                open: true,
                message: 'Không thể tải danh sách phương tiện!',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // --- FILTERING ---
    const filteredData = data.filter((item) => {
        const household = households.find((h) => h.id === item.householdId);
        const ownerName = household ? household.name.toLowerCase() : '';
        const plate = item.plateNumber?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        const matchSearch = plate.includes(search) || ownerName.includes(search);
        const matchType = typeFilter === 'ALL' || item.type === typeFilter;

        return matchSearch && matchType;
    });

    // --- HANDLERS ---
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (type) => {
        if (type) {
            setTypeFilter(type);
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
                householdId: record.householdId,
                plateNumber: record.plateNumber,
                type: record.type,
                basementFloor: record.basementFloor,
                location: record.location
            });
        } else {
            setEditingRecord(null);
            setFormData({
                householdId: '',
                plateNumber: '',
                type: 'bike',
                basementFloor: 1,
                location: ''
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
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        if (!formData.householdId) {
            setSnackbar({ open: true, message: 'Vui lòng chọn hộ gia đình!', severity: 'warning' });
            return;
        }
        if (!formData.plateNumber) {
            setSnackbar({ open: true, message: 'Vui lòng nhập biển số xe!', severity: 'warning' });
            return;
        }
        if (!formData.location) {
            setSnackbar({ open: true, message: 'Vui lòng nhập vị trí đỗ!', severity: 'warning' });
            return;
        }

        try {
            if (editingRecord) {
                // Update existing vehicle
                const response = await updateVehicle(editingRecord.vehicleId, formData);
                if (response.success) {
                    setSnackbar({ open: true, message: 'Cập nhật thông tin xe thành công!', severity: 'success' });
                    fetchVehicles(); // Refresh data
                } else {
                    setSnackbar({ open: true, message: response.message || 'Cập nhật thất bại!', severity: 'error' });
                }
            } else {
                // Add new vehicle
                const response = await addVehicle(formData);
                if (response.success) {
                    setSnackbar({ open: true, message: 'Thêm phương tiện mới thành công!', severity: 'success' });
                    fetchVehicles(); // Refresh data
                } else {
                    setSnackbar({ open: true, message: response.message || 'Thêm mới thất bại!', severity: 'error' });
                }
            }
            handleClose();
        } catch (error) {
            console.error('Error saving vehicle:', error);

            // Xử lý nhiều loại error response từ backend
            let errorMessage = 'Có lỗi xảy ra!';

            if (error.response?.data) {
                const data = error.response.data;

                // Trường hợp 1: Backend trả về message trực tiếp
                if (data.message) {
                    errorMessage = data.message;
                }
                // Trường hợp 2: Validation errors (Spring Boot returns errors array or object)
                else if (data.errors) {
                    if (Array.isArray(data.errors)) {
                        errorMessage = data.errors.join(', ');
                    } else if (typeof data.errors === 'object') {
                        errorMessage = Object.values(data.errors).join(', ');
                    }
                }
                // Trường hợp 3: Field-specific validation errors
                else if (data.plateNumber) {
                    errorMessage = `Biển số xe: ${data.plateNumber}`;
                }
                // Trường hợp 4: Spring Validation default format
                else if (data.error) {
                    errorMessage = data.error;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        }
    };

    const handleDelete = (record) => {
        setDeletingRecord(record);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deletingRecord) {
            try {
                const response = await deleteVehicle(deletingRecord.vehicleId);
                if (response.success) {
                    setSnackbar({ open: true, message: 'Đã xóa phương tiện!', severity: 'success' });
                    fetchVehicles(); // Refresh data
                } else {
                    setSnackbar({ open: true, message: response.message || 'Xóa thất bại!', severity: 'error' });
                }
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa!';
                setSnackbar({ open: true, message: errorMessage, severity: 'error' });
            }
        }
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    // --- HELPER FUNCTIONS ---
    const getHouseholdName = (id) => {
        const hh = households.find((h) => h.id === id);
        return hh ? hh.name : `Hộ ${id}`;
    };

    const getTypeChip = (type) => {
        return type === 'car' ? (
            <Chip
                icon={<Car size={14} />}
                label="Ô tô"
                size="small"
                sx={{ bgcolor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', fontWeight: 500, minWidth: 80, justifyContent: 'center' }}
            />
        ) : (
            <Chip
                icon={<Bike size={14} />}
                label="Xe máy"
                size="small"
                sx={{ bgcolor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', fontWeight: 500, minWidth: 80, justifyContent: 'center' }}
            />
        );
    };

    if (viewMode === 'map') {
        return <ParkingMap onBack={() => setViewMode('list')} />;
    }

    // Loading state
    if (loading) {
        return (
            <MainCard contentSX={{ pt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    return (
        <MainCard contentSX={{ pt: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>
                    Quản lý Phương tiện
                </Typography>

                <Tooltip title="Thêm phương tiện mới">
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

                <Tooltip title="Lọc theo loại xe">
                    <IconButton
                        onClick={handleFilterClick}
                        color={isFilterActive ? 'primary' : 'inherit'}
                        sx={{
                            border: '1px solid',
                            borderColor: isFilterActive ? 'primary.main' : 'divider',
                            borderRadius: '12px',
                            padding: '8px',
                            height: 40,
                            width: 40
                        }}
                    >
                        <Filter size={20} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Sơ đồ bãi đỗ">
                    <IconButton
                        onClick={() => setViewMode('map')}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '12px',
                            padding: '8px',
                            height: 40,
                            width: 40
                        }}
                    >
                        <Map size={20} />
                    </IconButton>
                </Tooltip>

                <OutlinedInput
                    placeholder="Tìm theo biển số, tên chủ hộ..."
                    startAdornment={
                        <InputAdornment position="start">
                            <Search size={18} />
                        </InputAdornment>
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        minWidth: 300,
                        borderRadius: '12px',
                        height: 40
                    }}
                    size="small"
                />
            </Box>

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
                        minWidth: 160
                    }
                }}
            >
                <MenuItem onClick={() => handleFilterClose('ALL')} selected={typeFilter === 'ALL'}>
                    Tất cả loại xe
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('car')} selected={typeFilter === 'car'}>
                    Ô tô
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('bike')} selected={typeFilter === 'bike'}>
                    Xe máy
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
                            <TableCell>STT</TableCell>
                            <TableCell>Chủ hộ</TableCell>
                            <TableCell>Biển số xe</TableCell>
                            <TableCell align="center">Loại xe</TableCell>
                            <TableCell>Vị trí đỗ</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={row.vehicleId} hover>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {getHouseholdName(row.householdId)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.plateNumber}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 600, fontSize: '0.875rem' }}
                                    />
                                </TableCell>
                                <TableCell align="center">{getTypeChip(row.type)}</TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        Tầng hầm <strong>{row.basementFloor}</strong> - Ô <strong>{row.location}</strong>
                                    </Typography>
                                </TableCell>
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
                                        <Tooltip title="Xóa phương tiện">
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
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body2" sx={{ py: 3, color: 'text.secondary' }}>
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

            {/* ADD/EDIT DIALOG */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {editingRecord ? 'Sửa thông tin phương tiện' : 'Thêm phương tiện mới'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Mã hộ gia đình <span style={{ color: '#ef4444' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                type="number"
                                name="householdId"
                                value={formData.householdId}
                                onChange={handleChange}
                                size="small"
                                placeholder="Nhập mã hộ gia đình"
                            />
                        </Box>

                        <Stack direction="row" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Biển số xe <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="VD: 30A-12345"
                                    name="plateNumber"
                                    value={formData.plateNumber}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Loại xe <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    size="small"
                                >
                                    <MenuItem value="bike">Xe máy</MenuItem>
                                    <MenuItem value="car">Ô tô</MenuItem>
                                </TextField>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Tầng hầm <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder="VD: 1"
                                    name="basementFloor"
                                    value={formData.basementFloor}
                                    onChange={handleChange}
                                    size="small"
                                    inputProps={{ min: 1, max: 3 }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Vị trí / Ô đỗ <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="VD: A-1 hoặc A1"
                                    name="location"
                                    value={formData.location}
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

            {/* DELETE CONFIRMATION */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1 }}>
                    Xác nhận xóa phương tiện
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Bạn có chắc chắn muốn xóa xe biển số <strong>{deletingRecord?.plateNumber}</strong>?
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
                        Xóa phương tiện
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

export default VehicleManagement;
