// frontend/src/views/admin/vehicle/VehicleManagement.jsx

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

// assets
import { Edit, Trash2, Plus, Search, Filter, Car, Bike } from 'lucide-react';

const VehicleManagement = () => {
    // --- MOCK DATA ---
    const mockHouseholds = [
        { id: 101, name: 'Hộ 101 - Nguyễn Văn A', cccd: '00109xxx' },
        { id: 102, name: 'Hộ 102 - Trần Thị B', cccd: '00108xxx' },
        { id: 205, name: 'Hộ 205 - Lê Văn C', cccd: '00107xxx' }
    ];

    const [data, setData] = useState([
        {
            vehicle_id: 1,
            household_id: 101,
            plate_number: '29A-123.45',
            type: 'car',
            basement_floor: 1,
            location: 'A-10'
        },
        {
            vehicle_id: 2,
            household_id: 101,
            plate_number: '29B1-999.99',
            type: 'bike',
            basement_floor: 1,
            location: 'B-05'
        },
        {
            vehicle_id: 3,
            household_id: 102,
            plate_number: '30E-555.66',
            type: 'car',
            basement_floor: 2,
            location: 'C-22'
        }
    ]);

    // --- UI STATE ---
    const [open, setOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');

    // Filter menu
    const [anchorEl, setAnchorEl] = useState(null);
    const openFilter = Boolean(anchorEl);

    // Form state
    const [formData, setFormData] = useState({
        household_id: '',
        plate_number: '',
        type: 'bike',
        basement_floor: 1,
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

    // --- FILTERING ---
    const filteredData = data.filter((item) => {
        const household = mockHouseholds.find((h) => h.id === item.household_id);
        const ownerName = household ? household.name.toLowerCase() : '';
        const plate = item.plate_number.toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchSearch = plate.includes(search) || ownerName.includes(search);
        const matchType = typeFilter === 'ALL' || item.type === typeFilter;

        return matchSearch && matchType;
    });

    // --- HANDLERS ---
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleOpen = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                household_id: record.household_id,
                plate_number: record.plate_number,
                type: record.type,
                basement_floor: record.basement_floor,
                location: record.location
            });
        } else {
            setEditingRecord(null);
            setFormData({
                household_id: '',
                plate_number: '',
                type: 'bike',
                basement_floor: 1,
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!formData.household_id) {
            setSnackbar({ open: true, message: 'Vui lòng chọn hộ gia đình!', severity: 'warning' });
            return;
        }
        if (!formData.plate_number) {
            setSnackbar({ open: true, message: 'Vui lòng nhập biển số xe!', severity: 'warning' });
            return;
        }
        if (!formData.location) {
            setSnackbar({ open: true, message: 'Vui lòng nhập vị trí đỗ!', severity: 'warning' });
            return;
        }

        if (editingRecord) {
            const updatedData = data.map((item) =>
                item.vehicle_id === editingRecord.vehicle_id ? { ...item, ...formData } : item
            );
            setData(updatedData);
            setSnackbar({ open: true, message: 'Cập nhật thông tin xe thành công!', severity: 'success' });
        } else {
            const newId = data.length > 0 ? Math.max(...data.map((d) => d.vehicle_id)) + 1 : 1;
            setData([...data, { vehicle_id: newId, ...formData }]);
            setSnackbar({ open: true, message: 'Thêm phương tiện mới thành công!', severity: 'success' });
        }
        handleClose();
    };

    const handleDelete = (record) => {
        setDeletingRecord(record);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingRecord) {
            setData(data.filter((item) => item.vehicle_id !== deletingRecord.vehicle_id));
            setSnackbar({ open: true, message: 'Đã xóa phương tiện!', severity: 'success' });
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
        const hh = mockHouseholds.find((h) => h.id === id);
        return hh ? hh.name : 'Chưa rõ';
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

    // --- HEADER ACTIONS ---
    const headerActions = (
        <Stack direction="row" spacing={1.5} alignItems="center">
            <OutlinedInput
                placeholder="Tìm theo biển số, tên chủ hộ..."
                startAdornment={
                    <InputAdornment position="start">
                        <Search size={18} />
                    </InputAdornment>
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 300, borderRadius: '12px' }}
                size="small"
            />

            <Tooltip title="Lọc theo loại xe">
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
                <MenuItem onClick={() => { setTypeFilter('ALL'); handleFilterClose(); }} selected={typeFilter === 'ALL'}>
                    Tất cả loại xe
                </MenuItem>
                <MenuItem onClick={() => { setTypeFilter('car'); handleFilterClose(); }} selected={typeFilter === 'car'}>
                    Ô tô
                </MenuItem>
                <MenuItem onClick={() => { setTypeFilter('bike'); handleFilterClose(); }} selected={typeFilter === 'bike'}>
                    Xe máy
                </MenuItem>
            </Menu>

            <Tooltip title="Thêm phương tiện mới">
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
        <MainCard title="Quản lý Phương tiện" secondary={headerActions} contentSX={{ pt: 0 }}>
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
                        {filteredData.map((row, index) => (
                            <TableRow key={row.vehicle_id} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {getHouseholdName(row.household_id)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.plate_number} 
                                        size="small" 
                                        sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 600, fontSize: '0.875rem' }} 
                                    />
                                </TableCell>
                                <TableCell align="center">{getTypeChip(row.type)}</TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        Tầng hầm <strong>{row.basement_floor}</strong> - Ô <strong>{row.location}</strong>
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

            {/* ADD/EDIT DIALOG */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {editingRecord ? 'Sửa thông tin phương tiện' : 'Thêm phương tiện mới'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Thuộc hộ gia đình <span style={{ color: '#ef4444' }}>*</span>
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                name="household_id"
                                value={formData.household_id}
                                onChange={handleChange}
                                size="small"
                            >
                                {mockHouseholds.map((h) => (
                                    <MenuItem key={h.id} value={h.id}>
                                        {h.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Stack direction="row" spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Biển số xe <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="VD: 29A-123.45"
                                    name="plate_number"
                                    value={formData.plate_number}
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
                                    name="basement_floor"
                                    value={formData.basement_floor}
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
                                    placeholder="VD: A-10"
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
                        Bạn có chắc chắn muốn xóa xe biển số <strong>{deletingRecord?.plate_number}</strong>?
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
