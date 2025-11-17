import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
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
  return (
    <Card
      sx={{
        height: '100%',
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: '#FAFAFA'
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Phân loại khoản thu
        </Typography>

        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
              />

              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
