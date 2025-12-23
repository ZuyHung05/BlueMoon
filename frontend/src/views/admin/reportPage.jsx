import React from "react";
import { Box, Typography, Grid, Card, CardContent, Stack, Chip } from "@mui/material";
import { TrendingUp, TrendingDown, Users, Car, Wallet, AlertTriangle } from 'lucide-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// Import chart components
import FeeByCategoryChart from "./charts/FeeByCategoryChart";
import RevenueOverTimeChart from "./charts/RevenueOverTimeChart";
import PaymentStatusBarChart from "./charts/PaymentStatusBarChart";
import CollectionPerformanceChart from "./charts/CollectionPerformanceChart";

// Stat Card Component
const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <Card sx={{ 
        bgcolor: 'background.paper', 
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%'
    }}>
        <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ color }}>
                        {value}
                    </Typography>
                    {change && (
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                            {changeType === 'up' ? (
                                <TrendingUp size={14} color="#22c55e" />
                            ) : (
                                <TrendingDown size={14} color="#ef4444" />
                            )}
                            <Typography variant="caption" sx={{ color: changeType === 'up' ? '#22c55e' : '#ef4444' }}>
                                {change} so với tháng trước
                            </Typography>
                        </Stack>
                    )}
                </Box>
                <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={24} color={color} />
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

// Header actions
const headerActions = (
    <Chip 
        label="Cập nhật: Tháng 12/2025"
        size="small"
        sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}
    />
);

export default function AdminReportsPage() {
    return (
        <MainCard 
            title="Báo cáo & Thống kê" 
            secondary={headerActions}
            contentSX={{ pt: 0 }}
        >
            {/* SUBTITLE */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, mt: 1 }}>
                Tổng quan về hoạt động thu phí và quản lý chung cư
            </Typography>

            {/* STAT CARDS */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                    <StatCard 
                        title="Tổng thu tháng này"
                        value="115M ₫"
                        change="+18.5%"
                        changeType="up"
                        icon={Wallet}
                        color="#22c55e"
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                    <StatCard 
                        title="Tổng số hộ dân"
                        value="256"
                        change="+4 hộ"
                        changeType="up"
                        icon={Users}
                        color="#3b82f6"
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                    <StatCard 
                        title="Phương tiện đăng ký"
                        value="412"
                        change="+12"
                        changeType="up"
                        icon={Car}
                        color="#a855f7"
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                    <StatCard 
                        title="Hộ nợ phí"
                        value="6"
                        change="-2"
                        changeType="up"
                        icon={AlertTriangle}
                        color="#f59e0b"
                    />
                </Box>
            </Stack>

            {/* ROW 1 — CHARTS */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                    <RevenueOverTimeChart />
                </Box>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                    <CollectionPerformanceChart />
                </Box>
            </Stack>

            {/* ROW 2 — CHARTS */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                    <FeeByCategoryChart />
                </Box>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                    <PaymentStatusBarChart />
                </Box>
            </Stack>

            {/* INSIGHTS SECTION */}
            <Card sx={{ 
                bgcolor: 'background.paper', 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider'
            }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Phân tích & Đề xuất
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ 
                                p: 2, 
                                borderRadius: 2, 
                                bgcolor: 'rgba(34, 197, 94, 0.08)',
                                borderLeft: '4px solid #22c55e'
                            }}>
                                <Typography variant="subtitle2" sx={{ color: '#22c55e', mb: 0.5 }}>
                                    Xu hướng tích cực
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Doanh thu tăng 18.5% so với tháng trước. Tỷ lệ thanh toán đúng hạn đạt 87%.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ 
                                p: 2, 
                                borderRadius: 2, 
                                bgcolor: 'rgba(59, 130, 246, 0.08)',
                                borderLeft: '4px solid #3b82f6'
                            }}>
                                <Typography variant="subtitle2" sx={{ color: '#3b82f6', mb: 0.5 }}>
                                    Đề xuất cải thiện
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Phí dịch vụ chiếm 45% tổng thu. Nên tối ưu chi phí bảo trì để tăng lợi nhuận.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ 
                                p: 2, 
                                borderRadius: 2, 
                                bgcolor: 'rgba(245, 158, 11, 0.08)',
                                borderLeft: '4px solid #f59e0b'
                            }}>
                                <Typography variant="subtitle2" sx={{ color: '#f59e0b', mb: 0.5 }}>
                                    Cần lưu ý
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    6 hộ đang nợ phí. Cần gửi nhắc nhở thanh toán để tránh phát sinh vấn đề.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </MainCard>
    );
}
