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
  Legend
} from 'recharts';

// Mock data — replace with API later
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
          Hiệu suất đợt thu
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />
              <YAxis
                dataKey="cycle"
                type="category"
                tick={{ fontSize: 13 }}
                width={90}
              />

              <Tooltip
                formatter={(value, name) =>
                  name === 'avgDays'
                    ? [`${value} ngày`, 'Thời gian thanh toán TB']
                    : [`${value}% hộ`, 'Tỷ lệ thanh toán']
                }
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
              />

              <Legend verticalAlign="bottom" height={36} />

              <Bar
                dataKey="paid"
                name="Tỷ lệ thanh toán (%)"
                fill={COLORS.paid}
                barSize={15}
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="avgDays"
                name="Số ngày thanh toán TB"
                fill={COLORS.avgDays}
                barSize={15}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
