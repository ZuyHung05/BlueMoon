import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { translateFeeDescription } from 'utils/feeUtils';

// Color palette for bars
const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function CollectionPerformanceChart({ data = [] }) {
  const theme = useTheme();

  const axisTextStyle = {
    fontSize: 12,
    fill: theme.palette.text.secondary
  };

  // Transform data for horizontal bar chart (convert to millions)
  const chartData = data.map((item, index) => ({
    feeType: translateFeeDescription(item.name || item.category || 'N/A'),
    amount: (item.amount || 0) / 1000000, // Convert to millions
    color: item.color || COLORS[index % COLORS.length]
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
            Tổng thu theo từng loại phí
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tổng thu theo từng loại phí (triệu đồng)
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
          Tổng thu theo từng loại phí
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tổng thu theo từng loại phí (triệu đồng)
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer key={theme.palette.mode}>
            <BarChart
              layout="vertical"
              data={chartData}
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
                tickFormatter={(value) => `${value.toFixed(0)}`}
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
                formatter={(value) => [`${value.toFixed(1)}M ₫`, 'Tổng thu']}
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
                {chartData.map((entry, index) => (
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

CollectionPerformanceChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    amount: PropTypes.number,
    color: PropTypes.string
  }))
};
