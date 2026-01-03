import { Typography, Stack, useTheme } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { Box, Card, CardContent, Chip, CircularProgress, Button } from '@mui/material';

import React from 'react';

import FeeByCategoryChart from './charts/FeeByCategoryChart';
import CollectionPerformanceChart from './charts/CollectionPerformanceChart';
import PaymentStatusBarChart from './charts/PaymentStatusBarChart';
import RevenueOverTimeChart from './charts/RevenueOverTimeChart';
import { Home, CreditCard } from 'lucide-react';

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';


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

export default function FeeDashboard() {
  const isDark = useTheme().palette.mode === 'dark';
  const [feeStats, setFeeStats] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Fetch fee stats from backend
  React.useEffect(() => {
    fetchFeeStats();
  }, []);

  const fetchFeeStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const { getFeeStats } = await import('api/dashboardService');
      const response = await getFeeStats();
      if (response.data) {
        setFeeStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching fee stats:', err);
      setError('Không thể tải dữ liệu thu phí. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainCard contentSX={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  if (error) {
    return (
      <MainCard contentSX={{ p: 3 }}>
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
      </MainCard>
    );
  }

  if (!feeStats) {
    return null;
  }

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '₫0';
    return `₫${(value / 1000000).toFixed(1)}M`;
  };

  return (
    <MainCard contentSX={{ p: 3 }}>
      {/* Header */}
      <Stack
  direction={{ xs: 'column', md: 'row' }}
  justifyContent="space-between"
  alignItems={{ md: 'center' }}
  spacing={2}
  sx={{ mb: 3 }}
>
  <Box>
    <Typography variant="h3" fontWeight={800}>
      Dashboard thu phí
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Tổng quan tài chính và trạng thái thanh toán
    </Typography>
  </Box>

  <Stack direction="row" spacing={1}>
    <Chip label="Tháng 12/2025" />
    <Chip label="Xuất báo cáo" variant="outlined" />
  </Stack>
</Stack>

{/* KPI STRIP */}
<Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>

  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(20% - 19px)' } }}>
    <StatCard
      title="Tổng phải thu"
      value={formatCurrency(feeStats.totalAmount)}
      subtitle="Toàn bộ kỳ hiện tại"
      icon={Wallet}
      color="#3b82f6"
      isDark={isDark}
    />
  </Box>

  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(20% - 19px)' } }}>
    <StatCard
      title="Đã thu"
      value={formatCurrency(feeStats.paidAmount)}
      subtitle="Đã thanh toán"
      change={feeStats.paidAmountChange ? `${feeStats.paidAmountChange > 0 ? '+' : ''}${feeStats.paidAmountChange.toFixed(1)}%` : undefined}
      changeType={feeStats.paidAmountChange > 0 ? "up" : "down"}
      icon={CheckCircle}
      color="#22c55e"
      isDark={isDark}
    />
  </Box>

  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(20% - 19px)' } }}>
    <StatCard
      title="Còn nợ"
      value={formatCurrency(feeStats.unpaidAmount)}
      subtitle="Chưa thanh toán"
      change={feeStats.unpaidAmountChange ? `${feeStats.unpaidAmountChange > 0 ? '+' : ''}${feeStats.unpaidAmountChange.toFixed(1)}%` : undefined}
      changeType={feeStats.unpaidAmountChange > 0 ? "down" : "up"}
      icon={AlertTriangle}
      color="#ef4444"
      isDark={isDark}
    />
  </Box>

  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(20% - 19px)' } }}>
    <StatCard
      title="Tỷ lệ thu"
      value={`${(feeStats.collectionRate || 0).toFixed(1)}%`}
      subtitle="So với tổng phải thu"
      icon={TrendingUp}
      color="#f59e0b"
      isDark={isDark}
    />
  </Box>

</Stack>



      {/* Charts */}
<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
  <Box sx={{ flex: 2 }}>
    <CollectionPerformanceChart />
  </Box>

  <Box sx={{ flex: 1 }}>
    <FeeByCategoryChart />
  </Box>
</Stack>


{/* RISK SECTION */}
<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
  {/* Overdue households */}
  <MainCard title="Hộ quá hạn nghiêm trọng" sx={{ flex: 1 }}>
    <Stack spacing={2}>
      {feeStats.overdueHouseholds && feeStats.overdueHouseholds.length > 0 ? (
        feeStats.overdueHouseholds.map((h) => (
          <Box key={h.id}>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>{h.name || h.householdName}</Typography>
              <Typography color="error.main" fontWeight={700}>
                {formatCurrency(h.amount)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Quá hạn {h.days || h.overdueDays} ngày
              </Typography>
              <Chip
                size="small"
                label="Nguy cơ cao"
                color="error"
                variant="outlined"
              />
            </Stack>

            {/* risk bar */}
            <Box
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(239,68,68,0.15)',
                mt: 1
              }}
            >
              <Box
                sx={{
                  width: `${Math.min((h.days || h.overdueDays), 60)}%`,
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: '#ef4444'
                }}
              />
            </Box>
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
          Không có hộ quá hạn
        </Typography>
      )}
    </Stack>
  </MainCard>

  {/* Bad debt trend */}
  <MainCard title="Xu hướng nợ xấu" sx={{ flex: 1 }}>
    <Stack spacing={2}>
      {feeStats.badDebtTrend && feeStats.badDebtTrend.length > 0 ? (
        feeStats.badDebtTrend.map((d, i) => (
          <Stack key={i} direction="row" justifyContent="space-between">
            <Typography variant="body2">{d.month}</Typography>
            <Typography fontWeight={600}>₫{d.value}M</Typography>
          </Stack>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
          Chưa có dữ liệu xu hướng
        </Typography>
      )}

      {/* mini area chart placeholder */}
      <Box
        sx={{
          height: 120,
          borderRadius: 2,
          bgcolor: 'rgba(239,68,68,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          (Area chart – nợ xấu theo thời gian)
        </Typography>
      </Box>
    </Stack>
  </MainCard>
</Stack>



{/* RECENT ACTIVITY TABLE */}
<MainCard title="Hoạt động thu phí gần đây">
  <Stack spacing={1.5}>
    {/* header */}
    <Stack direction="row" sx={{ fontWeight: 700 }}>
      <Box sx={{ flex: 1 }}>Hộ</Box>
      <Box sx={{ flex: 1.5 }}>Loại phí</Box>
      <Box sx={{ flex: 1 }}>Số tiền</Box>
      <Box sx={{ flex: 1 }}>Trạng thái</Box>
      <Box sx={{ flex: 1 }}>Ngày</Box>
    </Stack>

    {feeStats.recentPayments && feeStats.recentPayments.length > 0 ? (
      feeStats.recentPayments.map((row, idx) => (
        <Stack
          key={idx}
          direction="row"
          alignItems="center"
          sx={{
            py: 1,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ flex: 1 }}>{row.household || row.householdName}</Box>
          <Box sx={{ flex: 1.5 }}>{row.fee || row.feeType}</Box>
          <Box sx={{ flex: 1, fontWeight: 600 }}>{formatCurrency(row.amount)}</Box>
          <Box sx={{ flex: 1 }}>
            <Chip
              size="small"
              label={row.status}
              color={
                row.status === 'Đã thanh toán' || row.status === 'PAID'
                  ? 'success'
                  : row.status === 'Quá hạn' || row.status === 'OVERDUE'
                  ? 'error'
                  : 'warning'
              }
            />
          </Box>
          <Box sx={{ flex: 1 }}>{row.date || new Date(row.paymentDate).toLocaleDateString('vi-VN')}</Box>
        </Stack>
      ))
    ) : (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
        Chưa có hoạt động thu phí gần đây
      </Typography>
    )}
  </Stack>
</MainCard>


    </MainCard>
  );
}

