// frontend/src/views/admin/feeManager/DefaultFeeManagement.jsx

import React, { useState } from 'react';

// material-ui
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
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
    Alert
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import { Edit, Trash2, Plus, Search } from 'lucide-react';

const DefaultFeeManagement = () => {
    // --- 1. MOCK DATA ---
    const [data, setData] = useState([
        {
            id: 1,
            description: 'Phí quản lý chung cư (theo m2)',
            unit_price: 6000
        },
        {
            id: 2,
            description: 'Phí gửi xe máy (theo tháng)',
            unit_price: 80000
        },
        {
            id: 3,
            description: 'Phí gửi ô tô (theo tháng)',
            unit_price: 1200000
        }
    ]);

    // --- 2. UI STATE ---
    const [open, setOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Form state
    const [formData, setFormData] = useState({
        description: '',
        unit_price: ''
    });

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState(null);

    // Snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // --- 3. FILTERING ---
    const filteredData = data.filter((item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- 4. HANDLERS ---
    const handleOpen = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                description: record.description,
                unit_price: record.unit_price
            });
        } else {
            setEditingRecord(null);
            setFormData({
                description: '',
                unit_price: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRecord(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!formData.description) {
            setSnackbar({ open: true, message: 'Vui lòng nhập tên loại phí!', severity: 'warning' });
            return;
        }
        if (!formData.unit_price || formData.unit_price <= 0) {
            setSnackbar({ open: true, message: 'Vui lòng nhập đơn giá hợp lệ!', severity: 'warning' });
            return;
        }

        if (editingRecord) {
            const updatedData = data.map((item) =>
                item.id === editingRecord.id ? { ...item, unit_price: Number(formData.unit_price) } : item
            );
            setData(updatedData);
            setSnackbar({ open: true, message: 'Cập nhật giá thành công!', severity: 'success' });
        } else {
            const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
            setData([...data, { id: newId, description: formData.description, unit_price: Number(formData.unit_price) }]);
            setSnackbar({ open: true, message: 'Thêm loại phí mới thành công!', severity: 'success' });
        }
        handleClose();
    };

    const handleDelete = (record) => {
        setDeletingRecord(record);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingRecord) {
            setData(data.filter((item) => item.id !== deletingRecord.id));
            setSnackbar({ open: true, message: 'Đã xóa loại phí!', severity: 'success' });
        }
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    // --- 5. HELPER ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <MainCard contentSX={{ pt: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>
                    Quản lý Định mức Phí
                </Typography>

                <Tooltip title="Thêm loại phí mới">
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

                <OutlinedInput
                    placeholder="Tìm theo tên loại phí..."
                    startAdornment={
                        <InputAdornment position="start">
                            <Search size={18} />
                        </InputAdornment>
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ 
                        minWidth: 280,
                        borderRadius: '12px',
                        height: 40
                    }}
                    size="small"
                />
            </Box>
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
                            <TableCell width={80}>STT</TableCell>
                            <TableCell>Mô tả / Tên loại phí</TableCell>
                            <TableCell align="right">Đơn giá (VNĐ)</TableCell>
                            <TableCell align="center" width={150}>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={row.id} hover>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {row.description}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography sx={{ color: '#60a5fa', fontWeight: 700, fontSize: '1rem' }}>
                                        {formatCurrency(row.unit_price)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                        <Tooltip title="Sửa đơn giá">
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => handleOpen(row)}
                                                size="small"
                                            >
                                                <Edit size={18} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa loại phí">
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
                                <TableCell colSpan={4} align="center">
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
                    {editingRecord ? 'Sửa đơn giá phí' : 'Tạo loại phí mới'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Mô tả / Tên loại phí <span style={{ color: '#ef4444' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Ví dụ: Phí gửi xe máy..."
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={!!editingRecord}
                                size="small"
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Đơn giá mặc định (VNĐ) <span style={{ color: '#ef4444' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                type="number"
                                placeholder="Nhập số tiền..."
                                name="unit_price"
                                value={formData.unit_price}
                                onChange={handleChange}
                                size="small"
                                inputProps={{ min: 0 }}
                            />
                        </Box>
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
                    Xác nhận xóa loại phí
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Bạn có chắc chắn muốn xóa loại phí <strong>{deletingRecord?.description}</strong>?
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
                        Xóa loại phí
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

export default DefaultFeeManagement;
