// frontend/src/views/admin/household/ResidenceHistoryDialog.jsx

import React, { useState, useEffect } from 'react';
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
    Divider,
    IconButton,
    CircularProgress
} from '@mui/material';
import { X, UserPlus, UserMinus, Clock, Home } from 'lucide-react';

const ResidenceHistoryDialog = ({ open, onClose, household }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch history when dialog opens
    useEffect(() => {
        if (open && household) {
            fetchHistory();
        }
    }, [open, household]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/household/${household.household_id}/history`);
            if (!response.ok) throw new Error('Failed to fetch history');

            const result = await response.json();
            setHistory(result.result || []);
        } catch (error) {
            console.error('Error fetching history:', error);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const getActionChip = (action) => {
        if (action === 'THÊM_THÀNH_VIÊN') {
            return (
                <Chip
                    icon={<UserPlus size={14} />}
                    label="Thêm thành viên"
                    size="small"
                    sx={{
                        bgcolor: 'rgba(34, 197, 94, 0.15)',
                        color: '#4ade80',
                        fontWeight: 500,
                        '& .MuiChip-icon': { color: '#4ade80' }
                    }}
                />
            );
        }
        return (
            <Chip
                icon={<UserMinus size={14} />}
                label="Xóa thành viên"
                size="small"
                sx={{
                    bgcolor: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: '#f87171' }
                }}
            />
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Clock size={24} style={{ color: '#3b82f6' }} />
                        <Typography variant="h5" fontWeight={600}>
                            Lịch sử biến đổi nhân khẩu
                        </Typography>
                    </Stack>
                    <IconButton onClick={onClose} size="small">
                        <X size={20} />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                {/* Thông tin hộ gia đình */}
                {household && (
                    <Box
                        sx={{
                            mb: 3,
                            p: 2,
                            bgcolor: 'action.hover',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Home size={20} style={{ color: '#64748b' }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Phòng: {household.apartment_id}
                            </Typography>
                            <Divider orientation="vertical" flexItem />
                            <Typography variant="body2" color="text.secondary">
                                Chủ hộ: {household.head_of_household || '---'}
                            </Typography>
                        </Stack>
                    </Box>
                )}

                {/* Loading state */}
                {loading && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Timeline lịch sử */}
                {!loading && (
                    <Box sx={{ position: 'relative', pl: 3 }}>
                        {/* Đường kẻ dọc */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 8,
                                top: 0,
                                bottom: 0,
                                width: 2,
                                bgcolor: 'divider',
                                borderRadius: 1
                            }}
                        />

                        {history.map((item, index) => (
                            <Box
                                key={`${item.residentId}-${item.actionDate}-${index}`}
                                sx={{
                                    position: 'relative',
                                    mb: index === history.length - 1 ? 0 : 3,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        left: -19,
                                        top: 8,
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: item.actionType === 'THÊM_THÀNH_VIÊN' ? '#4ade80' : '#f87171',
                                        border: '2px solid',
                                        borderColor: 'background.paper',
                                        boxShadow: '0 0 0 3px rgba(100, 100, 100, 0.1)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'background.paper',
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            borderColor: item.actionType === 'THÊM_THÀNH_VIÊN' ? '#4ade80' : '#f87171'
                                        }
                                    }}
                                >
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            {getActionChip(item.actionType)}
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(item.actionDate)}
                                            </Typography>
                                        </Stack>

                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {item.memberName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                CCCD: {item.memberIdNumber}
                                            </Typography>
                                        </Box>

                                        <Divider />

                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" color="text.secondary">
                                                {item.note}
                                            </Typography>
                                            <Chip
                                                label={`Bởi: ${item.performedBy}`}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(100, 116, 139, 0.1)',
                                                    color: '#64748b',
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}

                {!loading && history.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            Chưa có lịch sử biến đổi nào
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResidenceHistoryDialog;
