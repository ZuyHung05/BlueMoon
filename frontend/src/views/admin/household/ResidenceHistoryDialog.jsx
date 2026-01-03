// frontend/src/views/admin/household/ResidenceHistoryDialog.jsx

import React from 'react';
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
    IconButton
} from '@mui/material';
import { X, UserPlus, UserMinus, Clock, Home } from 'lucide-react';

// Mock data cho lịch sử biến đổi nhân khẩu
const MOCK_HISTORY = [
    {
        id: 1,
        action: 'THÊM_THÀNH_VIÊN',
        memberName: 'Nguyễn Văn A',
        memberId: '001090000001',
        date: '2025-12-15T10:30:00',
        performedBy: 'Admin',
        note: 'Đăng ký nhân khẩu mới'
    },
    {
        id: 2,
        action: 'THÊM_THÀNH_VIÊN',
        memberName: 'Trần Thị B',
        memberId: '001090000002',
        date: '2025-12-16T14:20:00',
        performedBy: 'Admin',
        note: 'Thêm vợ vào hộ khẩu'
    },
    {
        id: 3,
        action: 'XÓA_THÀNH_VIÊN',
        memberName: 'Lê Văn C',
        memberId: '001090000003',
        date: '2025-12-20T09:00:00',
        performedBy: 'Admin',
        note: 'Chuyển đi hộ khẩu khác'
    },
    {
        id: 4,
        action: 'THÊM_THÀNH_VIÊN',
        memberName: 'Phạm Thị D',
        memberId: '001090000004',
        date: '2026-01-02T11:15:00',
        performedBy: 'Admin',
        note: 'Con mới sinh'
    }
];

const ResidenceHistoryDialog = ({ open, onClose, household }) => {
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
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

                {/* Timeline lịch sử */}
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

                    {MOCK_HISTORY.map((item, index) => (
                        <Box
                            key={item.id}
                            sx={{
                                position: 'relative',
                                mb: index === MOCK_HISTORY.length - 1 ? 0 : 3,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: -19,
                                    top: 8,
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: item.action === 'THÊM_THÀNH_VIÊN' ? '#4ade80' : '#f87171',
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
                                        borderColor: item.action === 'THÊM_THÀNH_VIÊN' ? '#4ade80' : '#f87171'
                                    }
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        {getActionChip(item.action)}
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(item.date)}
                                        </Typography>
                                    </Stack>

                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {item.memberName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            CCCD: {item.memberId}
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

                {MOCK_HISTORY.length === 0 && (
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
