import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  useTheme,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Users,
  Home,
  Car,
  ParkingCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Wallet,
  CheckCircle2,
  UserPlus,
  UserMinus
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';


import MainCard from 'ui-component/cards/MainCard';
import VehicleTypePieChart from './charts/VehicleTypePieChart';

const apartmentComposition = [
  {
    label: 'Gia đình nhỏ',
    percent: 52,
    color: '#3b82f6',
    hint: '1–2 người / căn'
  },
  {
    label: 'Gia đình lớn',
    percent: 31,
    color: '#22c55e',
    hint: '3–5 người / căn'
  },
  {
    label: 'Cá nhân',
    percent: 17,
    color: '#f59e0b',
    hint: '1 người / căn'
  }
];


const householdData = [
  { name: 'Gia đình nhỏ', value: 52 },
  { name: 'Gia đình lớn', value: 31 },
  { name: 'Cá nhân', value: 17 }
];

const vehicleData = [
  { type: 'Xe máy', value: 62 },
  { type: 'Ô tô', value: 28 },
  { type: 'Khác', value: 10 }
];

const carParkByFloor = [
  { name: 'Tầng B1', value: 68 }, // 68 cars
  { name: 'Tầng B2', value: 52 },
  { name: 'Tầng B3', value: 28 }
];

const floorOccupancy = [
  { range: 'Tầng 1–5', used: 95 },
  { range: 'Tầng 6–10', used: 88 },
  { range: 'Tầng 11–15', used: 72 },
  { range: 'Tầng 16–20', used: 60 }
];

const parkingSummary = [
  { label: 'Ô tô', used: 148, total: 180 },
  { label: 'Xe máy', used: 338, total: 420 }
];

const apartmentTypeUsage = [
  { type: '1PN', used: 110, total: 120 },
  { type: '2PN', used: 145, total: 160 },
  { type: '3PN', used: 72, total: 80 }
];

/* ====================== KPI CARD ====================== */
const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}20`
          }}
        >
          <Icon size={26} color={color} />
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

/* ====================== DASHBOARD ====================== */
export default function ResidentDashboard() {
  const isDark = useTheme().palette.mode === 'dark';
  const [residentStats, setResidentStats] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Fetch resident stats from backend
  React.useEffect(() => {
    fetchResidentStats();
  }, []);

  const fetchResidentStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const { getResidentStats } = await import('api/dashboardService');
      const response = await getResidentStats();
      if (response.data) {
        setResidentStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching resident stats:', err);
      setError('Không thể tải dữ liệu cư dân. Vui lòng thử lại sau.');
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
          <Button variant="contained" onClick={fetchResidentStats}>
            Thử lại
          </Button>
        </Box>
      </MainCard>
    );
  }

  if (!residentStats) {
    return null;
  }

  return (
    <MainCard contentSX={{ p: 3 }}>


      {/* STAT CARDS – SINGLE APARTMENT */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{ mb: 3 }}
        flexWrap="wrap"
        useFlexGap
      >
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <StatCard
            title="Hộ đang cư trú"
            value={`${residentStats.totalHouseholds || 0}`}
            icon={Home}
            color="#3b82f6"
          />
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <StatCard
            title="Cư dân hiện tại"
            value={residentStats.totalResidents?.toLocaleString() || '0'}
            icon={Users}
            color="#22c55e"
          />
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <StatCard
            title="Xe đã đăng ký"
            value={`${residentStats.totalVehicles || 0} / ${residentStats.totalParkingSpots || 0}`}
            icon={Car}
            color="#f59e0b"
          />
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <StatCard
            title="Bãi xe sử dụng"
            value={`${residentStats.parkingUsagePercent || 0}%`}
            icon={ParkingCircle}
            color="#ef4444"
          />
        </Box>
      </Stack>


      <MainCard title="Cơ cấu căn hộ" sx={{ flex: 1 }}>
        <Stack spacing={3}>
          {apartmentComposition.map((item) => (
            <Box key={item.label}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography fontWeight={600}>{item.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.hint}
                  </Typography>
                </Box>

                <Typography fontWeight={700}>
                  {item.percent}%
                </Typography>
              </Stack>

              {/* Progress bar */}
              <Box
                sx={{
                  mt: 1,
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'rgba(255,255,255,0.12)'
                }}
              >
                <Box
                  sx={{
                    width: `${item.percent}%`,
                    height: '100%',
                    borderRadius: 5,
                    bgcolor: item.color
                  }}
                />
              </Box>
            </Box>
          ))}


        </Stack>
      </MainCard>






      {/* CHART ROW 2 - Temporary Residence & Vehicle Types */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
        {/* Temporary Residence Stats */}
        <MainCard title="Thống kê tạm trú / tạm vắng" sx={{ flex: 1 }}>
          <Stack spacing={3}>
            {/* Tam tru */}
            <Box sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.05)',
              border: '1px solid rgba(34,197,94,0.2)'
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(34,197,94,0.2)',
                  display: 'flex'
                }}>
                  <UserPlus size={24} color="#22c55e" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Đang tạm trú</Typography>
                  <Typography variant="h4" fontWeight={700} color="#22c55e">
                    {residentStats.temporaryStayCount || 0}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Tam vang */}
            <Box sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.2)'
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(239,68,68,0.2)',
                  display: 'flex'
                }}>
                  <UserMinus size={24} color="#ef4444" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Đang tạm vắng</Typography>
                  <Typography variant="h4" fontWeight={700} color="#ef4444">
                    {residentStats.temporaryAbsenceCount || 0}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
              Số liệu cập nhật theo thời gian thực
            </Typography>
          </Stack>
        </MainCard>

        {/* Vehicle Type Distribution */}
        <Box sx={{ flex: 1 }}>
          <VehicleTypePieChart data={residentStats.vehicleTypeDistribution} />
        </Box>
      </Stack>

    </MainCard>
  );
}
