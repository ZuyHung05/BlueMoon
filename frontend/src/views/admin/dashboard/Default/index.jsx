import React from 'react';
import { Box, Typography, Card, CardContent, Stack, Chip, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown, Users, Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// Import chart components
import FeeByCategoryChart from './charts/FeeByCategoryChart';
import CollectionPerformanceChart from './charts/CollectionPerformanceChart';
import PaymentStatusBarChart from './charts/PaymentStatusBarChart';
import RevenueOverTimeChart from './charts/RevenueOverTimeChart';
import { Home, CreditCard } from 'lucide-react';

const ActionCard = ({ title, description, icon: Icon, color, to, isDark }) => {
    const navigate = useNavigate();

    return (
        <Card
            onClick={() => navigate(to)}
            sx={{
                cursor: 'pointer',
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'divider',
                bgcolor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'background.paper',
                backdropFilter: isDark ? 'blur(10px)' : 'none',
                transition: 'all 0.25s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: isDark
                        ? '0 10px 30px rgba(0,0,0,0.4)'
                        : '0 10px 30px rgba(0,0,0,0.15)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: `${color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Icon size={28} color={color} />
                    </Box>

                    <Box>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: isDark ? '#fff' : 'text.primary' }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: isDark ? '#94a3b8' : 'text.secondary' }}
                        >
                            {description}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};




// Stat Card Component (same as Report page)
const StatCard = ({ title, value, subtitle, change, changeType, icon: Icon, color, isDark }) => (
    <Card sx={{ 
        bgcolor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'background.paper', 
        borderRadius: 3,
        border: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'divider',
        height: '100%',
        backdropFilter: isDark ? 'blur(10px)' : 'none'
    }}>
        <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            mb: 0.5, 
                            fontWeight: 600, 
                            color: isDark ? '#ffffff' : 'text.secondary',
                            opacity: isDark ? 0.9 : 1
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ color, fontSize: '2.2rem' }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                mt: 0.5, 
                                color: isDark ? '#cbd5e1' : 'text.secondary',
                                fontWeight: 400
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                    {change && (
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.5 }}>
                            {changeType === 'up' ? (
                                <TrendingUp size={16} color="#4ade80" />
                            ) : (
                                <TrendingDown size={16} color="#f87171" />
                            )}
                            <Typography variant="body2" sx={{ color: changeType === 'up' ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                                {change}
                            </Typography>
                        </Stack>
                    )}
                </Box>
                <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: isDark ? `${color}30` : `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={30} color={isDark ? '#ffffff' : color} />
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

// ==============================|| BAN QUẢN LÝ DASHBOARD PAGE ||============================== //

export default function Dashboard() {
    const isDark = useTheme().palette.mode === 'dark';

    return (
        <MainCard 
            title="Tổng quan"
            darkTitle
            secondary={headerActions}
            contentSX={{ pt: 0 }}
        >
            {/* SUBTITLE */}
            <Typography 
                variant="body2" 
                sx={{ 
                    mb: 3, 
                    mt: 1, 
                    color: isDark ? '#94a3b8' : 'text.secondary' 
                }}
            >
                Tổng quan về hoạt động thu phí và quản lý chung cư
            </Typography>

            {/* ACTION CARDS */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
                sx={{ mb: 4 }}
            >   
            
                <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <ActionCard
                        title="Quản lý thu phí"
                        description="Quản lý các khoản phí, hóa đơn và trạng thái thanh toán"
                        icon={CreditCard}
                        color="#3b82f6"
                        to="/default-fee"
                        isDark={isDark}
                    />
                </Box>

                <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <ActionCard
                        title="Quản lý cư dân"
                        description="Quản lý thông tin cư dân, hộ gia đình và cư trú"
                        icon={Home}
                        color="#22c55e"
                        to="/resident"
                        isDark={isDark}
                    />
                </Box>
            </Stack>

            {/* STAT CARDS */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                    <StatCard 
                        title="Tổng số hộ gia đình"
                        value="342"
                        subtitle="Hộ đang sinh sống tại chung cư"
                        change="+5 hộ mới"
                        changeType="up"
                        icon={Users}
                        color="#3b82f6"
                        isDark={isDark}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                    <StatCard 
                        title="Hộ đã thanh toán"
                        value="224"
                        subtitle="Hộ đã hoàn tất thanh toán trong kỳ này"
                        change="+10 hôm nay"
                        changeType="up"
                        icon={CheckCircle2}
                        color="#22c55e"
                        isDark={isDark}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                    <StatCard 
                        title="Hộ còn nợ phí"
                        value="12"
                        subtitle="Hộ chưa thanh toán trong kỳ hiện tại"
                        change="+2 hôm nay"
                        changeType="down"
                        icon={AlertTriangle}
                        color="#ef4444"
                        isDark={isDark}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                    <StatCard 
                        title="Hộ chưa thanh toán"
                        value="32"
                        subtitle="Hộ còn nợ phí kỳ hiện tại"
                        change="+3 hôm nay"
                        changeType="down"
                        icon={Wallet}
                        color="#f59e0b"
                        isDark={isDark}
                    />
                </Box>
            </Stack>

            {/* ROW 1 — CHARTS */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                    <FeeByCategoryChart />
                </Box>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                    <CollectionPerformanceChart />
                </Box>
            </Stack>

            {/* ROW 2 — CHARTS */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                    <PaymentStatusBarChart />
                </Box>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                    <RevenueOverTimeChart />
                </Box>
            </Stack>
        </MainCard>
    );
}

