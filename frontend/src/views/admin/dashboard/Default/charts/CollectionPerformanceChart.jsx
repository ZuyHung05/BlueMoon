import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data — replace with API later
const data = [
  { cycle: 'Tháng 1', paid: 85, avgDays: 3.2 },
  { cycle: 'Tháng 2', paid: 78, avgDays: 4.1 },
  { cycle: 'Tháng 3', paid: 92, avgDays: 2.5 },
  { cycle: 'Tháng 4', paid: 88, avgDays: 3.7 }
];

const COLORS = {
  paid: '#42A5F5',
  avgDays: '#66BB6A'
};

export default function CollectionPerformanceChart() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        boxShadow: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom color="text.primary" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
          Hiệu suất đợt thu
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
              />

              <XAxis 
                type="number"
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis
                dataKey="cycle"
                type="category"
                tick={{ fontSize: 13, fill: theme.palette.text.secondary }}
                width={90}
              />

              <Tooltip
                formatter={(value, name) =>
                  name === 'avgDays'
                    ? [`${value} ngày`, 'Thời gian thanh toán TB']
                    : [`${value}% hộ`, 'Tỷ lệ thanh toán']
                }
                contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#fff', 
                  borderRadius: '8px',
                  border: `1px solid ${theme.palette.divider}`,
                  color: theme.palette.text.primary
                }}
              />

              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span style={{ color: theme.palette.text.primary }}>{value}</span>}
              />

              <Bar
                dataKey="paid"
                name="Tỷ lệ thanh toán (%)"
                fill={COLORS.paid}
                barSize={15}
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="avgDays"
                name="Số ngày thanh toán TB"
                fill={COLORS.avgDays}
                barSize={15}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

