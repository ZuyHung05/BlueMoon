import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
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

// Mock data — replace later with your backend data
const data = [
  { name: 'Tháng 1', reports: 45 },
  { name: 'Tháng 2', reports: 62 },
  { name: 'Tháng 3', reports: 51 },
  { name: 'Tháng 4', reports: 73 },
  { name: 'Tháng 5', reports: 89 },
  { name: 'Tháng 6', reports: 120 },
  { name: 'Tháng 7', reports: 97 },
  { name: 'Tháng 8', reports: 110 },
  { name: 'Tháng 9', reports: 134 },
  { name: 'Tháng 10', reports: 148 },
  { name: 'Tháng 11', reports: 139 },
  { name: 'Tháng 12', reports: 152 }
];

export default function ReportsOverTimeChart() {
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
          Báo cáo theo thời gian
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value} báo cáo`, 'Số lượng']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Line
                type="monotone"
                dataKey="reports"
                name="Số báo cáo"
                stroke="#1976D2"
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
