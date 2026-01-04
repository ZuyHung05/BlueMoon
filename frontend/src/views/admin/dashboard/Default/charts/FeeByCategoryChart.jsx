import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Color palette for categories
const COLORS = ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC'];

export default function FeeByCategoryChart({ data = [] }) {
  const theme = useTheme();

  // Transform data for pie chart (convert amounts to percentages)
  const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
  const chartData = data.map((item, index) => ({
    name: item.name || item.category || 'N/A',
    value: totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0,
    actualAmount: item.amount || 0,
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
            Phân loại khoản thu
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
          Phân loại khoản thu
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer key={theme.palette.mode}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.25;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill={theme.palette.text.secondary}
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight={500}
                    >
                      {`${value}%`}
                    </text>
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name, props) => [
                  `${value}% (${(props.payload.actualAmount / 1000000).toFixed(1)}M ₫)`,
                  name
                ]}
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
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

FeeByCategoryChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    amount: PropTypes.number,
    color: PropTypes.string
  }))
};
