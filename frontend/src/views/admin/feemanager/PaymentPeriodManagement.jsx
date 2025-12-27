// frontend/src/views/admin/feemanager/PaymentPeriodManagement.jsx

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
    LinearProgress,
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
    Tabs,
    Tab,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import { Edit, Trash2, Plus, Search, Upload, Download, Printer, CheckCircle, XCircle, Users } from 'lucide-react';
import dayjs from 'dayjs';

const PaymentPeriodManagement = () => {
    // --- DATA ĐỢT THU (MOCK) ---
    const [data, setData] = useState([
        {
            payment_period_id: 1,
            description: 'Phí dịch vụ chung cư Tháng 10/2025',
            start_date: '2025-10-01',
            end_date: '2025-10-31',
            is_mandatory: true,
            count: 2,
            total: 8
        },
        {
            payment_period_id: 2,
            description: 'Quyên góp quỹ từ thiện 2025',
            start_date: '2025-10-05',
            end_date: '2025-11-05',
            is_mandatory: false,
            count: 1,
            total: 8
        }
    ]);

    // --- MOCK DATA HỘ DÂN ---
    const mockAllHouseholds = [
        { id: 101, name: 'Hộ 101 - Nguyễn Văn A', room: '101', required_amount: 500000 },
        { id: 102, name: 'Hộ 102 - Lê Thị C', room: '102', required_amount: 500000 },
        { id: 201, name: 'Hộ 201 - Hoàng Văn D', room: '201', required_amount: 650000 },
        { id: 205, name: 'Hộ 205 - Trần Thị B', room: '205', required_amount: 650000 },
        { id: 301, name: 'Hộ 301 - Lê Văn C', room: '301', required_amount: 420000 },
        { id: 302, name: 'Hộ 302 - Ngô Thị E', room: '302', required_amount: 420000 },
        { id: 401, name: 'Hộ 401 - Đỗ Văn G', room: '401', required_amount: 550000 },
        { id: 402, name: 'Hộ 402 - Phạm Thị D', room: '402', required_amount: 550000 }
    ];

    // --- MOCK DATA ĐÃ ĐÓNG TIỀN ---
    const [paidResidents, setPaidResidents] = useState([
        { key: 'p1', payment_period_id: 1, household_id: 101, household_name: 'Hộ 101 - Nguyễn Văn A', room: '101', amount: 500000, date: '2025-10-05', method: 'Chuyển khoản' },
        { key: 'p2', payment_period_id: 1, household_id: 205, household_name: 'Hộ 205 - Trần Thị B', room: '205', amount: 650000, date: '2025-10-06', method: 'Tiền mặt' },
        { key: 'p3', payment_period_id: 2, household_id: 301, household_name: 'Hộ 301 - Lê Văn C', room: '301', amount: 200000, date: '2025-10-10', method: 'Chuyển khoản' }
    ]);

    // --- STATE ---
    const [open, setOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states for main table
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Pagination states for detail table
    const [detailPage, setDetailPage] = useState(0);
    const [detailRowsPerPage, setDetailRowsPerPage] = useState(10);

    // Form state
    const [formData, setFormData] = useState({
        description: '',
        start_date: '',
        end_date: '',
        is_mandatory: true
    });

    // Pay modal
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [targetHousehold, setTargetHousehold] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');

    // Donation modal
    const [donationModalOpen, setDonationModalOpen] = useState(false);
    const [donationData, setDonationData] = useState({ household_id: '', amount: '', method: 'Tiền mặt' });

    // Detail modal
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [viewPaymentDetail, setViewPaymentDetail] = useState(null);

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState(null);

    // Snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // --- FILTERING ---
    const filteredData = data.filter((item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- HANDLERS ---
    const handleOpen = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                description: record.description,
                start_date: record.start_date,
                end_date: record.end_date,
                is_mandatory: record.is_mandatory
            });
            setTabValue(0);
            setFilterStatus('all');
            setDetailPage(0);
        } else {
            setEditingRecord(null);
            setFormData({
                description: '',
                start_date: '',
                end_date: '',
                is_mandatory: true
            });
            setTabValue(0);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRecord(null);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDetailPage = (event, newPage) => {
        setDetailPage(newPage);
    };

    const handleChangeDetailRowsPerPage = (event) => {
        setDetailRowsPerPage(parseInt(event.target.value, 10));
        setDetailPage(0);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!formData.description) {
            setSnackbar({ open: true, message: 'Vui lòng nhập tên đợt thu!', severity: 'warning' });
            return;
        }
        if (!formData.start_date || !formData.end_date) {
            setSnackbar({ open: true, message: 'Vui lòng chọn thời gian thu!', severity: 'warning' });
            return;
        }

        if (editingRecord) {
            const updatedData = data.map((item) =>
                item.payment_period_id === editingRecord.payment_period_id ? { ...item, ...formData } : item
            );
            setData(updatedData);
            setSnackbar({ open: true, message: 'Cập nhật đợt thu thành công!', severity: 'success' });
        } else {
            const newId = data.length > 0 ? Math.max(...data.map((d) => d.payment_period_id)) + 1 : 1;
            setData([...data, { payment_period_id: newId, count: 0, total: mockAllHouseholds.length, ...formData }]);
            setSnackbar({ open: true, message: 'Tạo đợt thu mới thành công!', severity: 'success' });
        }
        handleClose();
    };

    const handleDelete = (record) => {
        setDeletingRecord(record);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingRecord) {
            setData(data.filter((item) => item.payment_period_id !== deletingRecord.payment_period_id));
            setSnackbar({ open: true, message: 'Đã xóa đợt thu!', severity: 'success' });
        }
        setDeleteDialogOpen(false);
        setDeletingRecord(null);
    };

    const savePayment = (newPayment) => {
        setPaidResidents([newPayment, ...paidResidents]);
        const updatedMainData = data.map((item) =>
            item.payment_period_id === editingRecord.payment_period_id ? { ...item, count: item.count + 1 } : item
        );
        setData(updatedMainData);
        setEditingRecord((prev) => ({ ...prev, count: prev.count + 1 }));
    };

    const handleOpenPayModal = (household) => {
        setTargetHousehold(household);
        setPaymentMethod('Tiền mặt');
        setPayModalOpen(true);
    };

    const handleConfirmPayment = () => {
        const newPayment = {
            key: Date.now(),
            payment_period_id: editingRecord.payment_period_id,
            household_id: targetHousehold.id,
            household_name: targetHousehold.name,
            room: targetHousehold.room,
            amount: targetHousehold.required_amount,
            date: dayjs().format('YYYY-MM-DD'),
            method: paymentMethod
        };
        savePayment(newPayment);
        setSnackbar({ open: true, message: `Đã thu ${formatCurrency(targetHousehold.required_amount)} của ${targetHousehold.name}`, severity: 'success' });
        setPayModalOpen(false);
        setTargetHousehold(null);
    };

    const handleAddDonation = () => {
        if (!donationData.household_id || !donationData.amount) {
            setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin!', severity: 'warning' });
            return;
        }
        const selectedHousehold = mockAllHouseholds.find((h) => h.id === donationData.household_id);
        const newPayment = {
            key: Date.now(),
            payment_period_id: editingRecord.payment_period_id,
            household_id: selectedHousehold.id,
            household_name: selectedHousehold.name,
            room: selectedHousehold.room,
            amount: Number(donationData.amount),
            date: dayjs().format('YYYY-MM-DD'),
            method: donationData.method
        };
        savePayment(newPayment);
        setSnackbar({ open: true, message: 'Thêm đóng góp thành công!', severity: 'success' });
        setDonationModalOpen(false);
        setDonationData({ household_id: '', amount: '', method: 'Tiền mặt' });
    };

    const handleExportBill = (record) => {
        setSnackbar({ open: true, message: `Đang xuất danh sách: ${record.description}...`, severity: 'info' });
    };

    // --- HELPERS ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getHouseholdStatusList = () => {
        if (!editingRecord) return [];

        const paidInThisPeriod = paidResidents.filter((p) => p.payment_period_id === editingRecord.payment_period_id);

        if (!editingRecord.is_mandatory) {
            return paidInThisPeriod.map((p) => ({
                ...p,
                id: p.household_id,
                name: p.household_name,
                required_amount: p.amount,
                status: 'Paid',
                paymentInfo: p
            }));
        }

        const fullList = mockAllHouseholds.map((hh) => {
            const paymentInfo = paidInThisPeriod.find((p) => p.household_id === hh.id);
            return {
                ...hh,
                key: hh.id,
                status: paymentInfo ? 'Paid' : 'Unpaid',
                paymentInfo: paymentInfo
            };
        });

        if (filterStatus === 'paid') return fullList.filter((item) => item.status === 'Paid');
        if (filterStatus === 'unpaid') return fullList.filter((item) => item.status === 'Unpaid');
        return fullList;
    };

    const getTypeChip = (isMandatory) => {
        return isMandatory ? (
            <Chip label="Bắt buộc" size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 500, minWidth: 80, justifyContent: 'center' }} />
        ) : (
            <Chip label="Tự nguyện" size="small" sx={{ bgcolor: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', fontWeight: 500, minWidth: 80, justifyContent: 'center' }} />
        );
    };

    return (
        <MainCard contentSX={{ pt: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>
                    Quản lý Đợt thu phí
                </Typography>

                <Tooltip title="Tạo đợt thu mới">
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
                    placeholder="Tìm theo tên đợt thu..."
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
            {/* MAIN TABLE */}
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
                            <TableCell width={60}>STT</TableCell>
                            <TableCell>Tên đợt thu</TableCell>
                            <TableCell>Thời gian</TableCell>
                            <TableCell align="center">Loại phí</TableCell>
                            <TableCell align="center" width={200}>Tiến độ / Tổng thu</TableCell>
                            <TableCell align="center" width={180}>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={row.payment_period_id} hover>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {row.description}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack spacing={0.5}>
                                        <Chip label={`Bắt đầu: ${row.start_date}`} size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }} />
                                        <Chip label={`Kết thúc: ${row.end_date}`} size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }} />
                                    </Stack>
                                </TableCell>
                                <TableCell align="center">{getTypeChip(row.is_mandatory)}</TableCell>
                                <TableCell align="center">
                                    {row.is_mandatory ? (
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {row.count} / {row.total} hộ
                                            </Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={(row.count / row.total) * 100} 
                                                sx={{ 
                                                    height: 6, 
                                                    borderRadius: 3,
                                                    bgcolor: 'rgba(255,255,255,0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: row.count === row.total ? '#22c55e' : '#3b82f6'
                                                    }
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Typography sx={{ color: '#22c55e', fontWeight: 700 }}>
                                                {formatCurrency(paidResidents.filter(p => p.payment_period_id === row.payment_period_id).reduce((sum, item) => sum + item.amount, 0))}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ({row.count} lượt đóng)
                                            </Typography>
                                        </Box>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                        <Tooltip title="Xuất danh sách">
                                            <IconButton size="small" sx={{ color: '#22c55e' }} onClick={() => handleExportBill(row)}>
                                                <Download size={18} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xem & Sửa">
                                            <IconButton color="primary" onClick={() => handleOpen(row)} size="small">
                                                <Edit size={18} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton 
                                                sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
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

            {/* MAIN DIALOG */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>
                    {editingRecord ? 'Chi tiết Đợt thu' : 'Tạo đợt thu mới'}
                </DialogTitle>
                <DialogContent>
                    <Tabs centered value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Tab label="Thông tin chung" />
                        {editingRecord && <Tab label={`Danh sách chi tiết (${editingRecord.count} hộ)`} icon={<Users size={16} />} iconPosition="start" />}
                    </Tabs>

                    {tabValue === 0 && (
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Tên đợt thu <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập tên đợt thu"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>
                            <Stack direction="row" spacing={2}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                        Ngày bắt đầu <span style={{ color: '#ef4444' }}>*</span>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        size="small"
                                    />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                        Ngày kết thúc <span style={{ color: '#ef4444' }}>*</span>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        size="small"
                                    />
                                </Box>
                            </Stack>
                            <Box>
                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    Loại khoản thu
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    name="is_mandatory"
                                    value={formData.is_mandatory}
                                    onChange={(e) => setFormData({ ...formData, is_mandatory: e.target.value === 'true' })}
                                    size="small"
                                >
                                    <MenuItem value="true">Bắt buộc</MenuItem>
                                    <MenuItem value="false">Tự nguyện</MenuItem>
                                </TextField>
                            </Box>
                        </Stack>
                    )}

                    {tabValue === 1 && editingRecord && (
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                {editingRecord.is_mandatory ? (
                                    <ToggleButtonGroup
                                        value={filterStatus}
                                        exclusive
                                        onChange={(e, v) => v && setFilterStatus(v)}
                                        size="small"
                                    >
                                        <ToggleButton value="all">Tất cả</ToggleButton>
                                        <ToggleButton value="paid">Đã đóng</ToggleButton>
                                        <ToggleButton value="unpaid">Chưa đóng</ToggleButton>
                                    </ToggleButtonGroup>
                                ) : (
                                    <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setDonationModalOpen(true)}>
                                        Thêm người đóng
                                    </Button>
                                )}
                                <Button variant="outlined" startIcon={<Download size={16} />} onClick={() => handleExportBill(editingRecord)}>
                                    Xuất Excel
                                </Button>
                            </Stack>

                            <TableContainer>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                                        <TableRow>
                                            <TableCell>Phòng</TableCell>
                                            <TableCell>Chủ hộ</TableCell>
                                            <TableCell align="right">{editingRecord.is_mandatory ? 'Số tiền quy định' : 'Số tiền đóng'}</TableCell>
                                            <TableCell align="center">Trạng thái</TableCell>
                                            <TableCell align="center">In</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getHouseholdStatusList().slice(detailPage * detailRowsPerPage, detailPage * detailRowsPerPage + detailRowsPerPage).map((row) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell>
                                                    <Chip label={row.room} size="small" sx={{ bgcolor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }} />
                                                </TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell align="right">
                                                    <Typography sx={{ color: '#60a5fa', fontWeight: 600 }}>
                                                        {formatCurrency(row.required_amount)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.status === 'Paid' ? (
                                                        <Tooltip title="Xem chi tiết">
                                                            <Chip 
                                                                icon={<CheckCircle size={14} />}
                                                                label="Đã đóng" 
                                                                size="small" 
                                                                sx={{ bgcolor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', cursor: 'pointer' }}
                                                                onClick={() => { setViewPaymentDetail(row.paymentInfo); setDetailModalOpen(true); }}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="Nhấn để thu tiền">
                                                            <Chip 
                                                                icon={<XCircle size={14} />}
                                                                label="Chưa đóng" 
                                                                size="small" 
                                                                sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', cursor: 'pointer' }}
                                                                onClick={() => handleOpenPayModal(row)}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small" disabled={row.status !== 'Paid'} onClick={() => setSnackbar({ open: true, message: `Đang in phiếu cho ${row.name}`, severity: 'info' })}>
                                                        <Printer size={16} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 20]}
                                component="div"
                                count={getHouseholdStatusList().length}
                                rowsPerPage={detailRowsPerPage}
                                page={detailPage}
                                onPageChange={handleChangeDetailPage}
                                onRowsPerPageChange={handleChangeDetailRowsPerPage}
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

            {/* PAY MODAL */}
            <Dialog open={payModalOpen} onClose={() => setPayModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Xác nhận thu tiền</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>Tên chủ hộ</Typography>
                            <TextField fullWidth value={targetHousehold?.name || ''} disabled size="small" />
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>Số tiền cần thu</Typography>
                            <TextField fullWidth value={targetHousehold ? formatCurrency(targetHousehold.required_amount) : ''} disabled size="small" />
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>Hình thức</Typography>
                            <TextField select fullWidth value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} size="small">
                                <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
                                <MenuItem value="Chuyển khoản">Chuyển khoản</MenuItem>
                            </TextField>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setPayModalOpen(false)} color="error">Hủy</Button>
                    <Button onClick={handleConfirmPayment} variant="contained">Xác nhận Đã Thu</Button>
                </DialogActions>
            </Dialog>

            {/* DONATION MODAL */}
            <Dialog open={donationModalOpen} onClose={() => setDonationModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Thêm đóng góp mới</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>Chọn hộ đóng góp <span style={{ color: '#ef4444' }}>*</span></Typography>
                            <TextField
                                select
                                fullWidth
                                value={donationData.household_id}
                                onChange={(e) => setDonationData({ ...donationData, household_id: e.target.value })}
                                size="small"
                            >
                                {mockAllHouseholds
                                    .filter(h => !paidResidents.some(p => p.household_id === h.id && p.payment_period_id === editingRecord?.payment_period_id))
                                    .map((h) => (
                                        <MenuItem key={h.id} value={h.id}>{h.name} - {h.room}</MenuItem>
                                    ))}
                            </TextField>
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>Số tiền đóng góp <span style={{ color: '#ef4444' }}>*</span></Typography>
                            <TextField
                                fullWidth
                                type="number"
                                placeholder="Nhập số tiền"
                                value={donationData.amount}
                                onChange={(e) => setDonationData({ ...donationData, amount: e.target.value })}
                                size="small"
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>Hình thức</Typography>
                            <TextField
                                select
                                fullWidth
                                value={donationData.method}
                                onChange={(e) => setDonationData({ ...donationData, method: e.target.value })}
                                size="small"
                            >
                                <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
                                <MenuItem value="Chuyển khoản">Chuyển khoản</MenuItem>
                            </TextField>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setDonationModalOpen(false)} color="error">Hủy</Button>
                    <Button onClick={handleAddDonation} variant="contained">Thêm</Button>
                </DialogActions>
            </Dialog>

            {/* DETAIL MODAL */}
            <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Chi tiết giao dịch</DialogTitle>
                <DialogContent>
                    {viewPaymentDetail && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Chủ hộ</Typography>
                                <Typography fontWeight={600}>{viewPaymentDetail.household_name}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Số tiền</Typography>
                                <Typography sx={{ color: '#22c55e', fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(viewPaymentDetail.amount)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Ngày đóng</Typography>
                                <Typography>{viewPaymentDetail.date}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Hình thức</Typography>
                                <Typography>{viewPaymentDetail.method}</Typography>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setDetailModalOpen(false)} variant="outlined">Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* DELETE CONFIRMATION */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Xác nhận xóa đợt thu</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa đợt thu <strong>{deletingRecord?.description}</strong>?</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Hành động này không thể hoàn tác.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">Hủy</Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">Xóa</Button>
                </DialogActions>
            </Dialog>

            {/* SNACKBAR */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', alignItems: 'center', '& .MuiAlert-action': { pt: 0, alignItems: 'center' } }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

export default PaymentPeriodManagement;
