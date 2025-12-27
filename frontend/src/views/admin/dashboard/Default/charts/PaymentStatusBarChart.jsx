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
              data={data}
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

