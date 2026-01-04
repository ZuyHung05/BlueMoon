import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Replace with real API data later
const data = [
  { name: 'Phí dịch vụ', value: 45 },
  { name: 'Phí quản lý', value: 30 },
  { name: 'Phí gửi xe', value: 15 },
  { name: 'Đóng góp / tự nguyện', value: 10 }
];

// Color palette for categories
const COLORS = ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350'];

export default function FeeByCategoryChart() {
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
          Phân loại khoản thu
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer key={theme.palette.mode}>
            <PieChart>
              <Pie
                data={data}
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
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => `${value}%`}
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

