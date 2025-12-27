import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data (replace with real backend response)
const data = [
  { name: 'Tháng 1', revenue: 45000000 },
  { name: 'Tháng 2', revenue: 52000000 },
  { name: 'Tháng 3', revenue: 48000000 },
  { name: 'Tháng 4', revenue: 62000000 },
  { name: 'Tháng 5', revenue: 73000000 },
  { name: 'Tháng 6', revenue: 81000000 },
  { name: 'Tháng 7', revenue: 76000000 },
  { name: 'Tháng 8', revenue: 88000000 },
  { name: 'Tháng 9', revenue: 94000000 },
  { name: 'Tháng 10', revenue: 102000000 },
  { name: 'Tháng 11', revenue: 97000000 },
  { name: 'Tháng 12', revenue: 115000000 }
];

export default function RevenueOverTimeChart() {
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
          Tổng thu theo thời gian
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer key={theme.palette.mode}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3"
                stroke={theme.palette.text.secondary}
                strokeOpacity={0.7}
              />

              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
              />

              <Tooltip
                formatter={(value) => [`${value.toLocaleString()} ₫`, 'Tổng thu']}
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

              <Line
                type="monotone"
                dataKey="revenue"
                name="Tổng thu (₫)"
                stroke="#3b82f6"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

