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
    // --- 1. STATE ---
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

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

    // Snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // --- 3. FILTERING ---
    const filteredData = data.filter((item) => item.descriptionVi.toLowerCase().includes(searchTerm.toLowerCase()));

    // --- 4. FETCH DATA ---
    const fetchDefaultFees = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/default-fee`);
            if (!response.ok) throw new Error('Failed to fetch default fees');
            const result = await response.json();
            setData(result.result);
        } catch (error) {
            console.error('Error fetching data:', error);
            setSnackbar({ open: true, message: 'Lỗi khi tải dữ liệu phí!', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchDefaultFees();
    }, []);

    // --- 5. HANDLERS ---
    const handleOpen = (record) => {
        setEditingRecord(record);
        setFormData({
            description: record.descriptionVi,
            unit_price: record.unitPrice
        });
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

    const handleSave = async () => {
        if (!formData.unit_price || formData.unit_price <= 0) {
            setSnackbar({ open: true, message: 'Vui lòng nhập đơn giá hợp lệ!', severity: 'warning' });
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/default-fee/${editingRecord.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    unitPrice: Number(formData.unit_price)
                })
            });

            if (!response.ok) throw new Error('Failed to update fee');

            setSnackbar({ open: true, message: 'Cập nhật giá thành công!', severity: 'success' });
            handleClose();
            fetchDefaultFees(); // Reload data
        } catch (error) {
            console.error('Error updating fee:', error);
            setSnackbar({ open: true, message: 'Lỗi khi cập nhật phí!', severity: 'error' });
        }
    };

    // --- 6. HELPER ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <MainCard contentSX={{ pt: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>
                    Quản lý Định mức Phí
                </Typography>

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
                            <TableCell width={80}>STT</TableCell>
                            <TableCell>Mô tả / Tên loại phí</TableCell>
                            <TableCell align="right">Đơn giá (VNĐ)</TableCell>
                            <TableCell align="center" width={150}>
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={row.id} hover>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                        {row.descriptionVi}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography sx={{ color: '#60a5fa', fontWeight: 700, fontSize: '1rem' }}>
                                        {formatCurrency(row.unitPrice)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Sửa đơn giá">
                                        <IconButton color="primary" onClick={() => handleOpen(row)} size="small">
                                            <Edit size={18} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body2" sx={{ py: 3, color: 'text.secondary' }}>
                                        {loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy dữ liệu'}
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

            {/* EDIT DIALOG */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Sửa đơn giá phí</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                Mô tả / Tên loại phí
                            </Typography>
                            <TextField fullWidth value={formData.description} disabled size="small" sx={{ bgcolor: 'action.hover' }} />
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
                                autoFocus
                            />
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleClose} color="error">
                        Hủy
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Cập nhật
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
