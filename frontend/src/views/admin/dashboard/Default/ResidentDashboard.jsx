import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Card,
    CardContent,
    Chip,
    useTheme
} from '@mui/material';
import {
    Users,
    Home,
    Car,
    ParkingCircle
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';


import { TrendingUp, TrendingDown, Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';

import MainCard from 'ui-component/cards/MainCard';

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

    return (
        <MainCard contentSX={{ p: 3 }}>
            {/* HEADER */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ md: 'center' }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h3" fontWeight={800}>
                        Quản lý cư dân & phương tiện
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Tổng quan cư trú, hộ gia đình và xe đăng ký
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Chip label="Tháng 12/2025" />
                    <Chip label="Xuất danh sách" variant="outlined" />
                </Stack>
            </Stack>

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
      value="342 / 360"
      icon={Home}
      color="#3b82f6"
    />
  </Box>

  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
    <StatCard
      title="Cư dân hiện tại"
      value="1,124"
      icon={Users}
      color="#22c55e"
    />
  </Box>

  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
    <StatCard
      title="Xe đã đăng ký"
      value="486 / 520"
      icon={Car}
      color="#f59e0b"
    />
  </Box>

  <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
    <StatCard
      title="Bãi xe sử dụng"
      value="78%"
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

    {/* Visual summary area */}
    <Box
      sx={{
        mt: 2,
        height: 120,
        borderRadius: 3,
        bgcolor: 'rgba(59,130,246,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <Typography variant="body2" fontWeight={600}>
        Tổng số căn hộ
      </Typography>
      <Typography variant="h4" fontWeight={800} color="#3b82f6">
        360 căn
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Phân bố theo quy mô sinh hoạt
      </Typography>
    </Box>
  </Stack>
</MainCard>



           {/* CHART ROW 2 */}
<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
  <MainCard title="Mật độ cư trú theo tầng" sx={{ flex: 2 }}>
  <Stack spacing={2}>
    {floorOccupancy.map((f) => (
      <Box key={f.range}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={600}>{f.range}</Typography>
          <Typography
            fontWeight={600}
            color={f.used > 85 ? 'error.main' : 'text.secondary'}
          >
            {f.used}%
          </Typography>
        </Stack>

        <Box
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: 'rgba(0,0,0,0.12)',
            mt: 0.5
          }}
        >
          <Box
            sx={{
              width: `${f.used}%`,
              height: '100%',
              borderRadius: 5,
              bgcolor: f.used > 85 ? '#ef4444' : '#3b82f6'
            }}
          />
        </Box>
      </Box>
    ))}
  </Stack>
</MainCard>

<MainCard title="Tình trạng bãi đỗ xe" sx={{ flex: 1 }}>
  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
    Phân bố ô tô theo từng tầng hầm
  </Typography>

  <Box sx={{ width: '100%', height: 240 }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={carParkByFloor}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
        >
          <Cell fill="#ef4444" /> {/* B1 */}
          <Cell fill="#f59e0b" /> {/* B2 */}
          <Cell fill="#22c55e" /> {/* B3 */}
        </Pie>

        <Tooltip formatter={(value) => [`${value} xe`, 'Số lượng']} />

        <Legend
          verticalAlign="bottom"
          formatter={(value) => (
            <Typography variant="caption">{value}</Typography>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  </Box>

  {/* Summary */}
  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
    <Typography variant="caption">Tổng: 148 xe</Typography>
    <Typography variant="caption">Sức chứa: 180</Typography>
    <Typography variant="caption" color="warning.main">
      82% sử dụng
    </Typography>
  </Stack>
</MainCard>

 
</Stack>

<MainCard title="Hoạt động gần đây">
  <Stack spacing={2}>
    {[
      'Hộ A120 đăng ký thêm ô tô',
      'Cư dân B304 chuyển đi',
      'Hộ C210 thêm 1 xe máy',
      'Cập nhật thông tin cư trú Block A'
    ].map((text, idx) => (
      <Stack key={idx} direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: '#3b82f6'
          }}
        />
        <Typography variant="body2">{text}</Typography>
      </Stack>
    ))}
  </Stack>
</MainCard>

        </MainCard>
    );
}
