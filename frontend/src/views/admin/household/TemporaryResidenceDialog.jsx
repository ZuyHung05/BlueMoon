// frontend/src/views/admin/household/TemporaryResidenceDialog.jsx

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Chip,
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Divider,
    Snackbar,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
import { X, Clock, Plus, MapPin, Trash2 } from 'lucide-react';

// Mock data cho danh sách tạm trú/tạm vắng hiện có
const MOCK_TEMPORARY_RECORDS = [
    {
        absence_id: 1,
        resident_id: 1,
        residentName: 'Nguyễn Văn A',
        record_type: 'TAM_VANG',
        start: '2026-01-05',
        end: '2026-02-05',
        reason: 'Công tác nước ngoài'
    },
    {
        absence_id: 2,
        resident_id: 2,
        residentName: 'Trần Thị B',
        record_type: 'TAM_TRU',
        start: '2025-12-20',
        end: '2026-06-20',
        reason: 'Thuê phòng tạm thời'
    }
];

const TemporaryResidenceDialog = ({ open, onClose, household }) => {
    const [tabValue, setTabValue] = useState(0);
    const [formData, setFormData] = useState({
        resident_id: '',
        record_type: 'TAM_TRU',
        start: '',
        end: '',
        reason: ''
    });
    const [records, setRecords] = useState(MOCK_TEMPORARY_RECORDS);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Lấy danh sách thành viên từ household
    const members = household?.members || [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Validate
        if (!formData.resident_id) {
            setSnackbar({ open: true, message: 'Vui lòng chọn thành viên!', severity: 'warning' });
            return;
        }
        if (!formData.start || !formData.end) {
            setSnackbar({ open: true, message: 'Vui lòng chọn ngày bắt đầu và kết thúc!', severity: 'warning' });
            return;
        }
        if (new Date(formData.end) <= new Date(formData.start)) {
            setSnackbar({ open: true, message: 'Ngày kết thúc phải sau ngày bắt đầu!', severity: 'error' });
            return;
        }

        // Mock submit - add to local list
        const selectedMember = members.find((m) => m.id === parseInt(formData.resident_id));
        const newRecord = {
            absence_id: records.length + 1,
            resident_id: parseInt(formData.resident_id),
            residentName: selectedMember?.full_name || 'Unknown',
            record_type: formData.record_type,
            start: formData.start,
            end: formData.end,
            reason: formData.reason
        };

        setRecords([...records, newRecord]);
        setSnackbar({
            open: true,
            message: `Đăng ký ${formData.record_type === 'TAM_TRU' ? 'tạm trú' : 'tạm vắng'} thành công!`,
            severity: 'success'
        });

        // Reset form
        setFormData({
            resident_id: '',
            record_type: 'TAM_TRU',
            start: '',
            end: '',
            reason: ''
        });
        setTabValue(1); // Switch to list tab
    };

    const handleDelete = (absenceId) => {
        setRecords(records.filter((r) => r.absence_id !== absenceId));
        setSnackbar({ open: true, message: 'Đã xóa đăng ký!', severity: 'success' });
    };

    const getRecordTypeChip = (type) => {
        if (type === 'TAM_TRU') {
            return (
                <Chip
                    icon={<MapPin size={14} />}
                    label="Tạm trú"
                    size="small"
                    sx={{
                        bgcolor: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        fontWeight: 500,
                        '& .MuiChip-icon': { color: '#60a5fa' }
                    }}
                />
            );
        }
        return (
            <Chip
                icon={<MapPin size={14} />}
                label="Tạm vắng"
                size="small"
                sx={{
                    bgcolor: 'rgba(234, 179, 8, 0.15)',
                    color: '#fbbf24',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: '#fbbf24' }
                }}
            />
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Clock size={24} style={{ color: '#f59e0b' }} />
                        <Typography variant="h5" fontWeight={600}>
                            Đăng ký Tạm trú / Tạm vắng
                        </Typography>
                    </Stack>
                    <IconButton onClick={onClose} size="small">
                        <X size={20} />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                {/* Thông tin hộ */}
                {household && (
                    <Box
                        sx={{
                            mb: 2,
                            p: 2,
                            bgcolor: 'action.hover',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            Hộ gia đình: <strong>Phòng {household.apartment_id}</strong> - Chủ hộ:{' '}
                            <strong>{household.head_of_household || '---'}</strong>
                        </Typography>
                    </Box>
                )}

                {/* Tabs */}
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Tab icon={<Plus size={16} />} iconPosition="start" label="Đăng ký mới" />
                    <Tab icon={<Clock size={16} />} iconPosition="start" label={`Danh sách (${records.length})`} />
                </Tabs>

                {/* Tab 0: Form đăng ký */}
                {tabValue === 0 && (
                    <Box sx={{ p: 2 }}>
                        <Stack spacing={3}>
                            {/* Chọn thành viên */}
                            <FormControl fullWidth>
                                <InputLabel>Chọn thành viên</InputLabel>
                                <Select name="resident_id" value={formData.resident_id} onChange={handleChange} label="Chọn thành viên">
                                    {members.length > 0 ? (
                                        members.map((member) => (
                                            <MenuItem key={member.id} value={member.id}>
                                                {member.full_name} - {member.id_number}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Không có thành viên</MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                            {/* Loại đăng ký */}
                            <FormControl>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Loại đăng ký
                                </Typography>
                                <RadioGroup row name="record_type" value={formData.record_type} onChange={handleChange}>
                                    <FormControlLabel
                                        value="TAM_TRU"
                                        control={<Radio />}
                                        label={
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <MapPin size={16} style={{ color: '#60a5fa' }} />
                                                <span>Tạm trú</span>
                                            </Stack>
                                        }
                                    />
                                    <FormControlLabel
                                        value="TAM_VANG"
                                        control={<Radio />}
                                        label={
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <MapPin size={16} style={{ color: '#fbbf24' }} />
                                                <span>Tạm vắng</span>
                                            </Stack>
                                        }
                                    />
                                </RadioGroup>
                            </FormControl>

                            {/* Ngày bắt đầu và kết thúc */}
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Ngày bắt đầu"
                                    name="start"
                                    type="date"
                                    value={formData.start}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    label="Ngày kết thúc"
                                    name="end"
                                    type="date"
                                    value={formData.end}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Stack>

                            {/* Lý do */}
                            <TextField
                                fullWidth
                                label="Lý do (tùy chọn)"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                multiline
                                rows={2}
                                placeholder="Nhập lý do tạm trú/tạm vắng..."
                            />

                            {/* Nút đăng ký */}
                            <Button
                                variant="contained"
                                startIcon={<Plus size={18} />}
                                onClick={handleSubmit}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: 'none'
                                }}
                            >
                                Đăng ký {formData.record_type === 'TAM_TRU' ? 'Tạm trú' : 'Tạm vắng'}
                            </Button>
                        </Stack>
                    </Box>
                )}

                {/* Tab 1: Danh sách đăng ký */}
                {tabValue === 1 && (
                    <TableContainer>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell>Thành viên</TableCell>
                                    <TableCell>Loại</TableCell>
                                    <TableCell>Từ ngày</TableCell>
                                    <TableCell>Đến ngày</TableCell>
                                    <TableCell>Lý do</TableCell>
                                    <TableCell align="center">Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {records.length > 0 ? (
                                    records.map((record) => (
                                        <TableRow key={record.absence_id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {record.residentName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{getRecordTypeChip(record.record_type)}</TableCell>
                                            <TableCell>{formatDate(record.start)}</TableCell>
                                            <TableCell>{formatDate(record.end)}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 150 }} noWrap>
                                                    {record.reason || '---'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(record.absence_id)}>
                                                    <Trash2 size={16} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Chưa có đăng ký tạm trú/tạm vắng nào
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
                    Đóng
                </Button>
            </DialogActions>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default TemporaryResidenceDialog;
