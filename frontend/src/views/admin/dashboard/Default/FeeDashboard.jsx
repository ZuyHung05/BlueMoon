import { Typography, Stack, useTheme } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { Box, Card, CardContent, Chip } from '@mui/material';

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

const overdueHouseholds = [
  { id: 'A120', name: 'Hộ A120', amount: '₫12.5M', days: 45 },
  { id: 'B304', name: 'Hộ B304', amount: '₫9.8M', days: 32 },
  { id: 'C210', name: 'Hộ C210', amount: '₫7.4M', days: 28 },
  { id: 'A512', name: 'Hộ A512', amount: '₫6.2M', days: 21 },
  { id: 'B118', name: 'Hộ B118', amount: '₫5.1M', days: 19 }
];

const badDebtTrend = [
  { month: 'Aug', value: 180 },
  { month: 'Sep', value: 210 },
  { month: 'Oct', value: 235 },
  { month: 'Nov', value: 260 },
  { month: 'Dec', value: 270 }
];


const recentPayments = [
  {
    household: 'A203',
    fee: 'Phí quản lý',
    amount: '₫1.2M',
    status: 'Đã thanh toán',
    date: '10/12/2025'
  },
  {
    household: 'B115',
    fee: 'Phí gửi xe',
    amount: '₫450K',
    status: 'Quá hạn',
    date: '08/12/2025'
  },
  {
    household: 'C308',
    fee: 'Phí bảo trì',
    amount: '₫2.5M',
    status: 'Đã thanh toán',
    date: '07/12/2025'
  },
  {
    household: 'A410',
    fee: 'Phí quản lý',
    amount: '₫1.2M',
    status: 'Chờ xử lý',
    date: '06/12/2025'
  }
];


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
      value="₫1.25B"
      subtitle="Toàn bộ kỳ hiện tại"
      icon={Wallet}
      color="#3b82f6"
      isDark={isDark}
    />
  </Box>

  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(20% - 19px)' } }}>
    <StatCard
      title="Đã thu"
      value="₫980M"
      subtitle="Đã thanh toán"
      change="+4.2%"
      changeType="up"
      icon={CheckCircle}
      color="#22c55e"
      isDark={isDark}
    />
  </Box>

  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(20% - 19px)' } }}>
    <StatCard
      title="Còn nợ"
      value="₫270M"
      subtitle="Chưa thanh toán"
      change="+2.1%"
      changeType="down"
      icon={AlertTriangle}
      color="#ef4444"
      isDark={isDark}
    />
  </Box>

  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(20% - 19px)' } }}>
    <StatCard
      title="Tỷ lệ thu"
      value="78.4%"
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
      {overdueHouseholds.map((h) => (
        <Box key={h.id}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={600}>{h.name}</Typography>
            <Typography color="error.main" fontWeight={700}>
              {h.amount}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Quá hạn {h.days} ngày
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
                width: `${Math.min(h.days, 60)}%`,
                height: '100%',
                borderRadius: 3,
                bgcolor: '#ef4444'
              }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  </MainCard>

  {/* Bad debt trend */}
  <MainCard title="Xu hướng nợ xấu" sx={{ flex: 1 }}>
    <Stack spacing={2}>
      {badDebtTrend.map((d, i) => (
        <Stack key={d.month} direction="row" justifyContent="space-between">
          <Typography variant="body2">{d.month}</Typography>
          <Typography fontWeight={600}>₫{d.value}M</Typography>
        </Stack>
      ))}

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

    {recentPayments.map((row, idx) => (
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
        <Box sx={{ flex: 1 }}>{row.household}</Box>
        <Box sx={{ flex: 1.5 }}>{row.fee}</Box>
        <Box sx={{ flex: 1, fontWeight: 600 }}>{row.amount}</Box>
        <Box sx={{ flex: 1 }}>
          <Chip
            size="small"
            label={row.status}
            color={
              row.status === 'Đã thanh toán'
                ? 'success'
                : row.status === 'Quá hạn'
                ? 'error'
                : 'warning'
            }
          />
        </Box>
        <Box sx={{ flex: 1 }}>{row.date}</Box>
      </Stack>
    ))}
  </Stack>
</MainCard>


    </MainCard>
  );
}

