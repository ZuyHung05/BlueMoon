import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
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
          Trạng thái thanh toán
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value} hộ`, 'Số lượng']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36} />
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
