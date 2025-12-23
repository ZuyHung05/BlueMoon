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

const data = [
    { name: 'Phí dịch vụ', value: 45 },
    { name: 'Phí quản lý', value: 30 },
    { name: 'Phí gửi xe', value: 15 },
    { name: 'Đóng góp / tự nguyện', value: 10 }
];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

export default function FeeByCategoryChart() {
    return (
        <Card
            sx={{
                height: '100%',
                minWidth: 0,
                flexGrow: 1,
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <CardContent sx={{ height: '100%', p: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Phân loại khoản thu
                </Typography>

                <Box sx={{ width: '100%', height: 320, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                fill="#8884d8"
                                paddingAngle={3}
                                dataKey="value"
                                nameKey="name"
                                isAnimationActive={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                            <Tooltip
                                formatter={(value) => `${value}%`}
                                contentStyle={{ 
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#e2e8f0'
                                }}
                            />

                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}
