import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Stack, Chip, useTheme, Button } from '@mui/material';
import { TrendingUp, TrendingDown, Users, Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { getFeeStats } from 'api/dashboardService';

// Import chart components
import FeeByCategoryChart from './charts/FeeByCategoryChart';
import CollectionPerformanceChart from './charts/CollectionPerformanceChart';
import PaymentStatusBarChart from './charts/PaymentStatusBarChart';
import RevenueOverTimeChart from './charts/RevenueOverTimeChart';
import ResidentDashboard from './ResidentDashboard';
import DashboardSkeleton from './DashboardSkeleton';
import { Home, CreditCard } from 'lucide-react';

const TabButton = ({ title, description, icon: Icon, color, isActive, onClick, isDark }) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                cursor: 'pointer',
                height: '100%',
                borderRadius: 3,
                border: '2px solid',
                borderColor: isActive
                    ? color
                    : (isDark ? 'rgba(255,255,255,0.1)' : 'divider'),
                bgcolor: isActive
                    ? (isDark ? `${color}20` : `${color}10`)
                    : (isDark ? 'rgba(30, 41, 59, 0.7)' : 'background.paper'),
                backdropFilter: isDark ? 'blur(10px)' : 'none',
                transition: 'all 0.25s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: isDark
                        ? '0 10px 30px rgba(0,0,0,0.4)'
                        : '0 10px 30px rgba(0,0,0,0.15)',
                    borderColor: color
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

    // Get user role from localStorage
    const userRole = localStorage.getItem('role')?.toLowerCase();

    // Determine initial tab based on role
    const getInitialTab = () => {
        if (userRole === 'accountant') return 'fee';
        if (userRole === 'manager') return 'resident';
        return 'fee'; // default for admin
    };

    const [activeTab, setActiveTab] = useState(getInitialTab());
    const [feeStats, setFeeStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check if user should see tabs (only admin)
    const shouldShowTabs = userRole === 'admin';

    // Fetch fee stats from backend
    useEffect(() => {
        if (activeTab === 'fee') {
            fetchFeeStats();
        }
    }, [activeTab]);

    const fetchFeeStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getFeeStats();
            if (response.data) {
                setFeeStats(response.data);
            }
        } catch (err) {
            console.error('Error fetching fee stats:', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainCard
            title={shouldShowTabs ? "Tổng quan" : (activeTab === 'fee' ? "Dashboard Thu Phí" : "Dashboard Cư Dân")}
            darkTitle
            secondary={headerActions}
            contentSX={{ pt: 0 }}
        >
            {/* SUBTITLE - Only for admin */}
            {shouldShowTabs && (
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
            )}

            {/* TAB BUTTONS - Only visible for admin */}
            {shouldShowTabs && (
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={3}
                    sx={{ mb: 4 }}
                >
                    <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                        <TabButton
                            title="Quản lý thu phí"
                            description="Quản lý các khoản phí, hóa đơn và trạng thái thanh toán"
                            icon={CreditCard}
                            color="#3b82f6"
                            isActive={activeTab === 'fee'}
                            onClick={() => setActiveTab('fee')}
                            isDark={isDark}
                        />
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                        <TabButton
                            title="Quản lý cư dân"
                            description="Quản lý thông tin cư dân, hộ gia đình và cư trú"
                            icon={Home}
                            color="#22c55e"
                            isActive={activeTab === 'resident'}
                            onClick={() => setActiveTab('resident')}
                            isDark={isDark}
                        />
                    </Box>
                </Stack>
            )}

            {/* CONDITIONAL CONTENT BASED ON ACTIVE TAB */}
            {activeTab === 'fee' ? (
                <>
                    {/* FEE DASHBOARD CONTENT */}
                    {loading ? (
                        <DashboardSkeleton />
                    ) : error ? (
                        <Box sx={{
                            p: 4,
                            textAlign: 'center',
                            bgcolor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: '#ef4444'
                        }}>
                            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: 16 }} />
                            <Typography variant="h5" sx={{ mb: 1, color: '#ef4444' }}>
                                {error}
                            </Typography>
                            <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : 'text.secondary', mb: 2 }}>
                                Vui lòng thử lại sau hoặc liên hệ quản trị viên
                            </Typography>
                            <Button variant="contained" onClick={fetchFeeStats}>
                                Thử lại
                            </Button>
                        </Box>
                    ) : feeStats ? (
                        <>
                            {/* STAT CARDS */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
                                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                                    <StatCard
                                        title="Tổng số hộ gia đình"
                                        value={feeStats.totalHouseholds?.toString() || '0'}
                                        subtitle="Hộ đang sinh sống tại chung cư"
                                        icon={Users}
                                        color="#3b82f6"
                                        isDark={isDark}
                                    />
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                                    <StatCard
                                        title="Hộ đã thanh toán"
                                        value={feeStats.paidHouseholds?.toString() || '0'}
                                        subtitle="Hộ đã hoàn tất thanh toán trong kỳ này"
                                        icon={CheckCircle2}
                                        color="#22c55e"
                                        isDark={isDark}
                                    />
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                                    <StatCard
                                        title="Hộ còn nợ phí"
                                        value={feeStats.overdueHouseholdCount?.toString() || '0'}
                                        subtitle="Hộ quá hạn thanh toán"
                                        icon={AlertTriangle}
                                        color="#ef4444"
                                        isDark={isDark}
                                    />
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                                    <StatCard
                                        title="Hộ chưa thanh toán"
                                        value={feeStats.unpaidHouseholds?.toString() || '0'}
                                        subtitle="Hộ chưa thanh toán trong kỳ"
                                        icon={Wallet}
                                        color="#f59e0b"
                                        isDark={isDark}
                                    />
                                </Box>
                            </Stack>

                            {/* ROW 1 — CHARTS */}
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
                                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                                    <FeeByCategoryChart data={feeStats.feesByCategory} />
                                </Box>
                                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                                    <CollectionPerformanceChart data={feeStats.feesByCategory} />
                                </Box>
                            </Stack>

                            {/* ROW 2 — CHARTS */}
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                                    <PaymentStatusBarChart data={feeStats} />
                                </Box>
                                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, minWidth: 0 }}>
                                    <RevenueOverTimeChart data={feeStats.revenueOverTime} />
                                </Box>
                            </Stack>
                        </>
                    ) : null}
                </>
            ) : (
                <>
                    {/* RESIDENT DASHBOARD CONTENT */}
                    <ResidentDashboard />
                </>
            )}
        </MainCard>
    );
}
