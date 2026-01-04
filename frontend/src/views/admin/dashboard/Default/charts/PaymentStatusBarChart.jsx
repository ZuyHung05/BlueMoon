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

const COLORS = ['#43A047', '#E53935', '#8E24AA'];

export default function PaymentStatusBarChart({ data }) {
  const theme = useTheme();

  // Use data from props or default mock data
  const chartData = data && data.paymentStatus ? [
    { status: 'Đã thanh toán', count: data.paymentStatus.paid || 0 },
    { status: 'Chưa thanh toán', count: data.paymentStatus.unpaid || 0 },
    { status: 'Trễ hạn', count: data.paymentStatus.overdue || 0 }
  ] : [
    { status: 'Đã thanh toán', count: 224 },
    { status: 'Chưa thanh toán', count: 32 },
    { status: 'Trễ hạn', count: 6 }
  ];

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
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
          Trạng thái thanh toán
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer key={theme.palette.mode}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3"
                stroke={theme.palette.text.secondary}
                strokeOpacity={0.7}
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
                  backgroundColor: theme.palette.background.paper, 
                  borderRadius: '8px',
                  border: `1px solid ${theme.palette.divider}`,
                  color: theme.palette.text.secondary
                }}
                itemStyle={{ color: theme.palette.text.secondary }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{
                  paddingTop: '10px',
                  color: theme.palette.text.secondary 
                }}
              />
              <Bar dataKey="count" name="Số hộ">
                {chartData.map((entry, index) => (
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

