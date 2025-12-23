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
  Legend,
  Cell
} from 'recharts';

// Replace with API later
const data = [
  { status: 'Chưa thanh toán', count: 32 },
  { status: 'Đang chờ xác nhận', count: 18 },
  { status: 'Đã thanh toán', count: 224 },
  { status: 'Trễ hạn', count: 6 }
];

const COLORS = ['#E53935', '#FB8C00', '#43A047', '#8E24AA'];

export default function PaymentStatusBarChart() {
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
          Trạng thái thanh toán
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3"
                stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              />
              <XAxis 
                dataKey="status" 
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              />
              <Tooltip
                formatter={(value) => [`${value} hộ`, 'Số lượng']}
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
              <Bar dataKey="count" name="Số hộ">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

