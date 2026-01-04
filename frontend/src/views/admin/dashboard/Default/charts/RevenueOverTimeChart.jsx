import React from 'react';
import PropTypes from 'prop-types';
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

export default function RevenueOverTimeChart({ data = [] }) {
  const theme = useTheme();

  // Transform data for line chart
  const chartData = data.map(item => ({
    name: item.name || item.month || 'N/A',
    revenue: item.revenue || item.amount || 0
  }));

  // Show placeholder if no data
  if (!data.length) {
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
            Tổng thu 12 tháng gần nhất
          </Typography>
          <Box sx={{ width: '100%', height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Không có dữ liệu</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

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
          Tổng thu 12 tháng gần nhất
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer key={theme.palette.mode}>
            <LineChart
              data={chartData}
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

RevenueOverTimeChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    month: PropTypes.string,
    revenue: PropTypes.number,
    amount: PropTypes.number
  }))
};
