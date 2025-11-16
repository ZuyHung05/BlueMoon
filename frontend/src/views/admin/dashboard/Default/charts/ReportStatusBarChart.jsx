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

// Mock data — replace later with backend API data
const data = [
  { status: 'Chờ xử lý', count: 28 },
  { status: 'Đã phân công', count: 46 },
  { status: 'Đang xử lý', count: 78 },
  { status: 'Hoàn tất', count: 190 }
];

// Define colors for each status
const COLORS = ['#FFB300', '#42A5F5', '#66BB6A', '#2E7D32'];

export default function ReportStatusBarChart() {
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
          Trạng thái xử lý báo cáo
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
                formatter={(value) => [`${value} báo cáo`, 'Số lượng']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Bar dataKey="count" name="Số báo cáo">
                {data.map((entry, index) => (
                  <cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
