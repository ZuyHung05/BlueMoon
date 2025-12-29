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

  const axisTextStyle = {
    fontSize: 12,
    fill: theme.palette.text.secondary
  };

  const axisLineStyle = {
    stroke: theme.palette.divider
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
          Hiệu suất đợt thu
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
              />

              <YAxis
                dataKey="cycle"
                type="category"
                tick={axisTextStyle} 
                axisLine={axisTextStyle}
                tickLine={axisTextStyle}
                width={90}
              />

              <Tooltip
                contentStyle={{ 
                  backgroundColor: theme.palette.background.paper, 
                  borderRadius: '8px',
                  border: `1px solid ${theme.palette.divider}`,
                  color: theme.palette.text.secondary
                }}
                itemStyle={{ color: theme.palette.text.secondary }}
                cursor={{ fill: theme.palette.action.hover }}
              />

              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{
                  paddingTop: '10px',
                  color: theme.palette.text.secondary 
                }}
              />

              <Bar
                dataKey="paid"
                name="Tỷ lệ thanh toán (%)"
                fill={COLORS.paid}
                barSize={15}
                radius={[0, 5, 5, 0]}
              />
              <Bar
                dataKey="avgDays"
                name="Số ngày thanh toán TB"
                fill={COLORS.avgDays}
                barSize={15}
                radius={[0, 5, 5, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
