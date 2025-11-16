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

// Mock data — replace later with real API data
const data = [
  { team: 'Đội A', completed: 28, avgTime: 3.1 },
  { team: 'Đội B', completed: 22, avgTime: 5.2 },
  { team: 'Đội C', completed: 18, avgTime: 2.7 },
  { team: 'Đội D', completed: 24, avgTime: 4.0 }
];

// Colors for the bars
const COLORS = {
  completed: '#42A5F5',
  avgTime: '#66BB6A'
};

export default function TeamPerformanceChart() {
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
          Hiệu suất đội kỹ thuật
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
                dataKey="team"
                type="category"
                tick={{ fontSize: 13 }}
                width={80}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === 'avgTime'
                    ? [`${value} giờ`, 'Thời gian trung bình']
                    : [`${value} nhiệm vụ`, 'Hoàn thành']
                }
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Bar
                dataKey="completed"
                name="Nhiệm vụ hoàn thành"
                fill={COLORS.completed}
                barSize={15}
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="avgTime"
                name="Thời gian trung bình (giờ)"
                fill={COLORS.avgTime}
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
