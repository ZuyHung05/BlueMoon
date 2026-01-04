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

// Mock data - Replace with API later
const data = [
  { feeType: 'Phí quản lý', amount: 450, color: '#3b82f6' },
  { feeType: 'Phí gửi xe', amount: 285, color: '#22c55e' },
  { feeType: 'Phí dịch vụ', amount: 198, color: '#f59e0b' },
  { feeType: 'Phí bảo trì', amount: 142, color: '#8b5cf6' },
  { feeType: 'Phí điện nước', amount: 125, color: '#ef4444' }
];

export default function CollectionPerformanceChart() {
  const theme = useTheme();

  const axisTextStyle = {
    fontSize: 12,
    fill: theme.palette.text.secondary
  };

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
          Top 5 loại phí thu nhiều nhất
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tổng thu theo từng loại phí (triệu đồng)
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer key={theme.palette.mode}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.text.secondary} 
                strokeOpacity={0.7}
                vertical={true}
                horizontal={false}
              />

              <XAxis 
                type="number"
                tick={axisTextStyle} 
                axisLine={axisTextStyle}
                tickLine={axisTextStyle}
                label={{ 
                  value: 'Triệu đồng', 
                  position: 'insideBottom', 
                  offset: -5,
                  style: { fill: theme.palette.text.secondary, fontSize: 12 }
                }}
              />

              <YAxis
                dataKey="feeType"
                type="category"
                tick={axisTextStyle} 
                axisLine={axisTextStyle}
                tickLine={axisTextStyle}
                width={110}
              />

              <Tooltip
                formatter={(value) => [`${value}M ₫`, 'Tổng thu']}
                contentStyle={{ 
                  backgroundColor: theme.palette.background.paper, 
                  borderRadius: '8px',
                  border: `1px solid ${theme.palette.divider}`,
                  color: theme.palette.text.secondary
                }}
                itemStyle={{ color: theme.palette.text.secondary }}
                cursor={{ fill: theme.palette.action.hover }}
              />

              <Bar
                dataKey="amount"
                name="Tổng thu (triệu đồng)"
                barSize={25}
                radius={[0, 8, 8, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
