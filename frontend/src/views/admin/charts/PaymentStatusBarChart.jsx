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
    Cell
} from 'recharts';

const data = [
    { status: 'Đã thanh toán', count: 224, color: '#22c55e' },
    { status: 'Chưa thanh toán', count: 32, color: '#ef4444' },
    { status: 'Đang chờ', count: 18, color: '#f59e0b' },
    { status: 'Trễ hạn', count: 6, color: '#a855f7' }
];

export default function PaymentStatusBarChart() {
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
                    Trạng thái thanh toán
                </Typography>

                <Box sx={{ width: '100%', height: 320, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis 
                                dataKey="status" 
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <YAxis 
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <Tooltip
                                formatter={(value) => [`${value} hộ`, 'Số lượng']}
                                contentStyle={{ 
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#e2e8f0'
                                }}
                            />
                            <Bar dataKey="count" name="Số hộ" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                                {data.map((entry, index) => (
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
